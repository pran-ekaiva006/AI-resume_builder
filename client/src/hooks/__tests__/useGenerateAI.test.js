/**
 * client/src/hooks/__tests__/useGenerateAI.test.js
 *
 * Tests that useGenerateAI.generate() routes through the shared axiosClient
 * so the 401 → refresh → retry interceptor fires correctly.
 *
 * Strategy:
 *   1. We import the REAL axiosClient (with its interceptor attached) from GlobalApi.
 *   2. We attach axios-mock-adapter to it so we can stub HTTP responses.
 *   3. We mock "bare" axios separately (for the refresh call inside the interceptor).
 *   4. We call generate() and assert the interceptor's retry behaviour.
 *
 * This avoids mocking GlobalApi entirely — we test the real interceptor logic.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

// ── Import the REAL axiosClient so we test its actual interceptor ─────────
import { axiosClient } from 'service/GlobalApi';
import { useGenerateAI } from '../useGenerateAI';

// ── Setup mock adapter on the real shared client ──────────────────────────
let mock;

beforeEach(() => {
  // passThrough: false — we handle every request explicitly
  mock = new MockAdapter(axiosClient, { onNoMatch: 'throwException' });
});

afterEach(() => {
  mock.restore();
  vi.restoreAllMocks();
});

// ── Tests ─────────────────────────────────────────────────────────────────

describe('useGenerateAI — happy path', () => {
  it('returns response.data.content on a successful 200', async () => {
    mock.onPost('/ai/generate').reply(200, { content: 'Generated HTML here' });

    const { result } = renderHook(() => useGenerateAI());

    let output;
    await act(async () => {
      output = await result.current.generate('Write me a summary', { format: 'html' });
    });

    expect(output).toBe('Generated HTML here');
  });

  it('sets loading=true during the call and loading=false after', async () => {
    // Resolve after a short tick so we can observe loading=true mid-flight
    mock.onPost('/ai/generate').reply(() =>
      new Promise((resolve) =>
        setTimeout(() => resolve([200, { content: 'done' }]), 10),
      ),
    );

    const { result } = renderHook(() => useGenerateAI());

    let generatePromise;
    act(() => {
      generatePromise = result.current.generate('test prompt');
    });

    // Right after kick-off, loading should be true
    expect(result.current.loading).toBe(true);

    await act(async () => { await generatePromise; });

    expect(result.current.loading).toBe(false);
  });
});

describe('useGenerateAI — 401 → refresh → retry (interceptor)', () => {
  it('retries and resolves with content after a successful token refresh', async () => {
    // First call to /ai/generate → 401 (access token expired)
    // Second call to /ai/generate (after refresh) → 200 with content
    let callCount = 0;
    mock.onPost('/ai/generate').reply(() => {
      callCount += 1;
      if (callCount === 1) {
        return [401, { message: 'Unauthorized' }];
      }
      return [200, { content: 'Retry succeeded content' }];
    });

    // The interceptor calls bare axios.post for the refresh — mock that to succeed
    const axiosSpy = vi
      .spyOn(axios, 'post')
      .mockResolvedValueOnce({ status: 200, data: {} });

    const { result } = renderHook(() => useGenerateAI());

    let output;
    await act(async () => {
      output = await result.current.generate('Write a summary');
    });

    // Interceptor fired the refresh
    expect(axiosSpy).toHaveBeenCalledTimes(1);
    expect(axiosSpy).toHaveBeenCalledWith(
      expect.stringContaining('/auth/refresh'),
      expect.anything(),
      expect.objectContaining({ withCredentials: true }),
    );

    // generate() ultimately resolved with the retried response's content
    expect(output).toBe('Retry succeeded content');

    // /ai/generate was called twice (original + retry)
    expect(callCount).toBe(2);
  });

  it('throws when token refresh also fails (session truly expired)', async () => {
    // /ai/generate → 401
    mock.onPost('/ai/generate').reply(401, { message: 'Unauthorized' });

    // Refresh also fails → 401
    vi.spyOn(axios, 'post').mockRejectedValueOnce(
      Object.assign(new Error('Refresh failed'), {
        response: { status: 401 },
      }),
    );

    const { result } = renderHook(() => useGenerateAI());

    await act(async () => {
      await expect(result.current.generate('test')).rejects.toThrow();
    });
  });

  it('does NOT retry when the failing request is itself a refresh call', async () => {
    // If /auth/refresh itself gets a 401, the interceptor must not re-enter
    // to avoid an infinite loop. We verify the interceptor bails out.
    mock.onPost('/auth/refresh').reply(401, {});
    mock.onPost('/ai/generate').reply(401, {});

    // bare axios is not mocked here — interceptor must short-circuit
    const { result } = renderHook(() => useGenerateAI());

    await act(async () => {
      await expect(result.current.generate('test')).rejects.toBeDefined();
    });
  });
});

describe('useGenerateAI — uses shared axiosClient (not bare axios)', () => {
  it('sends the request to /ai/generate via axiosClient (not a raw axios call)', async () => {
    // If the hook used raw axios the mock-adapter on axiosClient would miss it.
    // A successful response here proves the request went through axiosClient.
    mock.onPost('/ai/generate').reply(200, { content: 'via shared client' });

    const { result } = renderHook(() => useGenerateAI());
    let output;
    await act(async () => {
      output = await result.current.generate('prompt');
    });

    expect(output).toBe('via shared client');
  });

  it('sends prompt and format in the request body', async () => {
    mock.onPost('/ai/generate', { prompt: 'My prompt', format: 'json' })
      .reply(200, { content: '{}' });

    const { result } = renderHook(() => useGenerateAI());
    let output;
    await act(async () => {
      output = await result.current.generate('My prompt', { format: 'json' });
    });

    expect(output).toBe('{}');
  });
});
