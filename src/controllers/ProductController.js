import Product from '../models/Product';

// Controlador de Productos
class ProductController {
  constructor() {
    // Datos mock de productos (en producción vendrían del backend)
    this.products = [
      new Product(1, 'iPhone 15 Pro Max 256GB', 5499000, 6199000, 700000, '/images/iphone15.jpg', 'Celulares', 4.8, 10),
      new Product(2, 'Samsung Galaxy S24 Ultra', 4899000, 5499000, 600000, '/images/samsung-s24.jpg', 'Celulares', 4.7, 15),
      new Product(3, 'MacBook Pro 14" M3', 8999000, 9999000, 1000000, '/images/macbook-pro.jpg', 'Computadores', 4.9, 5),
      new Product(4, 'Smart TV Samsung 55" QLED 4K', 2499000, 2999000, 500000, '/images/tv-samsung.jpg', 'Televisores', 4.6, 20),
      new Product(5, 'PlayStation 5 + 2 Controles', 2899000, 3199000, 300000, '/images/ps5.jpg', 'Videojuegos', 4.9, 8),
      new Product(6, 'Nevera Samsung Side by Side', 3299000, 3899000, 600000, '/images/nevera-samsung.jpg', 'Electrodomésticos', 4.5, 12),
      new Product(7, 'Lavadora LG 22Kg TurboWash', 2199000, 2599000, 400000, '/images/lavadora-lg.jpg', 'Electrodomésticos', 4.4, 18),
      new Product(8, 'AirPods Pro 2da Generación', 1099000, 1299000, 200000, '/images/airpods-pro.jpg', 'Audio', 4.7, 30),
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
