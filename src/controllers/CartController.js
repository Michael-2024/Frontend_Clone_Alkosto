import Cart from '../models/Cart';
import Product from '../models/Product';

// Controlador del Carrito
class CartController {
  constructor() {
    this.cart = new Cart();
    this.loadCartFromStorage();
  }

  addToCart(product, quantity = 1) {
    this.cart.addItem(product, quantity);
    this.saveCartToStorage();
    return this.cart;
  }

  removeFromCart(productId) {
    this.cart.removeItem(productId);
    this.saveCartToStorage();
    return this.cart;
  }

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
    } else {
      this.cart.updateQuantity(productId, quantity);
      this.saveCartToStorage();
    }
    return this.cart;
  }

  getCart() {
    return this.cart;
  }

  clearCart() {
    this.cart.clear();
    this.saveCartToStorage();
    return this.cart;
  }

  getCartTotal() {
    return this.cart.getTotal();
  }

  getCartItemsCount() {
    return this.cart.getTotalItems();
  }

  saveCartToStorage() {
    try {
      localStorage.setItem('alkosto_cart', JSON.stringify(this.cart.items));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  loadCartFromStorage() {
    try {
      const savedCart = localStorage.getItem('alkosto_cart');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        // Restaurar las instancias de Product
        this.cart.items = items.map(item => ({
          ...item,
          product: new Product(
            item.product.id,
            item.product.name,
            item.product.price,
            item.product.originalPrice,
            item.product.discount,
            item.product.image,
            item.product.category,
            item.product.rating,
            item.product.stock,
            item.product.description
          )
        }));
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  }
}

const cartControllerInstance = new CartController();
export default cartControllerInstance;
