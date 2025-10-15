import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import './Header.css';

const Header = ({ cartItemsCount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Bogotá');
  const [isLoggedIn, setIsLoggedIn] = useState(UserController.isLoggedIn());
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const navigate = useNavigate();
  const formRef = useRef(null);

  // Actualizar estado de usuario al cargar componente y escuchar cambios
  useEffect(() => {
    const currentUser = UserController.getCurrentUser();
    if (currentUser) {
      setIsLoggedIn(true);
      setUserName(currentUser.getFullName());
    } else {
      setIsLoggedIn(false);
      setUserName('');
    }
    
    // Registrar listener para cambios de autenticación
    const unsubscribe = UserController.addAuthListener((isAuthenticated) => {
      setIsLoggedIn(isAuthenticated);
      if (isAuthenticated) {
        const user = UserController.getCurrentUser();
        setUserName(user.getFullName());
      } else {
        setUserName('');
      }
    });
    
    // Limpiar listener al desmontar
    return () => unsubscribe();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Validación de email
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!email.trim()) {
      setLoginError('Ingresa tu correo electrónico');
      return;
    }
    if (!validateEmail(email)) {
      setLoginError('Por favor ingresa un correo electrónico válido');
      return;
    }
    localStorage.setItem('pendingEmail', email);
    if (UserController.isEmailRegistered(email)) {
      // Redirigir a la pantalla de opciones de login (no loguear automáticamente)
      navigate(`/login/options?email=${encodeURIComponent(email)}`);
      setShowAccountMenu(false);
      return;
    }
    // Redirigir a registro
    window.location.href = `/register?email=${encodeURIComponent(email)}`;
  };

  const handleLogout = (e) => {
    e.preventDefault();
    UserController.logout();
    setIsLoggedIn(false);
    setUserName('');
    setShowAccountMenu(false);
  };

  const cities = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga'];

  // Cerrar menús al hacer clic fuera de ellos
  useEffect(() => {
    const closeMenus = (e) => {
      // No cerrar si se hace clic en el formulario de login
      const isClickInLoginForm = e.target.closest('.login-form');
      
      if (!e.target.closest('.location-selector') && showLocationMenu) {
        setShowLocationMenu(false);
      }
      
      if (!e.target.closest('.account-menu-container') && showAccountMenu && !isClickInLoginForm) {
        setShowAccountMenu(false);
      }
    };
    
    document.addEventListener('click', closeMenus);
    return () => document.removeEventListener('click', closeMenus);
  }, [showLocationMenu, showAccountMenu]);

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="location-selector" onClick={(e) => {
              e.stopPropagation();
              setShowLocationMenu(!showLocationMenu);
            }}>
              <span className="location-icon">📍</span>
              <span className="location-text">Enviar a: <strong>{selectedCity}</strong></span>
              <span className="dropdown-arrow">▼</span>
              {showLocationMenu && (
                <div className="location-menu">
                  {cities.map(city => (
                    <div 
                      key={city} 
                      className="location-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCity(city);
                        setShowLocationMenu(false);
                      }}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="header-links">
              <a href="/telefono">Venta: (601) 746 8001</a>
              <a href="/servicio">Servicio: (601) 407 3033</a>
              <a href="/seguimiento">Sigue tu pedido</a>
              <a href="/tiendas">Nuestras tiendas</a>
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
              <h1>ALKOSTO</h1>
            </Link>

            <form className="search-bar" onSubmit={handleSearch}>
              <select className="search-category">
                <option value="all">Todas las categorías</option>
                <option value="tech">Tecnología</option>
                <option value="home">Hogar</option>
                <option value="audio">Audio y Video</option>
                <option value="gaming">Gaming</option>
              </select>
              <input
                type="text"
                placeholder="Busca tu producto aquí..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-button">
                <span className="search-icon">🔍</span>
                <span className="search-text">Buscar</span>
              </button>
            </form>

            <div className="header-actions">
              {/* Mi Cuenta con menú desplegable */}
              <div 
                className="header-action account-menu-container"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAccountMenu(!showAccountMenu);
                }}
              >
                <div className="account-trigger">
                  <span className="icon alk-icon-user">👤</span>
                  <span className="account-name">
                    {isLoggedIn ? userName : 'Mi cuenta'}
                  </span>
                </div>
                
                {showAccountMenu && (
                  <div className="account-dropdown">
                    <div className="account-dropdown-arrow"></div>
                    <div className="account-dropdown-content">
                      
                      {/* Sección de bienvenida o login */}
                      {isLoggedIn ? (
                        <div className="account-welcome">
                          <div className="welcome-text">
                            Bienvenido/a <span className="user-name">{userName}</span>
                          </div>
                          <button onClick={handleLogout} className="close-session">
                            <i className="icon">🚪</i>
                            <span>Cerrar sesión</span>
                          </button>
                        </div>
                      ) : (
                        <div className="account-login-section">
                          <div className="login-title">Ingresar o crear cuenta</div>
                          <div className="login-description">
                            Accede a tus datos personales, tus pedidos y solicita devoluciones:
                          </div>
                          <form 
                            ref={formRef}
                            className="login-form" 
                            onSubmit={handleLogin}
                          >
                            <div className="form-group">
                              <input 
                                type="email" 
                                className="form-input"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => {
                                  setEmail(e.target.value);
                                  setLoginError(''); // Limpiar error al cambiar input
                                }}
                                onClick={(e) => e.stopPropagation()}
                                required
                              />
                              {loginError && (
                                <div className="error-message" style={{color: 'red', fontSize: '12px', marginTop: '-10px', marginBottom: '10px'}}>
                                  {loginError}
                                </div>
                              )}
                            </div>
                            <button 
                              type="submit" 
                              className="btn-continue"
                              onClick={handleLogin} // Añadir handler también al botón
                            >
                              Continuar
                            </button>
                          </form>
                        </div>
                      )}

                      {/* Sección adicional con fondo gris */}
                      <div className="account-menu-section gray-section">
                        <Link to="/seguimiento" className="account-menu-item">
                          <i className="item-icon">🔍</i>
                          <div className="item-text">
                            <div className="item-title">Sigue tu pedido</div>
                            <div className="item-description">
                              Revisa el estado actual de tu pedido.
                            </div>
                          </div>
                        </Link>

                        <a 
                          href="https://descargascolcomercio.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="account-menu-item"
                        >
                          <i className="item-icon">📄</i>
                          <div className="item-text">
                            <div className="item-title">Descarga tu factura</div>
                            <div className="item-description">
                              Consulta y descarga tu factura
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mi Carrito */}
              <Link to="/carrito" className="header-action cart-link">
                <span className="icon alk-icon-cart">🛒</span>
                <span className="cart-text">Mi carrito</span>
                {cartItemsCount > 0 && (
                  <span className="cart-counter">{cartItemsCount}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
