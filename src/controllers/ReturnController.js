// src/controllers/ReturnController.js
import Return from '../models/Return';
import NotificationController from './NotificationController';
import apiService from '../services/ApiService';

/**
 * Controlador de Devoluciones y Garantías (RF25)
 * Gestiona el ciclo completo de devoluciones: creación, seguimiento, aprobación y reembolsos
 */
class ReturnController {
  constructor() {
    this.returns = [];
    this.loadReturnsFromStorage();
  }

  /**
   * Crear nueva solicitud de devolución
   * @param {string} userId - ID del usuario
   * @param {string} orderId - ID del pedido
   * @param {string} orderItemId - ID del item del pedido
   * @param {Object} product - Información del producto
   * @param {number} quantity - Cantidad a devolver
   * @param {string} reasonType - Tipo de motivo
   * @param {string} reason - Motivo detallado
   * @param {string} description - Descripción adicional
   * @param {Array} evidence - Array de URLs de evidencia
   * @param {Date} orderDate - Fecha del pedido original
   * @returns {Object} - {success: boolean, return?: Return, message?: string}
   */
  createReturn(userId, orderId, orderItemId, product, quantity, reasonType, reason, description = '', evidence = [], orderDate) {
    try {
      // Validar datos
      const returnData = {
        userId,
        orderId,
        orderItemId,
        product,
        quantity,
        reasonType,
        reason,
        description,
        evidence
      };

      const validation = Return.validate(returnData, orderDate);
      
      if (!validation.valid) {
        return {
          success: false,
          message: validation.errors.join(', ')
        };
      }

      // Generar ID único
      const returnId = this.generateReturnId();

      // Crear nueva devolución
      const newReturn = new Return(
        returnId,
        userId,
        orderId,
        orderItemId,
        product,
        quantity,
        reason,
        reasonType,
        description,
        evidence
      );

      // Agregar a la lista
      this.returns.push(newReturn);
      this.saveReturnsToStorage();

      // Generar notificación
      NotificationController.notifyReturnCreated(
        userId,
        newReturn.ticketNumber,
        product.name,
        newReturn.refundAmount
      );

      // TODO: En producción, enviar email con confirmación
      // TODO: En producción, integrar con sistema logístico para guía de envío

      return {
        success: true,
        return: newReturn,
        message: 'Solicitud de devolución creada exitosamente'
      };
    } catch (error) {
      console.error('Error al crear devolución:', error);
      return {
        success: false,
        message: 'Error al procesar la solicitud de devolución'
      };
    }
  }

  /**
   * Obtener devoluciones de un usuario
   * @param {string} userId - ID del usuario
   * @returns {Array} - Lista de devoluciones
   */
  getUserReturns(userId) {
    return this.returns.filter(ret => ret.userId === userId);
  }

  /**
   * Obtener devolución por ID
   * @param {string} returnId - ID de la devolución
   * @returns {Return|null}
   */
  getReturnById(returnId) {
    return this.returns.find(ret => ret.id === returnId) || null;
  }

  /**
   * Obtener devolución por ticket number
   * @param {string} ticketNumber - Número de ticket
   * @returns {Return|null}
   */
  getReturnByTicket(ticketNumber) {
    return this.returns.find(ret => ret.ticketNumber === ticketNumber) || null;
  }

  /**
   * Obtener devoluciones por pedido
   * @param {string} orderId - ID del pedido
   * @returns {Array}
   */
  getReturnsByOrder(orderId) {
    return this.returns.filter(ret => ret.orderId === orderId);
  }

  /**
   * Aprobar devolución (Admin)
   * @param {string} returnId - ID de la devolución
   * @param {string} refundMethod - Método de reembolso
   * @param {string} shippingLabelUrl - URL de guía de envío
   * @param {string} notes - Notas del administrador
   * @returns {Object}
   */
  approveReturn(returnId, refundMethod = 'original_payment', shippingLabelUrl = null, notes = '') {
    try {
      const returnItem = this.getReturnById(returnId);
      
      if (!returnItem) {
        return {
          success: false,
          message: 'Devolución no encontrada'
        };
      }

      if (returnItem.status !== 'pending_review') {
        return {
          success: false,
          message: 'La devolución no está pendiente de revisión'
        };
      }

      // Aprobar
      returnItem.approve(refundMethod, shippingLabelUrl, notes);
      this.saveReturnsToStorage();

      // Notificar al usuario
      NotificationController.notifyReturnApproved(
        returnItem.userId,
        returnItem.ticketNumber,
        returnItem.refundAmount
      );

      // TODO: En producción, enviar email con guía de envío
      // TODO: Generar guía logística real con proveedor (Servientrega, DHL, etc.)

      return {
        success: true,
        return: returnItem,
        message: 'Devolución aprobada exitosamente'
      };
    } catch (error) {
      console.error('Error al aprobar devolución:', error);
      return {
        success: false,
        message: 'Error al aprobar la devolución'
      };
    }
  }

