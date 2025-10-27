// src/views/Home/Home.js
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

  const carouselSlides = [
    {
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400&h=450&fit=crop',
      title: '¡Gran Venta de Tecnología!',
      description: 'Hasta 50% de descuento en productos seleccionados',
      buttonText: 'Ver Ofertas',
    },
    {
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1400&h=450&fit=crop',
      title: 'Lo Último en Laptops',
      description: 'Potencia y rendimiento para tu trabajo',
      buttonText: 'Comprar Ahora',
    },
    {
      image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1400&h=450&fit=crop',
      title: 'Smartphones al Mejor Precio',
      description: 'Los modelos más recientes con increíbles descuentos',
      buttonText: 'Explorar',
    },
    {
      image: 'https://images.unsplash.com/photo-1558089687-518bdae3c7e8?w=1400&h=450&fit=crop',
      title: 'Audio Premium',
      description: 'Audífonos y parlantes de alta calidad',
      buttonText: 'Descubrir',
    },
  ];

  useEffect(() => {
    const allProducts = ProductController.getAllProducts() || [];

    // ✅ Asocia imágenes por nombre
    const imageMapByName = {
      'MacBook Pro 14" M3': '/images/productos/macbook.jpg',
      'PlayStation 5 + 2 Controles': '/images/productos/ps5.jpg',
      'iPhone 15 Pro Max 256GB': '/images/productos/iphone15.jpg',
      'Samsung Galaxy S24 Ultra': '/images/productos/galaxyS24.jpg',
      'Nevera Samsung Side by Side': '/images/productos/nevera.jpg',
      'Lavadora LG TurboWash 22Kg': '/images/productos/lavadora.jpg',
    };

    // 🔹 Inyectar imágenes en todos los productos que no tengan
    const allWithImages = allProducts.map((p) => ({
      ...p,
      image: p.image || imageMapByName[p.name] || '/images/placeholder.png',
    }));

    // 🔹 Productos con descuento
    const discounted =
      ProductController.getDiscountedProducts?.() ||
      allWithImages.filter((p) => p.discount > 0);

    // 🔹 Productos destacados
    const featured =
      ProductController.getFeaturedProducts?.(4) ||
      allWithImages.slice(0, 4);

    setDiscountedProducts(discounted.slice(0, 8));
    setFeaturedProducts(featured);
    setBestSellers(allWithImages.slice(0, 6));
    setRecommended(allWithImages.slice(2, 8));
  }, []);

  const handleAddToCart = (product) => {
    CartController.addToCart(product, 1);
    alert(`${product.name} agregado al carrito`);
  };

  return (
    <div className="home">
      <div className="hero-section">
        <Carousel slides={carouselSlides} />
        <CategorySection />
      </div>

      <div className="container">
        {/* 🔸 OFERTAS DEL DÍA */}
        <section className="daily-offers-section">
          <div className="section-header-special">
            <h2 className="section-title">⚡ Ofertas del Día</h2>
            <div className="countdown">
              <span className="countdown-label">Termina en:</span>
              <span className="countdown-time">12:34:56</span>
            </div>
          </div>

          {discountedProducts.length > 0 ? (
            <ProductGrid products={discountedProducts} onAddToCart={handleAddToCart} />
          ) : (
            <p className="no-products-text">No hay productos en oferta actualmente.</p>
          )}
        </section>

        {/* 🔸 DESTACADOS */}
        <section className="featured-section">
          <h2 className="section-title">🌟 Productos Destacados</h2>
          <ProductGrid products={featuredProducts} onAddToCart={handleAddToCart} />
        </section>

        {/* 🔸 PROMO */}
        <section className="promo-banner">
          <div className="promo-content">
            <h3>🎁 Envío Gratis en Compras Mayores a $150,000</h3>
            <p>Aprovecha esta promoción por tiempo limitado</p>
          </div>
        </section>

        {/* 🔸 MÁS VENDIDOS */}
        <section className="bestsellers-section">
          <h2 className="section-title">🏆 Lo Más Vendido</h2>
          <ProductGrid products={bestSellers} onAddToCart={handleAddToCart} />
        </section>

        {/* 🔸 RECOMENDADOS */}
        <section className="recommended-section">
          <h2 className="section-title">💡 Recomendados Para Ti</h2>
          <ProductGrid products={recommended} onAddToCart={handleAddToCart} />
        </section>

        {/* 🔸 CATEGORÍAS */}
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
