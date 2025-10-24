import React, { useState, useEffect } from 'react';
import Carousel from '../../components/Carousel/Carousel';
import CategorySection from '../../components/CategorySection/CategorySection';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import ProductController from '../../controllers/ProductController';
import CartController from '../../controllers/CartController';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  // Datos del carrusel principal
  const carouselSlides = [
    {
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&h=500&fit=crop',
      title: '¡Hiperofertas en Tecnología!',
      description: 'Hasta 50% de descuento en laptops, celulares y más',
      buttonText: 'Ver todas las ofertas'
    },
    {
      image: 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=1400&h=500&fit=crop',
      title: 'Electrodomésticos con Super Descuentos',
      description: 'Renueva tu hogar con los mejores precios del año',
      buttonText: 'Comprar ahora'
    },
    {
      image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1400&h=500&fit=crop',
      title: 'Lo Último en Smartphones',
      description: 'Las mejores marcas con envío gratis',
      buttonText: 'Explorar'
    },
    {
      image: 'https://images.unsplash.com/photo-1558089687-518bdae3c7e8?w=1400&h=500&fit=crop',
      title: 'Audio y Video Premium',
      description: 'Mejora tu experiencia de entretenimiento',
      buttonText: 'Ver productos'
    }
  ];

  useEffect(() => {
    const allProducts = ProductController.getAllProducts();
    setFeaturedProducts(ProductController.getFeaturedProducts(4));
    setDiscountedProducts(ProductController.getDiscountedProducts().slice(0, 8));
    setBestSellers(allProducts.slice(0, 6));
    setRecommended(allProducts.slice(2, 8));
    setNewArrivals(allProducts.slice(4, 10));
  }, []);

  const handleAddToCart = (product) => {
    CartController.addToCart(product, 1);
    alert(`${product.name} agregado al carrito`);
  };

  return (
    <div className="home">
      {/* Banner superior promocional */}
      <div className="top-banner">
        <div className="container">
          <p>🔥 <strong>Cyber Days:</strong> Descuentos de hasta 60% en tecnología | 
          🚚 <strong>Envío gratis</strong> en compras superiores a $150.000 | 
          💳 Hasta <strong>24 cuotas</strong> sin intereses</p>
        </div>
      </div>

      {/* Carrusel hero */}
      <Carousel slides={carouselSlides} />
      
      {/* Sección de categorías principales */}
      <CategorySection />
      
      <div className="container">
        {/* Banners promocionales duales */}
        <section className="dual-banners">
          <div className="promo-card promo-tech">
            <div className="promo-card-content">
              <span className="promo-badge">HOY</span>
              <h3>Tecnología al mejor precio</h3>
              <p>Hasta 40% OFF en laptops y tablets</p>
              <button className="promo-btn">Ver ofertas</button>
            </div>
          </div>
          <div className="promo-card promo-home">
            <div className="promo-card-content">
              <span className="promo-badge">NUEVO</span>
              <h3>Renueva tu hogar</h3>
              <p>Electrodomésticos con descuentos increíbles</p>
              <button className="promo-btn">Comprar ahora</button>
            </div>
          </div>
        </section>

        {/* Ofertas del día con temporizador */}
        <section className="daily-offers-section">
          <div className="section-header-special">
            <div className="section-title-group">
              <h2 className="section-title">⚡ Ofertas del Día</h2>
              <p className="section-subtitle">¡Aprovecha estos descuentos antes de que se acaben!</p>
            </div>
            <div className="countdown">
              <span className="countdown-label">Termina en:</span>
              <div className="countdown-time">
                <div className="time-block">
                  <span className="time-value">12</span>
                  <span className="time-label">h</span>
                </div>
                <span className="time-separator">:</span>
                <div className="time-block">
                  <span className="time-value">34</span>
                  <span className="time-label">m</span>
                </div>
                <span className="time-separator">:</span>
                <div className="time-block">
                  <span className="time-value">56</span>
                  <span className="time-label">s</span>
                </div>
              </div>
            </div>
          </div>
          <ProductGrid 
            products={discountedProducts} 
            onAddToCart={handleAddToCart}
          />
        </section>

        {/* Banner full width intermedio */}
        <section className="full-banner">
          <div className="full-banner-content">
            <div className="banner-text">
              <span className="banner-tag">EXCLUSIVO ONLINE</span>
              <h2>🎁 Envío Gratis en Compras Mayores a $150,000</h2>
              <p>Válido para productos seleccionados en todo Colombia</p>
              <button className="banner-cta">Ver productos con envío gratis</button>
            </div>
          </div>
        </section>

        {/* Lo más vendido */}
        <section className="bestsellers-section">
          <div className="section-header">
            <h2 className="section-title">� Lo Más Vendido</h2>
            <a href="/mas-vendidos" className="see-all">Ver todos →</a>
          </div>
          <ProductGrid 
            products={bestSellers} 
            onAddToCart={handleAddToCart}
          />
        </section>

        {/* Banner triple categorías */}
        <section className="triple-banner">
          <div className="category-promo cat-gaming">
            <div className="cat-content">
              <div className="cat-icon">🎮</div>
              <h3>Gaming Zone</h3>
              <p>Consolas y accesorios</p>
              <span className="discount-tag">Hasta 35% OFF</span>
            </div>
          </div>
          <div className="category-promo cat-smart">
            <div className="cat-content">
              <div className="cat-icon">📱</div>
              <h3>Smartphones</h3>
              <p>Los últimos modelos</p>
              <span className="discount-tag">Desde $399.000</span>
            </div>
          </div>
          <div className="category-promo cat-audio">
            <div className="cat-content">
              <div className="cat-icon">🎧</div>
              <h3>Audio Premium</h3>
              <p>Audífonos y parlantes</p>
              <span className="discount-tag">2x1 en marcas</span>
            </div>
          </div>
        </section>

        {/* Novedades */}
        <section className="new-arrivals-section">
          <div className="section-header">
            <h2 className="section-title">✨ Novedades</h2>
            <a href="/novedades" className="see-all">Ver todas →</a>
          </div>
          <ProductGrid 
            products={newArrivals} 
            onAddToCart={handleAddToCart}
          />
        </section>

        {/* Productos destacados */}
        <section className="featured-section">
          <div className="section-header">
            <h2 className="section-title">� Productos Destacados</h2>
            <a href="/destacados" className="see-all">Ver todos →</a>
          </div>
          <ProductGrid 
            products={featuredProducts} 
            onAddToCart={handleAddToCart}
          />
        </section>

        {/* Recomendados para ti */}
        <section className="recommended-section">
          <div className="section-header">
            <h2 className="section-title">💡 Recomendados Para Ti</h2>
            <a href="/recomendados" className="see-all">Ver todos →</a>
          </div>
          <ProductGrid 
            products={recommended} 
            onAddToCart={handleAddToCart}
          />
        </section>

        {/* Sección de beneficios */}
        <section className="benefits-section">
          <div className="benefit-card">
            <div className="benefit-icon">�</div>
            <h3>Envío Gratis</h3>
            <p>En compras superiores a $150.000</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💳</div>
            <h3>Paga en Cuotas</h3>
            <p>Hasta 24 meses sin intereses</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">�</div>
            <h3>Compra Segura</h3>
            <p>Protección en todas tus compras</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⭐</div>
            <h3>Garantía Oficial</h3>
            <p>En todos nuestros productos</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
