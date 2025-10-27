import Cart from '../models/Cart';

class CartController {
  constructor() {
    this.cart = new Cart();
    this.loadCartFromStorage();
  }

  addToCart(product, quantity = 1) {
    this.cart.addItem(product, quantity);
    this.saveCartToStorage();
    return this.getCart(); // 🔧 devuelve una copia limpia del carrito
  }

  removeFromCart(productId) {
    this.cart.removeItem(productId);
    this.saveCartToStorage();
    return this.getCart();
  }

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
    } else {
      this.cart.updateQuantity(productId, quantity);
      this.saveCartToStorage();
    }
    return this.getCart();
  }

  getCart() {
    // 🔧 devolvemos una instancia de Cart válida (no un objeto plano)
    return Cart.fromJSON(this.cart);
  }

  clearCart() {
    this.cart.clear();
    this.saveCartToStorage();
    return this.getCart();
  }

  getCartTotal() {
    return this.cart.getTotal();
  }

  getCartItemsCount() {
    return this.cart.getTotalItems();
  }

  saveCartToStorage() {
    try {
      localStorage.setItem('alkosto_cart', JSON.stringify(this.cart));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  loadCartFromStorage() {
    try {
      const savedCart = localStorage.getItem('alkosto_cart');
      if (savedCart) {
        const data = JSON.parse(savedCart);
        this.cart = Cart.fromJSON(data); // ✅ reconstruimos correctamente
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      this.cart = new Cart();
    }
  }
}

const cartControllerInstance = new CartController();
export default cartControllerInstance;
