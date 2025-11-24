// src/controllers/PaymentMethodController.js

import PaymentMethod from '../models/PaymentMethod';

/**
 * Controlador para la gestión de métodos de pago
 * Patrón Singleton
 */
class PaymentMethodController {
  constructor() {
    this.storageKey = 'alkosto_payment_methods';
    this.paymentMethods = [];
    this.loadFromStorage();
  }

  /**
   * Carga los métodos de pago desde localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.paymentMethods = data.map(pm => PaymentMethod.fromJSON(pm));
      }
    } catch (error) {
      console.error('Error loading payment methods from storage:', error);
      this.paymentMethods = [];
    }
  }

  /**
   * Guarda los métodos de pago en localStorage
   */
  saveToStorage() {
    try {
      const data = this.paymentMethods.map(pm => pm.toJSON());
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving payment methods to storage:', error);
      return false;
    }
  }

  /**
   * Genera un ID único para un nuevo método de pago
   */
  generateId() {
    return `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Agrega un nuevo método de pago
   */
  addPaymentMethod(userId, type, nickname, details, setAsDefault = false) {
    try {
      // Validar datos según el tipo
      if (!this.validatePaymentMethodData(type, details)) {
        return {
          success: false,
          message: 'Datos del método de pago inválidos'
        };
      }

      const id = this.generateId();
      let cardDetails = null;
      let pseDetails = null;
      let walletDetails = null;

      // Organizar detalles según el tipo
      switch (type) {
        case 'card':
          cardDetails = {
            lastFourDigits: details.cardNumber.replace(/\s/g, '').slice(-4),
            cardHolder: details.cardHolder,
            expiryDate: details.expiryDate,
            brand: PaymentMethod.detectCardBrand(details.cardNumber)
          };
          break;
        case 'pse':
          pseDetails = {
            bank: details.bank,
            personType: details.personType || 'natural'
          };
          break;
        case 'nequi':
        case 'daviplata':
          walletDetails = {
            phone: details.phone
          };
          break;
      }

      const paymentMethod = new PaymentMethod(
        id,
        userId,
        type,
        nickname,
        setAsDefault,
        cardDetails,
        pseDetails,
        walletDetails,
        new Date(),
        null
      );

      // Si se marca como predeterminado, quitar el predeterminado actual
      if (setAsDefault) {
        this.paymentMethods.forEach(pm => {
          if (pm.userId === userId && pm.isDefault) {
            pm.unsetDefault();
          }
        });
      }

      this.paymentMethods.push(paymentMethod);
      this.saveToStorage();

      return {
        success: true,
        paymentMethod: paymentMethod,
        message: 'Método de pago agregado exitosamente'
      };
    } catch (error) {
      console.error('Error adding payment method:', error);
      return {
        success: false,
        message: 'Error al agregar método de pago'
      };
    }
  }

  /**
   * Valida los datos del método de pago según su tipo
   */
  validatePaymentMethodData(type, details) {
    switch (type) {
      case 'card':
        if (!details.cardNumber || !details.cardHolder || !details.expiryDate) {
          return false;
        }
        // Validar número de tarjeta
        if (!PaymentMethod.validateCardNumber(details.cardNumber)) {
          return false;
        }
        // Validar fecha de expiración
        const expiryRegex = /^\d{2}\/\d{2}$/;
        if (!expiryRegex.test(details.expiryDate)) {
          return false;
        }
        return true;

      case 'pse':
        return details.bank && details.bank !== '';

      case 'nequi':
      case 'daviplata':
        if (!details.phone) return false;
        const phoneClean = details.phone.replace(/\D/g, '');
        return phoneClean.length === 10;

      default:
        return false;
    }
  }

  /**
   * Obtiene todos los métodos de pago de un usuario
   */
  getUserPaymentMethods(userId) {
    return this.paymentMethods.filter(pm => pm.userId === userId);
  }

  /**
   * Obtiene el método de pago predeterminado de un usuario
   */
  getDefaultPaymentMethod(userId) {
    return this.paymentMethods.find(pm => pm.userId === userId && pm.isDefault);
  }

  /**
   * Obtiene un método de pago por ID
   */
  getPaymentMethodById(id) {
    return this.paymentMethods.find(pm => pm.id === id);
  }

  /**
   * Actualiza un método de pago
   */
  updatePaymentMethod(id, updates) {
    try {
      const index = this.paymentMethods.findIndex(pm => pm.id === id);
      
      if (index === -1) {
        return {
          success: false,
          message: 'Método de pago no encontrado'
        };
      }

      const paymentMethod = this.paymentMethods[index];

      // Actualizar nickname si se proporciona
      if (updates.nickname) {
        paymentMethod.nickname = updates.nickname;
      }

      // Si se marca como predeterminado, quitar el predeterminado actual
      if (updates.setAsDefault) {
        this.paymentMethods.forEach(pm => {
          if (pm.userId === paymentMethod.userId && pm.isDefault) {
            pm.unsetDefault();
          }
        });
        paymentMethod.setAsDefault();
      }

      this.saveToStorage();

      return {
        success: true,
        paymentMethod: paymentMethod,
        message: 'Método de pago actualizado exitosamente'
      };
    } catch (error) {
      console.error('Error updating payment method:', error);
      return {
        success: false,
        message: 'Error al actualizar método de pago'
      };
    }
  }

  /**
   * Elimina un método de pago
   */
  deletePaymentMethod(id) {
    try {
      const index = this.paymentMethods.findIndex(pm => pm.id === id);
      
      if (index === -1) {
        return {
          success: false,
          message: 'Método de pago no encontrado'
        };
      }

      const wasDefault = this.paymentMethods[index].isDefault;
      const userId = this.paymentMethods[index].userId;

      this.paymentMethods.splice(index, 1);

      // Si era el predeterminado, marcar otro como predeterminado
      if (wasDefault) {
        const userMethods = this.getUserPaymentMethods(userId);
        if (userMethods.length > 0) {
          userMethods[0].setAsDefault();
        }
      }

      this.saveToStorage();

      return {
        success: true,
        message: 'Método de pago eliminado exitosamente'
      };
    } catch (error) {
      console.error('Error deleting payment method:', error);
      return {
        success: false,
        message: 'Error al eliminar método de pago'
      };
    }
  }

  /**
   * Establece un método de pago como predeterminado
   */
  setDefaultPaymentMethod(id) {
    try {
      const paymentMethod = this.getPaymentMethodById(id);
      
      if (!paymentMethod) {
        return {
          success: false,
          message: 'Método de pago no encontrado'
        };
      }

      // Quitar el predeterminado actual
      this.paymentMethods.forEach(pm => {
        if (pm.userId === paymentMethod.userId && pm.isDefault) {
          pm.unsetDefault();
        }
      });

      paymentMethod.setAsDefault();
      this.saveToStorage();

      return {
        success: true,
        paymentMethod: paymentMethod,
        message: 'Método de pago establecido como predeterminado'
      };
    } catch (error) {
      console.error('Error setting default payment method:', error);
      return {
        success: false,
        message: 'Error al establecer método predeterminado'
      };
    }
  }

  /**
   * Marca un método de pago como usado
   */
  markAsUsed(id) {
    try {
      const paymentMethod = this.getPaymentMethodById(id);
      
      if (paymentMethod) {
        paymentMethod.markAsUsed();
        this.saveToStorage();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error marking payment method as used:', error);
      return false;
    }
  }

  /**
   * Obtiene estadísticas de métodos de pago de un usuario
   */
  getUserPaymentStats(userId) {
    const methods = this.getUserPaymentMethods(userId);
    
    return {
      total: methods.length,
      byType: {
        card: methods.filter(pm => pm.type === 'card').length,
        pse: methods.filter(pm => pm.type === 'pse').length,
        nequi: methods.filter(pm => pm.type === 'nequi').length,
        daviplata: methods.filter(pm => pm.type === 'daviplata').length
      },
      hasDefault: methods.some(pm => pm.isDefault),
      expired: methods.filter(pm => pm.type === 'card' && pm.isExpired()).length
    };
  }

  /**
   * Limpia métodos de pago expirados
   */
  cleanExpiredMethods(userId) {
    const beforeCount = this.paymentMethods.length;
    this.paymentMethods = this.paymentMethods.filter(pm => {
      if (pm.userId !== userId) return true;
      return pm.type !== 'card' || !pm.isExpired();
    });
    
    const removed = beforeCount - this.paymentMethods.length;
    
    if (removed > 0) {
      this.saveToStorage();
    }
    
    return {
      success: true,
      removedCount: removed,
      message: `${removed} método(s) de pago expirado(s) eliminado(s)`
    };
  }

  /**
   * Obtiene los bancos disponibles para PSE
   */
  getAvailableBanks() {
    return [
      { value: 'Bancolombia', label: 'Bancolombia' },
      { value: 'Davivienda', label: 'Davivienda' },
      { value: 'BBVA', label: 'BBVA' },
      { value: 'Banco de Bogotá', label: 'Banco de Bogotá' },
      { value: 'Banco de Occidente', label: 'Banco de Occidente' },
      { value: 'Banco Popular', label: 'Banco Popular' },
      { value: 'AV Villas', label: 'AV Villas' },
      { value: 'Scotiabank Colpatria', label: 'Scotiabank Colpatria' },
      { value: 'Banco Caja Social', label: 'Banco Caja Social' },
      { value: 'Banco Agrario', label: 'Banco Agrario' }
    ];
  }

  /**
   * Simula el procesamiento de un pago
   */
  async processPayment(paymentMethodId, amount, orderId) {
    return new Promise((resolve) => {
      // Simular delay de procesamiento
      setTimeout(() => {
        const paymentMethod = this.getPaymentMethodById(paymentMethodId);
        
        if (!paymentMethod) {
          resolve({
            success: false,
            message: 'Método de pago no encontrado',
            transactionId: null
          });
          return;
        }

        // Simular 95% de éxito
        const isSuccess = Math.random() > 0.05;

        if (isSuccess) {
          // Marcar como usado
          this.markAsUsed(paymentMethodId);

          const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          
          resolve({
            success: true,
            message: 'Pago procesado exitosamente',
            transactionId: transactionId,
            paymentMethod: paymentMethod.getDisplayText(),
            amount: amount,
            orderId: orderId,
            timestamp: new Date()
          });
        } else {
          resolve({
            success: false,
            message: 'El pago fue rechazado. Por favor intenta con otro método de pago.',
            transactionId: null,
            errorCode: 'PAYMENT_DECLINED'
          });
        }
      }, 2000); // 2 segundos de delay para simular procesamiento
    });
  }
}

// Exportar instancia singleton
const paymentMethodController = new PaymentMethodController();
export default paymentMethodController;
