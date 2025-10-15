import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        {/* Resto de rutas con layout normal */}
        <Route path="*" element={
          <div className="app">
            <Header cartItemsCount={cartItemsCount} />
            <Navigation />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/producto/:id" element={<ProductDetail />} />
                <Route path="/carrito" element={<Cart />} />
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