  /**
   * Rechazar devolución (Admin)
   * @param {string} returnId - ID de la devolución
   * @param {string} reason - Razón del rechazo
   * @param {string} notes - Notas adicionales
   * @returns {Object}
   */
  rejectReturn(returnId, reason, notes = '') {
    try {
      const returnItem = this.getReturnById(returnId);
      
      if (!returnItem) {
        return {
          success: false,
          message: 'Devolución no encontrada'
        };
      }

      if (returnItem.status !== 'pending_review') {
        return {
          success: false,
          message: 'La devolución no está pendiente de revisión'
        };
      }

      // Rechazar
      returnItem.reject(reason, notes);
      this.saveReturnsToStorage();

      // Notificar al usuario
      NotificationController.notifyReturnRejected(
        returnItem.userId,
        returnItem.ticketNumber,
        reason
      );

      return {
        success: true,
        return: returnItem,
        message: 'Devolución rechazada'
      };
    } catch (error) {
      console.error('Error al rechazar devolución:', error);
      return {
        success: false,
        message: 'Error al rechazar la devolución'
      };
    }
  }

  /**
   * Marcar devolución como en tránsito
   * @param {string} returnId - ID de la devolución
   * @param {string} trackingNumber - Número de seguimiento del envío
   * @returns {Object}
   */
  markInTransit(returnId, trackingNumber = null) {
    try {
      const returnItem = this.getReturnById(returnId);
      
      if (!returnItem) {
        return {
          success: false,
          message: 'Devolución no encontrada'
        };
      }

      returnItem.markInTransit(trackingNumber);
      this.saveReturnsToStorage();

      // Notificar al usuario
      NotificationController.notifyReturnInTransit(
        returnItem.userId,
        returnItem.ticketNumber
      );

      return {
        success: true,
        return: returnItem,
        message: 'Devolución marcada como en tránsito'
      };
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      return {
        success: false,
        message: 'Error al actualizar el estado'
      };
    }
  }

  /**
   * Completar devolución y procesar reembolso
   * @param {string} returnId - ID de la devolución
   * @param {string} notes - Notas del proceso
   * @returns {Object}
   */
  completeReturn(returnId, notes = '') {
    try {
      const returnItem = this.getReturnById(returnId);
      
      if (!returnItem) {
        return {
          success: false,
          message: 'Devolución no encontrada'
        };
      }

      if (!['approved', 'in_transit'].includes(returnItem.status)) {
        return {
          success: false,
          message: 'La devolución no puede ser completada en su estado actual'
        };
      }

      // Completar devolución
      returnItem.complete(notes);
      this.saveReturnsToStorage();

      // Procesar reembolso (mock - en producción integrar con pasarela)
      const refundResult = this.processRefund(returnItem);

      if (refundResult.success) {
        // Revertir stock del producto
        this.revertProductStock(returnItem.product.id, returnItem.quantity);

        // Notificar al usuario
        NotificationController.notifyReturnCompleted(
          returnItem.userId,
          returnItem.ticketNumber,
          returnItem.refundAmount,
          returnItem.refundMethod
        );

        return {
          success: true,
          return: returnItem,
          refund: refundResult,
          message: 'Devolución completada y reembolso procesado'
        };
      } else {
        return {
          success: false,
          message: 'Error al procesar el reembolso'
        };
      }
    } catch (error) {
      console.error('Error al completar devolución:', error);
      return {
        success: false,
        message: 'Error al completar la devolución'
      };
    }
  }

  /**
   * Cancelar solicitud de devolución (Cliente)
   * @param {string} returnId - ID de la devolución
   * @param {string} reason - Razón de cancelación
   * @returns {Object}
   */
  cancelReturn(returnId, reason = 'Cancelado por el cliente') {
    try {
      const returnItem = this.getReturnById(returnId);
      
      if (!returnItem) {
        return {
          success: false,
          message: 'Devolución no encontrada'
        };
      }

      if (!returnItem.canBeCancelledByCustomer()) {
        return {
          success: false,
          message: 'La devolución no puede ser cancelada en su estado actual'
        };
      }

      returnItem.cancel(reason);
      this.saveReturnsToStorage();

      return {
        success: true,
        return: returnItem,
        message: 'Solicitud de devolución cancelada'
      };
    } catch (error) {
      console.error('Error al cancelar devolución:', error);
      return {
        success: false,
        message: 'Error al cancelar la devolución'
      };
    }
  }

