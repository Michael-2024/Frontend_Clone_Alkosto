import Order from '../models/Order';
import Product from '../models/Product';
import NotificationController from './NotificationController';

// Controlador de Pedidos
class OrderController {
  constructor() {
    this.orders = [];
    this.loadOrdersFromStorage();
  }

  /**
   * Crear nuevo pedido
   * @param {string} userId - ID del usuario
   * @param {Array} cartItems - Items del carrito
   * @param {Object} shippingAddress - Dirección de envío
   * @param {Object} paymentMethod - Método de pago
   * @param {Object} coupon - Cupón aplicado {code, discount} o null
   * @returns {Object} - {success: boolean, order?: Order, message?: string}
   */
  createOrder(userId, cartItems, shippingAddress, paymentMethod, coupon = null) {
    try {
      // Validaciones
      if (!userId) {
        return { success: false, message: 'Usuario no identificado' };
      }

      if (!cartItems || cartItems.length === 0) {
        return { success: false, message: 'El carrito está vacío' };
      }

      if (!shippingAddress || !this.validateShippingAddress(shippingAddress)) {
        return { success: false, message: 'Dirección de envío incompleta' };
      }

      if (!paymentMethod || !this.validatePaymentMethod(paymentMethod)) {
        return { success: false, message: 'Método de pago inválido' };
      }

      // Generar ID único
      const orderId = this.generateOrderId();

      // Crear nueva orden
      const order = new Order(
        orderId,
        userId,
        cartItems,
        shippingAddress,
        paymentMethod,
        'procesando',
        coupon
      );

      // Agregar a la lista de órdenes
      this.orders.push(order);
      this.saveOrdersToStorage();

      // Generar notificación de pedido creado
      NotificationController.notifyOrderCreated(
        userId,
        orderId,
        order.trackingNumber,
        order.total
      );

      return {
        success: true,
        order: order,
        message: 'Pedido creado exitosamente'
      };
    } catch (error) {
      console.error('Error al crear pedido:', error);
      return {
        success: false,
        message: 'Error al procesar el pedido'
      };
    }
  }

  /**
   * Obtener pedidos de un usuario
   * @param {string} userId - ID del usuario
   * @returns {Array} - Lista de pedidos del usuario
   */
  getUserOrders(userId) {
    return this.orders.filter(order => order.userId === userId);
  }

  /**
   * Obtener un pedido por ID
   * @param {string} orderId - ID del pedido
   * @returns {Order|null} - Pedido encontrado o null
   */
  getOrderById(orderId) {
    return this.orders.find(order => order.id === orderId) || null;
  }

  /**
   * Buscar pedido por tracking number y documento
   * @param {string} trackingNumber - Número de seguimiento
   * @param {string} document - Documento de identidad
   * @returns {Order|null} - Pedido encontrado o null
   */
  getOrderByTracking(trackingNumber, document) {
    // Buscar por tracking number
    const order = this.orders.find(o => o.trackingNumber === trackingNumber);
    
    if (!order) {
      return null;
    }

    // Verificar que el documento coincida con la dirección de envío
    if (order.shippingAddress.document === document) {
      return order;
    }

    return null;
  }

  /**
   * Actualizar estado de un pedido
   * @param {string} orderId - ID del pedido
   * @param {string} newStatus - Nuevo estado
   * @returns {boolean} - Éxito de la operación
   */
  updateOrderStatus(orderId, newStatus) {
    const order = this.getOrderById(orderId);
    if (order) {
      const oldStatus = order.status;
      order.updateStatus(newStatus);
      this.saveOrdersToStorage();

      // Generar notificación de cambio de estado
      if (oldStatus !== newStatus) {
        NotificationController.notifyOrderStatusChange(
          order.userId,
          orderId,
          order.trackingNumber,
          newStatus
        );
      }

      return true;
    }
    return false;
  }

