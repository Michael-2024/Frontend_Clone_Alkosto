// src/models/Coupon.js

/**
 * Modelo de Cupón de Descuento
 * Representa un cupón con validaciones, tipos y condiciones
 */
class Coupon {
  constructor({
    id,
    code,
    type = 'percentage', // 'percentage' o 'fixed'
    value,
    description = '',
    minPurchase = 0,
    maxDiscount = null,
    validFrom = new Date(),
    validUntil,
    usageLimit = null,
    usedCount = 0,
    userSpecific = null, // null = todos, o userId específico
    categories = [], // Categorías aplicables (vacío = todas)
    isActive = true,
    createdAt = new Date()
  }) {
    this.id = id;
    this.code = code.toUpperCase();
    this.type = type;
    this.value = value;
    this.description = description;
    this.minPurchase = minPurchase;
    this.maxDiscount = maxDiscount;
    this.validFrom = new Date(validFrom);
    this.validUntil = validUntil ? new Date(validUntil) : null;
    this.usageLimit = usageLimit;
    this.usedCount = usedCount;
    this.userSpecific = userSpecific;
    this.categories = categories;
    this.isActive = isActive;
    this.createdAt = new Date(createdAt);
  }

  /**
   * Verifica si el cupón es válido actualmente
   */
  isValid() {
    if (!this.isActive) return { valid: false, reason: 'Cupón inactivo' };

    const now = new Date();
    if (now < this.validFrom) {
      return { valid: false, reason: 'Cupón aún no disponible' };
    }

    if (this.validUntil && now > this.validUntil) {
      return { valid: false, reason: 'Cupón expirado' };
    }

    if (this.usageLimit && this.usedCount >= this.usageLimit) {
      return { valid: false, reason: 'Cupón agotado' };
    }

    return { valid: true };
  }

  /**
   * Verifica si el cupón es aplicable a un usuario específico
   */
  isValidForUser(userId) {
    if (this.userSpecific && this.userSpecific !== userId) {
      return { valid: false, reason: 'Cupón no disponible para este usuario' };
    }
    return { valid: true };
  }

  /**
   * Verifica si el cupón cumple con el monto mínimo de compra
   */
  meetsMinimumPurchase(total) {
    if (total < this.minPurchase) {
      return {
        valid: false,
        reason: `Compra mínima de ${this.formatPrice(this.minPurchase)} requerida`
      };
    }
    return { valid: true };
  }

  /**
   * Calcula el descuento aplicable al total
   */
  calculateDiscount(total) {
    let discount = 0;

    if (this.type === 'percentage') {
      discount = (total * this.value) / 100;
    } else if (this.type === 'fixed') {
      discount = this.value;
    }

    // Aplicar límite máximo de descuento si existe
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }

    // El descuento no puede ser mayor al total
    if (discount > total) {
      discount = total;
    }

    return Math.round(discount);
  }

  /**
   * Obtiene el texto descriptivo del descuento
   */
  getDiscountText() {
    if (this.type === 'percentage') {
      return `${this.value}% de descuento`;
    } else if (this.type === 'fixed') {
      return `${this.formatPrice(this.value)} de descuento`;
    }
    return 'Descuento';
  }

  /**
   * Obtiene el icono según el tipo de cupón
   */
  getIcon() {
    if (this.value >= 50 || this.type === 'fixed') return '🎁';
    if (this.value >= 30) return '🎟️';
    if (this.value >= 20) return '🏷️';
    return '🎫';
  }

  /**
   * Obtiene el color de prioridad visual
   */
  getPriorityColor() {
    if (this.value >= 50 || (this.type === 'fixed' && this.value >= 100000)) return '#d32f2f';
    if (this.value >= 30) return '#f57c00';
    if (this.value >= 20) return '#1976d2';
    return '#388e3c';
  }

  /**
   * Obtiene días restantes de validez
   */
  getDaysRemaining() {
    if (!this.validUntil) return null;
    
    const now = new Date();
    const diff = this.validUntil - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    return days > 0 ? days : 0;
  }

  /**
   * Obtiene texto de tiempo restante
   */
  getTimeRemainingText() {
    const days = this.getDaysRemaining();
    
    if (days === null) return 'Sin vencimiento';
    if (days === 0) return 'Expira hoy';
    if (days === 1) return 'Expira mañana';
    if (days <= 7) return `${days} días restantes`;
    if (days <= 30) return `${days} días restantes`;
    
    return 'Válido';
  }

  /**
   * Formatea precio en COP
   */
  formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  /**
   * Marca el cupón como usado
   */
  markAsUsed() {
    this.usedCount++;
  }

  /**
   * Serializa el cupón a JSON
   */
  toJSON() {
    return {
      id: this.id,
      code: this.code,
      type: this.type,
      value: this.value,
      description: this.description,
      minPurchase: this.minPurchase,
      maxDiscount: this.maxDiscount,
      validFrom: this.validFrom.toISOString(),
      validUntil: this.validUntil ? this.validUntil.toISOString() : null,
      usageLimit: this.usageLimit,
      usedCount: this.usedCount,
      userSpecific: this.userSpecific,
      categories: this.categories,
      isActive: this.isActive,
      createdAt: this.createdAt.toISOString()
    };
  }

  /**
   * Crea un cupón desde JSON
   */
  static fromJSON(json) {
    return new Coupon(json);
  }
}

export default Coupon;
