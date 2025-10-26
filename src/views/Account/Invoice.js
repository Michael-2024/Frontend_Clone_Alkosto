import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import './Account.css';
import AccountSidebar from './AccountSidebar';

const Invoice = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(UserController.getCurrentUser());

  useEffect(() => {
    if (!UserController.isLoggedIn()) {
      const email = localStorage.getItem('pendingEmail') || '';
      navigate(`/login/options${email ? `?email=${encodeURIComponent(email)}` : ''}`);
    }
  }, [navigate]);

  useEffect(() => {
    const u = UserController.getCurrentUser();
    setUser(u);
  }, []);

  if (!user) return null;

  const onLogout = () => { UserController.logout(); navigate('/'); };

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-layout">
          <AccountSidebar onLogout={onLogout} />

          <section className="account-content">
            <div className="account-hero">
              <div className="hero-icon" aria-hidden>📄</div>
              <div className="hero-texts">
                <h1 className="account-title">Descarga tu factura</h1>
                <p className="account-subtitle">Consulta y descarga tus facturas electrónicas</p>
              </div>
            </div>

            <div className="account-grid">
              <div className="account-card" style={{gridColumn: '1 / -1', textAlign: 'center'}}>
                <div className="card-icon" aria-hidden>📄</div>
                <div className="card-title">No tienes facturas disponibles</div>
                <div className="card-desc">
                  Las facturas de tus compras aparecerán aquí una vez que realices un pedido.
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
