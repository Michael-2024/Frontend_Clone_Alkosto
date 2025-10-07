import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductController from '../../controllers/ProductController';
import CartController from '../../controllers/CartController';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const foundProduct = ProductController.getProductById(id);
    setProduct(foundProduct);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      CartController.addToCart(product, quantity);
      alert(`${quantity} x ${product.name} agregado(s) al carrito`);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (!product) {
    return (
      <div className="container">
        <div className="product-not-found">
          <h2>Producto no encontrado</h2>
          <Link to="/" className="back-link">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Inicio</Link> / 
          <Link to={`/categoria/${product.category.toLowerCase()}`}> {product.category}</Link> / 
          <span> {product.name}</span>
        </div>

        <div className="product-detail-content">
          <div className="product-detail-image">
            <img src={product.image} alt={product.name} />
            {product.discount > 0 && (
              <span className="discount-badge">
                -{product.getDiscountPercentage()}% OFF
              </span>
            )}
          </div>

          <div className="product-detail-info">
            <h1>{product.name}</h1>
            
            <div className="product-rating">
              {'⭐'.repeat(Math.floor(product.rating))}
              <span className="rating-text">({product.rating} / 5.0)</span>
            </div>

            <div className="product-prices-detail">
              {product.originalPrice && (
                <>
                  <span className="original-price">
                    Antes: {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0
                    }).format(product.originalPrice)}
                  </span>
                  <span className="savings">
                    Ahorras: {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0
                    }).format(product.originalPrice - product.price)}
                  </span>
                </>
              )}
              <span className="current-price-detail">
                {product.getFormattedPrice()}
              </span>
            </div>

            <div className="stock-info">
              {product.isInStock() ? (
                <span className="in-stock">✅ Disponible ({product.stock} unidades)</span>
              ) : (
                <span className="out-of-stock">❌ Agotado</span>
              )}
            </div>

            <div className="quantity-selector">
              <label>Cantidad:</label>
              <div className="quantity-controls">
                <button onClick={decreaseQuantity} disabled={quantity <= 1}>-</button>
                <span className="quantity-value">{quantity}</span>
                <button onClick={increaseQuantity} disabled={quantity >= product.stock}>+</button>
              </div>
            </div>

            <button 
              className="add-to-cart-btn-detail"
              onClick={handleAddToCart}
              disabled={!product.isInStock()}
            >
              🛒 Agregar al Carrito
            </button>

            <div className="product-features">
              <h3>Características</h3>
              <ul>
                <li>📦 Envío gratis en compras mayores a $200.000</li>
                <li>🔄 Devolución gratis en 30 días</li>
                <li>🛡️ Garantía oficial del fabricante</li>
                <li>💳 Paga con tarjeta de crédito o débito</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
