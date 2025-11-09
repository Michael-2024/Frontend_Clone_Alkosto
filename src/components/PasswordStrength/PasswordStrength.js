import React from 'react';
import './PasswordStrength.css';

/**
 * Componente para mostrar la fortaleza de una contraseña
 * Muestra indicador visual y mensajes de validación
 */
const PasswordStrength = ({ password, validation }) => {
  if (!password || password.length === 0) {
    return null;
  }

  const { strength, level, messages, validations } = validation;

  // Configuración de colores y textos por nivel
  const levelConfig = {
    weak: {
      color: '#d32f2f',
      text: 'Débil',
      bgColor: '#ffebee'
    },
    medium: {
      color: '#f57c00',
      text: 'Media',
      bgColor: '#fff3e0'
    },
    strong: {
      color: '#2e7d32',
      text: 'Fuerte',
      bgColor: '#e8f5e9'
    }
  };

  const config = levelConfig[level];

  // Requisitos que se muestran siempre
  const requirements = [
    { key: 'length', label: 'Mínimo 8 caracteres', met: validations.length },
    { key: 'upperCase', label: 'Una letra mayúscula (A-Z)', met: validations.upperCase },
    { key: 'lowerCase', label: 'Una letra minúscula (a-z)', met: validations.lowerCase },
    { key: 'numbers', label: 'Un número (0-9)', met: validations.numbers },
    { key: 'specialChar', label: 'Un carácter especial (!@#$...)', met: validations.specialChar }
  ];

  return (
    <div className="password-strength-container">
      {/* Barra de fortaleza */}
      <div className="password-strength-bar-wrapper">
        <div className="password-strength-label">
          Fortaleza: <strong style={{ color: config.color }}>{config.text}</strong>
        </div>
        <div className="password-strength-bar">
          <div 
            className={`password-strength-fill ${level}`}
            style={{ 
              width: `${strength}%`,
              backgroundColor: config.color
            }}
          />
        </div>
      </div>

      {/* Lista de requisitos */}
      <div className="password-requirements">
        <p className="requirements-title">Tu contraseña debe contener:</p>
        <ul className="requirements-list">
          {requirements.map((req) => (
            <li 
              key={req.key} 
              className={`requirement-item ${req.met ? 'met' : 'unmet'}`}
            >
              <span className="requirement-icon">
                {req.met ? '✓' : '○'}
              </span>
              <span className="requirement-text">{req.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mensajes de error específicos */}
      {messages.length > 0 && (
        <div className="password-messages">
          {messages.slice(0, 3).map((message, index) => (
            <div key={index} className="password-message error">
              <span className="message-icon">⚠</span>
              {message}
            </div>
          ))}
        </div>
      )}

      {/* Mensaje de éxito */}
      {validation.isValid && (
        <div className="password-message success">
          <span className="message-icon">✓</span>
          ¡Contraseña segura! Cumple con todos los requisitos
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;
