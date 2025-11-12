// src/controllers/CouponController.js
import Coupon from '../models/Coupon';

/**
 * Controlador de Cupones (Singleton)
 * Gestiona cupones de descuento con validación y aplicación
 */
class CouponController {
  static instance = null;
  static STORAGE_KEY = 'alkosto_coupons';
  static USER_COUPONS_KEY = 'alkosto_user_coupons';

  constructor() {
    if (CouponController.instance) {
      return CouponController.instance;
    }
    this.coupons = [];
    this.userCoupons = new Map(); // userId -> [couponIds usados]
    this.loadCoupons();
    this.initializeDefaultCoupons();
    CouponController.instance = this;
  }

  static getInstance() {
    if (!CouponController.instance) {
      CouponController.instance = new CouponController();
    }
    return CouponController.instance;
  }

  /**
   * Carga cupones desde localStorage
   */
  loadCoupons() {
    try {
      const stored = localStorage.getItem(CouponController.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.coupons = data.map(c => Coupon.fromJSON(c));
      }

      const userCouponsStored = localStorage.getItem(CouponController.USER_COUPONS_KEY);
      if (userCouponsStored) {
        const data = JSON.parse(userCouponsStored);
        this.userCoupons = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Error loading coupons:', error);
      this.coupons = [];
      this.userCoupons = new Map();
    }
  }

  /**
   * Guarda cupones en localStorage
   */
  saveCoupons() {
    try {
      const data = this.coupons.map(c => c.toJSON());
      localStorage.setItem(CouponController.STORAGE_KEY, JSON.stringify(data));

      const userCouponsData = Object.fromEntries(this.userCoupons);
      localStorage.setItem(CouponController.USER_COUPONS_KEY, JSON.stringify(userCouponsData));
    } catch (error) {
      console.error('Error saving coupons:', error);
    }
  }

  /**
   * Inicializa cupones por defecto del sistema
   */
  initializeDefaultCoupons() {
    if (this.coupons.length > 0) return;

    const defaultCoupons = [
      {
        id: 'WELCOME20',
        code: 'WELCOME20',
        type: 'percentage',
        value: 20,
        description: '20% de descuento en tu primera compra',
        minPurchase: 100000,
        maxDiscount: 50000,
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 días
        usageLimit: 1000,
        isActive: true
      },
      {
        id: 'TECH30',
        code: 'TECH30',
        type: 'percentage',
        value: 30,
        description: '30% OFF en tecnología',
        minPurchase: 500000,
        maxDiscount: 150000,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        categories: ['Tecnología', 'Celulares', 'Laptops', 'Tablets'],
        isActive: true
      },
      {
        id: 'HOGAR15',
        code: 'HOGAR15',
        type: 'percentage',
        value: 15,
        description: '15% de descuento en hogar',
        minPurchase: 200000,
        maxDiscount: 75000,
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 días
        categories: ['Electrodomésticos', 'Hogar'],
        isActive: true
      },
      {
        id: 'ALKOSTO50',
        code: 'ALKOSTO50',
        type: 'fixed',
        value: 50000,
        description: '$50,000 de descuento en compras mayores',
        minPurchase: 1000000,
        maxDiscount: null,
        validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 días
        isActive: true
      },
      {
        id: 'ENVIOGRATIS',
        code: 'ENVIOGRATIS',
        type: 'fixed',
        value: 15000,
        description: 'Envío gratis (descuento $15,000)',
        minPurchase: 150000,
        maxDiscount: null,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        isActive: true
      }
    ];

    defaultCoupons.forEach(data => {
      this.coupons.push(new Coupon(data));
    });

    this.saveCoupons();
  }

  /**
   * Obtiene todos los cupones activos
   */
  getAllCoupons() {
    return this.coupons.filter(c => c.isActive);
  }

  /**
   * Obtiene un cupón por código
   */
  getCouponByCode(code) {
    return this.coupons.find(c => c.code === code.toUpperCase());
  }

  /**
   * Valida un cupón completo
   */
  validateCoupon(code, userId, total, categories = []) {
    const coupon = this.getCouponByCode(code);

    if (!coupon) {
      return { valid: false, reason: 'Cupón no válido' };
    }

    // Validar estado general del cupón
    const validityCheck = coupon.isValid();
    if (!validityCheck.valid) {
      return validityCheck;
    }

    // Validar usuario específico
    const userCheck = coupon.isValidForUser(userId);
    if (!userCheck.valid) {
      return userCheck;
    }

    // Verificar si el usuario ya usó este cupón
    if (this.hasUserUsedCoupon(userId, coupon.id)) {
      return { valid: false, reason: 'Ya has usado este cupón' };
    }

    // Validar monto mínimo
    const minPurchaseCheck = coupon.meetsMinimumPurchase(total);
    if (!minPurchaseCheck.valid) {
      return minPurchaseCheck;
    }

    // Validar categorías si aplica
    if (coupon.categories.length > 0 && categories.length > 0) {
      const hasValidCategory = categories.some(cat => 
        coupon.categories.includes(cat)
      );
      if (!hasValidCategory) {
        return {
          valid: false,
          reason: `Este cupón solo aplica para: ${coupon.categories.join(', ')}`
        };
      }
    }

    return {
      valid: true,
      coupon: coupon,
      discount: coupon.calculateDiscount(total)
    };
  }

  /**
   * Aplica un cupón (marca como usado)
   */
  applyCoupon(code, userId) {
    const coupon = this.getCouponByCode(code);
    if (!coupon) return false;

    // Marcar cupón como usado en el sistema
    coupon.markAsUsed();

    // Registrar uso por usuario
    if (!this.userCoupons.has(userId)) {
      this.userCoupons.set(userId, []);
    }
    this.userCoupons.get(userId).push(coupon.id);

    this.saveCoupons();
    return true;
  }

  /**
   * Verifica si un usuario ya usó un cupón
   */
  hasUserUsedCoupon(userId, couponId) {
    if (!this.userCoupons.has(userId)) return false;
    return this.userCoupons.get(userId).includes(couponId);
  }

  /**
   * Obtiene cupones disponibles para un usuario
   */
  getAvailableCouponsForUser(userId) {
    return this.coupons.filter(coupon => {
      const isValid = coupon.isValid();
      const isForUser = coupon.isValidForUser(userId);
      const notUsed = !this.hasUserUsedCoupon(userId, coupon.id);
      
      return isValid.valid && isForUser.valid && notUsed && coupon.isActive;
    });
  }

  /**
   * Obtiene cupones usados por un usuario
   */
  getUsedCouponsByUser(userId) {
    if (!this.userCoupons.has(userId)) return [];
    
    const usedIds = this.userCoupons.get(userId);
    return this.coupons.filter(c => usedIds.includes(c.id));
  }

  /**
   * Crea un cupón personalizado para un usuario
   */
  createPersonalizedCoupon(userId, couponData) {
    const newCoupon = new Coupon({
      id: `USER_${userId}_${Date.now()}`,
      ...couponData,
      userSpecific: userId
    });

    this.coupons.push(newCoupon);
    this.saveCoupons();
    return newCoupon;
  }

  /**
   * Crea un cupón de bienvenida para nuevo usuario
   */
  createWelcomeCoupon(userId) {
    const welcomeCoupon = {
      code: `WELCOME${userId.substr(0, 4).toUpperCase()}`,
      type: 'percentage',
      value: 20,
      description: '¡Bienvenido! 20% en tu primera compra',
      minPurchase: 100000,
      maxDiscount: 50000,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      usageLimit: 1
    };

    return this.createPersonalizedCoupon(userId, welcomeCoupon);
  }

  /**
   * Obtiene estadísticas de cupones
   */
  getCouponStats() {
    return {
      total: this.coupons.length,
      active: this.coupons.filter(c => c.isActive).length,
      expired: this.coupons.filter(c => {
        const check = c.isValid();
        return !check.valid && check.reason === 'Cupón expirado';
      }).length,
      exhausted: this.coupons.filter(c => {
        const check = c.isValid();
        return !check.valid && check.reason === 'Cupón agotado';
      }).length
    };
  }

  /**
   * Limpia cupones expirados
   */
  cleanupExpiredCoupons() {
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    this.coupons = this.coupons.filter(coupon => {
      // Mantener cupones activos
      if (coupon.isActive && (!coupon.validUntil || coupon.validUntil > now)) {
        return true;
      }
      // Mantener cupones expirados hace menos de 1 mes
      if (coupon.validUntil && coupon.validUntil > oneMonthAgo) {
        return true;
      }
      return false;
    });

    this.saveCoupons();
  }
}

// Exportar instancia única
export default CouponController.getInstance();
