import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import './Account.css';
import AccountSidebar from './AccountSidebar';

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(UserController.getCurrentUser());

  useEffect(() => {
    if (!UserController.isLoggedIn()) {
      const email = localStorage.getItem('pendingEmail') || '';
      navigate(`/login/options${email ? `?email=${encodeURIComponent(email)}` : ''}`);
    }
  }, [navigate]);

  useEffect(() => {
    setUser(UserController.getCurrentUser());
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    UserController.logout();
    navigate('/');
  };

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-layout">
          {/* Sidebar */}
          <AccountSidebar onLogout={handleLogout} />

          {/* Content */}
          <section className="account-content">
            <div className="account-hero">
              <div className="hero-icon" aria-hidden>👤</div>
              <div className="hero-texts">
                <h1 className="account-title">Mi cuenta</h1>
                <p className="account-greeting">¡Hola {user.firstName}! </p>
                <p className="account-sub">Aquí podrás consultar todos tus movimientos</p>
              </div>
            </div>

            <div className="account-grid">
              <Link to="/perfil/datos" className="account-card">
                <div className="card-icon" aria-hidden>👤</div>
                <div className="card-title">Mi Perfil</div>
                <div className="card-desc">Revisa y edita tus datos personales.</div>
              </Link>

              <Link to="/perfil/direcciones" className="account-card">
                <div className="card-icon" aria-hidden>📍</div>
                <div className="card-title">Direcciones de envío</div>
                <div className="card-desc">Agrega, edita y/o elimina una dirección</div>
              </Link>

              <Link to="/perfil/pedidos" className="account-card">
                <div className="card-icon" aria-hidden>📦</div>
                <div className="card-title">Mis Pedidos</div>
                <div className="card-desc">Gestiona tus pedidos, devoluciones y fechas de entrega.</div>
              </Link>

              <Link to="/perfil/pagos" className="account-card">
                <div className="card-icon" aria-hidden>💳</div>
                <div className="card-title">Métodos de Pago</div>
                <div className="card-desc">Agrega y valida tus métodos de pago.</div>
              </Link>

              <Link to="/perfil/favoritos" className="account-card">
                <div className="card-icon" aria-hidden>❤️</div>
                <div className="card-title">Mi lista de Favoritos</div>
                <div className="card-desc">Guarda y revisa tus productos</div>
              </Link>

              <Link to="/seguimiento" className="account-card">
                <div className="card-icon" aria-hidden>🔍</div>
                <div className="card-title">Sigue tu pedido</div>
                <div className="card-desc">Revisa el estado actual de tu pedido.</div>
              </Link>

              <a href="https://descargascolcomercio.com" target="_blank" rel="noopener noreferrer" className="account-card">
                <div className="card-icon" aria-hidden>📄</div>
                <div className="card-title">Descarga tu factura</div>
                <div className="card-desc">Consulta y descarga tu factura</div>
              </a>

              <button onClick={handleLogout} className="account-card as-button">
                <div className="card-icon" aria-hidden>🚪</div>
                <div className="card-title">Cerrar Sesión</div>
                <div className="card-desc">Salir de tu cuenta</div>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Account;
