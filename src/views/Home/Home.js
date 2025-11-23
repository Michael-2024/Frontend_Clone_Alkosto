// src/views/Home/Home.js
import React, { useState, useEffect } from 'react';
import { getActiveTemplate } from '../../config/homeTemplates';
import Carousel from '../../components/Carousel/Carousel';
import BlackDaysBanner from '../../components/BlackDaysBanner/BlackDaysBanner';
import CategorySection from '../../components/CategorySection/CategorySection';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import productController from '../../controllers/ProductController';
import CartController from '../../controllers/CartController';
import CartDrawer from '../../components/CartDrawer/CartDrawer';
import './Home.css';

const Home = () => {
  const activeTemplate = getActiveTemplate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Logs para debug
  console.log('🎨 Plantilla activa:', activeTemplate.name);
  console.log('📐 Configuración:', activeTemplate.layout);
  console.log('📦 Mostrar carrusel:', activeTemplate.layout.showCarousel);
  console.log('🎯 Mostrar banner:', activeTemplate.layout.showBanner);

  useEffect(() => {
    // Cargar productos desde backend
    const load = async () => {
      try {
        const [destacados, ofertas, all] = await Promise.all([
          productController.destacados(),
          productController.ofertas(),
          productController.list()
        ]);
        setFeaturedProducts(destacados.slice(0, 4));
        setDiscountedProducts(ofertas.slice(0, 8));
        setBestSellers(all.slice(0, 6));
        setRecommended(all.slice(2, 8));
        setNewArrivals(all.slice(4, 10));
      } catch (err) {
        console.error('Error cargando productos:', err);
      }
    };
    load();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await CartController.addToCart(product, 1);
      const cart = await CartController.getCart();
      setAddedProduct(product);
      setCartItems(cart.items);
      setCartTotal(cart.getTotal());
      setShowCartDrawer(true);
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
    }
  };

  // Si la plantilla activa es Black Days, agrega clase 'blackdays-bg' al contenedor
  const homeClass = `home${activeTemplate.id === 'plant_blackdays' ? ' blackdays-bg' : ''}`;
  return (
    <div className={homeClass}>
      {/* 🔹 Renderizado Condicional según Plantilla Activa */}
      
      {/* Plantilla General: Carrusel + Categorías lado a lado */}
      {activeTemplate.layout.showCarousel && (
        <div className="hero-section">
          <Carousel slides={activeTemplate.carousel.slides} />
          <CategorySection />
        </div>
      )}
      
      {/* Plantilla Black Days: Banner + Categorías debajo */}
      {activeTemplate.layout.showBanner && (
        <>
          <BlackDaysBanner />
          <div className="home-categories-section">
            <CategorySection />
          </div>
        </>
      )}

      <div className="container">
        {/* 🔸 Ofertas del día */}
        <section className="daily-offers-section">
          <div className="section-header-special">
            <h2 className="section-title">⚡ Ofertas del Día</h2>
          </div>
          <ProductGrid
            products={discountedProducts}
            onAddToCart={handleAddToCart}
          />
        </section>

        {/* 🔸 Productos destacados */}
        <section className="featured-section">
          <h2 className="section-title">🌟 Productos Destacados</h2>
          <ProductGrid
            products={featuredProducts}
            onAddToCart={handleAddToCart}
          />
        </section>

        {/* 🔸 Banner de promoción */}
        <section className="promo-banner">
          <div className="promo-content">
            <h3>🎁 Envío Gratis en Compras Mayores a $150,000</h3>
            <p>Aprovecha esta promoción por tiempo limitado</p>
          </div>
        </section>

        {/* 🔸 Más vendidos */}
        <section className="bestsellers-section">
          <h2 className="section-title">🏆 Lo Más Vendido</h2>
          <ProductGrid
            products={bestSellers}
            onAddToCart={handleAddToCart}
          />
        </section>

        {/* 🔸 Recomendados */}
        <section className="recommended-section">
          <h2 className="section-title">💡 Recomendados Para Ti</h2>
          <ProductGrid
            products={recommended}
            onAddToCart={handleAddToCart}
          />
        </section>

        {/* 🔸 Categorías finales */}
        <section className="categories-banner">
          <div className="category-item">
            <div className="category-icon">
              <img 
                src="https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/setup-gmar/portatiles-gaming-2.webp" 
                alt="Categoría videojuegos" 
                className="category-image" 
              />
              
            </div>
            <h3>Tecnología</h3>
            <p>Lo último en gadgets</p>
          </div>
          <div className="category-item">
            <div className="category-icon">
              <img 
                src="https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/agosto-alkosto/home/assets/c-electrohogar.webp" 
                alt="Categoría videojuegos" 
                className="category-image" 
              />
            </div>
            <h3>Hogar</h3>
            <p>Electrodomésticos</p>
          </div>
          <div className="category-item">
            <div className="category-icon">
              <img 
                src="https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/agosto-alkosto/home/assets/c-tv-video.webp" 
                alt="Categoría entretenimiento" 
                className="category-image" 
              />
            </div>
            <h3>Entretenimiento</h3>
            <p>TV y Audio</p>
          </div>
          <div className="category-item">
            <div className="category-icon">
              <img
                src="https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/agosto-alkosto/home/assets/c-videojuegos.webp"
                alt="Categoría videojuegos"
                className="category-image"
              />
            </div>
            <h3>Gaming</h3>
            <p>Consolas y juegos</p>
          </div>
        </section>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={showCartDrawer}
        onClose={() => setShowCartDrawer(false)}
        addedProduct={addedProduct}
        cartItems={cartItems}
        cartTotal={cartTotal}
      />
    </div>
  );
};

export default Home;
