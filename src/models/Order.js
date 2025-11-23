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
    this.iva = this.calculateIVA();
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

  calculateIVA() {
    // IVA del 19% sobre el subtotal
    const subtotal = this.calculateSubtotal();
    return Math.round(subtotal * 0.19);
  }

  calculateTotal() {
    const subtotal = this.calculateSubtotal();
    const shipping = this.calculateShipping();
    const iva = this.calculateIVA();
    return subtotal + shipping + iva - this.discount;
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

  /**
   * Verifica si el pedido puede ser cancelado según las políticas
   * Política: Solo se puede cancelar si:
   * - El estado es "pendiente" o "procesando"
   * - No han pasado más de 24 horas desde la creación
   * - No ha sido enviado ni entregado
   * @returns {Object} - {canCancel: boolean, reason?: string}
   */
  canBeCancelled() {
    // No se puede cancelar si ya está cancelado
    if (this.status === 'cancelado') {
      return {
        canCancel: false,
        reason: 'El pedido ya está cancelado'
      };
    }

    // No se puede cancelar si ya fue entregado
    if (this.status === 'entregado') {
      return {
        canCancel: false,
        reason: 'El pedido ya fue entregado. Para devoluciones contacta al servicio al cliente'
      };
    }

    // No se puede cancelar si ya fue enviado (Cliente A: útil siempre que no se haya enviado)
    if (this.status === 'enviado') {
      return {
        canCancel: false,
        reason: 'El pedido ya está en camino. Contacta al servicio al cliente para más información'
      };
    }

    // Verificar límite de tiempo de 24 horas (Cliente B: límite de tiempo)
    const now = new Date();
    const createdAt = new Date(this.createdAt);
    const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60);

    if (hoursSinceCreation > 24) {
      return {
        canCancel: false,
        reason: 'El plazo de cancelación (24 horas) ha expirado'
      };
    }

    // Solo se puede cancelar si está en estado "pendiente" o "procesando"
    if (this.status === 'pendiente' || this.status === 'procesando') {
      return {
        canCancel: true
      };
    }

    return {
      canCancel: false,
      reason: 'El pedido no puede ser cancelado en su estado actual'
    };
  }

  /**
   * Obtiene la fecha límite para cancelar el pedido (24 horas después de la creación)
   * @returns {Date} - Fecha límite de cancelación
   */
  getCancellationDeadline() {
    const deadline = new Date(this.createdAt);
    deadline.setHours(deadline.getHours() + 24);
    return deadline;
  }

  /**
   * Obtiene el tiempo restante para cancelar el pedido
   * @returns {Object} - {hours: number, minutes: number, expired: boolean}
   */
  getTimeLeftToCancel() {
    const now = new Date();
    const deadline = this.getCancellationDeadline();
    const timeLeft = deadline - now;

    if (timeLeft <= 0) {
      return {
        hours: 0,
        minutes: 0,
        expired: true
      };
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return {
      hours,
      minutes,
      expired: false
    };
  }

  /**
   * Cancela el pedido
   * @param {string} reason - Motivo de la cancelación
   * @returns {Object} - {success: boolean, message: string}
   */
  cancel(reason = 'Cancelado por el cliente') {
    const cancellationCheck = this.canBeCancelled();
    
    if (!cancellationCheck.canCancel) {
      return {
        success: false,
        message: cancellationCheck.reason
      };
    }

    this.status = 'cancelado';
    this.updatedAt = new Date();
    this.cancellationReason = reason;
    this.cancelledAt = new Date();

    return {
      success: true,
      message: 'Pedido cancelado exitosamente'
    };
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
      iva: this.iva,
      trackingNumber: this.trackingNumber,
      cancellationReason: this.cancellationReason || null,
      cancelledAt: this.cancelledAt || null,
      // Persistencia de descuento y cupón aplicado (RF20)
      discount: this.discount || 0,
      coupon: this.coupon ? { code: this.coupon.code, discount: this.discount } : null
    };
  }
}

export default Order;
