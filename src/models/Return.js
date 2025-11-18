// src/models/Return.js
/**
 * Modelo de Devolución/Garantía (RF25)
 * Gestiona el proceso de devoluciones y garantías de productos
 */
class Return {
  constructor(
    id,
    userId,
    orderId,
    orderItemId,
    product,
    quantity,
    reason,
    reasonType,
    description = '',
    evidence = [] // Array de URLs de imágenes
  ) {
    this.id = id;
    this.userId = userId;
    this.orderId = orderId;
    this.orderItemId = orderItemId; // ID del item específico del pedido
    this.product = product; // Información del producto
    this.quantity = quantity; // Cantidad a devolver
    this.reason = reason; // Motivo principal
    this.reasonType = reasonType; // Tipo: 'defect', 'wrong_item', 'change_mind', 'damaged', 'warranty', 'other'
    this.description = description; // Descripción detallada
    this.evidence = evidence; // Fotos/evidencia
    this.status = 'pending_review'; // pending_review, approved, rejected, in_transit, completed, cancelled
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.reviewedAt = null;
    this.completedAt = null;
    this.ticketNumber = this.generateTicketNumber();
    this.refundAmount = this.calculateRefundAmount();
    this.refundMethod = null; // 'original_payment', 'store_credit', 'exchange'
    this.shippingLabelUrl = null; // URL de guía de envío
    this.adminNotes = '';
    this.rejectionReason = null;
  }

