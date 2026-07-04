import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { vi } from 'vitest';
import SignInpage from '../index';
import { useAuth } from '../../../context/AuthContext';

// Mock the routing hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock the AuthContext hook
vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock GoogleLogin to render a dummy component since we don't want to load external scripts
vi.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <div data-testid="google-login-mock">Google Login</div>,
}));

describe('SignInpage Demo User Flow', () => {
  const mockNavigate = vi.fn();
  const mockDemoLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue({
      login: vi.fn(),
      googleLogin: vi.fn(),
      demoLogin: mockDemoLogin,
    });
  });

  it('calls demoLogin and navigates to /dashboard on clicking "Continue as Demo User"', async () => {
    mockDemoLogin.mockResolvedValueOnce({ success: true, user: { isDemo: true } });

    render(
      <MemoryRouter>
        <SignInpage />
      </MemoryRouter>
    );

    const demoButton = screen.getByRole('button', { name: /continue as demo user/i });
    expect(demoButton).toBeInTheDocument();

    await userEvent.click(demoButton);

    // Assert demoLogin was called
    expect(mockDemoLogin).toHaveBeenCalledTimes(1);

    // Assert it navigates to /dashboard on success
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
