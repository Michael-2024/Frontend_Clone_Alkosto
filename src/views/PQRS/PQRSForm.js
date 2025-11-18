import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pqrsController from '../../controllers/PQRSController';
import UserController from '../../controllers/UserController';
import './PQRSForm.css';

const PQRSForm = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [orders, setOrders] = useState([]);
  
  const [formData, setFormData] = useState({
    type: 'Petición',
    subject: '',
    description: '',
    email: '',
    phone: '',
    orderId: ''
  });

  const [errors, setErrors] = useState({});
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    // Obtener usuario actual
    const user = UserController.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        phone: user.telefono || user.phone || ''
      }));
      
      // Obtener pedidos del usuario para el selector
      loadUserOrders();
    }
  }, []);

  const loadUserOrders = async () => {
    try {
      // Aquí se cargarían los pedidos reales del usuario
      // Por ahora usamos datos mock
      const mockOrders = [
        { id: '12345', date: '2024-11-01', total: 1500000 },
        { id: '12346', date: '2024-11-05', total: 850000 },
        { id: '12347', date: '2024-11-10', total: 2300000 }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Actualizar contador de caracteres para descripción
    if (name === 'description') {
      setCharCount(value.length);
    }

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = 'Debe seleccionar un tipo de solicitud';
    }

    if (!formData.subject || formData.subject.trim().length < 5) {
      newErrors.subject = 'El asunto debe tener al menos 5 caracteres';
    }

    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'La descripción no puede exceder 1000 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({
        type: 'error',
        text: 'Por favor, corrige los errores en el formulario'
      });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const pqrsData = {
        ...formData,
        userId: currentUser?.id || null,
        orderId: formData.orderId || null
      };

      const result = await pqrsController.create(pqrsData);

      if (result.success) {
        setMessage({
          type: 'success',
          text: result.message
        });

        // Enviar notificación por email
        await pqrsController.sendEmailNotification(result.data, formData.email);

        // Limpiar formulario
        setFormData({
          type: 'Petición',
          subject: '',
          description: '',
          email: currentUser?.email || '',
          phone: currentUser?.telefono || currentUser?.phone || '',
          orderId: ''
        });
        setCharCount(0);

        // Redirigir a la lista de PQRS después de 3 segundos
        setTimeout(() => {
          if (currentUser) {
            navigate('/perfil/pqrs');
          }
        }, 3000);
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Error al crear PQRS'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al enviar PQRS. Por favor, intenta nuevamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  const pqrsTypes = [
    {
      value: 'Petición',
      label: 'Petición',
      description: 'Solicitud de información o servicio',
      icon: '📝'
    },
    {
      value: 'Queja',
      label: 'Queja',
      description: 'Insatisfacción con el servicio o producto',
      icon: '😟'
    },
    {
      value: 'Reclamo',
      label: 'Reclamo',
      description: 'Exigencia de solución a un problema',
      icon: '⚠️'
    },
    {
      value: 'Sugerencia',
      label: 'Sugerencia',
      description: 'Recomendación de mejora',
      icon: '💡'
    }
  ];

  return (
    <div className="pqrs-form-container">
      <div className="pqrs-form-header">
        <h1>Enviar PQRS</h1>
        <p className="subtitle">
          Peticiones, Quejas, Reclamos y Sugerencias
        </p>
      </div>

      {message.text && (
        <div className={`message-alert ${message.type}`}>
          <span className="message-icon">
            {message.type === 'success' ? '✓' : '⚠'}
          </span>
          <span className="message-text">{message.text}</span>
        </div>
      )}

      <div className="pqrs-info-box">
        <h3>📋 Información importante</h3>
        <ul>
          <li>Tiempo de respuesta: <strong>5 días hábiles</strong></li>
          <li>Recibirás un número de radicado para hacer seguimiento</li>
          <li>Te enviaremos actualizaciones a tu correo electrónico</li>
          <li>Todos los campos marcados con * son obligatorios</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="pqrs-form">
        {/* Tipo de PQRS */}
        <div className="form-group">
          <label htmlFor="type">Tipo de solicitud *</label>
          <div className="pqrs-type-selector">
            {pqrsTypes.map(type => (
              <div
                key={type.value}
                className={`pqrs-type-option ${formData.type === type.value ? 'selected' : ''}`}
                onClick={() => handleInputChange({ target: { name: 'type', value: type.value } })}
              >
                <span className="type-icon">{type.icon}</span>
                <strong>{type.label}</strong>
                <small>{type.description}</small>
              </div>
            ))}
          </div>
          {errors.type && <span className="error-message">{errors.type}</span>}
        </div>

        {/* Asunto */}
        <div className="form-group">
          <label htmlFor="subject">Asunto *</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="Describe brevemente tu solicitud"
            maxLength={200}
            className={errors.subject ? 'input-error' : ''}
          />
          {errors.subject && <span className="error-message">{errors.subject}</span>}
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label htmlFor="description">Descripción detallada *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe con detalle tu petición, queja, reclamo o sugerencia..."
            rows={6}
            maxLength={1000}
            className={errors.description ? 'input-error' : ''}
          />
          <div className="char-counter">
            <span className={charCount > 1000 ? 'over-limit' : ''}>
              {charCount} / 1000 caracteres
            </span>
          </div>
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        {/* Pedido relacionado (opcional) */}
        {orders.length > 0 && (
          <div className="form-group">
            <label htmlFor="orderId">Pedido relacionado (opcional)</label>
            <select
              id="orderId"
              name="orderId"
              value={formData.orderId}
              onChange={handleInputChange}
            >
              <option value="">Selecciona un pedido (si aplica)</option>
              {orders.map(order => (
                <option key={order.id} value={order.id}>
                  Pedido #{order.id} - {new Date(order.date).toLocaleDateString('es-CO')} - ${order.total.toLocaleString('es-CO')}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Email de contacto */}
        <div className="form-group">
          <label htmlFor="email">Email de contacto *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="tu@email.com"
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        {/* Teléfono (opcional) */}
        <div className="form-group">
          <label htmlFor="phone">Teléfono (opcional)</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="3001234567"
            maxLength={15}
          />
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(currentUser ? '/perfil/pqrs' : '/')}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Enviando...
              </>
            ) : (
              'Enviar PQRS'
            )}
          </button>
        </div>
      </form>

      <div className="pqrs-help-section">
        <h3>¿Necesitas ayuda?</h3>
        <p>
          Si tienes dudas sobre cómo diligenciar este formulario,
          puedes contactarnos a través de:
        </p>
        <ul>
          <li>📞 Línea de atención: 01 8000 123 456</li>
          <li>📧 Email: ayuda@alkosto.com</li>
          <li>💬 Chat en línea (disponible en la esquina inferior derecha)</li>
        </ul>
      </div>
    </div>
  );
};

export default PQRSForm;
