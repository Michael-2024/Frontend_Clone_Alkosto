import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import RegisterLayout from '../../layouts/RegisterLayout/RegisterLayout';
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
    
    // Limpiar error del campo modificado
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validar contraseñas
    const newErrors = {};
    
    if (!form.password) {
      newErrors.password = 'Ingresa una contraseña';
    } else if (form.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
    
    // Registrar usuario
    try {
      const result = UserController.registerUser({
        email,
        firstName,
        lastName,
        phone,
        password: form.password
      });
      
      if (result.success) {
        // Redirigir a verificación en lugar de login automático
        navigate('/verify', { 
          state: { 
            email, 
            phone, 
            fromRegister: true 
          } 
        });
      }
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
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleFormChange}
                    className={errors.password ? 'error' : ''}
                  />
                  {errors.password && <div className="error-message">{errors.password}</div>}
                </div>
                
                <div className="form-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmar contraseña"
                    value={form.confirmPassword}
                    onChange={handleFormChange}
                    className={errors.confirmPassword ? 'error' : ''}
                  />
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