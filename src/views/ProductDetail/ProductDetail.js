import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductController from '../../controllers/ProductController';
import CartController from '../../controllers/CartController';
import UserController from '../../controllers/UserController';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFavModal, setShowFavModal] = useState(false);
  const [favEmail, setFavEmail] = useState('');
  const [favEmailError, setFavEmailError] = useState('');

  useEffect(() => {
    const foundProduct = ProductController.getProductById(id);
    setProduct(foundProduct);
    // Sincroniza estado de favoritos por usuario si existe
    try {
      let favs = [];
      if (UserController.isLoggedIn()) {
        const user = UserController.getCurrentUser();
        favs = JSON.parse(localStorage.getItem(`alkosto_favorites_${user.id}`) || '[]');
      } else {
        favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      }
      setIsFavorite(favs.includes(foundProduct?.id));
    } catch (_) { /* noop */ }
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

  const toggleFavorite = () => {
    if (!product) return;
    // Si no está logueado, mostrar modal como en el sitio original
    if (!UserController.isLoggedIn()) {
      // Recordar intento de favorito para aplicarlo después del login/registro
      try {
        localStorage.setItem('pendingFavoriteProductId', String(product.id));
      } catch (_) { /* noop */ }
      setShowFavModal(true);
      return;
    }
    try {
      const user = UserController.getCurrentUser();
      const key = `alkosto_favorites_${user.id}`;
      const favs = JSON.parse(localStorage.getItem(key) || '[]');
      let next;
      if (favs.includes(product.id)) {
        next = favs.filter((pid) => pid !== product.id);
        setIsFavorite(false);
      } else {
        next = [...favs, product.id];
        setIsFavorite(true);
      }
      localStorage.setItem(key, JSON.stringify(next));
    } catch (e) {
      console.error('No se pudo actualizar favoritos', e);
    }
  };

  const shareProduct = async () => {
    if (!product) return;
    const shareData = {
      title: product.name,
      text: `Mira este producto: ${product.name}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        alert('Enlace copiado al portapapeles');
      }
    } catch (e) {
      console.warn('No se pudo compartir el producto', e);
    }
  };

  const validateEmail = (value) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(value).toLowerCase());
  };

  const proceedFavLogin = (e) => {
    e?.preventDefault?.();
    if (!validateEmail(favEmail)) {
      setFavEmailError('Correo electrónico inválido');
      return;
    }
    // Guardar email pendiente para el flujo de login, emulando alkosto
    localStorage.setItem('pendingEmail', favEmail);
    setShowFavModal(false);
    // Si el correo ya está registrado -> ir a opciones de login
    if (UserController.isEmailRegistered(favEmail)) {
      navigate(`/login/options?email=${encodeURIComponent(favEmail)}`);
    } else {
      // Si no existe -> ir a registro con el correo prellenado
      navigate(`/register?email=${encodeURIComponent(favEmail)}`);
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
              aria-label="Agregar al carrito"
            >
              🛒 Agregar al carrito
            </button>

            <div className="product-secondary-actions" role="group" aria-label="Acciones secundarias">
              <button
                type="button"
                className={`secondary-action ${isFavorite ? 'active' : ''}`}
                onClick={toggleFavorite}
                aria-pressed={isFavorite}
                aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <span className="action-icon" aria-hidden>❤</span>
                <span className="action-label">Favoritos</span>
              </button>
              <button
                type="button"
                className="secondary-action"
                onClick={shareProduct}
                aria-label="Compartir producto"
              >
                <span className="action-icon" aria-hidden>🔗</span>
                <span className="action-label">Compartir</span>
              </button>
            </div>

            <div className="product-features">
              <h3>Características</h3>
              <ul>
                <li>📦 Envío gratis en compras mayores a $200.000</li>
                <li>🔄 Devolución gratis en 30 días</li>
                <li>🛡️ Garantía oficial del fabricante</li>
                <li>💳 Paga con tarjeta de crédito o débito</li>
              </ul>
            </div>
            {/* Modal de favoritos para usuarios no logueados */}
            {showFavModal && (
              <div className="favorite-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="fav-modal-title">
                <div className="favorite-modal">
                  <button className="favorite-modal-close" aria-label="Cerrar" onClick={() => setShowFavModal(false)}>✕</button>
                  <div className="favorite-modal-logo">ALKOSTO</div>
                  <h3 id="fav-modal-title" className="favorite-modal-title">Ingresa tu correo para guardar productos favoritos.</h3>
                  <form className="favorite-modal-form" onSubmit={proceedFavLogin}>
                    <input
                      type="email"
                      placeholder="Correo electrónico"
                      value={favEmail}
                      onChange={(e) => { setFavEmail(e.target.value); setFavEmailError(''); }}
                      className="favorite-modal-input"
                      required
                    />
                    {favEmailError && <div className="favorite-modal-error">{favEmailError}</div>}
                    <button type="submit" className="favorite-modal-submit">Continuar</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
