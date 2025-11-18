import PQRS from '../models/PQRS';
import apiService from '../services/ApiService';

class PQRSController {
  constructor() {
    this.storageKey = 'alkosto_pqrs';
    this.changeListeners = [];
  }

  // Crea un nuevo PQRS
  async create(pqrsData) {
    try {
      const pqrs = new PQRS(pqrsData);
      
      // Validar datos
      const validation = pqrs.validate();
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Verificar si el usuario está autenticado
      const isAuthenticated = apiService.getToken();

      if (isAuthenticated) {
        // Enviar al backend
        const response = await apiService.post('/pqrs/', pqrs.toJSON(), true);
        const createdPQRS = PQRS.fromBackend(response);
        
        this.notifyListeners();
        return {
          success: true,
          data: createdPQRS,
          message: `PQRS creado exitosamente. Tu número de radicado es: ${createdPQRS.ticketNumber}`
        };
      } else {
        // Guardar en localStorage para usuarios no autenticados
        const storedPQRS = this.getFromLocalStorage();
        storedPQRS.push(pqrs);
        localStorage.setItem(this.storageKey, JSON.stringify(storedPQRS));
        
        this.notifyListeners();
        return {
          success: true,
          data: pqrs,
          message: `PQRS creado exitosamente. Tu número de radicado es: ${pqrs.ticketNumber}`
        };
      }
    } catch (error) {
      console.error('Error al crear PQRS:', error);
      return {
        success: false,
        error: error.message || 'Error al crear PQRS'
      };
    }
  }

  // Obtiene todos los PQRS del usuario actual
  async list(userId = null) {
    try {
      const isAuthenticated = apiService.getToken();

      if (isAuthenticated) {
        // Obtener del backend
        const response = await apiService.get('/pqrs/', true);
        return response.map(pqrs => PQRS.fromBackend(pqrs));
      } else {
        // Obtener de localStorage
        return this.getFromLocalStorage();
      }
    } catch (error) {
      console.error('Error al listar PQRS:', error);
      // Si falla backend, intentar con localStorage
      return this.getFromLocalStorage();
    }
  }

  // Obtiene un PQRS específico por ID o ticketNumber
  async getById(identifier) {
    try {
      const isAuthenticated = apiService.getToken();

      if (isAuthenticated) {
        // Buscar en backend
        const response = await apiService.get(`/pqrs/${identifier}/`, true);
        return PQRS.fromBackend(response);
      } else {
        // Buscar en localStorage
        const storedPQRS = this.getFromLocalStorage();
        return storedPQRS.find(
          p => p.id === identifier || p.ticketNumber === identifier
        );
      }
    } catch (error) {
      console.error('Error al obtener PQRS:', error);
      // Intentar buscar en localStorage
      const storedPQRS = this.getFromLocalStorage();
      return storedPQRS.find(
        p => p.id === identifier || p.ticketNumber === identifier
      );
    }
  }

  // Buscar PQRS por número de radicado
  async getByTicketNumber(ticketNumber) {
    try {
      const isAuthenticated = apiService.getToken();

      if (isAuthenticated) {
        // Buscar en backend
        const response = await apiService.get(`/pqrs/buscar/?ticket=${ticketNumber}`, false);
        if (response) {
          return PQRS.fromBackend(response);
        }
        return null;
      } else {
        // Buscar en localStorage
        const storedPQRS = this.getFromLocalStorage();
        return storedPQRS.find(p => p.ticketNumber === ticketNumber) || null;
      }
    } catch (error) {
      console.error('Error al buscar PQRS:', error);
      return null;
    }
  }

  // Actualiza un PQRS (principalmente usado por admin)
  async update(id, updates) {
    try {
      const isAuthenticated = apiService.getToken();

      if (isAuthenticated) {
        // Actualizar en backend
        const response = await apiService.put(`/pqrs/${id}/`, updates, true);
        const updatedPQRS = PQRS.fromBackend(response);
        
        this.notifyListeners();
        return {
          success: true,
          data: updatedPQRS,
          message: 'PQRS actualizado exitosamente'
        };
      } else {
        // Actualizar en localStorage
        const storedPQRS = this.getFromLocalStorage();
        const index = storedPQRS.findIndex(p => p.id === id);
        
        if (index !== -1) {
          storedPQRS[index] = { ...storedPQRS[index], ...updates };
          localStorage.setItem(this.storageKey, JSON.stringify(storedPQRS));
          
          this.notifyListeners();
          return {
            success: true,
            data: storedPQRS[index],
            message: 'PQRS actualizado exitosamente'
          };
        }
        
        throw new Error('PQRS no encontrado');
      }
    } catch (error) {
      console.error('Error al actualizar PQRS:', error);
      return {
        success: false,
        error: error.message || 'Error al actualizar PQRS'
      };
    }
  }

