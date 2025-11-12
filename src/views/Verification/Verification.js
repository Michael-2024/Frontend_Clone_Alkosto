// src/views/Verification/Verification.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import VerificationService from '../../services/VerificationService';
import UserController from '../../controllers/UserController';
import RegisterLayout from '../../layouts/RegisterLayout/RegisterLayout';
import './Verification.css';

const Verification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, phone, fromRegister } = location.state || {};

  const [step, setStep] = useState('choose'); // choose | verify-email | verify-sms
  const [verificationMethod, setVerificationMethod] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sentCode, setSentCode] = useState(''); // Para desarrollo

  useEffect(() => {
    // Si no hay email, redirigir
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  // Enviar código por correo
  const handleSendEmailCode = async () => {
    setIsLoading(true);
    setError('');
    setSentCode('');

    try {
      const codigo = VerificationService.generateVerificationCode();
      const result = await VerificationService.enviarCorreoVerificacion(email, codigo);
      
      if (result.success) {
        setSentCode(result.code); // Solo para desarrollo
        setVerificationMethod('email');
        setStep('verify-email');
        setSuccess('Código enviado a tu correo electrónico');
      }
    } catch (err) {
      setError('Error al enviar el código. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Enviar código por SMS
  const handleSendSMSCode = async () => {
    if (!phone) {
      setError('No se ha registrado un número de teléfono');
      return;
    }

    setIsLoading(true);
    setError('');
    setSentCode('123456');

    try {
      const codigo = VerificationService.generateVerificationCode();
      const result = await VerificationService.enviarSMS(phone, codigo);
      
      if (result.success) {
        setSentCode(result.code); // Solo para desarrollo
        setVerificationMethod('sms');
        setStep('verify-sms');
        setSuccess('Código enviado a tu teléfono');
      }
    } catch (err) {
      setError('Error al enviar el código. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar código ingresado
  const handleVerifyCode = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!code || code.length !== 6) {
      setError('Por favor ingresa un código de 6 dígitos');
      return;
    }

    const destinatario = verificationMethod === 'email' ? email : phone;
    const result = VerificationService.validarConfirmacion(destinatario, code);

    if (result.success) {
      // Actualizar estado en UserController
      if (verificationMethod === 'email') {
        UserController.verifyEmail(email);
      } else {
        UserController.verifyPhone(email);
      }

      setSuccess('¡Verificación exitosa!');
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        if (fromRegister) {
          navigate('/login', { state: { message: 'Cuenta verificada. Ya puedes iniciar sesión.' } });
        } else {
          navigate('/');
        }
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  // Reenviar código
  const handleResendCode = () => {
    setCode('');
    setError('');
    setSuccess('');
    
    if (verificationMethod === 'email') {
      handleSendEmailCode();
    } else {
      handleSendSMSCode();
    }
  };

  // Cambiar método de verificación
  const handleChangeMethod = () => {
    setStep('choose');
    setCode('');
    setError('');
    setSuccess('');
    setSentCode('');
    setVerificationMethod('');
  };

  // Omitir verificación (opcional)
  const handleSkipVerification = () => {
    if (fromRegister) {
      navigate('/login', { state: { message: 'Puedes verificar tu cuenta más tarde desde tu perfil.' } });
    } else {
      navigate('/');
    }
  };

  return (
    <RegisterLayout>
      <div className="verification-page">
        <div className="verification-container">
          <Link to={fromRegister ? "/register" : "/"} className="back-link">
            ← Volver
          </Link>

          <h1>Verificación de cuenta</h1>

          {/* Pantalla de selección de método */}
          {step === 'choose' && (
            <div className="verification-choose">
              <p className="verification-subtitle">
                Para completar tu registro, verifica tu correo electrónico o número de teléfono
              </p>

              <div className="user-info">
                <div className="info-item">
                  <span className="info-label">Correo:</span>
                  <span className="info-value">{email}</span>
                </div>
                {phone && (
                  <div className="info-item">
                    <span className="info-label">Teléfono:</span>
                    <span className="info-value">{phone}</span>
                  </div>
                )}
              </div>

              <div className="verification-methods">
                <button
                  type="button"
                  className="method-btn email-btn"
                  onClick={handleSendEmailCode}
                  disabled={isLoading}
                >
                  <span className="method-icon">✉️</span>
                  <div className="method-info">
                    <span className="method-title">Verificar por correo</span>
                    <span className="method-desc">Recibe un código en tu email</span>
                  </div>
                </button>

                {phone && (
                  <button
                    type="button"
                    className="method-btn sms-btn"
                    onClick={handleSendSMSCode}
                    disabled={isLoading}
                  >
                    <span className="method-icon">📱</span>
                    <div className="method-info">
                      <span className="method-title">Verificar por SMS</span>
                      <span className="method-desc">Recibe un código en tu teléfono</span>
                    </div>
                  </button>
                )}
              </div>

              {error && <p className="error-message">{error}</p>}

              <button
                type="button"
                className="skip-btn"
                onClick={handleSkipVerification}
              >
                Verificar más tarde
              </button>
            </div>
          )}

          {/* Pantalla de ingreso de código */}
          {(step === 'verify-email' || step === 'verify-sms') && (
            <div className="verification-code">
              <div className="verification-info">
                <p className="verification-subtitle">
                  {step === 'verify-email' 
                    ? `Ingresa el código de 6 dígitos que enviamos a:`
                    : `Ingresa el código de 6 dígitos que enviamos por SMS a:`}
                </p>
                <p className="verification-destination">
                  {step === 'verify-email' ? email : phone}
                </p>
                
                {/* Solo para desarrollo: mostrar código */}
                {sentCode && (
                  <div className="dev-code-display">
                    <p>🔧 Código de desarrollo: <strong>{sentCode}</strong></p>
                    <p className="dev-note">(En producción, esto se enviaría por email/SMS)</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleVerifyCode}>
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
                    className={error ? 'input-error code-input' : 'code-input'}
                    maxLength={6}
                    autoFocus
                  />
                  {error && <p className="error-message">{error}</p>}
                  {success && <p className="success-message">{success}</p>}
                </div>

                <button type="submit" className="verify-btn" disabled={isLoading}>
                  {isLoading ? 'Verificando...' : 'Verificar código'}
                </button>

                <div className="verification-actions">
                  <button
                    type="button"
                    className="action-link"
                    onClick={handleResendCode}
                    disabled={isLoading}
                  >
                    Reenviar código
                  </button>
                  <button
                    type="button"
                    className="action-link"
                    onClick={handleChangeMethod}
                  >
                    Cambiar método de verificación
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </RegisterLayout>
  );
};

export default Verification;
