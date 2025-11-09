import Product from '../models/Product';

// Controlador de Productos
class ProductController {
  constructor() {
    // Datos mock de productos (en producción vendrían del backend)
    this.products = [
      // ----  Celulares  ---
      new Product(1, 'iPhone 15 Pro Max 256GB', 5499000, 6199000, 700000, '/images/productos/iphone 15.jpg', 'Celulares', 4.8, 10, 'iPhone 15 Pro Max con pantalla Super Retina XDR, chip A17 Pro y cámara de 48MP'),
      new Product(2, 'Samsung Galaxy S24 Ultra', 4899000, 5499000, 600000, '/images/productos/samsung galaxy s24 ultra.jpg', 'Celulares', 4.7, 15, 'Samsung Galaxy S24 Ultra con S Pen integrado, cámara de 200MP y procesador Snapdragon'),
      
      // ----  Eletrodomesticos  ---
      new Product(6, 'Nevera Samsung Side by Side', 3299000, 3899000, 600000, '/images/productos/nevera.jpg', 'Electrodomésticos', 4.5, 12, 'Nevera Samsung Side by Side con dispensador de agua y hielo, tecnología Twin Cooling Plus'),
      new Product(7, 'Lavadora LG 22Kg TurboWash', 2199000, 2599000, 400000, '/images/productos/lavadora.jpg', 'Electrodomésticos', 4.4, 18, 'Lavadora LG de 22Kg con tecnología TurboWash, Motor Inverter Direct Drive y vapor'),
      new Product(4, 'Smart TV Samsung 55" QLED 4K', 2499000, 2999000, 500000, '/images/productos/tv.jpg', 'Televisores', 4.6, 20, 'Smart TV Samsung QLED 4K de 55 pulgadas con tecnología Quantum Dot y procesador Crystal 4K'),
      // ----  Computadores  ---
      new Product(3, 'MacBook Pro 14" M3', 8999000, 9999000, 1000000, '/images/productos/macbook pro 14.jpg', 'Computadores', 4.9, 5, 'MacBook Pro 14 pulgadas con chip M3, pantalla Liquid Retina XDR y hasta 22 horas de batería'),
      
      new Product(5, 'PlayStation 5 + 2 Controles', 2899000, 3199000, 300000, 'images/productos/ps5.jpg', 'Videojuegos', 4.9, 8, 'PlayStation 5 con 2 controles DualSense, gráficos en 4K y SSD ultrarrápido'),
      new Product(8, 'AirPods Pro 2da Generación', 1099000, 1299000, 200000, '/images/productos/airpods.jpg', 'Audio', 4.7, 30, 'AirPods Pro con cancelación activa de ruido, audio espacial personalizado y estuche MagSafe'),
      
      new Product(9, 'AirPods Pro 2da Generación', 1099000, 1299000, 200000, '/images/productos/airpods.jpg', 'Audio', 4.7, 30, 'AirPods Pro con cancelación activa de ruido, audio espacial personalizado y estuche MagSafe'),
    
    
    
    
    ];
  }

  getAllProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find(product => product.id === parseInt(id));
  }

  getProductsByCategory(category) {
    return this.products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }

  getFeaturedProducts(limit = 4) {
    return this.products
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  getDiscountedProducts() {
    return this.products.filter(product => product.discount > 0);
  }
}

const productControllerInstance = new ProductController();
export default productControllerInstance;
