import React from 'react';
import { Link } from 'react-router-dom';
import './RegisterLayout.css';

const RegisterLayout = ({ children }) => {
  return (
    <div className="register-layout">
      <header className="register-header">
        <div className="register-header-content">
          <Link to="/" className="register-logo">
            <img src="/assets/logo-alkosto.svg" alt="Alkosto" />
          </Link>
          <div className="register-security-message">
            <span>Compra seguro y en menos pasos.</span>
          </div>
        </div>
      </header>
      
      <div className="register-body">
        {children}
      </div>
    </div>
  );
};

export default RegisterLayout;