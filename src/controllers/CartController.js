import Cart from '../models/Cart';
import Product from '../models/Product';
import apiService from '../services/ApiService';
import UserController from './UserController';

// Adaptador de carrito del backend al modelo local
const toCartItemModel = (backendItem) => {
  const producto = backendItem.producto;
  return {
    product: new Product(
      producto.id_producto,
      producto.nombre,
      producto.precio,
      producto.precio_original || producto.precio,
      producto.descuento || 0,
      producto.imagenes?.[0]?.url_imagen || producto.imagen_url || '/placeholder.png',
      producto.categoria?.nombre || 'Sin categoría',
      producto.calificacion_promedio || 0,
      producto.stock || 0,
      producto.descripcion || ''
    ),
    quantity: backendItem.cantidad
  };
};

// Controlador del Carrito con integración backend/localStorage
class CartController {
  constructor() {
    this.cart = new Cart();
    this.isBackendMode = false; // true si usuario logueado
    // Suscriptores para cambios del carrito (mejor que hacer pooling cada 1s)
    this.listeners = [];
    // Si en modo backend falla una operación y caemos a local, evitamos sincronizar
    // automáticamente con backend para no "revivir" items antiguos.
    this.localOverride = false;
    this.loadCartFromStorage();
  }

  // Verifica si debe usar backend o localStorage
  _shouldUseBackend() {
    return UserController.isLoggedIn() && apiService.getToken();
  }

  // Añadir producto al carrito
  async addToCart(product, quantity = 1) {
    console.log('addToCart llamado con:', { product, quantity, shouldUseBackend: this._shouldUseBackend() });
    if (this._shouldUseBackend()) {
      try {
        console.log('Usando backend para agregar al carrito');
        // Añadir al carrito del backend
        const result = await apiService.addToCart(product.id, quantity);
        console.log('Resultado de addToCart backend:', result);
        // Recargar carrito desde backend
        await this.syncWithBackend();
        this.localOverride = false;
      } catch (error) {
        console.error('Error al agregar al carrito backend:', error);
        // Fallback a localStorage
        console.log('Usando fallback a localStorage');
        this.cart.addItem(product, quantity);
        this.saveCartToStorage();
        this.localOverride = true;
      }
    } else {
      // Usuario no logueado -> localStorage
      console.log('Usuario no logueado, usando localStorage');
      this.cart.addItem(product, quantity);
      this.saveCartToStorage();
    }
    this.notifyChange();
    return this.cart;
  }

  // Remover producto del carrito
  async removeFromCart(productId) {
    if (this._shouldUseBackend()) {
      try {
        await apiService.removeFromCart(productId);
        await this.syncWithBackend();
        this.localOverride = false;
      } catch (error) {
        console.error('Error al eliminar del carrito backend:', error);
        this.cart.removeItem(productId);
        this.saveCartToStorage();
        this.localOverride = true;
      }
    } else {
      this.cart.removeItem(productId);
      this.saveCartToStorage();
    }
    this.notifyChange();
    return this.cart;
  }

