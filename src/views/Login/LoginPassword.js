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

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!password) {
      setError('Por favor ingresa tu contraseña');
      setIsSubmitting(false);
      return;
    }
    console.log('Intentando login con:', email);
    const result = await UserController.login(email, password);
    console.log('Resultado del login:', result);
    if (result.success) {
      const intended = localStorage.getItem('intendedCheckout');
      if (intended) {
        localStorage.removeItem('intendedCheckout');
        navigate('/checkout');
      } else {
        navigate('/');
      }
    } else {
      // Mensaje más específico si el email podría no estar registrado
      const errorMessage = result.error || 'Credenciales incorrectas. Inténtalo nuevamente';
      setError(errorMessage);
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
              <h2 className="login-title">Ingresa tu contraseña</h2>
              <div className="email-display">
                <p className="email-label-login">Estás ingresando con:</p>
                <span className="email-value-left">{email}</span>{' '}
                <Link 
                  to={`/login/options?email=${encodeURIComponent(email)}`}
                  className="modify-link-inline"
                >
                  Modificar
                </Link>
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
                <div className="login-help-section">
                  <p className="login-help-title">Tengo problemas para ingresar</p>
                  <Link 
                    to={`/forgot-password?email=${encodeURIComponent(email)}`}
                    className="login-help-link"
                  >
                    Olvidé mi contraseña
                  </Link>
                  <Link 
                    to={`/login/options?email=${encodeURIComponent(email)}`}
                    className="login-help-link"
                  >
                    Probar otro método para ingresar
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </RegisterLayout>
  );
};

export default LoginPassword;
