// src/models/PaymentMethod.js

/**
 * Modelo de Método de Pago
 * Representa un método de pago guardado del usuario
 */
class PaymentMethod {
  constructor(
    id,
    userId,
    type, // 'card', 'pse', 'nequi', 'daviplata'
    nickname, // Nombre personalizado
    isDefault = false,
    cardDetails = null,
    pseDetails = null,
    walletDetails = null,
    createdAt = new Date(),
    lastUsed = null
  ) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.nickname = nickname;
    this.isDefault = isDefault;
    this.cardDetails = cardDetails; // { lastFourDigits, cardHolder, expiryDate, brand }
    this.pseDetails = pseDetails; // { bank, personType }
    this.walletDetails = walletDetails; // { phone }
    this.createdAt = createdAt;
    this.lastUsed = lastUsed;
  }

  // Getters

  /**
   * Obtiene el icono del método de pago
   */
  getIcon() {
    const icons = {
      card: '💳',
      pse: '🏦',
      nequi: '📱',
      daviplata: '📱',
      cash: '💵'
    };
    return icons[this.type] || '💰';
  }

  /**
   * Obtiene la marca de la tarjeta basándose en los primeros dígitos
   */
  getCardBrand() {
    if (!this.cardDetails) return null;
    return this.cardDetails.brand || 'Tarjeta';
  }

  /**
   * Obtiene el texto descriptivo del método de pago
   */
  getDisplayText() {
    switch (this.type) {
      case 'card':
        return `${this.getCardBrand()} •••• ${this.cardDetails.lastFourDigits}`;
      case 'pse':
        return `PSE - ${this.pseDetails.bank}`;
      case 'nequi':
        return `Nequi - ${this.walletDetails.phone}`;
      case 'daviplata':
        return `Daviplata - ${this.walletDetails.phone}`;
      default:
        return this.nickname;
    }
  }

  /**
   * Obtiene texto descriptivo corto
   */
  getShortText() {
    switch (this.type) {
      case 'card':
        return `•••• ${this.cardDetails.lastFourDigits}`;
      case 'pse':
        return this.pseDetails.bank;
      case 'nequi':
      case 'daviplata':
        return this.walletDetails.phone;
      default:
        return this.nickname;
    }
  }

  /**
   * Verifica si el método de pago ha expirado (solo para tarjetas)
   */
  isExpired() {
    if (this.type !== 'card' || !this.cardDetails.expiryDate) return false;

    const [month, year] = this.cardDetails.expiryDate.split('/');
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const today = new Date();
    today.setDate(1); // Comparar desde el primer día del mes

    return expiryDate < today;
  }

  /**
   * Verifica si el método requiere conexión con pasarela de pago
   */
  requiresGateway() {
    return ['card', 'pse', 'nequi', 'daviplata'].includes(this.type);
  }

  /**
   * Actualiza la fecha de último uso
   */
  markAsUsed() {
    this.lastUsed = new Date();
  }

  /**
   * Establece como método predeterminado
   */
  setAsDefault() {
    this.isDefault = true;
  }

  /**
   * Quita el estado de predeterminado
   */
  unsetDefault() {
    this.isDefault = false;
  }

  /**
   * Convierte el objeto a formato JSON para almacenamiento
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      nickname: this.nickname,
      isDefault: this.isDefault,
      cardDetails: this.cardDetails,
      pseDetails: this.pseDetails,
      walletDetails: this.walletDetails,
      createdAt: this.createdAt,
      lastUsed: this.lastUsed
    };
  }

  /**
   * Crea una instancia desde un objeto JSON
   */
  static fromJSON(json) {
    return new PaymentMethod(
      json.id,
      json.userId,
      json.type,
      json.nickname,
      json.isDefault,
      json.cardDetails,
      json.pseDetails,
      json.walletDetails,
      json.createdAt ? new Date(json.createdAt) : new Date(),
      json.lastUsed ? new Date(json.lastUsed) : null
    );
  }

  /**
   * Detecta la marca de tarjeta por el número
   */
  static detectCardBrand(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cleanNumber)) return 'Visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'American Express';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'Discover';
    if (/^3(?:0[0-5]|[68])/.test(cleanNumber)) return 'Diners Club';
    
    return 'Tarjeta';
  }

  /**
   * Valida el número de tarjeta usando algoritmo de Luhn
   */
  static validateCardNumber(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (!/^\d+$/.test(cleanNumber)) return false;
    if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Formatea el número de teléfono para billeteras
   */
  static formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    return phone;
  }
}

export default PaymentMethod;
