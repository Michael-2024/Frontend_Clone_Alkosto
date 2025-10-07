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

  // Datos del carrusel
  const carouselSlides = [
    {
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400&h=450&fit=crop',
      title: '¡Gran Venta de Tecnología!',
      description: 'Hasta 50% de descuento en productos seleccionados',
      buttonText: 'Ver Ofertas'
    },
    {
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1400&h=450&fit=crop',
      title: 'Lo Último en Laptops',
      description: 'Potencia y rendimiento para tu trabajo',
      buttonText: 'Comprar Ahora'
    },
    {
      image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1400&h=450&fit=crop',
      title: 'Smartphones al Mejor Precio',
      description: 'Los modelos más recientes con increíbles descuentos',
      buttonText: 'Explorar'
    },
    {
      image: 'https://images.unsplash.com/photo-1558089687-518bdae3c7e8?w=1400&h=450&fit=crop',
      title: 'Audio Premium',
      description: 'Audífonos y parlantes de alta calidad',
      buttonText: 'Descubrir'
    }
  ];

  useEffect(() => {
    // Cargar productos destacados y con descuento
    const allProducts = ProductController.getAllProducts();
    setFeaturedProducts(ProductController.getFeaturedProducts(4));
    setDiscountedProducts(ProductController.getDiscountedProducts().slice(0, 8));
    setBestSellers(allProducts.slice(0, 6));
    setRecommended(allProducts.slice(2, 8));
  }, []);

  const handleAddToCart = (product) => {
    CartController.addToCart(product, 1);
    alert(`${product.name} agregado al carrito`);
  };

  return (
    <div className="home">
      <Carousel slides={carouselSlides} />
      
      <CategorySection />
      
      <div className="container">
        {/* Ofertas del día con temporizador */}
        <section className="daily-offers-section">
          <div className="section-header-special">
            <h2 className="section-title">⚡ Ofertas del Día</h2>
            <div className="countdown">
              <span className="countdown-label">Termina en:</span>
              <span className="countdown-time">12:34:56</span>
            </div>
          </div>
          <ProductGrid 
            products={discountedProducts} 
            onAddToCart={handleAddToCart}
          />
        </section>

        {/* Productos destacados */}
        <section className="featured-section">
          <h2 className="section-title">🌟 Productos Destacados</h2>
          <ProductGrid 
            products={featuredProducts} 
            onAddToCart={handleAddToCart}
          />
        </section>

        {/* Banner promocional intermedio */}
        <section className="promo-banner">
          <div className="promo-content">
            <h3>🎁 Envío Gratis en Compras Mayores a $150,000</h3>
            <p>Aprovecha esta promoción por tiempo limitado</p>
          </div>
        </section>

        {/* Lo más vendido */}
        <section className="bestsellers-section">
          <h2 className="section-title">🏆 Lo Más Vendido</h2>
          <ProductGrid 
            products={bestSellers} 
            onAddToCart={handleAddToCart}
          />
        </section>

        {/* Recomendados para ti */}
        <section className="recommended-section">
          <h2 className="section-title">💡 Recomendados Para Ti</h2>
          <ProductGrid 
            products={recommended} 
            onAddToCart={handleAddToCart}
          />
        </section>

        <section className="categories-banner">
          <div className="category-item">
            <div className="category-icon">💻</div>
            <h3>Tecnología</h3>
            <p>Lo último en gadgets</p>
          </div>
          <div className="category-item">
            <div className="category-icon">🏠</div>
            <h3>Hogar</h3>
            <p>Electrodomésticos</p>
          </div>
          <div className="category-item">
            <div className="category-icon">📺</div>
            <h3>Entretenimiento</h3>
            <p>TV y Audio</p>
          </div>
          <div className="category-item">
            <div className="category-icon">🎮</div>
            <h3>Gaming</h3>
            <p>Consolas y juegos</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
