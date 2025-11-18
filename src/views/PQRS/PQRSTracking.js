import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pqrsController from '../../controllers/PQRSController';
import './PQRSTracking.css';

const PQRSTracking = () => {
  const navigate = useNavigate();
  const [ticketNumber, setTicketNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!ticketNumber.trim()) {
      setError('Por favor, ingresa un número de radicado');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const pqrs = await pqrsController.getByTicketNumber(ticketNumber.trim());
      
      if (pqrs) {
        // Redirigir a la página de detalle
        navigate(`/perfil/pqrs/${ticketNumber.trim()}`);
      } else {
        setError('No se encontró ninguna solicitud con ese número de radicado');
      }
    } catch (err) {
      console.error('Error al buscar PQRS:', err);
      setError('Error al buscar la solicitud. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pqrs-tracking-page">
      <div className="tracking-container">
        <div className="tracking-header">
          <h1>Seguimiento de PQRS</h1>
          <p className="subtitle">
            Ingresa tu número de radicado para consultar el estado de tu solicitud
          </p>
        </div>

        <form onSubmit={handleSubmit} className="tracking-form">
          <div className="form-group">
            <label htmlFor="ticketNumber">Número de radicado</label>
            <input
              type="text"
              id="ticketNumber"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              placeholder="Ej: PQRS-2024-123456789"
              className={error ? 'input-error' : ''}
              disabled={loading}
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <button
            type="submit"
            className="btn-track"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Consultando...
              </>
            ) : (
              'Consultar'
            )}
          </button>
        </form>

        <div className="tracking-info">
          <h3>¿No tienes un número de radicado?</h3>
          <p>
            Si aún no has enviado una solicitud PQRS, puedes hacerlo desde aquí:
          </p>
          <button
            className="btn-new-pqrs"
            onClick={() => navigate('/perfil/pqrs/nuevo')}
          >
            Enviar nueva PQRS
          </button>
        </div>

        <div className="help-section">
          <h3>Información sobre PQRS</h3>
          <div className="help-grid">
            <div className="help-item">
              <span className="help-icon">📝</span>
              <div>
                <h4>¿Qué es PQRS?</h4>
                <p>
                  Son Peticiones, Quejas, Reclamos y Sugerencias que puedes enviar
                  para comunicarte con nosotros sobre cualquier tema.
                </p>
              </div>
            </div>
            <div className="help-item">
              <span className="help-icon">⏱️</span>
              <div>
                <h4>Tiempo de respuesta</h4>
                <p>
                  Nuestro tiempo máximo de respuesta es de 5 días hábiles.
                  Recibirás actualizaciones por email.
                </p>
              </div>
            </div>
            <div className="help-item">
              <span className="help-icon">📞</span>
              <div>
                <h4>Contacto directo</h4>
                <p>
                  También puedes contactarnos por teléfono: 01 8000 123 456
                  o por email: ayuda@alkosto.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PQRSTracking;
