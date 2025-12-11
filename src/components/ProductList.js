import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const role = localStorage.getItem('role');

  const fetchProducts = async () => {
    try {
      const response = await API.get('/products');
      setProducts(response.data);
    } catch (err) {
      toast.error('Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await API.delete(`/products/${id}`);
        toast.success('Product deleted');
        fetchProducts();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  return (
    <div className="mt-4">
      <h4>Product List</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price</th>
            {role === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.quantity}</td>
              <td>${product.price}</td>
              {role === 'admin' && (
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;