  /**
   * Cancelar un pedido (RF19 - Cancelar pedidos)
   * @param {string} orderId - ID del pedido
   * @param {string} reason - Motivo de la cancelación
   * @param {string} userId - ID del usuario que cancela (para validación)
   * @returns {Object} - {success: boolean, message: string, order?: Order}
   */
  cancelOrder(orderId, reason, userId) {
    try {
      // Buscar el pedido
      const order = this.getOrderById(orderId);

      if (!order) {
        return {
          success: false,
          message: 'Pedido no encontrado'
        };
      }

      // Verificar que el pedido pertenezca al usuario
      if (order.userId !== userId) {
        return {
          success: false,
          message: 'No tienes permisos para cancelar este pedido'
        };
      }

      // Validar si el pedido puede ser cancelado según las políticas
      const cancellationCheck = order.canBeCancelled();
      
      if (!cancellationCheck.canCancel) {
        return {
          success: false,
          message: cancellationCheck.reason
        };
      }

      // Cancelar el pedido
      const cancelResult = order.cancel(reason);

      if (!cancelResult.success) {
        return cancelResult;
      }

      // Guardar cambios
      this.saveOrdersToStorage();

      // Generar notificación de cancelación
      NotificationController.notifyOrderCancelled(
        order.userId,
        orderId,
        order.trackingNumber,
        reason
      );

      return {
        success: true,
        message: 'Pedido cancelado exitosamente',
        order: order
      };
    } catch (error) {
      console.error('Error al cancelar pedido:', error);
      return {
        success: false,
        message: 'Error al procesar la cancelación del pedido'
      };
    }
  }

  /**
   * Obtener todos los pedidos
   * @returns {Array} - Lista de todos los pedidos
   */
  getAllOrders() {
    return [...this.orders];
  }

  /**
   * Validar dirección de envío
   * @param {Object} address - Dirección a validar
   * @returns {boolean} - Es válida
   */
  validateShippingAddress(address) {
    const requiredFields = ['fullName', 'document', 'phone', 'address', 'city', 'department'];
    return requiredFields.every(field => address[field] && address[field].trim() !== '');
  }

  /**
   * Validar método de pago
   * @param {Object} payment - Método de pago a validar
   * @returns {boolean} - Es válido
   */
  validatePaymentMethod(payment) {
    if (!payment.type) return false;

    if (payment.type === 'card') {
      return payment.cardNumber && payment.cardHolder && payment.expiryDate && payment.cvv;
    }

    if (payment.type === 'pse' || payment.type === 'cash') {
      return true;
    }

    return false;
  }

  /**
   * Generar ID único para pedido
   * @returns {string} - ID del pedido
   */
  generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORD-${timestamp}-${random}`;
  }

  /**
   * Guardar pedidos en localStorage
   */
  saveOrdersToStorage() {
    try {
      const ordersData = this.orders.map(order => order.toJSON());
      localStorage.setItem('alkosto_orders', JSON.stringify(ordersData));
    } catch (error) {
      console.error('Error al guardar pedidos:', error);
    }
  }

  /**
   * Cargar pedidos desde localStorage
   */
  loadOrdersFromStorage() {
    try {
      const savedOrders = localStorage.getItem('alkosto_orders');
      if (savedOrders) {
        const ordersData = JSON.parse(savedOrders);
        this.orders = ordersData.map(orderData => {
          // Reconstruir productos
          const items = orderData.items.map(item => ({
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
            ),
            quantity: item.quantity
          }));

          // Reconstruir orden
          const restoredCoupon = orderData.coupon ? { code: orderData.coupon.code, discount: orderData.coupon.discount } : null;
          const order = new Order(
            orderData.id,
            orderData.userId,
            items,
            orderData.shippingAddress,
            orderData.paymentMethod,
            orderData.status,
            restoredCoupon
          );

          // Restaurar fechas y tracking
          order.createdAt = new Date(orderData.createdAt);
          order.updatedAt = new Date(orderData.updatedAt);
          order.trackingNumber = orderData.trackingNumber;
          // Alinear descuento si estaba persistido
          if (orderData.discount) {
            order.discount = orderData.discount;
            order.total = order.calculateTotal();
          }
          
          // Restaurar datos de cancelación si existen
          if (orderData.cancellationReason) {
            order.cancellationReason = orderData.cancellationReason;
          }
          if (orderData.cancelledAt) {
            order.cancelledAt = new Date(orderData.cancelledAt);
          }

          return order;
        });
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      this.orders = [];
    }
  }

  /**
   * Limpiar todos los pedidos (solo para desarrollo)
   */
  clearAllOrders() {
    this.orders = [];
    localStorage.removeItem('alkosto_orders');
  }
}

// Crear instancia singleton
const orderControllerInstance = new OrderController();
export default orderControllerInstance;
