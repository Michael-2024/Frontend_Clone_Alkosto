// 🧩 Modelo de Producto
class Product {
  constructor(
    id,
    name,
    price,
    originalPrice = null,
    discount = 0,
    image = '',
    category = '',
    rating = 0,
    stock = 0,
    description = ''
  ) {
    this.id = id;
    this.name = name;
    this.price = Number(price) || 0;
    this.originalPrice = Number(originalPrice) || null;
    this.discount = Number(discount) || 0;
    this.image = image;
    this.category = category;
    this.rating = Number(rating) || 0;
    this.stock = Number(stock) || 0;
    this.description = description;
  }

  // 📉 Calcula el porcentaje de descuento
  getDiscountPercentage() {
    if (this.originalPrice && this.originalPrice > this.price) {
      return Math.round(
        ((this.originalPrice - this.price) / this.originalPrice) * 100
      );
    }
    return 0;
  }

  // 🛒 Verifica si hay stock disponible
  isInStock() {
    return this.stock > 0;
  }

  // 💰 Devuelve el precio actual formateado
  getFormattedPrice() {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(this.price);
  }

  // 💵 Devuelve el precio original formateado
  getFormattedOriginalPrice() {
    if (!this.originalPrice) return '';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(this.originalPrice);
  }

  // 🔄 Convierte un objeto plano en una instancia Product
  static fromJSON(obj) {
    if (!obj) return null;
    return new Product(
      obj.id,
      obj.name,
      obj.price,
      obj.originalPrice,
      obj.discount,
      obj.image,
      obj.category,
      obj.rating,
      obj.stock,
      obj.description
    );
  }
}

export default Product;
