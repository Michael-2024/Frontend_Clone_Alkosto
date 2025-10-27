import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import './Header.css';
import { HiOutlineUser, HiOutlineXMark } from "react-icons/hi2";
import { FiShoppingCart } from "react-icons/fi";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoTimeOutline } from "react-icons/io5";

const Header = ({ cartItemsCount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(UserController.isLoggedIn());
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const expandedSearchRef = useRef(null);

  const [recentSearches, setRecentSearches] = useState([
    'lavadora lg 22kg',
    'nevera samsung',
    'smart tv samsung 55'
  ]);

  // ✅ Productos vistos actualizados
  const viewedProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max 256GB',
      image: '/images/productos/iphone 15.jpg',
      rating: 4.8,
      reviews: 124,
      oldPrice: '$6,199,000',
      price: '$5,499,000'
    },
    {
      id: 6,
      name: 'Nevera Samsung Side by Side',
      image: '/images/productos/nevera.jpg',
      rating: 4.5,
      reviews: 48,
      oldPrice: '$3,899,000',
      price: '$3,299,000'
    }
  ];

  const popularSearches = [
    'lavadoras', 'celulares', 'televisores', 'tablet',
    'estufas', 'licuadoras', 'ventiladores', 'audífonos',
    'cafeteras', 'computadores'
  ];

  useEffect(() => {
    const currentUser = UserController.getCurrentUser();
    if (currentUser) {
      setIsLoggedIn(true);
      setUserName(currentUser.getFullName());
    } else {
      setIsLoggedIn(false);
      setUserName('');
    }

    const unsubscribe = UserController.addAuthListener((isAuthenticated) => {
      setIsLoggedIn(isAuthenticated);
      if (isAuthenticated) {
        const user = UserController.getCurrentUser();
        setUserName(user.getFullName());
      } else {
        setUserName('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchOverlay(false);
    }
  };

  const handleSearchClick = (term) => {
    setSearchQuery(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setShowSearchOverlay(false);
  };

  const removeRecentSearch = (index) => {
    const updated = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(updated);
  };

  useEffect(() => {
    if (showSearchOverlay) {
      setTimeout(() => expandedSearchRef.current?.focus(), 50);
    }
  }, [showSearchOverlay]);

  return (
    <>
      {/* CABEZAL PRINCIPAL */}
      <header className="header">
        <div className="header-top">
          <div className="container">
            <div className="header-top-content">
              <div className="header-links">
                <a href="/telefono">Venta: (601) 746 8001</a>
                <a href="/servicio">Servicio: (601) 407 3033</a>
                <a href="/seguimiento">Sigue tu pedido</a>
                <a href="/favoritos">Favoritos</a>
                <a href="/catalogo">Catálogo</a>
                <a href="/ayuda">Ayuda</a>
              </div>
            </div>
          </div>
        </div>

        <div className="header-main">
          <div className="container">
            <div className="header-main-content">
              <Link to="/" className="logo">
                <img src="/images/alkosto-logo-.jpg" alt="Alkosto Logo" className="logo-img" />
              </Link>

              <form
                className="search-bar"
                onSubmit={handleSearch}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="¿Qué buscas hoy?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchOverlay(true)}
                />
                <button type="submit" className="search-button">
                  <FaMagnifyingGlass className="search-icon" />
                  <span className="search-text">Buscar</span>
                </button>
              </form>

              <div className="header-actions">
                <div
                  className="header-action account-menu-container"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAccountMenu(!showAccountMenu);
                  }}
                >
                  <HiOutlineUser className="icon" />
                  <span className="account-name">
                    {isLoggedIn ? userName : 'Mi cuenta'}
                  </span>
                </div>

                <Link to="/carrito" className="header-action cart-link">
                  <FiShoppingCart className="icon" />
                  <span className="cart-text">Mi carrito</span>
                  {cartItemsCount > 0 && <span className="cart-counter">{cartItemsCount}</span>}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* OVERLAY DE BÚSQUEDA EXPANDIDA */}
      {showSearchOverlay && (
        <>
          <div
            className="search-overlay-backdrop"
            onClick={() => setShowSearchOverlay(false)}
          ></div>

          <div className="search-dropdown">
            {/* BARRA AZUL SUPERIOR */}
            <div className="search-dropdown-blue-bar">
              <div className="search-dropdown-container">
                <form
                  className="search-bar-expanded"
                  onSubmit={handleSearch}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    ref={expandedSearchRef}
                    type="text"
                    placeholder="¿Qué buscas hoy?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="search-button-expanded">
                    <FaMagnifyingGlass className="search-icon" />
                    <span className="search-text">Buscar</span>
                  </button>
                </form>
                <button
                  className="search-dropdown-close-white"
                  onClick={() => setShowSearchOverlay(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>

            {/* CONTENEDOR CENTRAL */}
            <div className="search-overlay-sections">
              <div className="search-columns-row">
                {/* COLUMNA IZQUIERDA */}
                <div className="search-column-left">
                  {/* Últimas búsquedas */}
                  <div className="search-section">
                    <h3 className="search-section-title">Últimas búsquedas</h3>
                    <div className="recent-searches-list">
                      {recentSearches.map((item, i) => (
                        <div key={i} className="recent-search-item">
                          <IoTimeOutline className="recent-search-icon" />
                          <span
                            className="recent-search-text"
                            onClick={() => handleSearchClick(item)}
                          >
                            {item}
                          </span>
                          <span
                            className="recent-search-remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRecentSearch(i);
                            }}
                          >
                            <HiOutlineXMark />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lo más buscado */}
                  <div className="search-section">
                    <h3 className="search-section-title">Lo más buscado</h3>
                    <div className="trending-list">
                      {popularSearches.map((term, i) => (
                        <div
                          key={i}
                          className="trending-item"
                          onClick={() => handleSearchClick(term)}
                        >
                          {term}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* COLUMNA DERECHA */}
                <div className="search-section half">
                  <h3 className="search-section-title">Productos vistos</h3>
                  <div className="viewed-products-list">
                    {viewedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="viewed-product-card"
                        onClick={() => navigate(`/producto/${p.id}`)} // ✅ ruta corregida
                      >
                        <img src={p.image} alt={p.name} className="viewed-product-image" />
                        <div className="viewed-product-info">
                          <p className="viewed-product-name">{p.name}</p>
                          <div className="viewed-product-rating">
                            <span className="rating-stars">⭐</span>
                            <span className="rating-value">{p.rating}</span>
                            <span className="rating-reviews">({p.reviews})</span>
                          </div>
                          <div className="viewed-product-prices">
                            <span className="old-price">{p.oldPrice}</span>
                            <span className="current-price">{p.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
