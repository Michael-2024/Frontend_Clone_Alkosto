import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import ProductController from '../../controllers/ProductController';
import CartController from '../../controllers/CartController';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Account.css';
import AccountSidebar from './AccountSidebar';

const Favorites = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(UserController.getCurrentUser());
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!UserController.isLoggedIn()) {
      const email = localStorage.getItem('pendingEmail') || '';
      navigate(`/login/options${email ? `?email=${encodeURIComponent(email)}` : ''}`);
    }
  }, [navigate]);

  useEffect(() => {
    const u = UserController.getCurrentUser();
    setUser(u);
    if (!u) return;
    try {
      const ids = JSON.parse(localStorage.getItem(`alkosto_favorites_${u.id}`) || '[]');
      const products = ids.map((id) => ProductController.getProductById(id)).filter(Boolean);
      setFavorites(products);
    } catch (_) {
      setFavorites([]);
    }
  }, []);

  if (!user) return null;

  const handleAddToCart = (product) => {
    CartController.addToCart(product, 1);
    alert(`${product.name} agregado al carrito`);
  };

  const removeFromFavorites = (productId) => {
    const key = `alkosto_favorites_${user.id}`;
    const ids = JSON.parse(localStorage.getItem(key) || '[]');
    const next = ids.filter((id) => id !== productId);
    localStorage.setItem(key, JSON.stringify(next));
    setFavorites((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearAll = () => {
    if (!user) return;
    const key = `alkosto_favorites_${user.id}`;
    localStorage.setItem(key, '[]');
    setFavorites([]);
  };

  const onLogout = () => { UserController.logout(); navigate('/'); };

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-layout">
          <AccountSidebar onLogout={onLogout} />

          <section className="account-content">
            <div className="account-hero">
              <div className="hero-icon" aria-hidden>❤️</div>
              <div className="hero-texts">
                <h1 className="account-title">Mi lista de favoritos</h1>
              </div>
            </div>

            {favorites.length === 0 ? (
              <div className="account-grid">
                <div className="account-card" style={{gridColumn: '1 / -1', textAlign: 'center'}}>
                  <div className="card-icon" aria-hidden>❤</div>
                  <div className="card-title">No tienes productos favoritos aún</div>
                  <div className="card-desc">Explora nuestras categorías y guarda los productos que te gusten.</div>
                  <Link to="/" className="btn-primary" style={{alignSelf: 'center', marginBlockStart: '8px'}}>Ir a comprar</Link>
                </div>
              </div>
            ) : (
              <div className="favorites-panel">
                <div className="panel-toolbar">
                  <button className="link-danger" onClick={clearAll}>
                    <span aria-hidden>🗑</span>
                    <span>Eliminar todos</span>
                  </button>
                </div>

                <div className="panel-warning" role="note">
                  <span className="warn-icon" aria-hidden>⚠</span>
                  <span>Puede que uno o varios de los productos tenga actualizaciones</span>
                </div>

                <div className="favorites-grid">
                  {favorites.map((product) => (
                    <div key={product.id} className="favorite-card">
                      <ProductCard product={product} onAddToCart={handleAddToCart} />
                      <button className="btn-remove" onClick={() => removeFromFavorites(product.id)}>Eliminar</button>
                    </div>
                  ))}
                </div>

                <div className="panel-footer">
                  <div className="divider" />
                  <small>Has visto {favorites.length} de {favorites.length} productos</small>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
