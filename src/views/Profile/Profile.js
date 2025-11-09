import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import ProductController from '../../controllers/ProductController';
import CartController from '../../controllers/CartController';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Profile.css';

// iconos
import { CiUser } from "react-icons/ci"; // usuario


const Profile = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(UserController.getCurrentUser());

  // Si no hay sesión, redirigir a login de opciones como Alkosto
  useEffect(() => {
    if (!UserController.isLoggedIn()) {
      const email = localStorage.getItem('pendingEmail') || '';
      navigate(`/login/options${email ? `?email=${encodeURIComponent(email)}` : ''}`);
    }
  }, [navigate]);

  // Cargar favoritos del usuario
  useEffect(() => {
    if (!user) return;
    try {
      const raw = localStorage.getItem(`alkosto_favorites_${user.id}`) || '[]';
      const ids = JSON.parse(raw);
      const products = ids
        .map((id) => ProductController.getProductById(id))
        .filter(Boolean);
      setFavorites(products);
    } catch (e) {
      console.warn('No se pudieron cargar favoritos', e);
    }
  }, [user]);

  // Añadir al carrito desde la grilla
  const handleAddToCart = (product) => {
    CartController.addToCart(product, 1);
    alert(`${product.name} agregado al carrito`);
  };

  // Quitar de favoritos
  const removeFromFavorites = (productId) => {
    if (!user) return;
    const key = `alkosto_favorites_${user.id}`;
    const ids = JSON.parse(localStorage.getItem(key) || '[]');
    const next = ids.filter((id) => id !== productId);
    localStorage.setItem(key, JSON.stringify(next));
    setFavorites((prev) => prev.filter((p) => p.id !== productId));
  };

  const favoriteCount = favorites.length;

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-info">
            {/* icono usuario */}
            <CiUser size={52} color="#ff7300ff" /> 
            <div>
              <h2 className="profile-name">{user.getFullName()}</h2>
              <div className="profile-email">{user.email}</div>
            </div>
          </div>
          <div className="profile-actions">
            <Link to="/" className="btn-link">Volver al inicio</Link>
          </div>
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h3>Mis favoritos</h3>
            <span className="pill">{favoriteCount}</span>
          </div>

          {favoriteCount === 0 ? (
            <div className="empty-state">
              <div className="empty-emoji" aria-hidden>❤</div>
              <h4>No tienes productos favoritos aún</h4>
              <p>Explora nuestras categorías y guarda los productos que te gusten.</p>
              <Link to="/" className="btn-primary">Ir a comprar</Link>
            </div>
          ) : (
            <div className="favorites-grid">
              {favorites.map((product) => (
                <div key={product.id} className="favorite-card">
                  <ProductCard product={product} onAddToCart={handleAddToCart} />
                  <button className="btn-remove" onClick={() => removeFromFavorites(product.id)}>Quitar de favoritos</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
