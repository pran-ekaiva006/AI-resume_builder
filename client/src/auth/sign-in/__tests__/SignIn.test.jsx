import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SignInPage from '../index';
import { useAuth } from '../../../context/AuthContext';
import * as router from 'react-router-dom';

// 1. Mock the AuthContext
vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// 2. Mock react-router-dom's useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// 3. Mock GoogleLogin
vi.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <button data-testid="google-login-mock">Mock Google Login</button>,
}));

describe('SignInPage Component', () => {
  const mockLogin = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      login: mockLogin,
      demoLogin: vi.fn(),
      googleLogin: vi.fn(),
    });
    vi.mocked(router.useNavigate).mockReturnValue(mockNavigate);
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );
  };

  it('successful login navigates to /dashboard', async () => {
    mockLogin.mockResolvedValueOnce();
    renderComponent();

    const user = userEvent.setup();
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitBtn = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitBtn);

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('failed login shows the error message from the mocked rejected promise', async () => {
    mockLogin.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials provided.' } }
    });
    renderComponent();

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('Enter your email'), 'wrong@example.com');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials provided.')).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('submit button shows a loading state and is disabled while the request is in flight', async () => {
    // Return a promise that never resolves so it stays in "loading" state
    mockLogin.mockImplementation(() => new Promise(() => {}));
    renderComponent();

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('Enter your email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');
    
    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    expect(submitBtn).not.toBeDisabled();
    expect(submitBtn).toHaveTextContent('Sign In');

    await user.click(submitBtn);

    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveTextContent('Signing in...');
  });

  it('required-field validation blocks submission with empty inputs', async () => {
    renderComponent();
    
    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    
    const user = userEvent.setup();
    await user.click(submitBtn);

    expect(mockLogin).not.toHaveBeenCalled();
  });
});
