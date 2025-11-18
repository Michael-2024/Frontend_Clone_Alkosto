// src/views/Returns/ReturnDetail.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import ReturnController from '../../controllers/ReturnController';
import OrderController from '../../controllers/OrderController';
import './Returns.css';
import AccountSidebar from '../Account/AccountSidebar';

/**
 * Vista de Detalle de Devolución (RF25)
 * Muestra información completa de una solicitud de devolución
 */
const ReturnDetail = () => {
  const navigate = useNavigate();
  const { returnId } = useParams();
  const [user, setUser] = useState(UserController.getCurrentUser());
  const [returnItem, setReturnItem] = useState(null);
  const [order, setOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    // Verificar autenticación
    if (!UserController.isLoggedIn()) {
      const email = localStorage.getItem('pendingEmail') || '';
      navigate(`/login/options${email ? `?email=${encodeURIComponent(email)}` : ''}`);
      return;
    }

    loadReturnDetails();
  }, [navigate, returnId]);

  const loadReturnDetails = () => {
    const returnData = ReturnController.getReturnById(returnId);
    
    if (!returnData) {
      // Devolución no encontrada
      navigate('/perfil/devoluciones');
      return;
    }

    // Verificar que pertenece al usuario actual
    if (returnData.userId !== user.id) {
      navigate('/perfil/devoluciones');
      return;
    }

    setReturnItem(returnData);

    // Cargar pedido relacionado
    const orderData = OrderController.getOrderById(returnData.orderId);
    if (orderData) {
      setOrder(orderData);
    }
  };

  const handleCancelReturn = async () => {
    if (!cancelReason.trim()) {
      alert('Por favor escribe un motivo de cancelación');
      return;
    }

    setIsCancelling(true);

    try {
      const result = ReturnController.cancelReturn(returnItem.id, cancelReason);

      if (result.success) {
        alert('Solicitud de devolución cancelada exitosamente');
        loadReturnDetails();
        setShowCancelModal(false);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error al cancelar:', error);
      alert('Error al cancelar la devolución');
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!returnItem) {
    return (
      <div className="account-container">
        <AccountSidebar />
        <div className="account-main">
          <div className="loading">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-container">
      <AccountSidebar />
      <div className="account-main">
        <div className="return-detail-container">
          <button 
            className="btn-link back-button"
            onClick={() => navigate('/perfil/devoluciones')}
          >
            ← Volver a Mis Devoluciones
          </button>

          {/* Header */}
          <div className="return-detail-header">
            <div>
              <h1>Devolución #{returnItem.ticketNumber}</h1>
              <p className="subtitle">
                Creada el {formatDate(returnItem.createdAt)}
              </p>
            </div>
            <div 
              className="status-badge large"
              style={{ backgroundColor: returnItem.getStatusColor() }}
            >
              {returnItem.getStatusText()}
            </div>
          </div>

          {/* Timeline / Progress */}
          <div className="return-timeline">
            <div className={`timeline-step ${returnItem.status !== 'rejected' && returnItem.status !== 'cancelled' ? 'completed' : ''}`}>
              <div className="timeline-icon">📝</div>
              <div className="timeline-content">
                <h4>Solicitud Creada</h4>
                <p>{formatDate(returnItem.createdAt)}</p>
              </div>
            </div>

            <div className={`timeline-step ${['approved', 'in_transit', 'completed'].includes(returnItem.status) ? 'completed' : returnItem.status === 'rejected' ? 'rejected' : ''}`}>
              <div className="timeline-icon">
                {returnItem.status === 'rejected' ? '❌' : '✅'}
              </div>
              <div className="timeline-content">
                <h4>
                  {returnItem.status === 'rejected' ? 'Rechazada' : 'Aprobación'}
                </h4>
                <p>
                  {returnItem.reviewedAt 
                    ? formatDate(returnItem.reviewedAt)
                    : 'Pendiente de revisión (1-2 días hábiles)'}
                </p>
                {returnItem.rejectionReason && (
                  <p className="rejection-reason">Motivo: {returnItem.rejectionReason}</p>
                )}
              </div>
            </div>

            {returnItem.status !== 'rejected' && returnItem.status !== 'cancelled' && (
              <>
                <div className={`timeline-step ${['in_transit', 'completed'].includes(returnItem.status) ? 'completed' : ''}`}>
                  <div className="timeline-icon">📦</div>
                  <div className="timeline-content">
                    <h4>En Tránsito</h4>
                    <p>
                      {returnItem.status === 'in_transit' || returnItem.status === 'completed'
                        ? 'Producto en camino al almacén'
                        : 'Esperando envío'}
                    </p>
                  </div>
                </div>

                <div className={`timeline-step ${returnItem.status === 'completed' ? 'completed' : ''}`}>
                  <div className="timeline-icon">💰</div>
                  <div className="timeline-content">
                    <h4>Reembolso</h4>
                    <p>
                      {returnItem.completedAt
                        ? `Procesado el ${formatDate(returnItem.completedAt)}`
                        : 'Pendiente de completar devolución'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Product Information */}
          <div className="section-card">
            <h2>Producto</h2>
            <div className="product-info-detail">
              <img 
                src={returnItem.product.image || '/images/placeholder.png'} 
                alt={returnItem.product.name}
              />
              <div className="product-details">
                <h3>{returnItem.product.name}</h3>
                {order && (
                  <p className="order-ref">
                    Pedido: #{order.trackingNumber} ({formatDate(order.createdAt)})
                  </p>
                )}
                <div className="product-meta">
                  <div className="meta-item">
                    <span className="label">Cantidad:</span>
                    <span className="value">{returnItem.quantity}</span>
                  </div>
                  <div className="meta-item">
                    <span className="label">Precio unitario:</span>
                    <span className="value">{formatCurrency(returnItem.product.price)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="label">Reembolso total:</span>
                    <span className="value refund-amount">{formatCurrency(returnItem.refundAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Return Reason */}
          <div className="section-card">
            <h2>Motivo de la Devolución</h2>
            <div className="reason-detail">
              <p className="reason-type">
                <strong>Tipo:</strong> {returnItem.getReasonTypeText()}
              </p>
              <p className="reason-text">
                <strong>Descripción:</strong> {returnItem.reason}
              </p>
              {returnItem.description && (
                <p className="description-text">
                  <strong>Detalles adicionales:</strong> {returnItem.description}
                </p>
              )}
            </div>

            {/* Evidence */}
            {returnItem.evidence && returnItem.evidence.length > 0 && (
              <div className="evidence-section">
                <h3>Evidencia Fotográfica</h3>
                <div className="evidence-grid">
                  {returnItem.evidence.map((url, index) => (
                    <div key={index} className="evidence-image">
                      <img src={url} alt={`Evidencia ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Refund Information */}
          {returnItem.status === 'approved' || returnItem.status === 'in_transit' || returnItem.status === 'completed' ? (
            <div className="section-card refund-info">
              <h2>Información de Reembolso</h2>
              <div className="refund-details">
                <div className="refund-row">
                  <span className="label">Monto:</span>
                  <span className="value">{formatCurrency(returnItem.refundAmount)}</span>
                </div>
                {returnItem.refundMethod && (
                  <div className="refund-row">
                    <span className="label">Método:</span>
                    <span className="value">{returnItem.getRefundMethodText()}</span>
                  </div>
                )}
                {returnItem.shippingLabelUrl && (
                  <div className="refund-row">
                    <span className="label">Guía de Envío:</span>
                    <a 
                      href={returnItem.shippingLabelUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="download-link"
                    >
                      📥 Descargar Guía
                    </a>
                  </div>
                )}
              </div>

              {returnItem.status === 'approved' && (
                <div className="info-box">
                  <h4>📦 Próximos Pasos:</h4>
                  <ol>
                    <li>Descarga la guía de envío desde tu email o desde arriba</li>
                    <li>Empaca el producto en su caja original (si es posible)</li>
                    <li>Pega la guía de envío en el paquete</li>
                    <li>Programa la recolección con la transportadora</li>
                    <li>Espera la confirmación de recepción (3-5 días hábiles)</li>
                  </ol>
                </div>
              )}

              {returnItem.status === 'completed' && (
                <div className="success-box">
                  <h4>✅ Devolución Completada</h4>
                  <p>El reembolso ha sido procesado y se reflejará en tu {returnItem.getRefundMethodText()} en 5-10 días hábiles.</p>
                </div>
              )}
            </div>
          ) : null}

          {/* Admin Notes */}
          {returnItem.adminNotes && (
            <div className="section-card admin-notes">
              <h2>Notas del Administrador</h2>
              <p>{returnItem.adminNotes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="return-actions">
            {returnItem.canBeCancelledByCustomer() && (
              <button 
                className="btn-danger"
                onClick={() => setShowCancelModal(true)}
              >
                Cancelar Solicitud
              </button>
            )}
            
            <button 
              className="btn-secondary"
              onClick={() => navigate('/perfil/pedidos')}
            >
              Ver Pedidos
            </button>

            <button 
              className="btn-secondary"
              onClick={() => navigate('/perfil/devoluciones')}
            >
              Ver Todas las Devoluciones
            </button>
          </div>

          {/* Cancel Modal */}
          {showCancelModal && (
            <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Cancelar Solicitud de Devolución</h2>
                  <button 
                    className="modal-close"
                    onClick={() => setShowCancelModal(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="modal-body">
                  <p>¿Estás seguro de que deseas cancelar esta solicitud de devolución?</p>
                  
                  <div className="form-group">
                    <label htmlFor="cancel-reason">Motivo de cancelación:</label>
                    <textarea
                      id="cancel-reason"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Explica por qué deseas cancelar..."
                      rows="3"
                    />
                  </div>

                  <div className="warning-box">
                    <strong>⚠️ Importante:</strong> Esta acción no se puede deshacer. Si deseas volver a solicitar la devolución, deberás crear una nueva solicitud.
                  </div>
                </div>

                <div className="modal-footer">
                  <button 
                    className="btn-secondary"
                    onClick={() => setShowCancelModal(false)}
                    disabled={isCancelling}
                  >
                    Volver
                  </button>
                  <button 
                    className="btn-danger"
                    onClick={handleCancelReturn}
                    disabled={isCancelling || !cancelReason.trim()}
                  >
                    {isCancelling ? 'Cancelando...' : 'Confirmar Cancelación'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnDetail;
