import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartController from '../../controllers/CartController';
import OrderController from '../../controllers/OrderController';
import UserController from '../../controllers/UserController';
import CouponController from '../../controllers/CouponController';
import PaymentMethodController from '../../controllers/PaymentMethodController';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [step, setStep] = useState(1); // 1: Envío, 2: Pago, 3: Confirmación
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cupón
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Datos de envío
  const [shippingData, setShippingData] = useState({
    fullName: '',
    document: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    department: '',
    postalCode: '',
    additionalInfo: ''
  });

  // Datos de pago
  const [paymentData, setPaymentData] = useState({
    type: 'card', // card, pse, cash, nequi, daviplata, saved
    useSavedMethod: false,
    savedMethodId: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    bank: '',
    personType: 'natural', // natural, juridica
    walletPhone: '',
    savePaymentMethod: false,
    paymentMethodNickname: ''
  });

  // Métodos de pago guardados
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);

  useEffect(() => {
    // Verificar autenticación
    const user = UserController.getCurrentUser();
    if (!user) {
      navigate('/login/options');
      return;
    }
    setCurrentUser(user);

    // Cargar métodos de pago guardados
    const methods = PaymentMethodController.getUserPaymentMethods(user.id);
    setSavedPaymentMethods(methods);

    // Pre-llenar datos del usuario
    setShippingData(prev => ({
      ...prev,
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone || ''
    }));

    // Obtener items del carrito
    const loadCart = async () => {
      const cart = await CartController.getCart();
      const items = cart.items;
      if (items.length === 0) {
        navigate('/carrito');
        return;
      }
      setCartItems(items);
    };
    loadCart();
  }, [navigate]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateShippingForm = () => {
    const required = ['fullName', 'document', 'phone', 'email', 'address', 'city', 'department'];
    for (let field of required) {
      if (!shippingData[field] || shippingData[field].trim() === '') {
        setError(`El campo ${getFieldLabel(field)} es obligatorio`);
        return false;
      }
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingData.email)) {
      setError('Email inválido');
      return false;
    }

    // Validar teléfono (10 dígitos)
    if (shippingData.phone.length < 10) {
      setError('El teléfono debe tener al menos 10 dígitos');
      return false;
    }

    return true;
  };

  const validatePaymentForm = () => {
    // Si usa método guardado
    if (paymentData.useSavedMethod) {
      if (!paymentData.savedMethodId) {
        setError('Selecciona un método de pago guardado');
        return false;
      }
      return true;
    }

    // Validación por tipo de pago
    if (paymentData.type === 'card') {
      if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length < 16) {
        setError('Número de tarjeta inválido');
        return false;
      }
      if (!paymentData.cardHolder) {
        setError('Titular de la tarjeta es obligatorio');
        return false;
      }
      if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
        setError('Fecha de vencimiento inválida (MM/YY)');
        return false;
      }
      if (!paymentData.cvv || paymentData.cvv.length < 3) {
        setError('CVV inválido');
        return false;
      }
    }

    if (paymentData.type === 'pse') {
      if (!paymentData.bank) {
        setError('Selecciona un banco');
        return false;
      }
    }

    if (paymentData.type === 'nequi' || paymentData.type === 'daviplata') {
      if (!paymentData.walletPhone || paymentData.walletPhone.length !== 10) {
        setError('Número de celular inválido (10 dígitos)');
        return false;
      }
    }

    return true;
  };

  const handleContinueToPayment = () => {
    if (validateShippingForm()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handleContinueToConfirmation = () => {
    if (validatePaymentForm()) {
      setStep(3);
      window.scrollTo(0, 0);
    }
  };

  // Funciones de cupón
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('Ingresa un código de cupón');
      return;
    }

    setCouponError('');
    setCouponSuccess('');

    const subtotal = calculateSubtotal();
    const categories = [...new Set(cartItems.map(item => item.product.category))];

    const validation = CouponController.validateCoupon(
      couponCode,
      currentUser.id,
      subtotal,
      categories
    );

    if (validation.valid) {
      setAppliedCoupon(validation.coupon);
      setCouponSuccess(`¡Cupón aplicado! Descuento de ${formatPrice(validation.discount)}`);
      setCouponCode('');
    } else {
      setCouponError(validation.reason);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
    setCouponCode('');
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      // Guardar método de pago si el usuario lo solicita
      if (paymentData.savePaymentMethod && !paymentData.useSavedMethod) {
        const nickname = paymentData.paymentMethodNickname || `${getPaymentTypeLabel(paymentData.type)} - ${new Date().toLocaleDateString()}`;
        
        PaymentMethodController.addPaymentMethod(
          currentUser.id,
          paymentData.type,
          nickname,
          paymentData,
          false
        );
      }

      // Aplicar cupón si existe
      if (appliedCoupon) {
        CouponController.applyCoupon(appliedCoupon.code, currentUser.id);
      }

      // Crear pedido
      const result = OrderController.createOrder(
        currentUser.id,
        cartItems,
        shippingData,
        paymentData,
        appliedCoupon ? {
          code: appliedCoupon.code,
          discount: appliedCoupon.calculateDiscount(calculateSubtotal())
        } : null
      );

      if (result.success) {
        // Limpiar carrito
        await CartController.clearCart();

        // Simular delay de procesamiento
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Resetear loading antes de navegar para evitar modal persistente
        setLoading(false);

        // Navegar a confirmación
        navigate(`/perfil/pedidos?new=${result.order.id}`);
      } else {
        setError(result.message || 'Error al crear el pedido');
        setLoading(false);
      }
    } catch (err) {
      setError('Error al procesar el pedido. Intenta nuevamente.');
      setLoading(false);
    }
  };

  const getFieldLabel = (field) => {
    const labels = {
      fullName: 'Nombre completo',
      document: 'Documento',
      phone: 'Teléfono',
      email: 'Email',
      address: 'Dirección',
      city: 'Ciudad',
      department: 'Departamento'
    };
    return labels[field] || field;
  };

  const getPaymentTypeLabel = (type) => {
    const labels = {
      card: 'Tarjeta',
      pse: 'PSE',
      nequi: 'Nequi',
      daviplata: 'Daviplata',
      cash: 'Efectivo'
    };
    return labels[type] || type;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return calculateSubtotal() >= 150000 ? 0 : 15000;
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    return appliedCoupon.calculateDiscount(calculateSubtotal());
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() - calculateDiscount();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  };

  const handleWalletPhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPaymentData(prev => ({ ...prev, walletPhone: value }));
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="checkout-breadcrumb">
          <span className={step >= 1 ? 'active' : ''}>1. Envío</span>
          <span className="separator">›</span>
          <span className={step >= 2 ? 'active' : ''}>2. Pago</span>
          <span className="separator">›</span>
          <span className={step >= 3 ? 'active' : ''}>3. Confirmación</span>
        </div>

        <div className="checkout-layout">
          {/* Columna Principal */}
          <div className="checkout-main">
            <h1 className="checkout-title">Finalizar compra</h1>

            {error && (
              <div className="checkout-error" role="alert">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {/* Step 1: Información de Envío */}
            {step === 1 && (
              <div className="checkout-section">
                <h2 className="section-title">
                  <span className="step-number">1</span>
                  Información de envío
                </h2>

                <form className="checkout-form">
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="fullName">Nombre completo *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={shippingData.fullName}
                        onChange={handleShippingChange}
                        placeholder="Ej: Juan Pérez"
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="document">Documento de identidad *</label>
                      <input
                        type="text"
                        id="document"
                        name="document"
                        value={shippingData.document}
                        onChange={handleShippingChange}
                        placeholder="Ej: 1234567890"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="phone">Teléfono *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={shippingData.phone}
                        onChange={handleShippingChange}
                        placeholder="Ej: 3001234567"
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={shippingData.email}
                        onChange={handleShippingChange}
                        placeholder="correo@ejemplo.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field full-width">
                    <label htmlFor="address">Dirección completa *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={shippingData.address}
                      onChange={handleShippingChange}
                      placeholder="Ej: Calle 123 # 45-67 Apto 801"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="city">Ciudad *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={shippingData.city}
                        onChange={handleShippingChange}
                        placeholder="Ej: Bogotá"
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="department">Departamento *</label>
                      <select
                        id="department"
                        name="department"
                        value={shippingData.department}
                        onChange={handleShippingChange}
                        required
                      >
                        <option value="">Selecciona...</option>
                        <option value="Amazonas">Amazonas</option>
                        <option value="Antioquia">Antioquia</option>
                        <option value="Arauca">Arauca</option>
                        <option value="Atlántico">Atlántico</option>
                        <option value="Bolívar">Bolívar</option>
                        <option value="Boyacá">Boyacá</option>
                        <option value="Caldas">Caldas</option>
                        <option value="Caquetá">Caquetá</option>
                        <option value="Casanare">Casanare</option>
                        <option value="Cauca">Cauca</option>
                        <option value="Cesar">Cesar</option>
                        <option value="Chocó">Chocó</option>
                        <option value="Córdoba">Córdoba</option>
                        <option value="Cundinamarca">Cundinamarca</option>
                        <option value="Guainía">Guainía</option>
                        <option value="Guaviare">Guaviare</option>
                        <option value="Huila">Huila</option>
                        <option value="La Guajira">La Guajira</option>
                        <option value="Magdalena">Magdalena</option>
                        <option value="Meta">Meta</option>
                        <option value="Nariño">Nariño</option>
                        <option value="Norte de Santander">Norte de Santander</option>
                        <option value="Putumayo">Putumayo</option>
                        <option value="Quindío">Quindío</option>
                        <option value="Risaralda">Risaralda</option>
                        <option value="San Andrés y Providencia">San Andrés y Providencia</option>
                        <option value="Santander">Santander</option>
                        <option value="Sucre">Sucre</option>
                        <option value="Tolima">Tolima</option>
                        <option value="Valle del Cauca">Valle del Cauca</option>
                        <option value="Vaupés">Vaupés</option>
                        <option value="Vichada">Vichada</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-field full-width">
                    <label htmlFor="additionalInfo">Información adicional (opcional)</label>
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      value={shippingData.additionalInfo}
                      onChange={handleShippingChange}
                      placeholder="Detalles adicionales de entrega, referencias, etc."
                      rows="3"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => navigate('/carrito')}
                    >
                      Volver al carrito
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={handleContinueToPayment}
                    >
                      Continuar al pago
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Método de Pago */}
            {step === 2 && (
              <div className="checkout-section">
                <h2 className="section-title">
                  <span className="step-number">2</span>
                  Método de pago
                </h2>

                <div className="payment-methods">
                  {/* Métodos de pago guardados */}
                  {savedPaymentMethods.length > 0 && (
                    <>
                      <div className="saved-methods-section">
                        <h3 className="subsection-title">Métodos guardados</h3>
                        {savedPaymentMethods.map(method => (
                          <label key={method.id} className={`payment-option saved ${paymentData.useSavedMethod && paymentData.savedMethodId === method.id ? 'active' : ''}`}>
                            <input
                              type="radio"
                              name="paymentType"
                              value="saved"
                              checked={paymentData.useSavedMethod && paymentData.savedMethodId === method.id}
                              onChange={() => setPaymentData(prev => ({ 
                                ...prev, 
                                useSavedMethod: true, 
                                savedMethodId: method.id,
                                type: method.type 
                              }))}
                            />
                            <div className="payment-option-content">
                              <span className="payment-icon">{method.getIcon()}</span>
                              <div>
                                <div className="payment-title">{method.nickname}</div>
                                <div className="payment-desc">{method.getDisplayText()}</div>
                              </div>
                              {method.isDefault && <span className="default-badge-inline">Predeterminado</span>}
                            </div>
                          </label>
                        ))}
                      </div>
                      <div className="or-divider">
                        <span>O usa otro método</span>
                      </div>
                    </>
                  )}

                  {/* Tarjeta de Crédito/Débito */}
                  <label className={`payment-option ${!paymentData.useSavedMethod && paymentData.type === 'card' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="card"
                      checked={!paymentData.useSavedMethod && paymentData.type === 'card'}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, useSavedMethod: false, type: e.target.value }))}
                    />
                    <div className="payment-option-content">
                      <span className="payment-icon">💳</span>
                      <div>
                        <div className="payment-title">Tarjeta de Crédito/Débito</div>
                        <div className="payment-desc">Visa, Mastercard, American Express</div>
                      </div>
                    </div>
                  </label>

                  {!paymentData.useSavedMethod && paymentData.type === 'card' && (
                    <div className="payment-form">
                      <div className="form-field">
                        <label htmlFor="cardNumber">Número de tarjeta</label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={paymentData.cardNumber}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value);
                            if (formatted.replace(/\s/g, '').length <= 16) {
                              setPaymentData(prev => ({ ...prev, cardNumber: formatted }));
                            }
                          }}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                      </div>

                      <div className="form-field">
                        <label htmlFor="cardHolder">Titular de la tarjeta</label>
                        <input
                          type="text"
                          id="cardHolder"
                          name="cardHolder"
                          value={paymentData.cardHolder}
                          onChange={handlePaymentChange}
                          placeholder="Nombre como aparece en la tarjeta"
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-field">
                          <label htmlFor="expiryDate">Fecha de vencimiento</label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={paymentData.expiryDate}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length >= 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2, 4);
                              }
                              setPaymentData(prev => ({ ...prev, expiryDate: value }));
                            }}
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                        </div>

                        <div className="form-field">
                          <label htmlFor="cvv">CVV</label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={paymentData.cvv}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              if (value.length <= 4) {
                                setPaymentData(prev => ({ ...prev, cvv: value }));
                              }
                            }}
                            placeholder="123"
                            maxLength="4"
                          />
                        </div>
                      </div>

                      {/* Opción de guardar tarjeta */}
                      <div className="save-payment-option">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={paymentData.savePaymentMethod}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, savePaymentMethod: e.target.checked }))}
                          />
                          <span>Guardar este método de pago para futuras compras</span>
                        </label>
                        {paymentData.savePaymentMethod && (
                          <input
                            type="text"
                            placeholder="Nombre del método (opcional)"
                            value={paymentData.paymentMethodNickname}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, paymentMethodNickname: e.target.value }))}
                            className="nickname-input"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* PSE */}
                  <label className={`payment-option ${!paymentData.useSavedMethod && paymentData.type === 'pse' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="pse"
                      checked={!paymentData.useSavedMethod && paymentData.type === 'pse'}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, useSavedMethod: false, type: e.target.value }))}
                    />
                    <div className="payment-option-content">
                      <span className="payment-icon">🏦</span>
                      <div>
                        <div className="payment-title">PSE</div>
                        <div className="payment-desc">Débito desde tu cuenta bancaria</div>
                      </div>
                    </div>
                  </label>

                  {!paymentData.useSavedMethod && paymentData.type === 'pse' && (
                    <div className="payment-form">
                      <div className="form-field">
                        <label htmlFor="bank">Selecciona tu banco</label>
                        <select
                          id="bank"
                          name="bank"
                          value={paymentData.bank}
                          onChange={handlePaymentChange}
                        >
                          <option value="">Selecciona...</option>
                          {PaymentMethodController.getAvailableBanks().map(bank => (
                            <option key={bank.value} value={bank.value}>{bank.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-field">
                        <label htmlFor="personType">Tipo de persona</label>
                        <select
                          id="personType"
                          name="personType"
                          value={paymentData.personType}
                          onChange={handlePaymentChange}
                        >
                          <option value="natural">Persona Natural</option>
                          <option value="juridica">Persona Jurídica</option>
                        </select>
                      </div>

                      {/* Opción de guardar PSE */}
                      <div className="save-payment-option">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={paymentData.savePaymentMethod}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, savePaymentMethod: e.target.checked }))}
                          />
                          <span>Guardar este banco para futuras compras</span>
                        </label>
                        {paymentData.savePaymentMethod && (
                          <input
                            type="text"
                            placeholder="Nombre del método (opcional)"
                            value={paymentData.paymentMethodNickname}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, paymentMethodNickname: e.target.value }))}
                            className="nickname-input"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Nequi */}
                  <label className={`payment-option ${!paymentData.useSavedMethod && paymentData.type === 'nequi' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="nequi"
                      checked={!paymentData.useSavedMethod && paymentData.type === 'nequi'}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, useSavedMethod: false, type: e.target.value }))}
                    />
                    <div className="payment-option-content">
                      <span className="payment-icon">📱</span>
                      <div>
                        <div className="payment-title">Nequi</div>
                        <div className="payment-desc">Paga desde tu cuenta Nequi</div>
                      </div>
                    </div>
                  </label>

                  {!paymentData.useSavedMethod && paymentData.type === 'nequi' && (
                    <div className="payment-form">
                      <div className="form-field">
                        <label htmlFor="walletPhone">Número de celular Nequi</label>
                        <div className="phone-input-wrapper">
                          <span className="phone-prefix">+57</span>
                          <input
                            type="tel"
                            id="walletPhone"
                            value={paymentData.walletPhone}
                            onChange={handleWalletPhoneChange}
                            placeholder="3001234567"
                            maxLength="10"
                          />
                        </div>
                      </div>

                      {/* Opción de guardar Nequi */}
                      <div className="save-payment-option">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={paymentData.savePaymentMethod}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, savePaymentMethod: e.target.checked }))}
                          />
                          <span>Guardar este número para futuras compras</span>
                        </label>
                        {paymentData.savePaymentMethod && (
                          <input
                            type="text"
                            placeholder="Nombre del método (opcional)"
                            value={paymentData.paymentMethodNickname}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, paymentMethodNickname: e.target.value }))}
                            className="nickname-input"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Daviplata */}
                  <label className={`payment-option ${!paymentData.useSavedMethod && paymentData.type === 'daviplata' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="daviplata"
                      checked={!paymentData.useSavedMethod && paymentData.type === 'daviplata'}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, useSavedMethod: false, type: e.target.value }))}
                    />
                    <div className="payment-option-content">
                      <span className="payment-icon">📱</span>
                      <div>
                        <div className="payment-title">Daviplata</div>
                        <div className="payment-desc">Paga desde tu cuenta Daviplata</div>
                      </div>
                    </div>
                  </label>

                  {!paymentData.useSavedMethod && paymentData.type === 'daviplata' && (
                    <div className="payment-form">
                      <div className="form-field">
                        <label htmlFor="walletPhone">Número de celular Daviplata</label>
                        <div className="phone-input-wrapper">
                          <span className="phone-prefix">+57</span>
                          <input
                            type="tel"
                            id="walletPhone"
                            value={paymentData.walletPhone}
                            onChange={handleWalletPhoneChange}
                            placeholder="3001234567"
                            maxLength="10"
                          />
                        </div>
                      </div>

                      {/* Opción de guardar Daviplata */}
                      <div className="save-payment-option">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={paymentData.savePaymentMethod}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, savePaymentMethod: e.target.checked }))}
                          />
                          <span>Guardar este número para futuras compras</span>
                        </label>
                        {paymentData.savePaymentMethod && (
                          <input
                            type="text"
                            placeholder="Nombre del método (opcional)"
                            value={paymentData.paymentMethodNickname}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, paymentMethodNickname: e.target.value }))}
                            className="nickname-input"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Efectivo */}
                  <label className={`payment-option ${!paymentData.useSavedMethod && paymentData.type === 'cash' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="cash"
                      checked={!paymentData.useSavedMethod && paymentData.type === 'cash'}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, useSavedMethod: false, type: e.target.value }))}
                    />
                    <div className="payment-option-content">
                      <span className="payment-icon">💵</span>
                      <div>
                        <div className="payment-title">Pago contra entrega</div>
                        <div className="payment-desc">Paga en efectivo al recibir tu pedido</div>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setStep(1)}
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleContinueToConfirmation}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmación */}
            {step === 3 && (
              <div className="checkout-section">
                <h2 className="section-title">
                  <span className="step-number">3</span>
                  Confirma tu pedido
                </h2>

                <div className="confirmation-summary">
                  <div className="summary-block">
                    <h3>Información de envío</h3>
                    <p><strong>{shippingData.fullName}</strong></p>
                    <p>{shippingData.document}</p>
                    <p>{shippingData.address}</p>
                    <p>{shippingData.city}, {shippingData.department}</p>
                    <p>{shippingData.phone}</p>
                    <p>{shippingData.email}</p>
                    <button className="link-button" onClick={() => setStep(1)}>
                      Editar
                    </button>
                  </div>

                  <div className="summary-block">
                    <h3>Método de pago</h3>
                    {paymentData.type === 'card' && (
                      <>
                        <p><strong>Tarjeta de crédito/débito</strong></p>
                        <p>**** **** **** {paymentData.cardNumber.slice(-4)}</p>
                        <p>{paymentData.cardHolder}</p>
                      </>
                    )}
                    {paymentData.type === 'pse' && (
                      <>
                        <p><strong>PSE</strong></p>
                        <p>{paymentData.bank}</p>
                      </>
                    )}
                    {paymentData.type === 'cash' && (
                      <>
                        <p><strong>Pago contra entrega</strong></p>
                        <p>Efectivo</p>
                      </>
                    )}
                    <button className="link-button" onClick={() => setStep(2)}>
                      Editar
                    </button>
                  </div>
                </div>

                <div className="checkout-products">
                  <h3>Productos</h3>
                  {cartItems.map((item, index) => (
                    <div key={index} className="checkout-product">
                      <img src={item.product.image} alt={item.product.name} />
                      <div className="product-info">
                        <h4>{item.product.name}</h4>
                        <p>Cantidad: {item.quantity}</p>
                      </div>
                      <div className="product-price">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setStep(2)}
                    disabled={loading}
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    className="btn-primary btn-place-order"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Procesando...
                      </>
                    ) : (
                      'Realizar pedido'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Columna Lateral: Resumen */}
          <aside className="checkout-sidebar">
            <div className="order-summary">
              <h3>Resumen del pedido</h3>

              <div className="summary-item">
                <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'})</span>
                <span>{formatPrice(calculateSubtotal())}</span>
              </div>

              <div className="summary-item">
                <span>Envío</span>
                <span className={calculateShipping() === 0 ? 'free-shipping' : ''}>
                  {calculateShipping() === 0 ? 'GRATIS' : formatPrice(calculateShipping())}
                </span>
              </div>

              {calculateShipping() === 0 && (
                <div className="shipping-notice">
                  <span className="icon">✓</span>
                  ¡Felicitaciones! Tu envío es gratis
                </div>
              )}

              {/* Sección de Cupón */}
              <div className="coupon-section">
                <h4>¿Tienes un cupón?</h4>
                {!appliedCoupon ? (
                  <div className="coupon-input-group">
                    <input
                      type="text"
                      placeholder="Código del cupón"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError('');
                        setCouponSuccess('');
                      }}
                      className={couponError ? 'error' : ''}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="btn-apply-coupon"
                      disabled={!couponCode.trim()}
                    >
                      Aplicar
                    </button>
                  </div>
                ) : (
                  <div className="applied-coupon">
                    <div className="coupon-info">
                      <span className="coupon-icon">{appliedCoupon.getIcon()}</span>
                      <div className="coupon-details">
                        <strong>{appliedCoupon.code}</strong>
                        <span>{appliedCoupon.getDiscountText()}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="btn-remove-coupon"
                        aria-label="Eliminar cupón"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {couponError && (
                  <div className="coupon-message error">{couponError}</div>
                )}
                {couponSuccess && (
                  <div className="coupon-message success">{couponSuccess}</div>
                )}
              </div>

              {/* Mostrar descuento si hay cupón aplicado */}
              {appliedCoupon && (
                <div className="summary-item discount-item">
                  <span>Descuento {appliedCoupon.code}</span>
                  <span className="discount-value">-{formatPrice(calculateDiscount())}</span>
                </div>
              )}

              <div className="summary-total">
                <span>Total</span>
                <span className="total-amount">{formatPrice(calculateTotal())}</span>
              </div>

              <div className="security-badges">
                <span className="security-icon">🔒</span>
                <p>Compra 100% segura</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
