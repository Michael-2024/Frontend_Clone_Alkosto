import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import './Account.css';
import AccountSidebar from './AccountSidebar';

const Orders = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(UserController.getCurrentUser());
  const orders = user?.getOrders() || [];

  useEffect(() => {
    if (!UserController.isLoggedIn()) {
      const email = localStorage.getItem('pendingEmail') || '';
      navigate(`/login/options${email ? `?email=${encodeURIComponent(email)}` : ''}`);
    }
  }, [navigate]);

  const onLogout = () => { UserController.logout(); navigate('/'); };

  if (!user) return null;

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-layout">
          <AccountSidebar onLogout={onLogout} />

          <section className="account-content">
            <div className="account-hero">
              <div className="hero-icon" aria-hidden>📦</div>
              <div className="hero-texts">
                <h1 className="account-title">Mis Pedidos</h1>
                <p className="account-sub">Gestiona tus pedidos, devoluciones y fechas de entrega</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="account-grid">
                <div className="account-card" style={{gridColumn: '1 / -1'}}>
                  <strong>No tienes pedidos aún.</strong>
                  <span>Cuando compres, verás aquí el historial y el estado.</span>
                </div>
              </div>
            ) : (
              <div className="account-grid">
                {orders.map((o) => (
                  <div className="account-card" key={o.id}>
                    <div className="card-title">Pedido #{o.id}</div>
                    <div className="card-desc">Estado: {o.status}</div>
                    <div className="card-desc">Total: ${o.total?.toLocaleString?.('es-CO') || o.total}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Orders;
