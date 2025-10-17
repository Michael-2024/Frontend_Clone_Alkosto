// src/views/ForgotPassword/ForgotPassword.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { validateEmail } from '../../utils/userUtils';
import UserController from '../../controllers/UserController';
import './ForgotPassword.css';
import RegisterLayout from '../../layouts/RegisterLayout/RegisterLayout';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  // Controla si mostramos el resumen del email (después de un submit válido)
  const [showSummary, setShowSummary] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Prefill: obtener email desde el querystring si viene de Login
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromQuery = params.get('email') || '';
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [location.search]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Validar formato de email
    if (!validateEmail(email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    // Verificar que el usuario exista
    const user = UserController.getUserByEmail(email);
    if (!user) {
      setError('No encontramos una cuenta con este correo electrónico');
      return;
    }

    // Generar código de verificación de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    // Simular envío de email
    console.log(`Código de recuperación enviado a ${email}: ${code}`);
    
    // Mostrar modal de confirmación y el resumen del email
    setShowModal(true);
    setShowSummary(true);
    } catch (error) {
      setError('Ha ocurrido un error. Por favor intenta nuevamente.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Navegar a la vista de ingresar código
    navigate('/forgot-password/verify', { state: { email, generatedCode } });
  };

  return (
    <RegisterLayout>
      <div className="login-page">
        <div className="login-container">
          <Link to={`/login/options?email=${encodeURIComponent(email)}`} className="back-button">
            <span className="back-arrow">←</span> Volver
          </Link>
          <div className="login-content">
            <div className="login-heading">
              <h2 className="login-title">Recupera tu contraseña</h2>
              <div className="email-display">
                <p className="email-label-login">Ingresa tu correo electrónico:</p>
              </div>
            </div>
            <div className="login-options-container">
              <div className="forgot-password-content">
        
        <div className="user-email-info">
          <p className="info-label">Ingresa tu correo electrónico:</p>
          {showSummary ? (
            <>
              <p className="email-display">{email}</p>
              <button 
                className="modify-link" 
                onClick={() => setShowSummary(false)}
              >
                Modificar
              </button>
              <div className="help-section">
                <p className="help-title">Tengo problemas para ingresar</p>
                <Link 
                  to={`/login/options?email=${encodeURIComponent(email)}`}
                  className="help-link"
                >
                  Probar otro método para ingresar
                </Link>
              </div>
            </>
          ) : (
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className={error ? 'input-error' : ''}
                  autoFocus
                />
                {error && <p className="error-message">{error}</p>}
              </div>

              <button type="submit" className="continue-btn">
                Continuar
              </button>

              <div className="help-section">
                <p className="help-title">Tengo problemas para ingresar</p>
                <Link 
                  to={`/login/options?email=${encodeURIComponent(email)}`}
                  className="help-link"
                >
                  Probar otro método para ingresar
                </Link>
              </div>
            </form>
          )}
        </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={handleCloseModal}>
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
    </RegisterLayout>
  );
};

export default ForgotPassword;
