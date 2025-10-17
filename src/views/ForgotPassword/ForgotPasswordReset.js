// src/views/ForgotPassword/ForgotPasswordReset.js
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import './ForgotPassword.css';

const ForgotPasswordReset = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleResetPassword = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validaciones
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Actualizar contraseña en el controlador
    const result = UserController.resetPassword(email, password);
    
    if (result.success) {
      alert('Contraseña actualizada exitosamente');
      navigate('/login');
    } else {
      setErrors({ general: result.message });
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-content">
        <Link to="/login" className="back-link">
          ← Volver
        </Link>

        <h1>Crea una nueva contraseña</h1>

        <div className="reset-info">
          <p>Tu nueva contraseña debe ser diferente a las contraseñas usadas anteriormente.</p>
        </div>

        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label htmlFor="password">Nueva contraseña</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className={errors.password ? 'input-error' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                className={errors.confirmPassword ? 'input-error' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}
          </div>

          {errors.general && (
            <p className="error-message general-error">{errors.general}</p>
          )}

          <button type="submit" className="continue-btn">
            Restablecer contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordReset;
