import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <div className="product-card">
      <Link to={`/producto/${product.id}`} className="product-link">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
          {product.discount > 0 && (
            <span className="discount-badge">
              -{product.getDiscountPercentage()}%
            </span>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          
          <div className="product-rating">
            {'⭐'.repeat(Math.floor(product.rating))}
            <span className="rating-number">({product.rating})</span>
          </div>
          
          <div className="product-prices">
            {product.originalPrice && (
              <span className="original-price">
                {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0
                }).format(product.originalPrice)}
              </span>
            )}
            <span className="current-price">
              {product.getFormattedPrice()}
            </span>
          </div>
        </div>
      </Link>
      
      <button 
        className="add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={!product.isInStock()}
      >
        {product.isInStock() ? '🛒 Agregar al carrito' : 'Agotado'}
      </button>
    </div>
  );
};

export default ProductCard;