  // Filtrar PQRS por estado
  filterByStatus(pqrsList, status) {
    return pqrsList.filter(pqrs => pqrs.status === status);
  }

  // Filtrar PQRS por tipo
  filterByType(pqrsList, type) {
    return pqrsList.filter(pqrs => pqrs.type === type);
  }

  // Obtener estadísticas de PQRS
  getStatistics(pqrsList) {
    return {
      total: pqrsList.length,
      byStatus: {
        abierto: pqrsList.filter(p => p.status === 'Abierto').length,
        enProceso: pqrsList.filter(p => p.status === 'En Proceso').length,
        resuelto: pqrsList.filter(p => p.status === 'Resuelto').length,
        cerrado: pqrsList.filter(p => p.status === 'Cerrado').length
      },
      byType: {
        peticion: pqrsList.filter(p => p.type === 'Petición').length,
        queja: pqrsList.filter(p => p.type === 'Queja').length,
        reclamo: pqrsList.filter(p => p.type === 'Reclamo').length,
        sugerencia: pqrsList.filter(p => p.type === 'Sugerencia').length
      },
      pending: pqrsList.filter(p => 
        p.status === 'Abierto' || p.status === 'En Proceso'
      ).length,
      overdue: pqrsList.filter(p => !p.isWithinResponseTime()).length
    };
  }

  // Obtiene PQRS desde localStorage
  getFromLocalStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map(data => new PQRS(data));
      }
      return [];
    } catch (error) {
      console.error('Error al leer PQRS de localStorage:', error);
      return [];
    }
  }

  // Migrar PQRS de localStorage al backend (cuando usuario inicia sesión)
  async migrateToBackend() {
    try {
      const localPQRS = this.getFromLocalStorage();
      
      if (localPQRS.length === 0) {
        return { success: true, migrated: 0 };
      }

      let migrated = 0;
      const errors = [];

      for (const pqrs of localPQRS) {
        try {
          await apiService.post('/pqrs/', pqrs.toJSON(), true);
          migrated++;
        } catch (error) {
          errors.push({
            ticketNumber: pqrs.ticketNumber,
            error: error.message
          });
        }
      }

      // Limpiar localStorage después de migración exitosa
      if (migrated > 0) {
        localStorage.removeItem(this.storageKey);
      }

      this.notifyListeners();

      return {
        success: true,
        migrated,
        errors: errors.length > 0 ? errors : null
      };
    } catch (error) {
      console.error('Error al migrar PQRS:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Enviar notificación por email sobre el PQRS
  async sendEmailNotification(pqrs, userEmail) {
    try {
      // Esta función enviará un email de confirmación al usuario
      // con el número de radicado y los detalles del PQRS
      const emailData = {
        to: userEmail,
        subject: `PQRS Recibido - ${pqrs.ticketNumber}`,
        body: `
          Estimado usuario,
          
          Hemos recibido tu ${pqrs.type.toLowerCase()} con el siguiente número de radicado:
          
          Radicado: ${pqrs.ticketNumber}
          Tipo: ${pqrs.type}
          Asunto: ${pqrs.subject}
          Fecha: ${new Date(pqrs.createdAt).toLocaleDateString('es-CO')}
          
          Puedes hacer seguimiento de tu solicitud en:
          ${window.location.origin}/perfil/pqrs
          
          Tiempo estimado de respuesta: 5 días hábiles
          
          Gracias por contactarnos.
          
          Equipo de Alkosto
        `
      };

      // Por ahora, solo registramos en consola
      // En producción, esto se enviaría al backend para enviar el email real
      console.log('Email de confirmación:', emailData);
      
      return { success: true };
    } catch (error) {
      console.error('Error al enviar notificación:', error);
      return { success: false, error: error.message };
    }
  }

  // Agregar listener para cambios
  addChangeListener(callback) {
    this.changeListeners.push(callback);
    return () => {
      this.changeListeners = this.changeListeners.filter(cb => cb !== callback);
    };
  }

  // Notificar a los listeners
  notifyListeners() {
    this.changeListeners.forEach(callback => callback());
  }

  // Limpiar datos de localStorage (solo para desarrollo/testing)
  clearLocalStorage() {
    localStorage.removeItem(this.storageKey);
    this.notifyListeners();
  }
}

// Exportar instancia singleton
const pqrsController = new PQRSController();
export default pqrsController;
