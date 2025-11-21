import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import './Header.css';

// Iconos
import { HiOutlineUser, HiOutlineXMark } from "react-icons/hi2";
import { TbLogout } from "react-icons/tb"; // icono logout cerrar sesión

import { HiOutlineUserCircle } from "react-icons/hi2";// usuario redondo

import { CiUser } from "react-icons/ci";  // carrito
import { RxMagnifyingGlass } from "react-icons/rx"; // lupa
import { LiaShoppingCartSolid } from "react-icons/lia";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoTimeOutline } from "react-icons/io5";
import { SlSocialDropbox } from "react-icons/sl"; //  segui tu pedido
import { IoReceiptOutline } from "react-icons/io5"; // icono Descargar factura

import { AiOutlineHome } from "react-icons/ai"; // icono home Mi cuenta
import { MdOutlinePayments } from "react-icons/md"; // metodos de pagos
import { GrMapLocation } from "react-icons/gr"; // Dirrecion de envio - ubicacion
import { FaRegHeart } from "react-icons/fa"; //  corazon favoritos

const Header = ({ cartItemsCount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(UserController.isLoggedIn());
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const navigate = useNavigate();
  const formRef = useRef(null);
  const searchInputRef = useRef(null);
  const expandedSearchRef = useRef(null);

  // ✅ Cargar búsquedas reales desde localStorage
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Productos vistos realmente por el usuario
  const [viewedProducts, setViewedProducts] = useState(() => {
    const saved = localStorage.getItem('viewedProducts');
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Ultima busqueda 
  const popularSearches = [
    'lavadoras', 'celulares', 'televisores', 'tablet',
    'estufas', 'licuadoras', 'ventiladores', 'audífonos',
    'cafeteras', 'computadores'
  ]; 

  // Funciones para manejar búsquedas
  const handleSearchClick = (searchTerm) => {
    if (searchInputRef.current) {
      searchInputRef.current.value = searchTerm;
      setSearchQuery(searchTerm);
    }
    if (expandedSearchRef.current) {
      expandedSearchRef.current.value = searchTerm;
    }
    // Ejecutar búsqueda inmediatamente
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    setShowSearchOverlay(false);
  };

  const removeRecentSearch = (index, event) => {
    if (event) {
      event.stopPropagation();
    }
    setRecentSearches(prev => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  // Escuchar cambios en productos vistos
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'viewedProducts') {
        const updated = e.newValue ? JSON.parse(e.newValue) : [];
        setViewedProducts(updated);
      }
    };
    
    const handleViewedProductsChanged = () => {
      const saved = localStorage.getItem('viewedProducts');
      const updated = saved ? JSON.parse(saved) : [];
      setViewedProducts(updated);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('viewedProductsChanged', handleViewedProductsChanged);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('viewedProductsChanged', handleViewedProductsChanged);
    };
  }, []);

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
      // Guardar búsqueda en localStorage
      const newSearch = searchQuery.trim();
      const saved = localStorage.getItem('recentSearches');
      let searches = saved ? JSON.parse(saved) : [];
      
      // Eliminar si ya existe (para moverlo al inicio)
      searches = searches.filter(s => s.toLowerCase() !== newSearch.toLowerCase());
      
      // Agregar al inicio
      searches.unshift(newSearch);
      
      // Mantener solo las últimas 5 búsquedas
      searches = searches.slice(0, 5);
      
      localStorage.setItem('recentSearches', JSON.stringify(searches));
      setRecentSearches(searches);
      
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchOverlay(false);
    }
  };

  // Validación de email
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async (e) => {
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
    const isRegistered = await UserController.isEmailRegistered(email);
    if (isRegistered) {
      // Redirigir a la pantalla de opciones de login (no loguear automáticamente)
      navigate(`/login/options?email=${encodeURIComponent(email)}`);
      setShowAccountMenu(false);
      return;
    }
    // Redirigir a registro
    window.location.href = `/register?email=${encodeURIComponent(email)}`;
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await UserController.logout();
    } finally {
      setIsLoggedIn(false);
      setUserName('');
      setShowAccountMenu(false);
      setShowSearchOverlay(false);
      setShowLocationMenu(false);
      navigate('/');
    }
  };

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
    <>
      <header className="header">
        <div className="header-top">
          <div className="container">
            <div className="header-top-content">
              
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
              <img src="/assets/logo-alkosto.svg" alt="Alkosto" className="logo-img" />
              </Link>

              <form 
                className="search-bar" 
                onSubmit={handleSearch}>
                
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="¿Que buscas hoy ?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchOverlay(true)}
                />
                <button type="submit" className="search-button">
                  <RxMagnifyingGlass className="search-icon" />
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
                    <span className="icon alk-icon-user">
                      <HiOutlineUserCircle size={32} color="#ffffffff" />
                    </span>
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
                            <div className="welcome-header">
                              <div className="welcome-text">
                                Bienvenido    <span className="user-name">{userName}</span>
                              </div>
                              <button onClick={handleLogout} className="close-session-link">
                                <TbLogout size={40} style={{marginRight: '6px'}} color='#ff9a27ff' />
                                Cerrar sesión
                              </button>
                            </div>
                            
                            {/* Opciones del menú de usuario */}
                            <div className="account-menu-list">
                              <Link to="/perfil/mi-cuenta" className="account-menu-item" onClick={() => setShowAccountMenu(false)}>
                                <i className="item-icon">
                                  <AiOutlineHome size={30} color='#ff9a27ff' /></i>
                                <div className="item-text">
                                  <div className="item-title">Mi cuenta</div>
                                  <div className="item-description">Aquí podrás consultar todos tus movimientos</div>
                                </div>
                              </Link>

                              <Link
                              // User  Mi Cuenta 
                                to="/perfil/datos"
                                className="account-menu-item"
                                onClick={() => setShowAccountMenu(false)}
                              >
                                <div className="item-icon" aria-hidden>
                                  < HiOutlineUserCircle size={32} color="#ff9a27ff" />
                                </div>
                                <div className="item-text">
                                  <div className="item-title">Mi Perfil</div>
                                  <div className="item-description">
                                    Revisa y edita tus datos personales
                                  </div>
                                </div>
                              </Link>

                              <Link to="/perfil/pedidos" className="account-menu-item" onClick={() => setShowAccountMenu(false)}>
                                <i className="item-icon">
                                  < SlSocialDropbox size={30} color="#ff9a27ff" /></i>
                                <div className="item-text">
                                  <div className="item-title">Mis Pedidos</div>
                                  <div className="item-description">Gestiona tus pedidos, devoluciones y fechas de entrega</div>
                                </div>
                              </Link>

                              <Link to="/perfil/pagos" className="account-menu-item" onClick={() => setShowAccountMenu(false)}>
                                <i className="item-icon">
                                  < MdOutlinePayments size={30} color="#ff9a27ff" /> </i>
                                <div className="item-text">
                                  <div className="item-title">Métodos de Pago</div>
                                  <div className="item-description">Agrega y valida tus métodos de pago</div>
                                </div>
                              </Link>

                              <Link to="/perfil/direcciones" className="account-menu-item" onClick={() => setShowAccountMenu(false)}>
                                <i className="item-icon">
                                  <GrMapLocation size={28} color="#ff9a27ff" />
                                </i>
                                <div className="item-text">
                                  <div className="item-title">Direcciones de envío</div>
                                  <div className="item-description">Agrega, edita y/o elimina una dirección</div>
                                </div>
                              </Link>

                                <Link to="/perfil/favoritos" className="account-menu-item" onClick={() => setShowAccountMenu(false)}>
                                <i className="item-icon">
                                  <FaRegHeart size={30} color="#ff9a27ff" />
                                </i>
                                <div className="item-text">
                                  <div className="item-title">Mi lista de Favoritos</div>
                                  <div className="item-description">Guarda y revisa tus productos</div>
                                </div>
                              </Link>
                            </div>
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
                            <i className="item-icon">
                              < SlSocialDropbox  size={32} color="#ffa600ff" />
                            </i>
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
                            <i className="item-icon">
                              <IoReceiptOutline   size={32} color="#ffa600ff" />
                            </i>
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
                  <span className="icon alk-icon-cart">
                    <LiaShoppingCartSolid size={36} />
                  </span>
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
                            onClick={(e) => removeRecentSearch(i, e)}
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
                    {viewedProducts.length === 0 ? (
                      <p className="no-viewed-products">No has visto productos aún</p>
                    ) : (
                      viewedProducts.slice(0, 2).map((p) => (
                      <div
                        key={p.id}
                        className="viewed-product-card"
                        onClick={() => {
                          // Cerrar overlay de búsqueda antes de navegar
                          setShowSearchOverlay(false);
                          navigate(`/producto/${p.id}`);
                        }}
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
                      ))
                    )}
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