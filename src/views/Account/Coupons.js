// src/views/Account/Coupons.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import CouponController from '../../controllers/CouponController';
import './Account.css';
import './Coupons.css';
import AccountSidebar from './AccountSidebar';

const Coupons = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(UserController.getCurrentUser());
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [usedCoupons, setUsedCoupons] = useState([]);
  const [filter, setFilter] = useState('available'); // 'available', 'used', 'all'

  useEffect(() => {
    if (!UserController.isLoggedIn()) {
      const email = localStorage.getItem('pendingEmail') || '';
      navigate(`/login/options${email ? `?email=${encodeURIComponent(email)}` : ''}`);
      return;
    }

    loadCoupons();
  }, [navigate]);

  const loadCoupons = () => {
    const currentUser = UserController.getCurrentUser();
    if (currentUser) {
      const available = CouponController.getAvailableCouponsForUser(currentUser.id);
      const used = CouponController.getUsedCouponsByUser(currentUser.id);
      
      setAvailableCoupons(available);
      setUsedCoupons(used);
    }
  };

  const getCouponsToShow = () => {
    if (filter === 'available') return availableCoupons;
    if (filter === 'used') return usedCoupons;
    return [...availableCoupons, ...usedCoupons];
  };

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Código ${code} copiado al portapapeles`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const onLogout = () => {
    UserController.logout();
    navigate('/');
  };

  if (!user) return null;

  const couponsToShow = getCouponsToShow();

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-layout">
          <AccountSidebar onLogout={onLogout} />

          <section className="account-content">
            <div className="account-hero">
              <div className="hero-icon" aria-hidden>🎟️</div>
              <div className="hero-texts">
                <h1 className="account-title">Mis Cupones</h1>
                <p className="account-sub">
                  {availableCoupons.length > 0
                    ? `Tienes ${availableCoupons.length} cupón${availableCoupons.length > 1 ? 'es' : ''} disponible${availableCoupons.length > 1 ? 's' : ''}`
                    : 'No tienes cupones disponibles en este momento'}
                </p>
              </div>
            </div>

            {/* Filtros */}
            <div className="coupon-filters">
              <button
                className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
                onClick={() => setFilter('available')}
              >
                Disponibles ({availableCoupons.length})
              </button>
              <button
                className={`filter-btn ${filter === 'used' ? 'active' : ''}`}
                onClick={() => setFilter('used')}
              >
                Usados ({usedCoupons.length})
              </button>
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                Todos ({availableCoupons.length + usedCoupons.length})
              </button>
            </div>

            {/* Lista de cupones */}
            {couponsToShow.length === 0 ? (
              <div className="account-grid">
                <div className="account-card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                  <div className="card-icon" aria-hidden>🎟️</div>
                  <div className="card-title">No hay cupones</div>
                  <div className="card-desc">
                    {filter === 'available'
                      ? 'No tienes cupones disponibles en este momento.'
                      : filter === 'used'
                      ? 'Aún no has usado ningún cupón.'
                      : 'No tienes cupones registrados.'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="coupons-grid">
                {couponsToShow.map((coupon) => {
                  const isUsed = usedCoupons.some(c => c.id === coupon.id);
                  const isExpired = !coupon.isValid().valid;
                  const daysRemaining = coupon.getDaysRemaining();

                  return (
                    <div
                      key={coupon.id}
                      className={`coupon-card ${isUsed ? 'used' : ''} ${isExpired ? 'expired' : ''}`}
                      style={{ borderLeftColor: coupon.getPriorityColor() }}
                    >
                      <div className="coupon-card-header">
                        <span className="coupon-card-icon">{coupon.getIcon()}</span>
                        <div className="coupon-card-discount">
                          <span className="discount-value">
                            {coupon.type === 'percentage' ? `${coupon.value}%` : formatPrice(coupon.value)}
                          </span>
                          <span className="discount-label">DESCUENTO</span>
                        </div>
                      </div>

                      <div className="coupon-card-body">
                        <h3 className="coupon-card-title">{coupon.description || coupon.code}</h3>
                        
                        <div className="coupon-code-display">
                          <code>{coupon.code}</code>
                          {!isUsed && !isExpired && (
                            <button
                              onClick={() => copyCouponCode(coupon.code)}
                              className="btn-copy-code"
                              aria-label="Copiar código"
                            >
                              📋 Copiar
                            </button>
                          )}
                        </div>

                        <div className="coupon-card-details">
                          {coupon.minPurchase > 0 && (
                            <p className="coupon-detail">
                              <span>💰</span>
                              Compra mínima: {formatPrice(coupon.minPurchase)}
                            </p>
                          )}
                          {coupon.maxDiscount && (
                            <p className="coupon-detail">
                              <span>🎯</span>
                              Descuento máximo: {formatPrice(coupon.maxDiscount)}
                            </p>
                          )}
                          {coupon.categories.length > 0 && (
                            <p className="coupon-detail">
                              <span>📦</span>
                              Aplica en: {coupon.categories.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="coupon-card-footer">
                        {isUsed ? (
                          <span className="coupon-status used-status">✓ Cupón usado</span>
                        ) : isExpired ? (
                          <span className="coupon-status expired-status">✕ Expirado</span>
                        ) : daysRemaining !== null ? (
                          <span className={`coupon-expiry ${daysRemaining <= 3 ? 'urgent' : ''}`}>
                            ⏰ {coupon.getTimeRemainingText()}
                          </span>
                        ) : (
                          <span className="coupon-expiry">✓ Sin vencimiento</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Información adicional */}
            <div className="coupons-info">
              <h3>ℹ️ Cómo usar tus cupones</h3>
              <ol>
                <li>Agrega productos a tu carrito de compras</li>
                <li>En el carrito o checkout, ingresa tu código de cupón</li>
                <li>Presiona "Aplicar" y verás el descuento reflejado</li>
                <li>¡Completa tu compra con el descuento aplicado!</li>
              </ol>
              <p className="info-note">
                <strong>Nota:</strong> Los cupones tienen condiciones específicas de uso 
                (monto mínimo, categorías, fechas de validez). Revisa los detalles de cada cupón.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Coupons;
