import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import RegisterLayout from '../../layouts/RegisterLayout/RegisterLayout';
import PasswordStrength from '../../components/PasswordStrength/PasswordStrength';
import { validatePassword } from '../../utils/userUtils';
import './Register.css';

const RegisterPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  
  // Obtener datos del paso anterior
  const email = params.get('email');
  const firstName = params.get('firstName');
  const lastName = params.get('lastName');
  const phone = params.get('phone');
  
  const [form, setForm] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Verificar que tengamos todos los datos necesarios
  useEffect(() => {
    if (!email || !firstName || !lastName) {
      navigate('/register');
    }
  }, [email, firstName, lastName, navigate]);
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
    
    // Validar contraseña en tiempo real
    if (name === 'password') {
      const validation = validatePassword(value);
      setPasswordValidation(validation);
    }
    
    // Limpiar error del campo modificado
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validar contraseñas con el nuevo sistema
    const newErrors = {};
    
    if (!form.password) {
      newErrors.password = 'Ingresa una contraseña';
    } else {
      const validation = validatePassword(form.password);
      if (!validation.isValid) {
        newErrors.password = 'La contraseña no cumple con los requisitos de seguridad';
      }
    }
    
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
    
    // Registrar usuario (backend)
    try {
      const result = await UserController.registerUser({
        email,
        firstName,
        lastName,
        phone,
        password: form.password
      });
      if (result.success) {
        navigate('/verify', { 
          state: { email, phone, fromRegister: true } 
        });
        return;
      }
      setErrors({ general: result.error || 'Ocurrió un error durante el registro.' });
    } catch (error) {
      console.error('Error al registrar:', error);
      setErrors({ general: 'Ocurrió un error durante el registro. Intenta nuevamente.' });
      setIsSubmitting(false);
    }
  };
  
  return (
    <RegisterLayout>
      <div className="register-page">
        <div className="register-container">
          <Link to={`/register?email=${encodeURIComponent(email)}`} className="back-button">
            <span className="back-arrow">←</span> Volver
          </Link>
          
          <div className="register-content">
            <div className="register-heading">
              <h2 className="register-title">Crea tu contraseña</h2>
              
              {/* Email info */}
              <div className="email-display">
                <p className="email-label-left">Correo electrónico ingresado:</p>
                <div className="email-value-container">
                  <span className="email-value-left">{email}</span>
                </div>
              </div>
            </div>
            
            <div className="register-form-container">
              <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Contraseña"
                      value={form.password}
                      onChange={handleFormChange}
                      className={errors.password ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="toggle-password-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  
                  {/* Componente de fortaleza de contraseña */}
                  {form.password && passwordValidation && (
                    <PasswordStrength 
                      password={form.password} 
                      validation={passwordValidation}
                    />
                  )}
                  
                  {errors.password && <div className="error-message">{errors.password}</div>}
                </div>
                
                <div className="form-group">
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirmar contraseña"
                      value={form.confirmPassword}
                      onChange={handleFormChange}
                      className={errors.confirmPassword ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="toggle-password-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex="-1"
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                </div>
                
                {errors.general && <div className="error-message general">{errors.general}</div>}
                
                <button 
                  type="submit" 
                  className="continue-button"
                  disabled={isSubmitting}
                >
                  Crear cuenta
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </RegisterLayout>
  );
};

export default RegisterPassword;