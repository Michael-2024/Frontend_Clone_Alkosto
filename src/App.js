import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SkipLink from './components/SkipLink/SkipLink';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import LiveChat from './components/LiveChat/LiveChat';
import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import Home from './views/Home/Home';
import Register from './views/Register/Register';
import RegisterPassword from './views/Register/RegisterPassword';
import ProductDetail from './views/ProductDetail/ProductDetail';
import Cart from './views/Cart/Cart';
import Checkout from './views/Checkout/Checkout';
import CartController from './controllers/CartController';
import LoginOptions from './views/Login/LoginOptions';
import LoginPassword from './views/Login/LoginPassword';
import LoginCode from './views/Login/LoginCode';
import ForgotPassword from './views/ForgotPassword/ForgotPassword';
import ForgotPasswordVerify from './views/ForgotPassword/ForgotPasswordVerify';
import ForgotPasswordReset from './views/ForgotPassword/ForgotPasswordReset';
import Verification from './views/Verification/Verification';
import SearchResults from './views/Search/SearchResults';
import Profile from './views/Profile/Profile';
import Account from './views/Account/Account';
import AccountProfile from './views/Account/AccountProfile';
import Addresses from './views/Account/Addresses';
import Orders from './views/Account/Orders';
import PaymentMethods from './views/Account/PaymentMethods';
import Tracking from './views/Tracking/Tracking';
import AccountFavorites from './views/Account/Favorites';
import Invoice from './views/Account/Invoice';
import Notifications from './views/Account/Notifications';
import Coupons from './views/Account/Coupons';
import Category from './views/Category/Category';
import PQRSForm from './views/PQRS/PQRSForm';
import PQRSList from './views/PQRS/PQRSList';
import PQRSDetail from './views/PQRS/PQRSDetail';
import PQRSTracking from './views/PQRS/PQRSTracking';
import ReturnRequest from './views/Returns/ReturnRequest';
import ReturnsList from './views/Returns/ReturnsList';
import ReturnDetail from './views/Returns/ReturnDetail';
import Test from './Test';
import './App.css';

function App() {
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    // Inicial cargar conteo y suscribirse a cambios para evitar polling cada 1s
    const updateCartCount = () => setCartItemsCount(CartController.getCartItemsCount());
    updateCartCount();

    const unsubscribe = CartController.addChangeListener(() => {
      updateCartCount();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <LiveChat />
      <Routes>
        {/* Rutas de registro y login con layout especial */}
        <Route path="/register" element={<Register />} />
        <Route path="/register/password" element={<RegisterPassword />} />
        <Route path="/login/options" element={<LoginOptions />} />
        <Route path="/login/password" element={<LoginPassword />} />
        <Route path="/login/code" element={<LoginCode />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/verify" element={<ForgotPasswordVerify />} />
        <Route path="/forgot-password/reset" element={<ForgotPasswordReset />} />
        <Route path="/verify" element={<Verification />} />
        {/* Ruta de prueba */}
        <Route path="/test" element={<Test />} />
        {/* Resto de rutas con layout normal */}
        <Route path="*" element={
          <div className="app">
            <SkipLink />
            <Header cartItemsCount={cartItemsCount} />
            <Navigation />
            <main id="main" className="main-content" role="main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/producto/:id" element={<ProductDetail />} />
                <Route path="/carrito" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/perfil/mi-cuenta" element={<Account />} />
                <Route path="/perfil/datos" element={<AccountProfile />} />
                <Route path="/perfil/direcciones" element={<Addresses />} />
                <Route path="/perfil/pedidos" element={<Orders />} />
                <Route path="/perfil/devoluciones" element={<ReturnsList />} />
                <Route path="/perfil/devoluciones/nueva" element={<ReturnRequest />} />
                <Route path="/perfil/devoluciones/:returnId" element={<ReturnDetail />} />
                <Route path="/perfil/pagos" element={<PaymentMethods />} />
                <Route path="/perfil/favoritos" element={<AccountFavorites />} />
                <Route path="/perfil/notificaciones" element={<Notifications />} />
                <Route path="/perfil/cupones" element={<Coupons />} />
                <Route path="/perfil/factura" element={<Invoice />} />
                <Route path="/perfil/pqrs" element={<PQRSList />} />
                <Route path="/perfil/pqrs/nuevo" element={<PQRSForm />} />
                <Route path="/perfil/pqrs/:ticketNumber" element={<PQRSDetail />} />
                <Route path="/pqrs/seguimiento" element={<PQRSTracking />} />
                <Route path="/seguimiento" element={<Tracking />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/categoria/:categoria" element={<Category />} />
                <Route path="/ofertas" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
