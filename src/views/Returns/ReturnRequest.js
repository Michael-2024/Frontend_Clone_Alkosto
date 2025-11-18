// src/views/Returns/ReturnRequest.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import OrderController from '../../controllers/OrderController';
import ReturnController from '../../controllers/ReturnController';
import './Returns.css';
import AccountSidebar from '../Account/AccountSidebar';

/**
 * Vista de Solicitud de Devolución/Garantía (RF25)
 * Permite al cliente solicitar la devolución de un producto
 */
const ReturnRequest = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(UserController.getCurrentUser());
  
  // Paso del formulario multi-paso
  const [step, setStep] = useState(1); // 1: Seleccionar producto, 2: Motivo y detalles, 3: Revisión
  
  // Estado de pedido y producto
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Estado del formulario
  const [reasonType, setReasonType] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [evidence, setEvidence] = useState([]);
  const [evidencePreview, setEvidencePreview] = useState([]);
  
  // Estado de UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdReturn, setCreatedReturn] = useState(null);

  // Tipos de motivo
  const reasonTypes = [
    { value: 'defect', label: 'Defecto de fábrica', requiresEvidence: true },
    { value: 'wrong_item', label: 'Producto incorrecto', requiresEvidence: true },
    { value: 'change_mind', label: 'Cambio de opinión', requiresEvidence: false },
    { value: 'damaged', label: 'Producto dañado', requiresEvidence: true },
    { value: 'warranty', label: 'Garantía', requiresEvidence: true },
    { value: 'other', label: 'Otro motivo', requiresEvidence: false }
  ];

  useEffect(() => {
    // Verificar autenticación
    if (!UserController.isLoggedIn()) {
      const email = localStorage.getItem('pendingEmail') || '';
      navigate(`/login/options${email ? `?email=${encodeURIComponent(email)}` : ''}`);
      return;
    }

    // Cargar pedidos del usuario
    loadOrders();

    // Verificar si viene desde un pedido específico
    const orderId = searchParams.get('orderId');
    const itemId = searchParams.get('itemId');
    
    if (orderId) {
      const order = OrderController.getOrderById(orderId);
      if (order) {
        setSelectedOrder(order);
        if (itemId) {
          const item = order.items.find(i => i.product.id === itemId);
          if (item) {
            setSelectedItem(item);
            setQuantity(item.quantity);
            setStep(2);
          }
        }
      }
    }
  }, [navigate, searchParams]);

  const loadOrders = () => {
    const currentUser = UserController.getCurrentUser();
    if (currentUser) {
      // Solo pedidos entregados (pueden tener devoluciones)
      const userOrders = OrderController.getUserOrders(currentUser.id)
        .filter(order => order.status === 'entregado');
      setOrders(userOrders);
    }
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setSelectedItem(null);
    setStep(1);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setQuantity(item.quantity);
    setStep(2);
  };

  const handleReasonTypeChange = (type) => {
    setReasonType(type);
    setReason('');
    setErrors([]);
  };

  const handleEvidenceUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + evidence.length > 5) {
      setErrors(['Máximo 5 imágenes permitidas']);
      return;
    }

    // Simular carga de archivos (en producción, usar servicio de almacenamiento)
    const newEvidence = files.map((file, index) => {
      return {
        id: `evidence_${Date.now()}_${index}`,
        name: file.name,
        url: URL.createObjectURL(file), // Mock URL
        file: file
      };
    });

    setEvidence([...evidence, ...newEvidence]);
    setEvidencePreview([...evidencePreview, ...newEvidence.map(e => e.url)]);
  };

  const removeEvidence = (evidenceId) => {
    setEvidence(evidence.filter(e => e.id !== evidenceId));
    setEvidencePreview(evidencePreview.filter((_, i) => evidence[i].id !== evidenceId));
  };

  const validateForm = () => {
    const newErrors = [];

    if (!reasonType) {
      newErrors.push('Selecciona un tipo de motivo');
    }

    if (!reason || reason.trim().length < 10) {
      newErrors.push('El motivo debe tener al menos 10 caracteres');
    }

    if (quantity < 1 || quantity > selectedItem.quantity) {
      newErrors.push(`La cantidad debe estar entre 1 y ${selectedItem.quantity}`);
    }

    // Verificar si requiere evidencia
    const selectedReasonType = reasonTypes.find(r => r.value === reasonType);
    if (selectedReasonType && selectedReasonType.requiresEvidence && evidence.length === 0) {
      newErrors.push('Este tipo de devolución requiere evidencia fotográfica');
    }

    // Validar plazo
    const orderDate = new Date(selectedOrder.createdAt);
    const daysSinceOrder = Math.ceil((new Date() - orderDate) / (1000 * 60 * 60 * 24));
    
    if (reasonType === 'change_mind' && daysSinceOrder > 30) {
      newErrors.push('El plazo para cambio de opinión es de 30 días');
    }

    if (['defect', 'warranty'].includes(reasonType) && daysSinceOrder > 365) {
      newErrors.push('El plazo de garantía es de 1 año');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Crear solicitud de devolución
      const result = ReturnController.createReturn(
        user.id,
        selectedOrder.id,
        selectedItem.product.id,
        selectedItem.product,
        quantity,
        reasonType,
        reason,
        description,
        evidence.map(e => e.url),
        selectedOrder.createdAt
      );

      if (result.success) {
        setCreatedReturn(result.return);
        setShowSuccess(true);
        
        // Redirigir después de 3 segundos
        setTimeout(() => {
          navigate(`/perfil/devoluciones/${result.return.id}`);
        }, 3000);
      } else {
        setErrors([result.message]);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error al crear devolución:', error);
      setErrors(['Error al procesar la solicitud. Intenta nuevamente.']);
      setIsSubmitting(false);
    }
  };

  const goToStep = (newStep) => {
    if (newStep < step) {
      setStep(newStep);
    } else if (newStep === 2 && selectedItem) {
      setStep(2);
    } else if (newStep === 3 && validateForm()) {
      setStep(3);
    }
  };

  // Calcular reembolso estimado
  const calculateRefund = () => {
    if (!selectedItem) return 0;
    return selectedItem.product.price * quantity;
  };

  if (showSuccess && createdReturn) {
    return (
      <div className="account-container">
        <AccountSidebar />
        <div className="account-main">
          <div className="return-success">
            <div className="success-icon">✅</div>
            <h1>¡Solicitud Creada Exitosamente!</h1>
            <p>Tu solicitud de devolución ha sido registrada</p>
            
            <div className="success-details">
              <div className="detail-row">
                <span className="label">Número de Ticket:</span>
                <span className="value ticket-number">{createdReturn.ticketNumber}</span>
              </div>
              <div className="detail-row">
                <span className="label">Producto:</span>
                <span className="value">{selectedItem.product.name}</span>
              </div>
              <div className="detail-row">
                <span className="label">Reembolso Estimado:</span>
                <span className="value refund-amount">
                  {new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0
                  }).format(createdReturn.refundAmount)}
                </span>
              </div>
            </div>

            <div className="success-info">
              <p>📧 Recibirás un email de confirmación con los detalles</p>
              <p>⏱️ Revisaremos tu solicitud en 1-2 días hábiles</p>
              <p>📦 Si es aprobada, te enviaremos la guía de envío</p>
            </div>

            <button 
              className="btn-primary"
              onClick={() => navigate(`/perfil/devoluciones/${createdReturn.id}`)}
            >
              Ver Detalles de la Devolución
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-container">
      <AccountSidebar />
      <div className="account-main">
        <div className="return-request-container">
          <h1>Solicitar Devolución o Garantía</h1>
          
          {/* Progress Indicator */}
          <div className="progress-steps">
            <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Producto</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Motivo</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Revisión</div>
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="error-box">
              <h3>⚠️ Errores:</h3>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Step 1: Seleccionar Producto */}
          {step === 1 && (
            <div className="step-content">
              <h2>Paso 1: Selecciona el producto a devolver</h2>
              
              {orders.length === 0 ? (
                <div className="no-orders">
                  <p>No tienes pedidos entregados elegibles para devolución</p>
                  <button 
                    className="btn-secondary"
                    onClick={() => navigate('/perfil/pedidos')}
                  >
                    Ver Mis Pedidos
                  </button>
                </div>
              ) : (
                <>
                  {!selectedOrder ? (
                    <div className="orders-list">
                      <h3>Pedidos Entregados:</h3>
                      {orders.map(order => (
                        <div key={order.id} className="order-card" onClick={() => handleOrderSelect(order)}>
                          <div className="order-header">
                            <span className="order-number">#{order.trackingNumber}</span>
                            <span className="order-date">
                              {new Date(order.createdAt).toLocaleDateString('es-CO')}
                            </span>
                          </div>
                          <div className="order-items">
                            {order.items.length} producto(s)
                          </div>
                          <div className="order-total">
                            Total: {new Intl.NumberFormat('es-CO', {
                              style: 'currency',
                              currency: 'COP',
                              minimumFractionDigits: 0
                            }).format(order.total)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="items-list">
                      <div className="selected-order-info">
                        <h3>Pedido #{selectedOrder.trackingNumber}</h3>
                        <button 
                          className="btn-link"
                          onClick={() => setSelectedOrder(null)}
                        >
                          ← Cambiar pedido
                        </button>
                      </div>

                      <h3>Selecciona el producto:</h3>
                      {selectedOrder.items.map((item, index) => (
                        <div 
                          key={index} 
                          className={`product-card ${selectedItem === item ? 'selected' : ''}`}
                          onClick={() => handleItemSelect(item)}
                        >
                          <img 
                            src={item.product.image || '/images/placeholder.png'} 
                            alt={item.product.name}
                            className="product-image"
                          />
                          <div className="product-info">
                            <h4>{item.product.name}</h4>
                            <p className="product-price">
                              {new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0
                              }).format(item.product.price)}
                            </p>
                            <p className="product-quantity">Cantidad: {item.quantity}</p>
                          </div>
                          {selectedItem === item && (
                            <div className="selected-badge">✓</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 2: Motivo y Detalles */}
          {step === 2 && selectedItem && (
            <div className="step-content">
              <button 
                className="btn-link back-button"
                onClick={() => goToStep(1)}
              >
                ← Volver
              </button>

              <h2>Paso 2: Motivo de la devolución</h2>

              <div className="selected-product-summary">
                <img 
                  src={selectedItem.product.image || '/images/placeholder.png'} 
                  alt={selectedItem.product.name}
                />
                <div>
                  <h4>{selectedItem.product.name}</h4>
                  <p>Pedido: #{selectedOrder.trackingNumber}</p>
                </div>
              </div>

              <div className="form-group">
                <label>Tipo de motivo *</label>
                <div className="reason-types">
                  {reasonTypes.map(type => (
                    <label key={type.value} className="reason-type-option">
                      <input
                        type="radio"
                        name="reasonType"
                        value={type.value}
                        checked={reasonType === type.value}
                        onChange={(e) => handleReasonTypeChange(e.target.value)}
                      />
                      <span>{type.label}</span>
                      {type.requiresEvidence && <span className="badge">Requiere foto</span>}
                    </label>
                  ))}
                </div>
              </div>

              {reasonType && (
                <>
                  <div className="form-group">
                    <label htmlFor="reason">Describe el motivo * (mínimo 10 caracteres)</label>
                    <textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Explica brevemente el motivo de la devolución..."
                      rows="3"
                      maxLength="200"
                    />
                    <small>{reason.length}/200 caracteres</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Descripción adicional (opcional)</label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Agrega más detalles si lo deseas..."
                      rows="4"
                      maxLength="500"
                    />
                    <small>{description.length}/500 caracteres</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="quantity">Cantidad a devolver</label>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      min="1"
                      max={selectedItem.quantity}
                    />
                    <small>Máximo: {selectedItem.quantity} unidad(es)</small>
                  </div>

                  {/* Evidencia fotográfica */}
                  {reasonTypes.find(r => r.value === reasonType)?.requiresEvidence && (
                    <div className="form-group">
                      <label>Evidencia fotográfica * (máximo 5 imágenes)</label>
                      <div className="evidence-upload">
                        <input
                          type="file"
                          id="evidence"
                          accept="image/*"
                          multiple
                          onChange={handleEvidenceUpload}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="evidence" className="upload-button">
                          📷 Subir Fotos
                        </label>
                        
                        {evidence.length > 0 && (
                          <div className="evidence-preview">
                            {evidence.map(ev => (
                              <div key={ev.id} className="evidence-item">
                                <img src={ev.url} alt={ev.name} />
                                <button 
                                  type="button"
                                  className="remove-evidence"
                                  onClick={() => removeEvidence(ev.id)}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <small className="help-text">
                        {reasonType === 'defect' && '📸 Toma fotos del defecto de fábrica'}
                        {reasonType === 'damaged' && '📸 Muestra los daños del producto'}
                        {reasonType === 'wrong_item' && '📸 Foto del producto recibido y etiqueta'}
                        {reasonType === 'warranty' && '📸 Evidencia del problema cubierto por garantía'}
                      </small>
                    </div>
                  )}

                  <div className="estimated-refund">
                    <h3>Reembolso Estimado:</h3>
                    <p className="refund-amount">
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0
                      }).format(calculateRefund())}
                    </p>
                  </div>

                  <button 
                    className="btn-primary"
                    onClick={() => goToStep(3)}
                  >
                    Continuar a Revisión
                  </button>
                </>
              )}
            </div>
          )}

          {/* Step 3: Revisión */}
          {step === 3 && (
            <div className="step-content">
              <button 
                className="btn-link back-button"
                onClick={() => goToStep(2)}
              >
                ← Volver
              </button>

              <h2>Paso 3: Revisa tu solicitud</h2>

              <div className="review-summary">
                <div className="review-section">
                  <h3>Producto</h3>
                  <div className="review-product">
                    <img 
                      src={selectedItem.product.image || '/images/placeholder.png'} 
                      alt={selectedItem.product.name}
                    />
                    <div>
                      <h4>{selectedItem.product.name}</h4>
                      <p>Pedido: #{selectedOrder.trackingNumber}</p>
                      <p>Cantidad: {quantity} unidad(es)</p>
                    </div>
                  </div>
                </div>

                <div className="review-section">
                  <h3>Motivo</h3>
                  <p><strong>{reasonTypes.find(r => r.value === reasonType)?.label}</strong></p>
                  <p>{reason}</p>
                  {description && (
                    <p className="description">{description}</p>
                  )}
                </div>

                {evidence.length > 0 && (
                  <div className="review-section">
                    <h3>Evidencia</h3>
                    <div className="evidence-thumbnails">
                      {evidence.map(ev => (
                        <img key={ev.id} src={ev.url} alt="Evidencia" />
                      ))}
                    </div>
                  </div>
                )}

                <div className="review-section refund-section">
                  <h3>Reembolso</h3>
                  <p className="refund-amount">
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0
                    }).format(calculateRefund())}
                  </p>
                </div>
              </div>

              <div className="terms-box">
                <h4>Política de Devoluciones</h4>
                <ul>
                  <li>✓ Revisaremos tu solicitud en 1-2 días hábiles</li>
                  <li>✓ Si es aprobada, recibirás una guía de envío por email</li>
                  <li>✓ El reembolso se procesará al recibir el producto</li>
                  <li>✓ El producto debe estar en su empaque original y sin uso (excepto defectos)</li>
                  <li>✓ El reembolso se hará al método de pago original en 5-10 días hábiles</li>
                </ul>
              </div>

              <div className="form-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => goToStep(2)}
                  disabled={isSubmitting}
                >
                  Volver a Editar
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Enviando...
                    </>
                  ) : (
                    'Enviar Solicitud'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnRequest;
