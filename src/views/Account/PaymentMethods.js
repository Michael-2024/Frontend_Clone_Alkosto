import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import './Account.css';
import AccountSidebar from './AccountSidebar';

const PaymentMethods = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!UserController.isLoggedIn()) {
      const email = localStorage.getItem('pendingEmail') || '';
      navigate(`/login/options${email ? `?email=${encodeURIComponent(email)}` : ''}`);
    }
  }, [navigate]);

  const onLogout = () => { UserController.logout(); navigate('/'); };

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-layout">
          <AccountSidebar onLogout={onLogout} />

          <section className="account-content">
            <div className="account-hero">
              <div className="hero-icon" aria-hidden>💳</div>
              <div className="hero-texts">
                <h1 className="account-title">Métodos de Pago</h1>
                <p className="account-sub">Agrega y valida tus métodos de pago</p>
              </div>
            </div>

            {/* Empty state estilo Alkosto */}
            <div className="empty-panel">
              <div className="empty-header">
                <span className="empty-title">¡No tienes métodos de pago guardados!</span>
                <p className="empty-subtitle">Tus métodos de pago aparecerán cuando realices una compra.</p>
              </div>

              <div className="empty-illustration" aria-hidden>
                <div className="card-placeholder" />
              </div>

              <div className="empty-actions">
                <Link to="/perfil/mi-cuenta" className="btn-secondary">Ir a mi cuenta</Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
