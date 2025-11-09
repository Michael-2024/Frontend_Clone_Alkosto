import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import PaymentMethodController from '../../controllers/PaymentMethodController';
import './Account.css';
import './PaymentMethods.css';
import AccountSidebar from './AccountSidebar';

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedType, setSelectedType] = useState('card');
  const [formData, setFormData] = useState({
    nickname: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    bank: '',
    personType: 'natural',
    phone: '',
    setAsDefault: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const user = UserController.getCurrentUser();
    if (!user) {
      const email = localStorage.getItem('pendingEmail') || '';
      navigate(`/login/options${email ? `?email=${encodeURIComponent(email)}` : ''}`);
      return;
    }
    setCurrentUser(user);
    loadPaymentMethods(user.id);
  }, [navigate]);

  const loadPaymentMethods = (userId) => {
    const methods = PaymentMethodController.getUserPaymentMethods(userId);
    setPaymentMethods(methods);
  };

  const onLogout = () => { 
    UserController.logout(); 
    navigate('/'); 
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar error del campo
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      // Formatear: #### #### #### ####
      value = value.match(/.{1,4}/g)?.join(' ') || value;
      setFormData(prev => ({ ...prev, cardNumber: value }));
    }
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    if (value.length <= 5) {
      setFormData(prev => ({ ...prev, expiryDate: value }));
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setFormData(prev => ({ ...prev, cvv: value }));
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setFormData(prev => ({ ...prev, phone: value }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nickname.trim()) {
      errors.nickname = 'El nombre es requerido';
    }

    if (selectedType === 'card') {
      const cleanNumber = formData.cardNumber.replace(/\s/g, '');
      if (!cleanNumber) {
        errors.cardNumber = 'Número de tarjeta requerido';
      } else if (cleanNumber.length < 13) {
        errors.cardNumber = 'Número de tarjeta inválido';
      }
      
      if (!formData.cardHolder.trim()) {
        errors.cardHolder = 'Titular de la tarjeta requerido';
      }
      
      if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        errors.expiryDate = 'Fecha inválida (MM/YY)';
      }
    } else if (selectedType === 'pse') {
      if (!formData.bank) {
        errors.bank = 'Selecciona un banco';
      }
    } else if (selectedType === 'nequi' || selectedType === 'daviplata') {
      if (!formData.phone || formData.phone.length !== 10) {
        errors.phone = 'Número de celular inválido (10 dígitos)';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = PaymentMethodController.addPaymentMethod(
      currentUser.id,
      selectedType,
      formData.nickname,
      formData,
      formData.setAsDefault
    );

    if (result.success) {
      setSuccessMessage('Método de pago agregado exitosamente');
      setTimeout(() => setSuccessMessage(''), 3000);
      resetForm();
      loadPaymentMethods(currentUser.id);
    } else {
      setFormErrors({ general: result.message });
    }
  };

  const resetForm = () => {
    setFormData({
      nickname: '',
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
      bank: '',
      personType: 'natural',
      phone: '',
      setAsDefault: false
    });
    setFormErrors({});
    setShowAddForm(false);
    setSelectedType('card');
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este método de pago?')) {
      const result = PaymentMethodController.deletePaymentMethod(id);
      if (result.success) {
        setSuccessMessage('Método de pago eliminado');
        setTimeout(() => setSuccessMessage(''), 3000);
        loadPaymentMethods(currentUser.id);
      }
    }
  };

  const handleSetDefault = (id) => {
    const result = PaymentMethodController.setDefaultPaymentMethod(id);
    if (result.success) {
      setSuccessMessage('Método predeterminado actualizado');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadPaymentMethods(currentUser.id);
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      card: 'Tarjeta',
      pse: 'PSE',
      nequi: 'Nequi',
      daviplata: 'Daviplata'
    };
    return labels[type] || type;
  };

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-layout">
          <AccountSidebar onLogout={onLogout} />

          <section className="account-content">
            <div className="account-hero">
              <div className="hero-icon" aria-hidden>💳</div>
              <div className="hero-texts">
                <h1 className="account-title">Métodos de Pago</h1>
                <p className="account-sub">Agrega y gestiona tus métodos de pago</p>
              </div>
            </div>

            {successMessage && (
              <div className="success-banner" role="alert">
                <span className="success-icon">✓</span>
                {successMessage}
              </div>
            )}

            {/* Botón para agregar método */}
            {!showAddForm && (
              <div className="payment-actions">
                <button 
                  className="btn-add-payment"
                  onClick={() => setShowAddForm(true)}
                >
                  <span className="btn-icon">+</span>
                  Agregar método de pago
                </button>
              </div>
            )}

            {/* Formulario para agregar método de pago */}
            {showAddForm && (
              <div className="payment-form-card">
                <div className="form-header">
                  <h3>Agregar método de pago</h3>
                  <button 
                    className="btn-close-form"
                    onClick={resetForm}
                    aria-label="Cerrar formulario"
                  >
                    ✕
                  </button>
                </div>

                {formErrors.general && (
                  <div className="error-banner">{formErrors.general}</div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Selector de tipo */}
                  <div className="payment-type-selector">
                    <label className={`type-option ${selectedType === 'card' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="paymentType"
                        value="card"
                        checked={selectedType === 'card'}
                        onChange={(e) => setSelectedType(e.target.value)}
                      />
                      <span className="type-icon">💳</span>
                      <span className="type-label">Tarjeta</span>
                    </label>

                    <label className={`type-option ${selectedType === 'pse' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="paymentType"
                        value="pse"
                        checked={selectedType === 'pse'}
                        onChange={(e) => setSelectedType(e.target.value)}
                      />
                      <span className="type-icon">🏦</span>
                      <span className="type-label">PSE</span>
                    </label>

                    <label className={`type-option ${selectedType === 'nequi' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="paymentType"
                        value="nequi"
                        checked={selectedType === 'nequi'}
                        onChange={(e) => setSelectedType(e.target.value)}
                      />
                      <span className="type-icon">📱</span>
                      <span className="type-label">Nequi</span>
                    </label>

                    <label className={`type-option ${selectedType === 'daviplata' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="paymentType"
                        value="daviplata"
                        checked={selectedType === 'daviplata'}
                        onChange={(e) => setSelectedType(e.target.value)}
                      />
                      <span className="type-icon">📱</span>
                      <span className="type-label">Daviplata</span>
                    </label>
                  </div>

                  {/* Campo común: Nickname */}
                  <div className="form-field">
                    <label htmlFor="nickname">Nombre del método *</label>
                    <input
                      type="text"
                      id="nickname"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleInputChange}
                      placeholder="Ej: Mi tarjeta principal"
                      className={formErrors.nickname ? 'error' : ''}
                    />
                    {formErrors.nickname && <span className="field-error">{formErrors.nickname}</span>}
                  </div>

                  {/* Campos específicos por tipo */}
                  {selectedType === 'card' && (
                    <>
                      <div className="form-field">
                        <label htmlFor="cardNumber">Número de tarjeta *</label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          className={formErrors.cardNumber ? 'error' : ''}
                        />
                        {formErrors.cardNumber && <span className="field-error">{formErrors.cardNumber}</span>}
                      </div>

                      <div className="form-field">
                        <label htmlFor="cardHolder">Titular de la tarjeta *</label>
                        <input
                          type="text"
                          id="cardHolder"
                          name="cardHolder"
                          value={formData.cardHolder}
                          onChange={handleInputChange}
                          placeholder="Nombre como aparece en la tarjeta"
                          className={formErrors.cardHolder ? 'error' : ''}
                        />
                        {formErrors.cardHolder && <span className="field-error">{formErrors.cardHolder}</span>}
                      </div>

                      <div className="form-row">
                        <div className="form-field">
                          <label htmlFor="expiryDate">Fecha de vencimiento *</label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleExpiryDateChange}
                            placeholder="MM/YY"
                            maxLength="5"
                            className={formErrors.expiryDate ? 'error' : ''}
                          />
                          {formErrors.expiryDate && <span className="field-error">{formErrors.expiryDate}</span>}
                        </div>

                        <div className="form-field">
                          <label htmlFor="cvv">CVV</label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleCvvChange}
                            placeholder="123"
                            maxLength="4"
                          />
                          <small className="field-hint">No se guardará por seguridad</small>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedType === 'pse' && (
                    <>
                      <div className="form-field">
                        <label htmlFor="bank">Banco *</label>
                        <select
                          id="bank"
                          name="bank"
                          value={formData.bank}
                          onChange={handleInputChange}
                          className={formErrors.bank ? 'error' : ''}
                        >
                          <option value="">Selecciona tu banco...</option>
                          {PaymentMethodController.getAvailableBanks().map(bank => (
                            <option key={bank.value} value={bank.value}>
                              {bank.label}
                            </option>
                          ))}
                        </select>
                        {formErrors.bank && <span className="field-error">{formErrors.bank}</span>}
                      </div>

                      <div className="form-field">
                        <label htmlFor="personType">Tipo de persona</label>
                        <select
                          id="personType"
                          name="personType"
                          value={formData.personType}
                          onChange={handleInputChange}
                        >
                          <option value="natural">Persona Natural</option>
                          <option value="juridica">Persona Jurídica</option>
                        </select>
                      </div>
                    </>
                  )}

                  {(selectedType === 'nequi' || selectedType === 'daviplata') && (
                    <div className="form-field">
                      <label htmlFor="phone">Número de celular *</label>
                      <div className="phone-input-group">
                        <span className="phone-prefix">+57</span>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          placeholder="3001234567"
                          maxLength="10"
                          className={formErrors.phone ? 'error' : ''}
                        />
                      </div>
                      {formErrors.phone && <span className="field-error">{formErrors.phone}</span>}
                    </div>
                  )}

                  {/* Checkbox para marcar como predeterminado */}
                  <div className="form-checkbox">
                    <label>
                      <input
                        type="checkbox"
                        name="setAsDefault"
                        checked={formData.setAsDefault}
                        onChange={handleInputChange}
                      />
                      <span>Establecer como método predeterminado</span>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={resetForm}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn-primary">
                      Guardar método de pago
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Lista de métodos de pago */}
            {paymentMethods.length > 0 ? (
              <div className="payment-methods-list">
                <h3 className="list-title">Tus métodos de pago</h3>
                <div className="payment-cards-grid">
                  {paymentMethods.map(method => (
                    <div key={method.id} className={`payment-card ${method.isDefault ? 'default' : ''} ${method.isExpired() ? 'expired' : ''}`}>
                      {method.isDefault && (
                        <div className="default-badge">Predeterminado</div>
                      )}
                      {method.isExpired() && (
                        <div className="expired-badge">Expirada</div>
                      )}
                      
                      <div className="payment-card-header">
                        <span className="payment-card-icon">{method.getIcon()}</span>
                        <span className="payment-card-type">{getTypeLabel(method.type)}</span>
                      </div>

                      <div className="payment-card-body">
                        <h4 className="payment-card-nickname">{method.nickname}</h4>
                        <p className="payment-card-details">{method.getDisplayText()}</p>
                        {method.lastUsed && (
                          <p className="payment-card-last-used">
                            Último uso: {new Date(method.lastUsed).toLocaleDateString('es-CO')}
                          </p>
                        )}
                      </div>

                      <div className="payment-card-actions">
                        {!method.isDefault && (
                          <button
                            className="btn-card-action"
                            onClick={() => handleSetDefault(method.id)}
                            title="Establecer como predeterminado"
                          >
                            <span>★</span> Predeterminado
                          </button>
                        )}
                        <button
                          className="btn-card-action delete"
                          onClick={() => handleDelete(method.id)}
                          title="Eliminar"
                        >
                          <span>🗑️</span> Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : !showAddForm && (
              <div className="empty-panel">
                <div className="empty-header">
                  <span className="empty-title">¡No tienes métodos de pago guardados!</span>
                  <p className="empty-subtitle">Agrega un método de pago para agilizar tus compras futuras.</p>
                </div>

                <div className="empty-illustration" aria-hidden>
                  <div className="card-placeholder" />
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
