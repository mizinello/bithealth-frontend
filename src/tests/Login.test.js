import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import { login } from '../services/auth';
import { toast } from 'react-toastify';

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

// Mock login service
jest.mock('../services/auth', () => ({
  login: jest.fn(),
}));

// Mock toast
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('Login Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders login form', () => {
    render(<Login />);

    expect(screen.getByText('Warehouse Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('accepts user input', () => {
    render(<Login />);

    const username = screen.getByLabelText('Username');
    const password = screen.getByLabelText('Password');

    fireEvent.change(username, { target: { value: 'admin' }});
    fireEvent.change(password, { target: { value: '12345' }});

    expect(username.value).toBe('admin');
    expect(password.value).toBe('12345');
  });

  test('handles successful login', async () => {
    login.mockResolvedValue({
      token: 'fake-token',
      role: 'admin'
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'admin' }
    });

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: '12345' }
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('admin', '12345');
    });

    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(localStorage.getItem('role')).toBe('admin');

    expect(toast.success).toHaveBeenCalledWith('Login successful');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('handles login failure', async () => {
    login.mockRejectedValue({
      response: { data: { error: 'Invalid credentials' }}
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'wrong' }
    });

    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong' }
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalled();
    });

    expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
  });
});
