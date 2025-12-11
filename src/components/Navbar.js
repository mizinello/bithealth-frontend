import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="/">
          Warehouse System
        </a>
        <div className="navbar-nav ms-auto">
          <span className="nav-item nav-link text-light">
            Role: <strong>{role}</strong>
          </span>
          <button className="btn btn-outline-light" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;