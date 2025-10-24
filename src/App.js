import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SkipLink from './components/SkipLink/SkipLink';
import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import Home from './views/Home/Home';
import Register from './views/Register/Register';
import RegisterPassword from './views/Register/RegisterPassword';
import ProductDetail from './views/ProductDetail/ProductDetail';
import Cart from './views/Cart/Cart';
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
import './App.css';

function App() {
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(CartController.getCartItemsCount());

    const interval = setInterval(() => {
      setCartItemsCount(CartController.getCartItemsCount());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
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
                <Route path="/perfil" element={<Profile />} />
                <Route path="/categoria/:categoria" element={<Home />} />
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
