// src/views/Register/Register.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import RegisterLayout from '../../layouts/RegisterLayout/RegisterLayout';
import './Register.css';

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtener email de URL o localStorage 
  const params = new URLSearchParams(location.search);
  const emailFromURL = params.get('email') || '';
  const emailFromStorage = localStorage.getItem('pendingEmail') || '';
  
  const [email, setEmail] = useState(emailFromURL || emailFromStorage);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [form, setForm] = useState({ 
    firstName: '', 
    lastName: '', 
    phone: '', 
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneValidationActive, setPhoneValidationActive] = useState(false); // Nuevo estado para validación de teléfono

  // Limpiar el email de localStorage después de usarlo
  useEffect(() => {
    if (emailFromStorage) {
      localStorage.removeItem('pendingEmail');
    }
    
    // Si no hay email, redirigir a la página principal
    if (!email && !emailFromURL && !emailFromStorage) {
      navigate('/');
    }
  }, [email, emailFromURL, emailFromStorage, navigate]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setForm({
      ...form,
      [name]: newValue
    });
    
    // Validación en tiempo real para el teléfono
    if (name === 'phone') {
      // Activar validación solo si el usuario ha empezado a escribir
      if (value.length > 0 && !phoneValidationActive) {
        setPhoneValidationActive(true);
      }
      
      // Validar teléfono si la validación está activa
      if (phoneValidationActive) {
        if (!value) {
          setErrors({...errors, phone: ''});
        } else if (!value.startsWith('3')) {
          setErrors({...errors, phone: 'Por favor ingresa un número celular válido de 10 dígitos - el número debe empezar con \'3\''});
        } else if (value.length !== 10 && value.length > 3) {
          // Solo mostrar error de longitud cuando ya hay suficientes caracteres
          setErrors({...errors, phone: 'Por favor ingresa un número celular válido de 10 dígitos'});
        } else if (value.length === 10 && value.startsWith('3')) {
          // Todo correcto
          setErrors({...errors, phone: ''});
        }
      }
    } else {
      // Limpiar error del campo modificado (para otros campos)
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ''
        });
      }
    }
  };

  // Agregar esta función para restringir a solo números

  // Agregar esta función para manejar la entrada de teléfono
  const handlePhoneInput = (e) => {
    // Permitir solo dígitos
    const value = e.target.value.replace(/\D/g, '');
    
    // Actualizar el formulario con el valor limpio
    setForm({
      ...form,
      phone: value
    });
    
    // Activar validación solo si el usuario ha empezado a escribir
    if (value.length > 0 && !phoneValidationActive) {
      setPhoneValidationActive(true);
    }
    
    // Validar teléfono si la validación está activa
    if (phoneValidationActive) {
      if (!value) {
        setErrors({...errors, phone: ''});
      } else if (!value.startsWith('3')) {
        setErrors({...errors, phone: 'Por favor ingresa un número celular válido de 10 dígitos - el número debe empezar con \'3\''});
      } else if (value.length !== 10 && value.length > 3) {
        // Solo mostrar error de longitud cuando ya hay suficientes caracteres
        setErrors({...errors, phone: 'Por favor ingresa un número celular válido de 10 dígitos'});
      } else if (value.length === 10 && value.startsWith('3')) {
        // Todo correcto
        setErrors({...errors, phone: ''});
      }
    }
  };

  // Validación teléfono celular
  const validatePhone = (phone) => {
    if (!phone) return false;
    if (phone.length !== 10) return false;
    if (!phone.startsWith('3')) return false;
    return true;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validar campos
    const newErrors = {};
    
    if (!form.firstName.trim()) {
      newErrors.firstName = 'Ingresa tu nombre';
    }
    
    if (!form.lastName.trim()) {
      newErrors.lastName = 'Ingresa tu apellido';
    }
    
    if (!form.phone.trim()) {
      newErrors.phone = 'Ingresa tu número de teléfono';
    } else if (!validatePhone(form.phone.trim())) {
      newErrors.phone = 'Por favor ingresa un número celular válido de 10 dígitos - el número debe empezar con \'3\'';
    }
    
    if (!form.agreeTerms) {
      newErrors.agreeTerms = 'Debes aceptar los términos y condiciones';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
    
    // Ir al siguiente paso (contraseña)
    navigate(`/register/password?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(form.firstName)}&lastName=${encodeURIComponent(form.lastName)}&phone=${encodeURIComponent(form.phone)}`);
  };

  // Función para activar la edición del email
  const handleModifyEmail = () => {
    setIsEditingEmail(true);
    setNewEmail(email);
  };

  // Función para guardar el nuevo email
  const handleSaveEmail = () => {
    if (newEmail && newEmail.trim() !== '') {
      setEmail(newEmail.trim());
      setIsEditingEmail(false);
    }
  };

  // Función para cancelar la edición del email
  const handleCancelEditEmail = () => {
    setIsEditingEmail(false);
  };

  // Validar email
  const validateEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(value);
  };

  return (
    <RegisterLayout>
      <div className="register-page">
        <div className="register-container">
          <Link to="/" className="back-button">
            <span className="back-arrow">←</span> Volver
          </Link>
          
          <div className="register-content">
            <div className="register-heading">
              <h2 className="register-title">Crea tu cuenta<br/>completando los datos</h2
              >
              
              {/* Email y botón Modificar movidos a la columna izquierda */}
              <div className="email-display">
                <p className="email-label-left">Correo electrónico ingresado:</p>
                <div className="email-value-container">
                  <span className="email-value-left">{email}</span>
                  <button 
                    className="modify-button"
                    type="button"
                    onClick={handleModifyEmail}
                  >
                    Modificar
                  </button>
                </div>
              </div>
            </div>
            
            <div className="register-form-container">
              {isEditingEmail ? (
                <div className="email-edit">
                  <label className="email-edit-label">Correo electrónico:</label>
                  <div className="email-edit-input-container">
                    <input 
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="email-edit-input"
                    />
                    <div className="email-edit-buttons">
                      <button 
                        onClick={handleSaveEmail}
                        className="email-save-button"
                        disabled={!validateEmail(newEmail)}
                      >
                        Guardar
                      </button>
                      <button 
                        onClick={handleCancelEditEmail}
                        className="email-cancel-button"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="register-form">
                  <div className="form-group">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Nombres"
                      value={form.firstName}
                      onChange={handleFormChange}
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                  </div>
                  
                  <div className="form-group">
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Apellidos"
                      value={form.lastName}
                      onChange={handleFormChange}
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                  </div>
                  
                  <div className="form-group phone-group">
                    <div className="phone-prefix">
                      <div className="colombia-flag"></div>
                      <span>+57</span>
                    </div>
                    <div className="phone-input-container">
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Teléfono celular"
                        value={form.phone}
                        onChange={handlePhoneInput}
                        className={`phone-input ${errors.phone ? 'error' : ''}`}
                        maxLength={10} // Limitar a 10 dígitos
                      />
                      {errors.phone && phoneValidationActive && (
                        <div className="phone-error-message">
                          <span className="error-icon">⚠️</span>
                          <span>{errors.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={form.agreeTerms}
                        onChange={handleFormChange}
                      />
                      <span>Autorizo el uso de mis datos en los siguientes </span>
                      <a href="/terminos" className="terms-link">términos y condiciones</a>
                    </label>
                    {errors.agreeTerms && <div className="error-message">{errors.agreeTerms}</div>}
                  </div>
                  
                  <button 
                    type="submit" 
                    className="continue-button"
                    disabled={isSubmitting}
                  >
                    Continuar
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </RegisterLayout>
  );
};

export default Register;
