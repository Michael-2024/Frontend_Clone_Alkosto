// src/views/ForgotPassword/ForgotPasswordVerify.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPasswordVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, generatedCode } = location.state || {};
  
  const [inputEmail, setInputEmail] = useState(email || '');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Si llegamos aquí sin datos, mostrar el modal automáticamente
    if (email && generatedCode) {
      // Simular que el email fue "enviado"
      alert(`Código de recuperación: ${generatedCode}\n(En producción, esto se enviaría por email)`);
      setShowModal(true);
    }
  }, [email, generatedCode]);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    
    if (!inputEmail || !inputEmail.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    setShowModal(true);
  };

  const handleContinue = () => {
    setShowModal(false);
    // En producción, aquí se verificaría el código del email
    navigate('/forgot-password/reset', { state: { email: inputEmail } });
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-content">
        <Link to="/login" className="back-link">
          ← Volver
        </Link>

        <h1>Nueva contraseña</h1>

        <div className="verify-instructions">
          <p>Escribe tu correo</p>
        </div>

        <form onSubmit={handleEmailSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              placeholder="abc@123.com"
              className={error ? 'input-error' : ''}
              readOnly={!!email}
            />
            {error && <p className="error-message">{error}</p>}
          </div>

          <button type="submit" className="continue-btn">
            Continuar
          </button>
        </form>
      </div>

      {/* Modal de confirmación de envío */}
      {showModal && (
        <div className="modal-overlay" onClick={handleContinue}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleContinue}>
              ✕
            </button>
            <h2>Nueva contraseña</h2>
            <div className="modal-message">
              <div className="icon-warning">⚠️</div>
              <p>
                Te enviamos un correo electrónico con un enlace para restablecer tu contraseña.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordVerify;
