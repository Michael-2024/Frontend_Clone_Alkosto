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
  const [showDetailModal, setShowDetailModal] = useState(false);

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
      // Reload orders to ensure latest status
      setTimeout(() => {
        loadOrders();
      }, 500);
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
      window.scrollTo({ top: 0, behavior: 'smooth' });

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
                      {order.status === 'entregado' && (
                        <button 
                          className="btn-primary"
                          onClick={() => navigate(`/perfil/devoluciones/nueva?orderId=${order.id}`)}
                          title="Solicitar devolución"
                        >
                          Solicitar devolución
                        </button>
                      )}
                      {order.canBeCancelled().canCancel && (
                        <button 
                          className="btn-cancel-order"
                          onClick={() => handleCancelClick(order)}
                          title="Cancelar pedido"
                        >  
                          Cancelar pedido
                        </button>
                      )}
                      <button 
                        className="btn-link"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetailModal(true);
                        }}
                      >
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

            {/* Modal de detalles del pedido */}
            {showDetailModal && selectedOrder && (
              <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
                <div className="modal-content order-detail-modal" onClick={e => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Detalles del Pedido</h3>
                    <button 
                      className="modal-close"
                      onClick={() => setShowDetailModal(false)}
                      aria-label="Cerrar"
                    >
                      ×
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="order-detail-section">
                      <h4>Información del Pedido</h4>
                      <p><strong>Número de seguimiento:</strong> {selectedOrder.trackingNumber}</p>
                      <p><strong>Fecha:</strong> {formatDate(selectedOrder.createdAt)}</p>
                      <p><strong>Estado:</strong> <span className={`status-badge status-${selectedOrder.status.toLowerCase()}`}>{selectedOrder.status}</span></p>
                    </div>

                    <div className="order-detail-section">
                      <h4>Información de Envío</h4>
                      <p><strong>Nombre:</strong> {selectedOrder.shippingAddress.fullName}</p>
                      <p><strong>Teléfono:</strong> {selectedOrder.shippingAddress.phone}</p>
                      <p><strong>Email:</strong> {selectedOrder.shippingAddress.email}</p>
                      <p><strong>Dirección:</strong> {selectedOrder.shippingAddress.address}</p>
                      <p><strong>Ciudad:</strong> {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.department}</p>
                      <p><strong>Código Postal:</strong> {selectedOrder.shippingAddress.postalCode}</p>
                      {selectedOrder.shippingAddress.additionalInfo && (
                        <p><strong>Info adicional:</strong> {selectedOrder.shippingAddress.additionalInfo}</p>
                      )}
                    </div>

                    <div className="order-detail-section">
                      <h4>Productos ({selectedOrder.items.length})</h4>
                      <div className="order-items-detail">
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="order-item-detail">
                            <div className="item-image">
                              {item.product.image ? (
                                <img src={item.product.image} alt={item.product.name} />
                              ) : (
                                <div className="placeholder-image">Sin imagen</div>
                              )}
                            </div>
                            <div className="item-info">
                              <p className="item-name">{item.product.name}</p>
                              <p className="item-quantity">Cantidad: {item.quantity}</p>
                              <p className="item-price">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(item.product.price)}</p>
                            </div>
                            <div className="item-subtotal">
                              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(item.product.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="order-detail-section">
                      <h4>Resumen de Pago</h4>
                      <div className="order-summary-detail">
                        <div className="summary-row">
                          <span>Subtotal:</span>
                          <span>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(selectedOrder.subtotal)}</span>
                        </div>
                        <div className="summary-row">
                          <span>Envío:</span>
                          <span>{(selectedOrder.shipping || selectedOrder.shippingCost || 0) === 0 ? 'GRATIS' : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(selectedOrder.shipping || selectedOrder.shippingCost || 0)}</span>
                        </div>
                        {selectedOrder.discount > 0 && (
                          <div className="summary-row discount">
                            <span>Descuento:</span>
                            <span>-{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(selectedOrder.discount)}</span>
                          </div>
                        )}
                        <div className="summary-row total">
                          <span><strong>Total:</strong></span>
                          <span><strong>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(selectedOrder.total)}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="order-detail-section">
                      <h4>Método de Pago</h4>
                      <p>{selectedOrder.paymentMethod?.type === 'card' ? 'Tarjeta de Crédito/Débito' : 
                         selectedOrder.paymentMethod?.type === 'pse' ? 'PSE' :
                         selectedOrder.paymentMethod?.type === 'nequi' ? 'Nequi' :
                         selectedOrder.paymentMethod?.type === 'daviplata' ? 'Daviplata' :
                         selectedOrder.paymentMethod?.type === 'cash' ? 'Efectivo contra entrega' : 
                         'No especificado'}</p>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button 
                      className="btn-secondary"
                      onClick={() => setShowDetailModal(false)}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Orders;
