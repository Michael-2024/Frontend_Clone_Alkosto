import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import RegisterLayout from '../../layouts/RegisterLayout/RegisterLayout';
import UserController from '../../controllers/UserController';
import './LoginOptions.css';

const LoginPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const email = params.get('email') || '';

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/');
    }
  }, [email, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!password) {
      setError('Por favor ingresa tu contraseña');
      setIsSubmitting(false);
      return;
    }
    const result = UserController.login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError('Contraseña incorrecta. Inténtalo nuevamente');
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
              <h2 className="login-title">Ingresa con tu contraseña</h2>
              <div className="email-display">
                <p className="email-label-login">Correo electrónico:</p>
                <span className="email-value-left">{email}</span>
              </div>
            </div>
            <div className="register-form-container">
              <form onSubmit={handleLogin} className="register-form">
                <div className="form-group">
                  <div className="password-input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Contraseña"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(''); }}
                      className={error ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="toggle-password-visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                  {error && <div className="error-message">{error}</div>}
                </div>
                <button type="submit" className="continue-button" disabled={isSubmitting}>
                  Ingresar
                </button>
                <button type="button" className="forgot-password-button" onClick={() => alert('Funcionalidad no implementada')}>¿Olvidaste tu contraseña?</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </RegisterLayout>
  );
};

export default LoginPassword;
