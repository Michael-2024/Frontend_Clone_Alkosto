// src/views/Returns/ReturnsList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import ReturnController from '../../controllers/ReturnController';
import './Returns.css';
import AccountSidebar from '../Account/AccountSidebar';

/**
 * Vista de Lista de Devoluciones (RF25)
 * Muestra todas las solicitudes de devolución del usuario
 */
const ReturnsList = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(UserController.getCurrentUser());
  const [returns, setReturns] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending_review, approved, rejected, completed
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Verificar autenticación
    if (!UserController.isLoggedIn()) {
      const email = localStorage.getItem('pendingEmail') || '';
      navigate(`/login/options${email ? `?email=${encodeURIComponent(email)}` : ''}`);
      return;
    }

    loadReturns();
  }, [navigate]);

  const loadReturns = () => {
    const currentUser = UserController.getCurrentUser();
    if (currentUser) {
      const userReturns = ReturnController.getUserReturns(currentUser.id);
      setReturns(userReturns);

      const userStats = ReturnController.getUserReturnStats(currentUser.id);
      setStats(userStats);
    }
  };

  const getFilteredReturns = () => {
    if (filter === 'all') {
      return returns;
    }
    return returns.filter(ret => ret.status === filter);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredReturns = getFilteredReturns();

  return (
    <div className="account-container">
      <AccountSidebar />
      <div className="account-main">
        <div className="returns-list-container">
          <div className="page-header">
            <div>
              <h1>Mis Devoluciones</h1>
              <p className="subtitle">Gestiona tus solicitudes de devolución y garantías</p>
            </div>
            <button 
              className="btn-primary"
              onClick={() => navigate('/perfil/devoluciones/nueva')}
            >
              + Nueva Devolución
            </button>
          </div>

          {/* Estadísticas */}
          {stats && stats.total > 0 && (
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="stat-card pending">
                <div className="stat-value">{stats.pending}</div>
                <div className="stat-label">Pendientes</div>
              </div>
              <div className="stat-card approved">
                <div className="stat-value">{stats.approved}</div>
                <div className="stat-label">Aprobadas</div>
              </div>
              <div className="stat-card completed">
                <div className="stat-value">{stats.completed}</div>
                <div className="stat-label">Completadas</div>
              </div>
              <div className="stat-card refunded">
                <div className="stat-value">{formatCurrency(stats.totalRefunded)}</div>
                <div className="stat-label">Reembolsado</div>
              </div>
            </div>
          )}

          {/* Filtros */}
          <div className="filters-bar">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todas ({returns.length})
            </button>
            <button
              className={`filter-btn ${filter === 'pending_review' ? 'active' : ''}`}
              onClick={() => setFilter('pending_review')}
            >
              Pendientes ({returns.filter(r => r.status === 'pending_review').length})
            </button>
            <button
              className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              Aprobadas ({returns.filter(r => r.status === 'approved').length})
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completadas ({returns.filter(r => r.status === 'completed').length})
            </button>
          </div>

          {/* Lista de Devoluciones */}
          {filteredReturns.length === 0 ? (
            <div className="empty-state">
              {filter === 'all' ? (
                <>
                  <div className="empty-icon">📦</div>
                  <h2>No tienes devoluciones</h2>
                  <p>¿Necesitas devolver un producto? Inicia una solicitud</p>
                  <button 
                    className="btn-primary"
                    onClick={() => navigate('/perfil/devoluciones/nueva')}
                  >
                    Solicitar Devolución
                  </button>
                </>
              ) : (
                <>
                  <div className="empty-icon">🔍</div>
                  <h2>No hay devoluciones en este estado</h2>
                  <button 
                    className="btn-link"
                    onClick={() => setFilter('all')}
                  >
                    Ver todas
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="returns-list">
              {filteredReturns.map(returnItem => (
                <div 
                  key={returnItem.id} 
                  className="return-card"
                  onClick={() => navigate(`/perfil/devoluciones/${returnItem.id}`)}
                >
                  <div className="return-card-header">
                    <div className="return-number">
                      <span className="label">Ticket:</span>
                      <span className="value">{returnItem.ticketNumber}</span>
                    </div>
                    <div 
                      className="return-status"
                      style={{ backgroundColor: returnItem.getStatusColor() }}
                    >
                      {returnItem.getStatusText()}
                    </div>
                  </div>

                  <div className="return-card-body">
                    <div className="return-product">
                      <img 
                        src={returnItem.product.image || '/images/placeholder.png'} 
                        alt={returnItem.product.name}
                      />
                      <div className="product-details">
                        <h3>{returnItem.product.name}</h3>
                        <p className="reason-type">{returnItem.getReasonTypeText()}</p>
                        <p className="reason">{returnItem.reason}</p>
                      </div>
                    </div>

                    <div className="return-meta">
                      <div className="meta-item">
                        <span className="label">Cantidad:</span>
                        <span className="value">{returnItem.quantity}</span>
                      </div>
                      <div className="meta-item">
                        <span className="label">Reembolso:</span>
                        <span className="value refund">{formatCurrency(returnItem.refundAmount)}</span>
                      </div>
                      <div className="meta-item">
                        <span className="label">Creado:</span>
                        <span className="value">{formatDate(returnItem.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="return-card-footer">
                    <button className="btn-link">
                      Ver Detalles →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnsList;
