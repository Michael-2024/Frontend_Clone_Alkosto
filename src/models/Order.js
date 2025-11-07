// Modelo de Pedido/Orden
class Order {
  constructor(
    id,
    userId,
    items = [],
    shippingAddress = {},
    paymentMethod = {},
    status = 'pendiente',
    coupon = null
  ) {
    this.id = id;
    this.userId = userId;
    this.items = items; // Array de {product, quantity}
    this.shippingAddress = shippingAddress;
    this.paymentMethod = paymentMethod;
    this.status = status; // pendiente, procesando, enviado, entregado, cancelado
    this.coupon = coupon; // {code, discount} o null
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.subtotal = this.calculateSubtotal();
    this.shipping = this.calculateShipping();
    this.discount = coupon ? coupon.discount : 0;
    this.total = this.calculateTotal();
    this.trackingNumber = this.generateTrackingNumber();
  }

  calculateSubtotal() {
    return this.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
  }

  calculateShipping() {
    // Envío gratis para compras mayores a $150,000
    const subtotal = this.calculateSubtotal();
    return subtotal >= 150000 ? 0 : 15000;
  }

  calculateTotal() {
    return this.calculateSubtotal() + this.calculateShipping() - this.discount;
  }

  generateTrackingNumber() {
    // Formato: ALK-YYYYMMDD-XXXXX
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
    return `ALK-${year}${month}${day}-${random}`;
  }

  updateStatus(newStatus) {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  getStatusText() {
    const statusMap = {
      pendiente: 'Pendiente de pago',
      procesando: 'Procesando pedido',
      enviado: 'En camino',
      entregado: 'Entregado',
      cancelado: 'Cancelado'
    };
    return statusMap[this.status] || this.status;
  }

  getStatusColor() {
    const colorMap = {
      pendiente: '#FFA500',
      procesando: '#0066CC',
      enviado: '#4CAF50',
      entregado: '#28A745',
      cancelado: '#DC3545'
    };
    return colorMap[this.status] || '#666666';
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      items: this.items.map(item => ({
        product: item.product.toJSON ? item.product.toJSON() : item.product,
        quantity: item.quantity
      })),
      shippingAddress: this.shippingAddress,
      paymentMethod: this.paymentMethod,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      total: this.total,
      subtotal: this.subtotal,
      shipping: this.shipping,
      trackingNumber: this.trackingNumber
    };
  }
}

export default Order;
