import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartController from '../../controllers/CartController';
import UserController from '../../controllers/UserController';
import CouponController from '../../controllers/CouponController';
import './Cart.css';

// iconos 
import { LiaShoppingCartSolid } from "react-icons/lia";

const Cart = () => {
  const navigate = useNavigate();
  // Usamos un "tick" para forzar re-render sin perder métodos de la clase Cart
  const [tick, setTick] = useState(0);
  const [cart, setCart] = useState(null);

  // Estados de cupón
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Cargar carrito al iniciar
  React.useEffect(() => {
    const loadCart = async () => {
      const loadedCart = await CartController.getCart();
      setCart(loadedCart);
    };
    loadCart();
  }, []);

  const updateCart = async () => {
    const updatedCart = await CartController.getCart();
    setCart(updatedCart);
    setTick((t) => t + 1);
  };

  const handleRemoveItem = async (productId) => {
    await CartController.removeFromCart(productId);
    updateCart();
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    await CartController.updateQuantity(productId, newQuantity);
    updateCart();
  };

  const handleClearCart = async () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      await CartController.clearCart();
      updateCart();
    }
  };

  // Mostrar loading mientras carga el carrito
  if (!cart) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Cargando carrito...</p>
        </div>
      </div>
    );
  }

  const total = cart.getTotal();
  const totalItems = cart.getTotalItems();

  // Funciones de cupón
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('Ingresa un código de cupón');
      return;
    }

    setCouponError('');
    setCouponSuccess('');

    const user = UserController.getCurrentUser();
    if (!user) {
      setCouponError('Debes iniciar sesión para usar cupones');
      return;
    }

    const categories = [...new Set(cart.items.map(item => item.product.category))];

    const validation = CouponController.validateCoupon(
      couponCode,
      user.id,
      total,
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

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    return appliedCoupon.calculateDiscount(total);
  };

  const calculateFinalTotal = () => {
    return total - calculateDiscount();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleCheckout = () => {
    // Verificar si el usuario está logueado
    if (!UserController.isLoggedIn()) {
      // Redirigir a login y guardar intención de checkout
      localStorage.setItem('intendedCheckout', 'true');
      navigate('/login/options');
      return;
    }

    // Si está logueado, ir directamente a checkout
    navigate('/checkout');
  };

  if (cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <div className="empty-content">
            <div className="empty-icon">  
              <LiaShoppingCartSolid size={308} color="#ff7300ff" />
            </div>
            <h2>Tu carrito está vacío</h2>
            <p>Agrega productos para comenzar tu compra</p>
            <Link to="/" className="continue-shopping-btn">
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>

    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">Mi Carrito ({totalItems} productos)</h1>

        <div className="cart-content">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.product.id} className="cart-item">
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  className="cart-item-image"
                />
                
                <div className="cart-item-details">
                  <div className="cart-item-info">
                    <p className="cart-item-code">Código: {item.product.id}</p>
                    <Link to={`/producto/${item.product.id}`} className="cart-item-name">
                      {item.product.name}
                    </Link>
                    {item.product.specs && (
                      <p className="cart-item-specs">{item.product.specs}</p>
                    )}
                  </div>

                  <div className="cart-item-shipping">
                    <p className="shipping-method-title">Método de envío</p>
                    <div className="shipping-option selected">
                      <input type="radio" checked readOnly />
                      <span className="shipping-icon">📦</span>
                      <span className="shipping-text">
                        Envío <strong>gratis</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <p className="cart-item-price">
                    {item.product.getFormattedPrice()}
                    {item.product.oldPrice && (
                      <span className="old-price">
                        {new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                          minimumFractionDigits: 0
                        }).format(item.product.oldPrice)}
                      </span>
                    )}
                  </p>

                  <div className="cart-item-quantity">
                    <label htmlFor={`quantity-${item.product.id}`} className="quantity-label">
                      Cantidad
                    </label>
                    <select 
                      id={`quantity-${item.product.id}`}
                      value={item.quantity}
                      onChange={(e) => {
                        const newQty = parseInt(e.target.value);
                        if (newQty === 0) {
                          handleRemoveItem(item.product.id);
                        } else {
                          handleUpdateQuantity(item.product.id, newQty);
                        }
                      }}
                      className="quantity-select"
                    >
                      <option value="0">0 - eliminar</option>
                      {[...Array(Math.min(10, item.product.stock || 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                      {item.quantity > 10 && <option value={item.quantity}>{item.quantity}</option>}
                    </select>
                  </div>

                  <button 
                    className="cart-item-remove"
                    onClick={() => handleRemoveItem(item.product.id)}
                    title="Eliminar producto"
                  >
                    <span className="remove-icon">🗑️</span>
                    <span className="remove-text">Eliminar</span>
                  </button>
                </div>
              </div>
            ))}

            <button className="clear-cart-btn" onClick={handleClearCart}>
              Vaciar Carrito
            </button>
          </div>

          <div className="cart-summary">
            <h2>Mi carrito</h2>
            
            <div className="summary-row">
              <span>Subtotal ({totalItems} productos)</span>
              <span>{new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
              }).format(total)}</span>
            </div>

            <div className="summary-row">
              <span>Entrega</span>
              <span className="free-shipping">Gratis</span>
            </div>

            {/* Sección de cupones */}
            <details className="discounts-section" open={appliedCoupon || couponError || couponSuccess}>
              <summary className="discounts-toggle">
                <span>▼ Descuentos y cupones</span>
              </summary>
              <div className="discounts-content">
                {!appliedCoupon ? (
                  <div className="coupon-input-wrapper">
                    <input
                      type="text"
                      placeholder="Código del cupón"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError('');
                        setCouponSuccess('');
                      }}
                      className={`coupon-input ${couponError ? 'error' : ''}`}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="apply-coupon-btn"
                      disabled={!couponCode.trim()}
                    >
                      Aplicar
                    </button>
                  </div>
                ) : (
                  <div className="applied-coupon-cart">
                    <div className="coupon-badge">
                      <span className="coupon-icon">{appliedCoupon.getIcon()}</span>
                      <div className="coupon-info-cart">
                        <strong>{appliedCoupon.code}</strong>
                        <span>-{formatPrice(calculateDiscount())}</span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="remove-coupon-btn"
                        aria-label="Eliminar cupón"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {couponError && (
                  <div className="coupon-message-cart error">{couponError}</div>
                )}
                {couponSuccess && (
                  <div className="coupon-message-cart success">{couponSuccess}</div>
                )}
              </div>
            </details>

            {appliedCoupon && (
              <div className="summary-row discount-row">
                <span>Descuento {appliedCoupon.code}</span>
                <span className="discount-amount">-{formatPrice(calculateDiscount())}</span>
              </div>
            )}

            <div className="summary-total">
              <span>Total a pagar</span>
              <span>{formatPrice(calculateFinalTotal())}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Ir a pagar
            </button>

            <div className="security-badges">
              <p className="security-text">
                <span className="security-icon">🔒</span>
                Tu compra siempre segura
              </p>
              <div className="payment-methods">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJzUFYr18R30af9a_noSOxQ9QRqq6fNt5r4A&s" alt="Norton" className="badge-img" />
                <img src="https://www.shutterstock.com/image-vector/secure-ssl-encryption-logo-connection-260nw-2318420931.jpg" alt="SSL" className="badge-img" />
                <img src="https://img.freepik.com/vector-gratis/ilustracion-logotipo-diseno-logotipo-degradado-escudo_343694-3222.jpg?semt=ais_hybrid&w=740&q=80" alt="Secure" className="badge-img" />
              </div>
              <p className="payment-info">
                Recibimos todos los medios de pago y también efectivo
              </p>
              <div className="payment-logos">
                <span className="payment-logo">💳</span>
                <span className="payment-logo">💵</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
