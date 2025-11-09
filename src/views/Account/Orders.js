import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import OrderController from '../../controllers/OrderController';
import CancelOrderModal from '../../components/CancelOrderModal/CancelOrderModal';
import './Account.css';
import AccountSidebar from './AccountSidebar';

const Orders = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(UserController.getCurrentUser());
  const [orders, setOrders] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [newOrderId, setNewOrderId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelMessage, setCancelMessage] = useState(null);

  useEffect(() => {
    if (!UserController.isLoggedIn()) {
      const email = localStorage.getItem('pendingEmail') || '';
      navigate(`/login/options${email ? `?email=${encodeURIComponent(email)}` : ''}`);
      return;
    }

    // Obtener pedidos del usuario
    loadOrders();

    // Verificar si hay un nuevo pedido
    const newOrder = searchParams.get('new');
    if (newOrder) {
      setShowSuccessMessage(true);
      setNewOrderId(newOrder);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }
  }, [navigate, searchParams]);

  const loadOrders = () => {
    const currentUser = UserController.getCurrentUser();
    if (currentUser) {
      const userOrders = OrderController.getUserOrders(currentUser.id);
      setOrders(userOrders);
    }
  };

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async (reason) => {
    if (!selectedOrder || !user) return;

    const result = OrderController.cancelOrder(selectedOrder.id, reason, user.id);

    if (result.success) {
      setCancelMessage({
        type: 'success',
        text: 'Pedido cancelado exitosamente'
      });
      loadOrders(); // Recargar pedidos
      setShowCancelModal(false);
      setSelectedOrder(null);

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => {
        setCancelMessage(null);
      }, 5000);
    } else {
      setCancelMessage({
        type: 'error',
        text: result.message || 'Error al cancelar el pedido'
      });

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => {
        setCancelMessage(null);
      }, 5000);
    }
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
    setSelectedOrder(null);
  };

  const onLogout = () => { UserController.logout(); navigate('/'); };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

            {showSuccessMessage && (
              <div className="success-message" role="alert">
                <span className="success-icon">✓</span>
                <div>
                  <strong>¡Pedido realizado exitosamente!</strong>
                  <p>Tu número de seguimiento es: <strong>{newOrderId}</strong></p>
                </div>
              </div>
            )}

            {cancelMessage && (
              <div className={`${cancelMessage.type}-message`} role="alert">
                <span className={`${cancelMessage.type}-icon`}>
                  {cancelMessage.type === 'success' ? '✓' : '⚠️'}
                </span>
                <div>
                  <strong>{cancelMessage.text}</strong>
                </div>
              </div>
            )}

            {orders.length === 0 ? (
              <div className="account-grid">
                <div className="account-card" style={{gridColumn: '1 / -1'}}>
                  <strong>No tienes pedidos aún.</strong>
                  <span>Cuando compres, verás aquí el historial y el estado.</span>
                  <button 
                    onClick={() => navigate('/')} 
                    className="btn-primary"
                    style={{marginTop: '20px'}}
                  >
                    Ir a comprar
                  </button>
                </div>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div className="order-card" key={order.id}>
                    <div className="order-header">
                      <div className="order-number">
                        <span className="label">Pedido</span>
                        <span className="value">#{order.trackingNumber}</span>
                      </div>
                      <div className="order-date">
                        <span className="label">Fecha</span>
                        <span className="value">{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="order-status">
                        <span 
                          className="status-badge" 
                          style={{backgroundColor: order.getStatusColor()}}
                        >
                          {order.getStatusText()}
                        </span>
                      </div>
                    </div>

                    <div className="order-body">
                      <div className="order-items">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div className="order-item" key={idx}>
                            <img 
                              src={item.product.image} 
                              alt={item.product.name}
                              className="item-image"
                            />
                            <div className="item-info">
                              <p className="item-name">{item.product.name}</p>
                              <p className="item-quantity">Cantidad: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="more-items">
                            +{order.items.length - 3} producto(s) más
                          </p>
                        )}
                      </div>

                      <div className="order-summary">
                        <div className="summary-row">
                          <span>Subtotal:</span>
                          <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="summary-row">
                          <span>Envío:</span>
                          <span className={order.shipping === 0 ? 'free-shipping' : ''}>
                            {order.shipping === 0 ? 'GRATIS' : formatPrice(order.shipping)}
                          </span>
                        </div>
                        <div className="summary-row total">
                          <span>Total:</span>
                          <span>{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="order-footer">
                      <button 
                        className="btn-secondary"
                        onClick={() => navigate(`/seguimiento?tracking=${order.trackingNumber}&doc=${order.shippingAddress.document}`)}
                      >
                        Rastrear pedido
                      </button>
                      {order.canBeCancelled().canCancel && (
                        <button 
                          className="btn-cancel-order"
                          onClick={() => handleCancelClick(order)}
                          title="Cancelar pedido"
                        >
                          Cancelar pedido
                        </button>
                      )}
                      <button className="btn-link">
                        Ver detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal de cancelación */}
            {showCancelModal && selectedOrder && (
              <CancelOrderModal
                order={selectedOrder}
                onConfirm={handleCancelConfirm}
                onCancel={handleCancelCancel}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Orders;
