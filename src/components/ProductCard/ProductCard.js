import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  if (!product) return null;

  const handleAddToCart = (e) => {
    e.preventDefault(); // evita que el link se dispare al hacer clic en el botón
    if (onAddToCart) onAddToCart(product);
  };

  return (
    <div className="product-card">
      <Link to={`/producto/${product.id}`} className="product-link">
        <div className="product-image">
          <img
            src={product.image || '/placeholder.png'}
            alt={product.name || 'Producto'}
            onError={(e) => {
              e.target.src = '/placeholder.png';
            }}
          />
          {product.getDiscountPercentage?.() > 0 && (
            <span className="discount-badge">
              -{product.getDiscountPercentage()}%
            </span>
          )}
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>

          <div className="product-rating">
            {'⭐'.repeat(Math.floor(product.rating || 0))}
            <span className="rating-number">
              ({product.rating?.toFixed(1) || '0.0'})
            </span>
          </div>

          <div className="product-prices">
            {product.originalPrice && (
              <span className="original-price">
                {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                }).format(product.originalPrice)}
              </span>
            )}
            <span className="current-price">
              {product.getFormattedPrice
                ? product.getFormattedPrice()
                : new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                  }).format(product.price || 0)}
            </span>
          </div>
        </div>
      </Link>

      <button
        className="add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={!product.isInStock?.()}
      >
        {product.isInStock?.() ? '🛒 Agregar al carrito' : 'Agotado'}
      </button>
    </div>
  );
};

export default ProductCard;
