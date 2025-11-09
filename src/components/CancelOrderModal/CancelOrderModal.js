// src/components/CancelOrderModal/CancelOrderModal.js
import React, { useState } from 'react';
import './CancelOrderModal.css';

/**
 * Modal de Confirmación de Cancelación de Pedido (RF19)
 * Permite al cliente cancelar un pedido con un motivo
 */
const CancelOrderModal = ({ order, onConfirm, onCancel }) => {
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Motivos predefinidos
  const predefinedReasons = [
    'Encontré un mejor precio',
    'Cambié de opinión',
    'Compré por error',
    'Demora en el envío',
    'Necesito modificar mi pedido',
    'Otro motivo'
  ];

  const handleReasonSelect = (value) => {
    setSelectedReason(value);
    if (value !== 'Otro motivo') {
      setReason(value);
    } else {
      setReason('');
    }
  };

  const handleConfirm = async () => {
    if (!reason.trim()) {
      alert('Por favor selecciona o escribe un motivo de cancelación');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onConfirm(reason);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener tiempo restante para cancelar
  const timeLeft = order.getTimeLeftToCancel();
  const canBeCancelled = order.canBeCancelled();

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content cancel-order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Cancelar Pedido</h2>
          <button className="modal-close" onClick={onCancel} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Información del pedido */}
          <div className="order-info-box">
            <div className="info-row">
              <span className="label">Número de pedido:</span>
              <span className="value">#{order.trackingNumber}</span>
            </div>
            <div className="info-row">
              <span className="label">Total:</span>
              <span className="value">
                {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0
                }).format(order.total)}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Estado:</span>
              <span className="value status-badge" style={{ backgroundColor: order.getStatusColor() }}>
                {order.getStatusText()}
              </span>
            </div>
          </div>

          {/* Política de cancelación */}
          {canBeCancelled.canCancel ? (
            <>
              <div className="policy-box">
                <h3>⏱️ Tiempo para cancelar</h3>
                {!timeLeft.expired ? (
                  <p className="time-left">
                    Tienes <strong>{timeLeft.hours}h {timeLeft.minutes}m</strong> restantes para cancelar este pedido
                  </p>
                ) : (
                  <p className="time-expired">El plazo de cancelación ha expirado</p>
                )}
              </div>

              {/* Motivos de cancelación */}
              <div className="reason-section">
                <h3>¿Por qué deseas cancelar?</h3>
                <p className="reason-hint">Selecciona un motivo o escribe el tuyo</p>

                <div className="reason-options">
                  {predefinedReasons.map((reasonOption) => (
                    <label key={reasonOption} className="reason-option">
                      <input
                        type="radio"
                        name="cancellation-reason"
                        value={reasonOption}
                        checked={selectedReason === reasonOption}
                        onChange={(e) => handleReasonSelect(e.target.value)}
                      />
                      <span>{reasonOption}</span>
                    </label>
                  ))}
                </div>

                {selectedReason === 'Otro motivo' && (
                  <div className="custom-reason">
                    <label htmlFor="custom-reason-input">Escribe tu motivo:</label>
                    <textarea
                      id="custom-reason-input"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Describe el motivo de cancelación..."
                      rows="3"
                      maxLength="200"
                    />
                    <small>{reason.length}/200 caracteres</small>
                  </div>
                )}
              </div>

              {/* Advertencia */}
              <div className="warning-box">
                <span className="warning-icon">⚠️</span>
                <div className="warning-text">
                  <strong>Importante:</strong>
                  <p>Una vez cancelado el pedido, no podrás reactivarlo. Si deseas volver a comprarlo, deberás realizar un nuevo pedido.</p>
                </div>
              </div>
            </>
          ) : (
            <div className="error-box">
              <span className="error-icon">❌</span>
              <div className="error-text">
                <strong>No se puede cancelar este pedido</strong>
                <p>{canBeCancelled.reason}</p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button 
            className="btn-secondary" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Volver
          </button>
          {canBeCancelled.canCancel && (
            <button 
              className="btn-danger" 
              onClick={handleConfirm}
              disabled={isSubmitting || !reason.trim()}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Cancelando...
                </>
              ) : (
                'Confirmar Cancelación'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
