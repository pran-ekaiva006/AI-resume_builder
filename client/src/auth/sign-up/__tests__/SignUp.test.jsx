import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SignUpPage from '../index';
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
  GoogleLogin: () => <button data-testid="google-signup-mock">Mock Google Sign Up</button>,
}));

describe('SignUpPage Component', () => {
  const mockSignup = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      signup: mockSignup,
      googleLogin: vi.fn(),
    });
    vi.mocked(router.useNavigate).mockReturnValue(mockNavigate);
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );
  };

  it('successful signup navigates to /dashboard', async () => {
    mockSignup.mockResolvedValueOnce();
    renderComponent();

    const user = userEvent.setup();
    const firstNameInput = screen.getByPlaceholderText('John');
    const lastNameInput = screen.getByPlaceholderText('Doe');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Create a password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitBtn = screen.getByRole('button', { name: /^sign up$/i });

    await user.type(firstNameInput, 'Jane');
    await user.type(lastNameInput, 'Smith');
    await user.type(emailInput, 'jane@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitBtn);

    expect(mockSignup).toHaveBeenCalledWith('Jane', 'Smith', 'jane@example.com', 'password123');
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('failed signup shows the error message from the mocked rejected promise', async () => {
    mockSignup.mockRejectedValueOnce({
      response: { data: { message: 'Email already exists.' } }
    });
    renderComponent();

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('John'), 'Jane');
    await user.type(screen.getByPlaceholderText('Doe'), 'Smith');
    await user.type(screen.getByPlaceholderText('Enter your email'), 'jane@example.com');
    await user.type(screen.getByPlaceholderText('Create a password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm your password'), 'password123');
    
    await user.click(screen.getByRole('button', { name: /^sign up$/i }));

    await waitFor(() => {
      expect(screen.getByText('Email already exists.')).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('submit button shows a loading state and is disabled while the request is in flight', async () => {
    mockSignup.mockImplementation(() => new Promise(() => {}));
    renderComponent();

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('John'), 'Jane');
    await user.type(screen.getByPlaceholderText('Doe'), 'Smith');
    await user.type(screen.getByPlaceholderText('Enter your email'), 'jane@example.com');
    await user.type(screen.getByPlaceholderText('Create a password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm your password'), 'password123');
    
    const submitBtn = screen.getByRole('button', { name: /^sign up$/i });
    expect(submitBtn).not.toBeDisabled();
    expect(submitBtn).toHaveTextContent('Sign Up');

    await user.click(submitBtn);

    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveTextContent('Creating account...');
  });

  it('blocks submission if passwords do not match', async () => {
    renderComponent();

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('John'), 'Jane');
    await user.type(screen.getByPlaceholderText('Doe'), 'Smith');
    await user.type(screen.getByPlaceholderText('Enter your email'), 'jane@example.com');
    await user.type(screen.getByPlaceholderText('Create a password'), 'password123');
    await user.type(screen.getByPlaceholderText('Confirm your password'), 'differentpass');
    
    const submitBtn = screen.getByRole('button', { name: /^sign up$/i });
    await user.click(submitBtn);

    // The component should set the error to "Passwords don't match" without calling mockSignup
    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
    expect(mockSignup).not.toHaveBeenCalled();
  });

  it('required-field validation blocks submission with empty inputs', async () => {
    renderComponent();
    
    const submitBtn = screen.getByRole('button', { name: /^sign up$/i });
    
    const user = userEvent.setup();
    await user.click(submitBtn);

    expect(mockSignup).not.toHaveBeenCalled();
  });
});
