import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import RegisterLayout from '../../layouts/RegisterLayout/RegisterLayout';
import UserController from '../../controllers/UserController';
import './LoginOptions.css';

const LoginCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const email = params.get('email');
  const method = params.get('method'); // whatsapp, sms, email

  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [codeSent, setCodeSent] = useState(true);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (timeLeft > 0 && codeSent) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, codeSent]);

  useEffect(() => {
    if (!email || !method) {
      navigate('/');
    }
    setCodeSent(true);
  }, [email, method, navigate]);

  const methodTitle = {
    whatsapp: 'Whatsapp',
    sms: 'SMS',
    email: 'correo electrónico'
  };

  const getDestination = () => {
    if (method === 'email') {
      return email;
    } else {
      // Buscar el teléfono del usuario
      const users = UserController.getAllUsers();
      const user = users.find(u => u.email === email);
      if (user && user.phone && user.phone.length >= 4) {
        return 'terminado en ' + user.phone.slice(-4);
      }
      return '----';
    }
  };

  const handleCodeChange = (index, value) => {
    if (value !== '' && !/^[0-9]$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value !== '' && index < 3) {
      inputRefs[index + 1].current.focus();
    }
    if (error) setError('');
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && code[index] === '') {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    if (/^\d{4}$/.test(paste)) {
      setCode(paste.split(''));
      inputRefs[3].current.focus();
    }
  };

  const handleResendCode = () => {
    setCodeSent(true);
    setTimeLeft(30);
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fullCode = code.join('');
    if (fullCode.length !== 4) {
      setError('Por favor ingresa el código completo de 4 dígitos');
      setIsSubmitting(false);
      return;
    }
    if (fullCode === '1234') {
      UserController.loginWithCode(email);
      navigate('/');
    } else {
      setError('Código incorrecto. Inténtalo nuevamente');
    }
    setIsSubmitting(false);
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
              <h2 className="login-title">Ingresa con código por {methodTitle[method]}</h2>
              <div className="email-display">
                <p className="email-label-login">Enviamos un código a tu {method === 'email' ? 'correo' : 'teléfono'}</p>
                <span className="email-value-left">{getDestination()}</span>
              </div>
            </div>
            <div className="register-form-container">
              <form onSubmit={handleVerifyCode} className="register-form">
                <div className="form-group">
                  <label className="code-label">Ingresa el código de 4 dígitos:</label>
                  <div className="code-inputs">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={inputRefs[index]}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={e => handleCodeChange(index, e.target.value)}
                        onKeyDown={e => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className="code-input"
                      />
                    ))}
                  </div>
                  {error && <div className="error-message">{error}</div>}
                </div>
                <button type="submit" className="continue-button" disabled={isSubmitting}>
                  Verificar código
                </button>
                <div className="resend-code">
                  {timeLeft > 0 ? (
                    <p>Puedes solicitar un nuevo código en {timeLeft} segundos</p>
                  ) : (
                    <button type="button" className="resend-code-button" onClick={handleResendCode} disabled={codeSent && timeLeft > 0}>
                      Reenviar código
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </RegisterLayout>
  );
};

export default LoginCode;
