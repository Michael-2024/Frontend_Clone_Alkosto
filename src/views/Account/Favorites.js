import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import ProductController from '../../controllers/ProductController';
import CartController from '../../controllers/CartController';
import CartDrawer from '../../components/CartDrawer/CartDrawer';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Account.css';
import AccountSidebar from './AccountSidebar';

const Favorites = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(UserController.getCurrentUser());
  const [favorites, setFavorites] = useState([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    if (!UserController.isLoggedIn()) {
      const email = localStorage.getItem('pendingEmail') || '';
      navigate(`/login/options${email ? `?email=${encodeURIComponent(email)}` : ''}`);
    }
  }, [navigate]);

  useEffect(() => {
    const loadFavorites = async () => {
      const u = UserController.getCurrentUser();
      setUser(u);
      if (!u) return;
      try {
        const ids = JSON.parse(localStorage.getItem(`alkosto_favorites_${u.id}`) || '[]');
        const productsPromises = ids.map((id) => ProductController.getProductById(id));
        const products = await Promise.all(productsPromises);
        setFavorites(products.filter(Boolean));
      } catch (_) {
        setFavorites([]);
      }
    };
    loadFavorites();
  }, []);

  if (!user) return null;

  const handleAddToCart = async (product) => {
    try {
      await CartController.addToCart(product, 1);
      const cart = await CartController.getCart();
      setAddedProduct(product);
      setCartItems(cart.items);
      setCartTotal(cart.getTotal());
      setShowCartDrawer(true);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
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
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar TODOS tus favoritos? Esta acción no se puede deshacer.');
    if (!confirmed) return;
    const key = `alkosto_favorites_${user.id}`;
    localStorage.setItem(key, '[]');
    setFavorites([]);
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) {}
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
      <CartDrawer
        isOpen={showCartDrawer}
        onClose={() => setShowCartDrawer(false)}
        addedProduct={addedProduct}
        cartItems={cartItems}
        cartTotal={cartTotal}
      />
    </div>
  );
};

export default Favorites;
