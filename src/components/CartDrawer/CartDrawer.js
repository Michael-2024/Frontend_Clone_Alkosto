import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductController from '../../controllers/ProductController';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose, addedProduct, cartItems, cartTotal }) => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    const loadRecommended = async () => {
      if (isOpen && addedProduct) {
        try {
          // Obtener productos relacionados o recomendados por categoría
          const allProducts = await ProductController.porCategoria(addedProduct.category);
          const related = allProducts
            .filter(p => p.id !== addedProduct.id)
            .slice(0, 3);
          setRecommendedProducts(related);
        } catch (error) {
          console.error('Error cargando productos recomendados:', error);
          setRecommendedProducts([]);
        }
      }
    };
    loadRecommended();
  }, [isOpen, addedProduct]);

  useEffect(() => {
    // Bloquear scroll del body cuando el drawer está abierto
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !addedProduct) return null;

  return (
    <>
      <div className="cart-drawer-overlay" onClick={onClose}></div>
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <button className="cart-drawer-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
          <h2 className="cart-drawer-title">
            <span className="success-icon">✓</span> Se agregó a tu carrito
          </h2>
        </div>

        <div className="cart-drawer-content">
          {/* Producto agregado */}
          <div className="added-product-section">
            <div className="added-product">
              <img 
                src={addedProduct.image} 
                alt={addedProduct.name}
                className="added-product-image"
              />
              <div className="added-product-info">
                <h3 className="added-product-name">{addedProduct.name}</h3>
                <p className="added-product-price">
                  {addedProduct.getFormattedPrice()}
                  {addedProduct.originalPrice && (
                    <span className="added-product-discount">-{addedProduct.getDiscountPercentage()}%</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* También te puede interesar */}
          {recommendedProducts.length > 0 && (
            <div className="recommended-section">
              <h3 className="recommended-title">También te puede interesar</h3>
              <div className="recommended-products">
                {recommendedProducts.map(product => (
                  <Link 
                    key={product.id} 
                    to={`/producto/${product.id}`}
                    className="recommended-product"
                    onClick={onClose}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="recommended-product-image"
                    />
                    <div className="recommended-product-info">
                      <p className="recommended-product-name">{product.name}</p>
                      <div className="recommended-product-rating">
                        {'⭐'.repeat(Math.floor(product.rating))}
                        <span className="rating-count">({product.rating})</span>
                      </div>
                      <p className="recommended-product-price">
                        {product.getFormattedPrice()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="cart-drawer-actions">
            <button 
              className="continue-shopping-btn"
              onClick={onClose}
            >
              Continuar comprando
            </button>
            <Link 
              to="/carrito"
              className="go-to-cart-btn"
              onClick={onClose}
            >
              Ir al carrito y pagar
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
