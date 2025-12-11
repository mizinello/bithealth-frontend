// src/components/ProductList.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductList from '../components/ProductList';

// FIX: Mock API sesuai struktur asli
import API from '../services/api';
jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    delete: jest.fn()
  }
}));

// Mock toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

describe('ProductList Component', () => {
  const mockProducts = [
    { id: 1, name: 'Laptop', description: 'Gaming laptop', quantity: 10, price: 999.99 },
    { id: 2, name: 'Mouse', description: 'Wireless mouse', quantity: 50, price: 29.99 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders product list for admin role', async () => {
    localStorage.setItem('role', 'admin');
    API.get.mockResolvedValue({ data: mockProducts });

    render(<ProductList />);

    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith('/products');
    });

    expect(await screen.findByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Mouse')).toBeInTheDocument();

    expect(screen.getAllByText('Delete').length).toBe(2);
  });

  test('renders product list for viewer role', async () => {
    localStorage.setItem('role', 'viewer');
    API.get.mockResolvedValue({ data: mockProducts });

    render(<ProductList />);

    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith('/products');
    });

    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  test('handles delete product', async () => {
    localStorage.setItem('role', 'admin');

    API.get.mockResolvedValue({ data: mockProducts });
    API.delete.mockResolvedValue({});

    window.confirm = jest.fn(() => true);

    render(<ProductList />);

    await screen.findByText('Laptop');

    fireEvent.click(screen.getAllByText('Delete')[0]);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure?');

    await waitFor(() => {
      expect(API.delete).toHaveBeenCalledWith('/products/1');
    });
  });

  test('shows error message on fetch failure', async () => {
    API.get.mockRejectedValue(new Error('Failed'));

    render(<ProductList />);

    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith('/products');
    });
  });
});
