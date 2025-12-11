import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductForm from '../components/ProductForm';
import * as apiService from '../services/api';

jest.mock('axios');

jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn()
  }
}));

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() }
}));

describe('ProductForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders product form correctly', () => {
    render(<ProductForm />);

    expect(screen.getByText('Add New Product')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Quantity')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Price ($)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add product/i })).toBeInTheDocument();
  });

  test('handles input change', () => {
    render(<ProductForm />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test' } });
    expect(screen.getByLabelText('Name').value).toBe('Test');
  });

  test('submits form successfully', async () => {
    apiService.default.post.mockResolvedValue({});

    render(<ProductForm />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Desc' } });
    fireEvent.change(screen.getByLabelText('Price ($)'), { target: { value: '5.99' } });

    fireEvent.click(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(apiService.default.post).toHaveBeenCalledWith('/products', {
        name: 'Test',
        description: 'Desc',
        quantity: '10',
        price: '5.99'
      });
    });
  });
});
