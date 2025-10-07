import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ cartItemsCount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Bogotá');
  const [isLoggedIn] = useState(false); // Simular estado de login
  const [userName] = useState(''); // Nombre del usuario cuando esté logueado

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const cities = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga'];

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="location-selector" onClick={() => setShowLocationMenu(!showLocationMenu)}>
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
              {/* Mi Cuenta con menú desplegable tipo Alkosto */}
              <div 
                className="header-action account-menu-container"
                onClick={() => setShowAccountMenu(!showAccountMenu)}
              >
                <div className="account-trigger">
                  <span className="icon alk-icon-user">👤</span>
                  <span className="account-name">
                    {isLoggedIn && userName ? userName : 'Mi cuenta'}
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
                          <Link to="/logout" className="close-session">
                            <i className="icon">🚪</i>
                            <span>Cerrar sesión</span>
                          </Link>
                        </div>
                      ) : (
                        <div className="account-login-section">
                          <div className="login-title">Ingresar o crear cuenta</div>
                          <div className="login-description">
                            Accede a tus datos personales, tus pedidos y solicita devoluciones:
                          </div>
                          <form className="login-form">
                            <div className="form-group">
                              <input 
                                type="email" 
                                className="form-input"
                                placeholder="Correo electrónico"
                                required
                              />
                            </div>
                            <button type="submit" className="btn-continue">
                              Continuar
                            </button>
                          </form>
                        </div>
                      )}

                      

                      {/* Sección adicional con fondo gris */}
                      <div className="account-menu-section gray-section">
                        <Link to="/sigue-tu-pedido" className="account-menu-item">
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
                          <i className="item-icon">�</i>
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
