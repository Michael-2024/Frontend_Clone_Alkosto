// Modelo de Carrito de Compras
class Cart {
  constructor() {
    this.items = [];
  }

  // Asegura que siempre sea un array
  ensureArray() {
    if (!Array.isArray(this.items)) {
      this.items = [];
    }
  }

  addItem(product, quantity = 1) {
    this.ensureArray();
    const existingItem = this.items.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
  }

  removeItem(productId) {
    this.ensureArray();
    this.items = this.items.filter(item => item.product.id !== productId);
  }

  updateQuantity(productId, quantity) {
    this.ensureArray();
    const item = this.items.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
    }
  }

  getTotal() {
    this.ensureArray();
    return this.items.reduce((total, item) => {
      const price = item?.product?.price ?? 0;
      const qty = item?.quantity ?? 0;
      return total + price * qty;
    }, 0);
  }

  getTotalItems() {
    this.ensureArray();
    return this.items.reduce((total, item) => total + (item?.quantity ?? 0), 0);
  }

  clear() {
    this.items = [];
  }
}

export default Cart;