  /**
   * Procesar reembolso (Mock - En producción integrar con pasarela)
   * @param {Return} returnItem - Devolución
   * @returns {Object}
   */
  processRefund(returnItem) {
    try {
      // Mock: Simular procesamiento de reembolso
      // En producción, integrar con:
      // - PayU (refund API)
      // - MercadoPago (refunds)
      // - PSE (reversión)
      // - Sistema bancario

      console.log('Procesando reembolso:', {
        ticketNumber: returnItem.ticketNumber,
        amount: returnItem.refundAmount,
        method: returnItem.refundMethod
      });

      // Simular éxito
      return {
        success: true,
        refundId: `REF-${Date.now()}`,
        amount: returnItem.refundAmount,
        method: returnItem.refundMethod,
        processedAt: new Date()
      };
    } catch (error) {
      console.error('Error al procesar reembolso:', error);
      return {
        success: false,
        message: 'Error al procesar el reembolso'
      };
    }
  }

  /**
   * Revertir stock del producto
   * @param {string} productId - ID del producto
   * @param {number} quantity - Cantidad a revertir
   */
  revertProductStock(productId, quantity) {
    try {
      // TODO: En producción, integrar con ProductController
      // o backend para actualizar stock
      console.log(`Revirtiendo stock: Producto ${productId} +${quantity} unidades`);
      
      // Mock: Simulación
      const stockKey = `product_stock_${productId}`;
      const currentStock = parseInt(localStorage.getItem(stockKey) || '0');
      const newStock = currentStock + quantity;
      localStorage.setItem(stockKey, newStock.toString());
      
      return {
        success: true,
        productId,
        quantityReverted: quantity,
        newStock
      };
    } catch (error) {
      console.error('Error al revertir stock:', error);
      return {
        success: false,
        message: 'Error al revertir el stock'
      };
    }
  }

  /**
   * Generar guía de envío (Mock - En producción integrar con logística)
   * @param {Return} returnItem - Devolución
   * @param {Object} userAddress - Dirección del usuario
   * @returns {Object}
   */
  generateShippingLabel(returnItem, userAddress) {
    try {
      // Mock: En producción, integrar con:
      // - Servientrega API
      // - DHL API
      // - Coordinadora
      // - TCC

      const labelUrl = `https://alkosto-labels.example.com/return/${returnItem.ticketNumber}.pdf`;
      
      console.log('Generando guía de envío:', {
        ticketNumber: returnItem.ticketNumber,
        origin: userAddress,
        destination: 'ALMACÉN_CENTRAL_ALKOSTO',
        weight: returnItem.product.weight || 1
      });

      return {
        success: true,
        labelUrl,
        trackingNumber: `SHIP-${Date.now()}`,
        carrier: 'Servientrega',
        estimatedPickup: this.getEstimatedPickupDate()
      };
    } catch (error) {
      console.error('Error al generar guía:', error);
      return {
        success: false,
        message: 'Error al generar la guía de envío'
      };
    }
  }

  /**
   * Obtiene fecha estimada de recolección (2 días hábiles)
   */
  getEstimatedPickupDate() {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date;
  }

  /**
   * Filtrar devoluciones por estado
   * @param {string} userId - ID del usuario
   * @param {string} status - Estado a filtrar
   * @returns {Array}
   */
  filterReturnsByStatus(userId, status) {
    return this.returns.filter(ret => ret.userId === userId && ret.status === status);
  }

  /**
   * Obtener estadísticas de devoluciones de un usuario
   * @param {string} userId - ID del usuario
   * @returns {Object}
   */
  getUserReturnStats(userId) {
    const userReturns = this.getUserReturns(userId);
    
    return {
      total: userReturns.length,
      pending: userReturns.filter(r => r.status === 'pending_review').length,
      approved: userReturns.filter(r => r.status === 'approved').length,
      rejected: userReturns.filter(r => r.status === 'rejected').length,
      completed: userReturns.filter(r => r.status === 'completed').length,
      totalRefunded: userReturns
        .filter(r => r.status === 'completed')
        .reduce((sum, r) => sum + r.refundAmount, 0)
    };
  }

  /**
   * Generar ID único para devolución
   */
  generateReturnId() {
    return `return_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Persistir devoluciones en localStorage
   */
  saveReturnsToStorage() {
    try {
      const returnsJSON = this.returns.map(ret => ret.toJSON());
      localStorage.setItem('alkosto_returns', JSON.stringify(returnsJSON));
    } catch (error) {
      console.error('Error al guardar devoluciones:', error);
    }
  }

  /**
   * Cargar devoluciones desde localStorage
   */
  loadReturnsFromStorage() {
    try {
      const returnsJSON = localStorage.getItem('alkosto_returns');
      if (returnsJSON) {
        const returnsData = JSON.parse(returnsJSON);
        this.returns = returnsData.map(data => Return.fromJSON(data));
      }
    } catch (error) {
      console.error('Error al cargar devoluciones:', error);
      this.returns = [];
    }
  }

  /**
   * Limpiar todas las devoluciones (solo para desarrollo)
   */
  clearAllReturns() {
    this.returns = [];
    localStorage.removeItem('alkosto_returns');
    return {
      success: true,
      message: 'Todas las devoluciones han sido eliminadas'
    };
  }
}

// Instancia singleton
const returnController = new ReturnController();
export default returnController;
