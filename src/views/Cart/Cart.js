import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineDeleteForever } from 'react-icons/md';
import { BsCartX } from 'react-icons/bs';
import CartController from '../../controllers/CartController';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState(CartController.getCart());

  const updateCart = () => {
    setCart(CartController.getCart());
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

  // 🟠 Carrito vacío con nuevo icono BsCartX
  if (cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <div className="empty-content">
            <div className="empty-icon">
              <BsCartX style={{ color: 'orange', fontSize: '70px' }} />
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

                <div className="cart-item-info">
                  <Link to={`/producto/${item.product.id}`} className="cart-item-name">
                    {item.product.name}
                  </Link>
                  <p className="cart-item-price">
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0,
                    }).format(item.product.price)}
                  </p>
                </div>

                <div className="cart-item-quantity">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.product.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.product.id, item.quantity + 1)
                    }
                    disabled={item.quantity >= item.product.stock}
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-subtotal">
                  {new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                  }).format(item.product.price * item.quantity)}
                </div>

                <button
                  className="cart-item-remove"
                  onClick={() => handleRemoveItem(item.product.id)}
                >
                  <MdOutlineDeleteForever style={{ color: 'orange', fontSize: '24px' }} />
                </button>
              </div>
            ))}

            <button className="clear-cart-btn" onClick={handleClearCart}>
              Vaciar Carrito
            </button>
          </div>

          <div className="cart-summary">
            <h2>Resumen de Compra</h2>

            <div className="summary-row">
              <span>Subtotal ({totalItems} productos)</span>
              <span>
                {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                }).format(total)}
              </span>
            </div>

            <div className="summary-row">
              <span>Envío</span>
              <span className="free-shipping">
                {total >= 200000
                  ? 'GRATIS'
                  : new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0,
                    }).format(15000)}
              </span>
            </div>

            {total < 200000 && (
              <div className="shipping-notice">
                💡 Agrega{' '}
                {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                }).format(200000 - total)}{' '}
                para envío gratis
              </div>
            )}

            <div className="summary-total">
              <span>Total</span>
              <span>
                {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                }).format(total + (total >= 200000 ? 0 : 15000))}
              </span>
            </div>

            <button className="checkout-btn">Proceder al Pago</button>

            <Link to="/" className="continue-link">
              ← Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
