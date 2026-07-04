/**
 * client/src/dashboard/resume/components/forms/__tests__/Summery.test.jsx
 *
 * React Testing Library (Vitest) tests for the Summery wizard step.
 *
 * Mocking strategy:
 *   Summery.jsx's relative import '../../../../../service/GlobalApi' resolves
 *   to <client>/service/GlobalApi.js. We mock it with the alias 'service/GlobalApi'
 *   configured in vite.config.js test.alias so Vitest resolves both to the same file.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ── Module mocks ───────────────────────────────────────────────────────────

vi.mock('react-router-dom', () => ({
  useParams: () => ({ resumeId: 'test-resume-uuid-1234' }),
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// useGenerateAI lives in src/hooks — relative from forms/ it's ../../../../hooks/useGenerateAI
// Vitest resolves the relative path from the component file's location.
// We mock via the alias-resolved specifier.
vi.mock('client/src/hooks/useGenerateAI', () => ({
  useGenerateAI: () => ({ generate: vi.fn(), loading: false }),
}));

// service/GlobalApi alias resolves to <client>/service/GlobalApi.js — same file
// that Summery.jsx's relative import resolves to.
const mockUpdateResumeDetail = vi.fn();
vi.mock('service/GlobalApi', () => ({
  useApiClient: () => ({ UpdateResumeDetail: mockUpdateResumeDetail }),
}));

// ── Import component AFTER mocks ─────────────────────────────────────────
import Summery from '../Summery';
import { ResumeInfoContext } from 'client/src/context/ResumeInfoContext';

// ── Helper ────────────────────────────────────────────────────────────────

function renderSummery(extraResumeInfo = {}) {
  const enabledNext = vi.fn();
  const resumeInfo = {
    resumeId: 'test-resume-uuid-1234',
    summery: '',
    jobTitle: 'Software Engineer',
    ...extraResumeInfo,
  };

  render(
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo: vi.fn() }}>
      <Summery enabledNext={enabledNext} />
    </ResumeInfoContext.Provider>,
  );

  return { enabledNext };
}

/** Returns the Save button (not "Generate from AI"). */
function getSaveButton() {
  return screen.getAllByRole('button').find((b) => b.textContent.trim() === 'Save');
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe('Summery — Save button behaviour', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateResumeDetail.mockResolvedValue({ success: true });
  });

  it('calls UpdateResumeDetail with typed summary text when Save is clicked', async () => {
    const user = userEvent.setup();
    renderSummery();

    await user.type(screen.getByRole('textbox'), 'A great professional summary.');
    await user.click(getSaveButton());

    await waitFor(() => {
      expect(mockUpdateResumeDetail).toHaveBeenCalledWith(
        'test-resume-uuid-1234',
        { summery: 'A great professional summary.' },
      );
    });
  });

  it('calls enabledNext(true) after the API call resolves successfully', async () => {
    const user = userEvent.setup();
    const { enabledNext } = renderSummery();

    await user.type(screen.getByRole('textbox'), 'My summary text.');
    await user.click(getSaveButton());

    await waitFor(() => {
      expect(enabledNext).toHaveBeenCalledWith(true);
    });
  });

  it('does NOT call enabledNext when the API call fails', async () => {
    mockUpdateResumeDetail.mockRejectedValue(new Error('Network error'));

    const user = userEvent.setup();
    const { enabledNext } = renderSummery();

    await user.type(screen.getByRole('textbox'), 'Some summary.');
    await user.click(getSaveButton());

    await waitFor(() => {
      expect(mockUpdateResumeDetail).toHaveBeenCalledTimes(1);
    });

    expect(enabledNext).not.toHaveBeenCalled();
  });

  it('does NOT throw ReferenceError for params — dead onSave is gone', async () => {
    const user = userEvent.setup();
    const { enabledNext } = renderSummery({ summery: 'pre-filled summary' });

    await user.click(getSaveButton());

    await waitFor(() => {
      expect(mockUpdateResumeDetail).toHaveBeenCalledTimes(1);
    });

    expect(enabledNext).toHaveBeenCalledWith(true);
  });
});
