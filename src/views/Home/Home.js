// src/views/Home/Home.js
import React, { useState, useEffect } from 'react';
import Carousel from '../../components/Carousel/Carousel';
import CategorySection from '../../components/CategorySection/CategorySection';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import productController from '../../controllers/ProductController';
import CartController from '../../controllers/CartController';
import CartDrawer from '../../components/CartDrawer/CartDrawer';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [countdown, setCountdown] = useState({ hours: 12, minutes: 34, seconds: 56 });

  const carouselSlides = [
    {
      image: 'https://okdiario.com/img/2024/12/08/iphone-17-1-635x358.jpeg',
      title: '¡Tu nuevo Iphone te espera!',
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
      image: 'https://live.mrf.io/statics/i/ps/www.muycomputer.com/wp-content/uploads/2018/07/smartphone.jpg?width=1200&enable=upscale',
      title: 'Smartphones al Mejor Precio',
      description: 'Los modelos más recientes con increíbles descuentos',
      buttonText: 'Explorar',
    },
    {
      image: 'https://hiraoka.com.pe/media/mageplaza/blog/post/a/u/audio_premium-parlantes-audifonos-hiraoka.jpg',
      title: 'Audio Premium',
      description: 'Audífonos y parlantes de alta calidad',
      buttonText: 'Descubrir',
    },
  ];

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

  // Temporizador de cuenta regresiva
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { hours, minutes, seconds } = prev;
        
        // Decrementar segundos
        seconds--;
        
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        
        // Si llega a 0, reiniciar a 24 horas
        if (hours < 0) {
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
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

  return (
    <div className="home">
      {/* 🔹 Hero Section combinada (Carousel + Categorías) */}
      <div className="hero-section">
        <Carousel slides={carouselSlides} />
        <CategorySection />
      </div>

      <div className="container">
        {/* 🔸 Ofertas del día */}
        <section className="daily-offers-section">
          <div className="section-header-special">
            <h2 className="section-title">⚡ Ofertas del Día</h2>
            <div className="countdown">
              <span className="countdown-label">Termina en:</span>
              <span className="countdown-time">
                {String(countdown.hours).padStart(2, '0')}:
                {String(countdown.minutes).padStart(2, '0')}:
                {String(countdown.seconds).padStart(2, '0')}
              </span>
            </div>
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
                src="https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/agosto-alkosto/home/assets/c-televisores.webp" 
                alt="Categoría videojuegos" 
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
