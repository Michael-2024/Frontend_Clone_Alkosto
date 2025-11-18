import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, showFavorite = false }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!UserController.isLoggedIn()) {
      // Guardar producto pendiente y redirigir a login
      localStorage.setItem('pendingFavoriteProductId', String(product.id));
      localStorage.setItem('pendingFavoriteRedirect', 'true');
      const email = localStorage.getItem('pendingEmail') || '';
      navigate(`/login/options${email ? `?email=${encodeURIComponent(email)}` : ''}`);
      return;
    }

    // Usuario logueado: toggle favorito
    const favs = UserController.getFavorites(UserController.getCurrentUser().id);
    if (favs.includes(product.id)) {
      UserController.removeFavorite(product.id);
      setIsFavorite(false);
    } else {
      UserController.addFavorite(product.id);
      setIsFavorite(true);
    }
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
      
      <div className="product-card-actions">
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={!product.isInStock()}
        >
          {product.isInStock() ? '🛒 Agregar al carrito' : 'Agotado'}
        </button>
        {showFavorite && (
          <button 
            className="favorite-btn"
            onClick={handleToggleFavorite}
            title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
