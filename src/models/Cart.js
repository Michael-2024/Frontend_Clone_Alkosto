class Cart {
  constructor(items = []) {
    this.items = items;
  }

  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.product.id !== productId);
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.product.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  getTotalItems() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  clear() {
    this.items = [];
  }

  static fromJSON(data) {
    if (!data) return new Cart();
    return new Cart(Array.isArray(data.items) ? data.items : []);
  }
}

export default Cart;