  /**
   * Genera número de ticket único
   * Formato: RET-YYYYMMDD-XXXXX
   */
  generateTicketNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
    return `RET-${year}${month}${day}-${random}`;
  }

  /**
   * Calcula el monto del reembolso
   */
  calculateRefundAmount() {
    if (!this.product || !this.quantity) return 0;
    return this.product.price * this.quantity;
  }

  /**
   * Valida si la devolución es válida
   * Reglas:
   * - Dentro del plazo (30 días para cambio de opinión, 1 año garantía)
   * - Razón válida
   * - Evidencia requerida para ciertos tipos
   */
  static validate(returnData, orderDate) {
    const errors = [];

    // Validar razón
    if (!returnData.reason || returnData.reason.trim().length < 10) {
      errors.push('El motivo debe tener al menos 10 caracteres');
    }

    // Validar tipo de razón
    const validReasonTypes = ['defect', 'wrong_item', 'change_mind', 'damaged', 'warranty', 'other'];
    if (!returnData.reasonType || !validReasonTypes.includes(returnData.reasonType)) {
      errors.push('Tipo de motivo inválido');
    }

    // Validar plazo según tipo
    const daysSinceOrder = this.getDaysSince(orderDate);
    
    if (returnData.reasonType === 'change_mind' && daysSinceOrder > 30) {
      errors.push('El plazo para devoluciones por cambio de opinión es de 30 días');
    }

    if (['defect', 'warranty'].includes(returnData.reasonType) && daysSinceOrder > 365) {
      errors.push('El plazo de garantía es de 1 año desde la compra');
    }

    // Validar evidencia para defectos o daños
    if (['defect', 'damaged', 'wrong_item'].includes(returnData.reasonType)) {
      if (!returnData.evidence || returnData.evidence.length === 0) {
        errors.push('Se requiere evidencia fotográfica para este tipo de devolución');
      }
    }

    // Validar cantidad
    if (!returnData.quantity || returnData.quantity < 1) {
      errors.push('La cantidad debe ser mayor a 0');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Calcula días desde una fecha
   */
  static getDaysSince(date) {
    const now = new Date();
    const orderDate = new Date(date);
    const diffTime = Math.abs(now - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Verifica si la devolución está dentro del plazo según su tipo
   */
  isWithinReturnPeriod(orderDate) {
    const daysSinceOrder = Return.getDaysSince(orderDate);
    
    switch (this.reasonType) {
      case 'change_mind':
        return daysSinceOrder <= 30; // 30 días
      case 'defect':
      case 'warranty':
        return daysSinceOrder <= 365; // 1 año
      case 'wrong_item':
      case 'damaged':
        return daysSinceOrder <= 30; // 30 días
      default:
        return daysSinceOrder <= 30;
    }
  }

  /**
   * Obtiene el plazo de devolución según el tipo
   */
  getReturnPeriodDays() {
    switch (this.reasonType) {
      case 'change_mind':
      case 'wrong_item':
      case 'damaged':
        return 30;
      case 'defect':
      case 'warranty':
        return 365;
      default:
        return 30;
    }
  }

  /**
   * Actualiza el estado de la devolución
   */
  updateStatus(newStatus, notes = '') {
    const validStatuses = ['pending_review', 'approved', 'rejected', 'in_transit', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(newStatus)) {
      throw new Error('Estado inválido');
    }

    this.status = newStatus;
    this.updatedAt = new Date();

    if (notes) {
      this.adminNotes = notes;
    }

    if (newStatus === 'approved') {
      this.reviewedAt = new Date();
    }

    if (newStatus === 'completed') {
      this.completedAt = new Date();
    }
  }

  /**
   * Aprueba la devolución
   */
  approve(refundMethod = 'original_payment', shippingLabelUrl = null, notes = '') {
    this.status = 'approved';
    this.refundMethod = refundMethod;
    this.shippingLabelUrl = shippingLabelUrl;
    this.reviewedAt = new Date();
    this.updatedAt = new Date();
    
    if (notes) {
      this.adminNotes = notes;
    }
  }

  /**
   * Rechaza la devolución
   */
  reject(reason, notes = '') {
    this.status = 'rejected';
    this.rejectionReason = reason;
    this.reviewedAt = new Date();
    this.updatedAt = new Date();
    
    if (notes) {
      this.adminNotes = notes;
    }
  }

  /**
   * Marca la devolución como en tránsito
   */
  markInTransit(shippingLabelUrl = null) {
    this.status = 'in_transit';
    if (shippingLabelUrl) {
      this.shippingLabelUrl = shippingLabelUrl;
    }
    this.updatedAt = new Date();
  }

  /**
   * Completa la devolución
   */
  complete(notes = '') {
    this.status = 'completed';
    this.completedAt = new Date();
    this.updatedAt = new Date();
    
    if (notes) {
      this.adminNotes = notes;
    }
  }

  /**
   * Cancela la devolución
   */
  cancel(reason = 'Cancelado por el cliente') {
    this.status = 'cancelled';
    this.rejectionReason = reason;
    this.updatedAt = new Date();
  }

  /**
   * Obtiene el texto del estado
   */
  getStatusText() {
    const statusMap = {
      pending_review: 'Pendiente de revisión',
      approved: 'Aprobado - Generar envío',
      rejected: 'Rechazado',
      in_transit: 'En tránsito a almacén',
      completed: 'Completado - Reembolso procesado',
      cancelled: 'Cancelado'
    };
    return statusMap[this.status] || this.status;
  }

  /**
   * Obtiene el color del estado
   */
  getStatusColor() {
    const colorMap = {
      pending_review: '#FFA500',
      approved: '#4CAF50',
      rejected: '#DC3545',
      in_transit: '#0066CC',
      completed: '#28A745',
      cancelled: '#757575'
    };
    return colorMap[this.status] || '#666666';
  }

  /**
   * Obtiene el texto del tipo de razón
   */
  getReasonTypeText() {
    const reasonMap = {
      defect: 'Defecto de fábrica',
      wrong_item: 'Producto incorrecto',
      change_mind: 'Cambio de opinión',
      damaged: 'Producto dañado',
      warranty: 'Garantía',
      other: 'Otro motivo'
    };
    return reasonMap[this.reasonType] || this.reasonType;
  }

  /**
   * Obtiene el texto del método de reembolso
   */
  getRefundMethodText() {
    const refundMap = {
      original_payment: 'Método de pago original',
      store_credit: 'Crédito en tienda',
      exchange: 'Cambio por otro producto'
    };
    return this.refundMethod ? refundMap[this.refundMethod] : 'No definido';
  }

  /**
   * Verifica si requiere evidencia fotográfica
   */
  requiresEvidence() {
    return ['defect', 'damaged', 'wrong_item', 'warranty'].includes(this.reasonType);
  }

  /**
   * Verifica si puede ser cancelada por el cliente
   */
  canBeCancelledByCustomer() {
    return ['pending_review', 'approved'].includes(this.status);
  }

  /**
   * Serializa a JSON para persistencia
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      orderId: this.orderId,
      orderItemId: this.orderItemId,
      product: this.product.toJSON ? this.product.toJSON() : this.product,
      quantity: this.quantity,
      reason: this.reason,
      reasonType: this.reasonType,
      description: this.description,
      evidence: this.evidence,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      reviewedAt: this.reviewedAt,
      completedAt: this.completedAt,
      ticketNumber: this.ticketNumber,
      refundAmount: this.refundAmount,
      refundMethod: this.refundMethod,
      shippingLabelUrl: this.shippingLabelUrl,
      adminNotes: this.adminNotes,
      rejectionReason: this.rejectionReason
    };
  }

  /**
   * Crea instancia desde JSON
   */
  static fromJSON(json) {
    const returnInstance = new Return(
      json.id,
      json.userId,
      json.orderId,
      json.orderItemId,
      json.product,
      json.quantity,
      json.reason,
      json.reasonType,
      json.description,
      json.evidence
    );

    returnInstance.status = json.status;
    returnInstance.createdAt = new Date(json.createdAt);
    returnInstance.updatedAt = new Date(json.updatedAt);
    returnInstance.reviewedAt = json.reviewedAt ? new Date(json.reviewedAt) : null;
    returnInstance.completedAt = json.completedAt ? new Date(json.completedAt) : null;
    returnInstance.ticketNumber = json.ticketNumber;
    returnInstance.refundAmount = json.refundAmount;
    returnInstance.refundMethod = json.refundMethod;
    returnInstance.shippingLabelUrl = json.shippingLabelUrl;
    returnInstance.adminNotes = json.adminNotes || '';
    returnInstance.rejectionReason = json.rejectionReason || null;

    return returnInstance;
  }
}

export default Return;