  // Actualizar cantidad de un producto
  async updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      return this.removeFromCart(productId);
    }
    
    if (this._shouldUseBackend()) {
      try {
        await apiService.updateCartItem(productId, quantity);
        await this.syncWithBackend();
        this.localOverride = false;
      } catch (error) {
        console.error('Error al actualizar cantidad en backend:', error);
        this.cart.updateQuantity(productId, quantity);
        this.saveCartToStorage();
        this.localOverride = true;
      }
    } else {
      this.cart.updateQuantity(productId, quantity);
      this.saveCartToStorage();
    }
    this.notifyChange();
    return this.cart;
  }

  // Obtener carrito actual
  async getCart() {
    if (this._shouldUseBackend() && !this.localOverride) {
      await this.syncWithBackend();
    }
    return this.cart;
  }

  // Limpiar carrito
  async clearCart() {
    if (this._shouldUseBackend()) {
      try {
        await apiService.clearCart();
        this.cart.clear();
        this.localOverride = false;
      } catch (error) {
        console.error('Error al limpiar carrito backend:', error);
        this.cart.clear();
        this.saveCartToStorage();
        this.localOverride = true;
      }
    } else {
      this.cart.clear();
      this.saveCartToStorage();
    }
    this.notifyChange();
    return this.cart;
  }

  getCartTotal() {
    return this.cart.getTotal();
  }

  getCartItemsCount() {
    return this.cart.getTotalItems();
  }

  // Sincronizar con backend
  async syncWithBackend() {
    try {
      console.log('Sincronizando carrito con backend...');
      const backendCart = await apiService.getCart();
      console.log('Carrito del backend:', backendCart);
      // Convertir items del backend al modelo local
      if (backendCart && backendCart.items) {
        this.cart.items = backendCart.items.map(toCartItemModel);
        console.log('Items del carrito después de conversión:', this.cart.items);
      } else {
        console.warn('Backend no retornó items en el carrito');
        this.cart.items = [];
      }
      this.isBackendMode = true;
      this.localOverride = false;
      this.saveCartToStorage(); // mantener copia local para offline
      this.notifyChange();
    } catch (error) {
      console.error('Error sincronizando carrito con backend:', error);
      // Mantener carrito local actual
    }
  }

  // Migrar carrito localStorage a backend al iniciar sesión
  async migrateToBackend() {
    if (!this._shouldUseBackend() || this.cart.items.length === 0) {
      return;
    }

    try {
      // Enviar todos los items del localStorage al backend
      for (const item of this.cart.items) {
        await apiService.addToCart(item.product.id, item.quantity);
      }
      // Sincronizar con backend
      await this.syncWithBackend();
      // Limpiar localStorage
      localStorage.removeItem('alkosto_cart');
    } catch (error) {
      console.error('Error migrando carrito a backend:', error);
    }
  }

  // Guardar carrito en localStorage (solo modo offline)
  saveCartToStorage() {
    if (this._shouldUseBackend()) return; // No guardar si usamos backend
    try {
      localStorage.setItem('alkosto_cart', JSON.stringify(this.cart.items));
    } catch (error) {
      console.error('Error guardando carrito en storage:', error);
    }
  }

  // Guardar cupón aplicado
  saveAppliedCoupon(coupon) {
    try {
      if (coupon) {
        localStorage.setItem('alkosto_applied_coupon', JSON.stringify({
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          description: coupon.description,
          minPurchase: coupon.minPurchase,
          validUntil: coupon.validUntil,
          usedBy: coupon.usedBy,
          category: coupon.category,
          maxDiscount: coupon.maxDiscount
        }));
      } else {
        localStorage.removeItem('alkosto_applied_coupon');
      }
    } catch (error) {
      console.error('Error guardando cupón:', error);
    }
  }

  // Obtener cupón aplicado
  getAppliedCoupon() {
    try {
      const savedCoupon = localStorage.getItem('alkosto_applied_coupon');
      if (savedCoupon) {
        return JSON.parse(savedCoupon);
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo cupón guardado:', error);
      return null;
    }
  }

  // Limpiar cupón aplicado
  clearAppliedCoupon() {
    try {
      localStorage.removeItem('alkosto_applied_coupon');
    } catch (error) {
      console.error('Error limpiando cupón:', error);
    }
  }

  // Cargar carrito desde localStorage (solo al iniciar)
  loadCartFromStorage() {
    try {
      const savedCart = localStorage.getItem('alkosto_cart');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        // Restaurar las instancias de Product
        this.cart.items = items.map(item => ({
          ...item,
          product: new Product(
            item.product.id,
            item.product.name,
            item.product.price,
            item.product.originalPrice,
            item.product.discount,
            item.product.image,
            item.product.category,
            item.product.rating,
            item.product.stock,
            item.product.description
          )
        }));
        this.notifyChange();
      }
    } catch (error) {
      console.error('Error cargando carrito desde storage:', error);
    }
  }

  // Inicializar carrito según estado de sesión
  async initialize() {
    if (this._shouldUseBackend()) {
      await this.migrateToBackend();
      await this.syncWithBackend();
    } else {
      this.loadCartFromStorage();
    }
  }

  // Observadores (UI se actualiza sin interval)
  addChangeListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyChange() {
    try {
      this.listeners.forEach(cb => cb(this.cart));
    } catch (e) {
      // evitar romper por errores en listeners
    }
  }
}

const cartControllerInstance = new CartController();
export default cartControllerInstance;
