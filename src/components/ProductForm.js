import React, { useState } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';

const ProductForm = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    quantity: '',
    price: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/products', form);
      toast.success('Product created');
      setForm({ name: '', description: '', quantity: '', price: '' });
      window.location.reload();
    } catch (err) {
      toast.error('Failed to create product');
    }
  };

  return (
    <div className="card p-4 mb-4">
      <h4>Add New Product</h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              id="name"
              type="text"
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input
              id="quantity"
              type="number"
              className="form-control"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price ($)</label>
          <input
            id="price"
            type="number"
            step="0.01"
            className="form-control"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-success">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
