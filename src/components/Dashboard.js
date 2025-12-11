import React from 'react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import Navbar from './Navbar';

const Dashboard = () => {
  const role = localStorage.getItem('role');

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Warehouse Management Dashboard</h2>
        {role === 'admin' || role === 'staff' ? (
          <ProductForm />
        ) : null}
        <ProductList />
      </div>
    </div>
  );
};

export default Dashboard;