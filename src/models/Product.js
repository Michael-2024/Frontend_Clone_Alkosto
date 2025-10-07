// Modelo de Producto
class Product {
  constructor(id, name, price, originalPrice, discount, image, category, rating, stock) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.originalPrice = originalPrice;
    this.discount = discount;
    this.image = image;
    this.category = category;
    this.rating = rating;
    this.stock = stock;
  }

  getDiscountPercentage() {
    if (!this.originalPrice) return 0;
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }

  isInStock() {
    return this.stock > 0;
  }

  getFormattedPrice() {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(this.price);
  }
}

export default Product;
