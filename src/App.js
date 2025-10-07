import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import Home from './views/Home/Home';
import ProductDetail from './views/ProductDetail/ProductDetail';
import Cart from './views/Cart/Cart';
import CartController from './controllers/CartController';
import './App.css';

function App() {
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    // Actualizar el contador del carrito al montar
    setCartItemsCount(CartController.getCartItemsCount());

    // Actualizar el contador periódicamente
    const interval = setInterval(() => {
      setCartItemsCount(CartController.getCartItemsCount());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
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
    </Router>
  );
}

export default App;
