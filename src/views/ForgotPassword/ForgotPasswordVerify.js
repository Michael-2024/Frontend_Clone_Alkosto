// src/views/ForgotPassword/ForgotPasswordVerify.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import './ForgotPassword.css';

const ForgotPasswordVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, generatedCode } = location.state || {};
  
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Si llegamos aquí sin email o código, redirigir a inicio
    if (!email || !generatedCode) {
      navigate('/forgot-password');
    }
  }, [email, generatedCode, navigate]);

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!code) {
      setError('Por favor ingresa el código de verificación');
      return;
    }

    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }

    // Verificar el código
    const isValid = UserController.verifyResetCode(email, code, generatedCode);
    
    if (isValid) {
      // Código válido, navegar a reset password
      navigate('/forgot-password/reset', { state: { email, verifiedCode: code } });
    } else {
      setError('Código de verificación incorrecto');
    }
  };

  const handleResendCode = () => {
    // Simular reenvío de código
    alert(`Código reenviado: ${generatedCode}\n(En producción, esto se enviaría por email)`);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-content">
        <Link to="/forgot-password" className="back-link">
          ← Volver
        </Link>

        <h1>Verificación de código</h1>

        <div className="verify-instructions">
          <p>Ingresa el código de 6 dígitos que enviamos a:</p>
          <p className="email-display">{email}</p>
        </div>

        <form onSubmit={handleCodeSubmit}>
          <div className="form-group">
            <label htmlFor="code">Código de verificación</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 6) {
                  setCode(value);
                }
              }}
              placeholder="123456"
              className={error ? 'input-error' : ''}
              maxLength={6}
              autoFocus
            />
            {error && <p className="error-message">{error}</p>}
          </div>

          <button type="submit" className="continue-btn">
            Verificar código
          </button>

          <div className="help-section">
            <p className="help-title">¿No recibiste el código?</p>
            <button 
              type="button" 
              className="help-link-btn" 
              onClick={handleResendCode}
            >
              Reenviar código
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordVerify;
