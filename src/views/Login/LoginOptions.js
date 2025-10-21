import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import RegisterLayout from '../../layouts/RegisterLayout/RegisterLayout';
import { getLast4PhoneDigitsByEmail } from '../../utils/userUtils';
import './LoginOptions.css';

const LoginOptions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtener email de URL o localStorage
  const params = new URLSearchParams(location.search);
  const emailFromURL = params.get('email') || '';
  const emailFromStorage = localStorage.getItem('pendingEmail') || '';
  const email = emailFromURL || emailFromStorage;
  
  // Obtener los últimos 4 dígitos del teléfono registrado
  const phoneNumber = getLast4PhoneDigitsByEmail(email);
  
  // Función para modificar el email
  const handleModifyEmail = () => {
    navigate('/');
  };
  
  // Funciones para manejar las opciones de inicio de sesión
  const handleWhatsappLogin = () => {
    navigate(`/login/code?email=${encodeURIComponent(email)}&method=whatsapp`);
  };
  
  const handleSMSLogin = () => {
    navigate(`/login/code?email=${encodeURIComponent(email)}&method=sms`);
  };
  
  const handleEmailLogin = () => {
    navigate(`/login/code?email=${encodeURIComponent(email)}&method=email`);
  };
  
  const handlePasswordLogin = () => {
    navigate(`/login/password?email=${encodeURIComponent(email)}`);
  };
  
  const [editingEmail, setEditingEmail] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState(email);
  const [emailError, setEmailError] = React.useState('');

  const validateEmail = (value) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(value).toLowerCase());
  };

  const handleEditEmail = () => {
    setEditingEmail(true);
    setNewEmail(email);
    setEmailError('');
  };

  const handleSaveEmail = () => {
    if (!validateEmail(newEmail)) {
      setEmailError('Correo electrónico inválido');
      return;
    }
    navigate(`/login/options?email=${encodeURIComponent(newEmail)}`);
    setEditingEmail(false);
  };

  const handleCancelEditEmail = () => {
    setEditingEmail(false);
    setEmailError('');
  };
  
  React.useEffect(() => {
    if (emailFromStorage) {
      localStorage.removeItem('pendingEmail');
    }
    if (!email) {
      navigate('/');
    }
  }, [email, emailFromStorage, navigate]);
  
  return (
    <RegisterLayout>
      <div className="login-page">
        <div className="login-container">
          <Link to="/" className="back-button">
            <span className="back-arrow">←</span> Volver
          </Link>
          <div className="login-content">
            <div className="login-heading">
              <h2 className="login-title">Elige un método para ingresar</h2>
              <div className="email-display">
                <p className="email-label-login">Estás ingresando con:</p>
                <div className="email-value-container">
                  {!editingEmail ? (
                    <>
                      <span className="email-value-left">{email}</span>
                      <button 
                        className="modify-button"
                        type="button"
                        onClick={handleEditEmail}
                      >
                        Modificar
                      </button>
                    </>
                  ) : (
                    <form className="email-edit-form" onSubmit={e => { e.preventDefault(); handleSaveEmail(); }}>
                      <label className="email-edit-label">Correo electrónico:</label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={e => { setNewEmail(e.target.value); setEmailError(''); }}
                        className="email-edit-input"
                        autoFocus
                      />
                      {emailError && <div className="error-message">{emailError}</div>}
                      <div className="email-edit-buttons">
                        <button type="submit" className="email-save-button" disabled={!validateEmail(newEmail)}>
                          Guardar
                        </button>
                        <button type="button" className="email-cancel-button" onClick={handleCancelEditEmail}>
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
            <div className="login-options-container">
              <div className="login-options-list">
                <button 
                  className="login-option-item"
                  onClick={handleWhatsappLogin}
                >
                  <div className="login-option-icon whatsapp-icon">📱</div>
                  <div className="login-option-text">
                    <div className="login-option-title">Whatsapp</div>
                    <div className="login-option-description">
                      Recibirás un código al número terminado en {phoneNumber || '----'}
                    </div>
                  </div>
                  <div className="login-option-arrow">&gt;</div>
                </button>
                <button 
                  className="login-option-item"
                  onClick={handleSMSLogin}
                >
                  <div className="login-option-icon sms-icon">💬</div>
                  <div className="login-option-text">
                    <div className="login-option-title">SMS</div>
                    <div className="login-option-description">
                      Recibirás un código al número terminado en {phoneNumber || '----'}
                    </div>
                  </div>
                  <div className="login-option-arrow">&gt;</div>
                </button>
                <button 
                  className="login-option-item"
                  onClick={handleEmailLogin}
                >
                  <div className="login-option-icon email-icon">✉️</div>
                  <div className="login-option-text">
                    <div className="login-option-title">Correo</div>
                    <div className="login-option-description">
                      Recibirás un código a {email}
                    </div>
                  </div>
                  <div className="login-option-arrow">&gt;</div>
                </button>
                <button 
                  className="login-option-item"
                  onClick={handlePasswordLogin}
                >
                  <div className="login-option-icon password-icon">🔒</div>
                  <div className="login-option-text">
                    <div className="login-option-title">Contraseña</div>
                    <div className="login-option-description">
                      Ingresa con la contraseña que asignaste al crear tu cuenta
                    </div>
                  </div>
                  <div className="login-option-arrow">&gt;</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RegisterLayout>
  );
};

export default LoginOptions;
