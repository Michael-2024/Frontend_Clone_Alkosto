import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CartController from '../../controllers/CartController';
import './Cart.css';

const Cart = () => {
  // Usamos un "tick" para forzar re-render sin perder métodos de la clase Cart
  const [tick, setTick] = useState(0);
  const cart = CartController.getCart();

  const updateCart = () => {
    setTick((t) => t + 1);
  };

  const handleRemoveItem = (productId) => {
    CartController.removeFromCart(productId);
    updateCart();
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    CartController.updateQuantity(productId, newQuantity);
    updateCart();
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      CartController.clearCart();
      updateCart();
    }
  };

  const total = cart.getTotal();
  const totalItems = cart.getTotalItems();

  if (cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <div className="empty-content">
            <div className="empty-icon">🛒</div>
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

            <details className="discounts-section">
              <summary className="discounts-toggle">
                <span>▼ Descuentos</span>
              </summary>
              <div className="discounts-content">
                <p className="no-discounts">No hay descuentos aplicados</p>
              </div>
            </details>

            <div className="summary-total">
              <span>Total a pagar</span>
              <span>{new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
              }).format(total)}</span>
            </div>

            <button className="checkout-btn">
              Ir a pagar
            </button>

            <div className="security-badges">
              <p className="security-text">
                <span className="security-icon">🔒</span>
                Tu compra siempre segura
              </p>
              <div className="payment-methods">
                <img src="/images/norton.png" alt="Norton" className="badge-img" />
                <img src="/images/ssl.png" alt="SSL" className="badge-img" />
                <img src="/images/secure.png" alt="Secure" className="badge-img" />
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
