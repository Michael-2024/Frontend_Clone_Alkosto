// src/models/Notification.js

/**
 * Modelo de Notificación
 * Representa una notificación del sistema
 */
class Notification {
  constructor(id, userId, type, title, message, priority = 'normal', data = {}) {
    this.id = id;
    this.userId = userId; // ID del usuario destinatario
    this.type = type; // 'order', 'offer', 'account', 'system'
    this.title = title;
    this.message = message;
    this.priority = priority; // 'low', 'normal', 'high'
    this.data = data; // Datos adicionales (orderId, productId, etc.)
    this.read = false;
    this.createdAt = new Date().toISOString();
    this.readAt = null;
  }

  /**
   * Marca la notificación como leída
   */
  markAsRead() {
    this.read = true;
    this.readAt = new Date().toISOString();
  }

  /**
   * Marca la notificación como no leída
   */
  markAsUnread() {
    this.read = false;
    this.readAt = null;
  }

  /**
   * Obtiene el ícono según el tipo de notificación
   */
  getIcon() {
    const icons = {
      order: '📦',
      offer: '🎁',
      account: '👤',
      system: '🔔'
    };
    return icons[this.type] || '🔔';
  }

  /**
   * Obtiene el color según la prioridad
   */
  getPriorityColor() {
    const colors = {
      low: '#666',
      normal: '#004797',
      high: '#FF6B35'
    };
    return colors[this.priority] || '#004797';
  }

  /**
   * Obtiene tiempo relativo (hace X minutos/horas/días)
   */
  getTimeAgo() {
    const now = new Date();
    const created = new Date(this.createdAt);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} d`;
    
    return created.toLocaleDateString('es-CO', { 
      day: 'numeric', 
      month: 'short' 
    });
  }

  /**
   * Convierte la notificación a objeto JSON
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      title: this.title,
      message: this.message,
      priority: this.priority,
      data: this.data,
      read: this.read,
      createdAt: this.createdAt,
      readAt: this.readAt
    };
  }

  /**
   * Crea una instancia desde JSON
   */
  static fromJSON(json) {
    const notification = new Notification(
      json.id,
      json.userId,
      json.type,
      json.title,
      json.message,
      json.priority,
      json.data
    );
    notification.read = json.read;
    notification.createdAt = json.createdAt;
    notification.readAt = json.readAt;
    return notification;
  }
}

export default Notification;
