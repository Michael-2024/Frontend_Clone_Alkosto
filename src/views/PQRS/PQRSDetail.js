import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pqrsController from '../../controllers/PQRSController';
import './PQRSDetail.css';

const PQRSDetail = () => {
  const { ticketNumber } = useParams();
  const navigate = useNavigate();
  const [pqrs, setPqrs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPQRSDetail();
  }, [ticketNumber]);

  const loadPQRSDetail = async () => {
    try {
      setLoading(true);
      const data = await pqrsController.getByTicketNumber(ticketNumber);
      
      if (data) {
        setPqrs(data);
        setError(null);
      } else {
        setError('PQRS no encontrado');
      }
    } catch (err) {
      console.error('Error al cargar PQRS:', err);
      setError('Error al cargar los detalles del PQRS');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Abierto': '📨',
      'En Proceso': '⏳',
      'Resuelto': '✅',
      'Cerrado': '🔒'
    };
    return icons[status] || '📋';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Petición': '📝',
      'Queja': '😟',
      'Reclamo': '⚠️',
      'Sugerencia': '💡'
    };
    return icons[type] || '📋';
  };

  if (loading) {
    return (
      <div className="pqrs-detail-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (error || !pqrs) {
    return (
      <div className="pqrs-detail-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>{error || 'PQRS no encontrado'}</h2>
          <p>Verifica el número de radicado e intenta nuevamente.</p>
          <button
            className="btn-primary"
            onClick={() => navigate('/perfil/pqrs')}
          >
            Volver a mis PQRS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pqrs-detail-container">
      {/* Header */}
      <div className="pqrs-detail-header">
        <button
          className="btn-back"
          onClick={() => navigate('/perfil/pqrs')}
        >
          ← Volver
        </button>
        <div className="header-content">
          <h1>{getTypeIcon(pqrs.type)} {pqrs.type}</h1>
          <div className="ticket-info">
            <span className="ticket-number">
              Radicado: <strong>{pqrs.ticketNumber}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Estado y Timeline */}
      <div className="pqrs-status-section">
        <div className="status-card">
          <div className="status-icon">{getStatusIcon(pqrs.status)}</div>
          <div className="status-content">
            <h3>Estado Actual</h3>
            <p className={`status-badge status-${pqrs.status.toLowerCase().replace(' ', '-')}`}>
              {pqrs.status}
            </p>
          </div>
        </div>

        <div className="timeline">
          <div className="timeline-item active">
            <div className="timeline-icon">✓</div>
            <div className="timeline-content">
              <h4>Solicitud Recibida</h4>
              <p>{new Date(pqrs.createdAt).toLocaleString('es-CO')}</p>
            </div>
          </div>

          <div className={`timeline-item ${pqrs.status !== 'Abierto' ? 'active' : ''}`}>
            <div className="timeline-icon">
              {pqrs.status !== 'Abierto' ? '✓' : '○'}
            </div>
            <div className="timeline-content">
              <h4>En Proceso</h4>
              <p>
                {pqrs.updatedAt 
                  ? new Date(pqrs.updatedAt).toLocaleString('es-CO')
                  : 'Pendiente'}
              </p>
            </div>
          </div>

          <div className={`timeline-item ${pqrs.status === 'Resuelto' || pqrs.status === 'Cerrado' ? 'active' : ''}`}>
            <div className="timeline-icon">
              {pqrs.status === 'Resuelto' || pqrs.status === 'Cerrado' ? '✓' : '○'}
            </div>
            <div className="timeline-content">
              <h4>Resuelto</h4>
              <p>
                {pqrs.resolvedAt
                  ? new Date(pqrs.resolvedAt).toLocaleString('es-CO')
                  : 'Pendiente'}
              </p>
            </div>
          </div>
        </div>

        {!pqrs.isWithinResponseTime() && (
          <div className="warning-alert">
            <span className="alert-icon">⚠️</span>
            <div className="alert-content">
              <h4>Fuera de tiempo de respuesta</h4>
              <p>Esta solicitud ha superado el tiempo estándar de respuesta de 5 días hábiles.</p>
            </div>
          </div>
        )}
      </div>

      {/* Detalles de la solicitud */}
      <div className="pqrs-details-section">
        <div className="detail-card">
          <h3>Asunto</h3>
          <p className="subject-text">{pqrs.subject}</p>
        </div>

        <div className="detail-card">
          <h3>Descripción</h3>
          <p className="description-text">{pqrs.description}</p>
        </div>

        {pqrs.response && (
          <div className="detail-card response-card">
            <h3>Respuesta de Alkosto</h3>
            <p className="response-text">{pqrs.response}</p>
            {pqrs.resolvedAt && (
              <p className="response-date">
                Respondido el: {new Date(pqrs.resolvedAt).toLocaleString('es-CO')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="pqrs-info-section">
        <h3>Información de Contacto</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">📧 Email:</span>
            <span className="info-value">{pqrs.email}</span>
          </div>
          {pqrs.phone && (
            <div className="info-item">
              <span className="info-label">📞 Teléfono:</span>
              <span className="info-value">{pqrs.phone}</span>
            </div>
          )}
          {pqrs.orderId && (
            <div className="info-item">
              <span className="info-label">📦 Pedido relacionado:</span>
              <span className="info-value">#{pqrs.orderId}</span>
            </div>
          )}
          <div className="info-item">
            <span className="info-label">⏱️ Tiempo transcurrido:</span>
            <span className="info-value">{pqrs.getElapsedTime()}</span>
          </div>
        </div>
      </div>

      {/* Información de seguimiento */}
      <div className="tracking-info">
        <h3>¿Necesitas ayuda adicional?</h3>
        <p>
          Si tienes preguntas sobre el estado de tu {pqrs.type.toLowerCase()}, 
          puedes contactarnos usando tu número de radicado:
        </p>
        <div className="contact-options">
          <div className="contact-option">
            <span className="option-icon">📞</span>
            <div className="option-content">
              <h4>Línea de atención</h4>
              <p>01 8000 123 456</p>
            </div>
          </div>
          <div className="contact-option">
            <span className="option-icon">📧</span>
            <div className="option-content">
              <h4>Email</h4>
              <p>ayuda@alkosto.com</p>
            </div>
          </div>
          <div className="contact-option">
            <span className="option-icon">💬</span>
            <div className="option-content">
              <h4>Chat en línea</h4>
              <p>Disponible 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PQRSDetail;
