// Modelo PQRS (Peticiones, Quejas, Reclamos, Sugerencias)
class PQRS {
  constructor(data = {}) {
    this.id = data.id || null;
    this.ticketNumber = data.ticketNumber || data.ticket_number || this.generateTicketNumber();
    this.type = data.type || data.tipo || 'Petición'; // Petición, Queja, Reclamo, Sugerencia
    this.subject = data.subject || data.asunto || '';
    this.description = data.description || data.descripcion || '';
    this.attachments = data.attachments || data.adjuntos || [];
    this.orderId = data.orderId || data.pedido_id || null;
    this.userId = data.userId || data.usuario_id || null;
    this.status = data.status || data.estado || 'Abierto'; // Abierto, En Proceso, Resuelto, Cerrado
    this.priority = data.priority || data.prioridad || 'Media'; // Baja, Media, Alta, Urgente
    this.email = data.email || data.correo || '';
    this.phone = data.phone || data.telefono || '';
    this.createdAt = data.createdAt || data.fecha_creacion || new Date().toISOString();
    this.updatedAt = data.updatedAt || data.fecha_actualizacion || null;
    this.resolvedAt = data.resolvedAt || data.fecha_resolucion || null;
    this.response = data.response || data.respuesta || '';
    this.assignedTo = data.assignedTo || data.asignado_a || null;
  }

  // Genera un número de radicado único
  generateTicketNumber() {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PQRS-${year}-${timestamp}${random}`;
  }

  // Valida que los campos requeridos estén completos
  validate() {
    const errors = [];

    if (!this.type || !['Petición', 'Queja', 'Reclamo', 'Sugerencia'].includes(this.type)) {
      errors.push('Tipo de PQRS inválido');
    }

    if (!this.subject || this.subject.trim().length < 5) {
      errors.push('El asunto debe tener al menos 5 caracteres');
    }

    if (!this.description || this.description.trim().length < 10) {
      errors.push('La descripción debe tener al menos 10 caracteres');
    }

    if (this.description && this.description.length > 1000) {
      errors.push('La descripción no puede exceder 1000 caracteres');
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Email inválido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Valida formato de email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Obtiene el color asociado al tipo de PQRS
  getTypeColor() {
    const colors = {
      'Petición': '#2196F3',
      'Queja': '#FF9800',
      'Reclamo': '#F44336',
      'Sugerencia': '#4CAF50'
    };
    return colors[this.type] || '#757575';
  }

  // Obtiene el color asociado al estado
  getStatusColor() {
    const colors = {
      'Abierto': '#2196F3',
      'En Proceso': '#FF9800',
      'Resuelto': '#4CAF50',
      'Cerrado': '#757575'
    };
    return colors[this.status] || '#757575';
  }

  // Obtiene el tiempo transcurrido desde la creación
  getElapsedTime() {
    const now = new Date();
    const created = new Date(this.createdAt);
    const diffMs = now - created;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays > 0) {
      return `${diffDays} día${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    } else {
      return 'Hace menos de 1 hora';
    }
  }

  // Verifica si el PQRS está dentro del tiempo de respuesta esperado (5 días hábiles)
  isWithinResponseTime() {
    if (this.status === 'Resuelto' || this.status === 'Cerrado') {
      return true;
    }

    const now = new Date();
    const created = new Date(this.createdAt);
    const diffMs = now - created;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    return diffDays <= 5; // 5 días hábiles
  }

  // Convierte el objeto a formato JSON para enviar al backend
  toJSON() {
    return {
      id: this.id,
      ticket_number: this.ticketNumber,
      tipo: this.type,
      asunto: this.subject,
      descripcion: this.description,
      adjuntos: this.attachments,
      pedido_id: this.orderId,
      usuario_id: this.userId,
      estado: this.status,
      prioridad: this.priority,
      correo: this.email,
      telefono: this.phone,
      fecha_creacion: this.createdAt,
      fecha_actualizacion: this.updatedAt,
      fecha_resolucion: this.resolvedAt,
      respuesta: this.response,
      asignado_a: this.assignedTo
    };
  }

  // Crea una instancia desde datos del backend
  static fromBackend(data) {
    return new PQRS({
      id: data.id,
      ticketNumber: data.ticket_number,
      type: data.tipo,
      subject: data.asunto,
      description: data.descripcion,
      attachments: data.adjuntos || [],
      orderId: data.pedido_id,
      userId: data.usuario_id,
      status: data.estado,
      priority: data.prioridad,
      email: data.correo,
      phone: data.telefono,
      createdAt: data.fecha_creacion,
      updatedAt: data.fecha_actualizacion,
      resolvedAt: data.fecha_resolucion,
      response: data.respuesta,
      assignedTo: data.asignado_a
    });
  }
}

export default PQRS;
