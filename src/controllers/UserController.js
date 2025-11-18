import User from '../models/User';
import NotificationController from './NotificationController';
import CouponController from './CouponController';
import apiService from '../services/ApiService';

/**
 * UserController
 * Manages user authentication, registration, and profile operations
 */
class UserController {
  constructor() {
    if (UserController.instance) {
      return UserController.instance;
    }
    UserController.instance = this;
    this.STORAGE_KEY = 'alkosto_user'; // usuario logueado actualmente
    this.USERS_KEY = 'alkosto_users'; // lista de todos los usuarios
    this.currentUser = null;
    this.loadUser();
    this.listeners = [];
  }

  // Utilidades de favoritos por usuario
  getFavoritesKey(userId) {
    return `alkosto_favorites_${userId}`;
  }

  getFavorites(userId) {
    const key = this.getFavoritesKey(userId);
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  }

  addFavorite(productId) {
    if (!this.currentUser) return;
    const key = this.getFavoritesKey(this.currentUser.id);
    const favs = this.getFavorites(this.currentUser.id);
    if (!favs.includes(productId)) {
      const next = [...favs, productId];
      localStorage.setItem(key, JSON.stringify(next));
    }
  }

  removeFavorite(productId) {
    if (!this.currentUser) return;
    const key = this.getFavoritesKey(this.currentUser.id);
    const favs = this.getFavorites(this.currentUser.id);
    const next = favs.filter(id => id !== productId);
    localStorage.setItem(key, JSON.stringify(next));
  }

  // Si hay un intento de favorito pendiente antes de autenticarse, aplicarlo al iniciar sesión/registrarse
  syncPendingFavorite() {
    try {
      const pending = localStorage.getItem('pendingFavoriteProductId');
      if (pending && this.currentUser) {
        const productId = isNaN(Number(pending)) ? pending : Number(pending);
        this.addFavorite(productId);
        localStorage.removeItem('pendingFavoriteProductId');
      }
    } catch (error) {
      // Ignore errors when syncing pending favorites
    }
  }

  /**
   * Migrar favoritos de localStorage (guest) al backend después del login
   * Busca favoritos temporales guardados sin autenticación y los sincroniza
   */
  async migrateFavoritesToBackend() {
    if (!this.currentUser) return;
    
    try {
      // Buscar favoritos de invitado almacenados con una clave genérica
      const guestFavoritesKey = 'alkosto_guest_favorites';
      const guestFavorites = localStorage.getItem(guestFavoritesKey);
      
      if (guestFavorites) {
        const favoriteIds = JSON.parse(guestFavorites);
        
        // Migrar cada favorito al backend usando la API
        for (const productId of favoriteIds) {
          try {
            await apiService.toggleFavorite(productId);
            console.log(`Favorito migrado: ${productId}`);
          } catch (error) {
            console.error(`Error migrando favorito ${productId}:`, error);
            // Continuar con los demás aunque falle uno
          }
        }
        
        // Limpiar favoritos de invitado después de migrar
        localStorage.removeItem(guestFavoritesKey);
        console.log('Favoritos de invitado migrados exitosamente');
      }
      
      // También intentar migrar favoritos del sistema anterior (por si acaso)
      const oldFavoritesKey = this.getFavoritesKey(this.currentUser.id);
      const oldFavorites = localStorage.getItem(oldFavoritesKey);
      
      if (oldFavorites) {
        const favoriteIds = JSON.parse(oldFavorites);
        for (const productId of favoriteIds) {
          try {
            await apiService.toggleFavorite(productId);
          } catch (error) {
            console.error(`Error migrando favorito antiguo ${productId}:`, error);
          }
        }
        // No eliminar la key antigua por compatibilidad
      }
    } catch (error) {
      console.error('Error en migrateFavoritesToBackend:', error);
      // No lanzar error para no interrumpir el flujo de login
    }
  }

  // Añadir método para notificar a los componentes sobre cambios de autenticación
  addAuthListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Método para notificar a los listeners cuando cambia el estado de autenticación
  notifyAuthChange() {
    this.listeners.forEach(callback => callback(this.isLoggedIn()));
  }

  // Cargar usuario desde localStorage
  loadUser() {
    const userJSON = localStorage.getItem(this.STORAGE_KEY);
    if (userJSON) {
      const userData = JSON.parse(userJSON);
      this.currentUser = new User(
        userData.id,
        userData.email,
        userData.firstName,
        userData.lastName,
        userData.password
      );
      this.currentUser.phone = userData.phone || '';
      this.currentUser.emailVerified = userData.emailVerified || false;
      this.currentUser.phoneVerified = userData.phoneVerified || false;
      this.currentUser.estadoCuenta = userData.estadoCuenta || 'pendiente';
      this.currentUser.addresses = userData.addresses || [];
      this.currentUser.orders = userData.orders || [];
      this.currentUser.createdAt = new Date(userData.createdAt);
    }
  }

  // Métodos para recuperación de contraseña
  verifyResetCode(email, code, generatedCode) {
    if (code === generatedCode) {
      return true;
    }
    return false;
  }

  resetPassword(email, newPassword) {
    const users = this.getAllUsers() || [];
    const userIndex = users.findIndex(user => user.email === email);
    
    if (userIndex === -1) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    // Actualizar la contraseña del usuario
    users[userIndex].password = newPassword;
    
    // Guardar los cambios
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    
    return { success: true, message: 'Contraseña actualizada exitosamente' };
  }

  // Obtener usuario por email
  getUserByEmail(email) {
    const users = this.getAllUsers() || [];
    return users.find(user => user.email === email);
  }

  // Obtener todos los usuarios registrados
  getAllUsers() {
    const usersJSON = localStorage.getItem(this.USERS_KEY);
    if (usersJSON) {
      return JSON.parse(usersJSON);
    }
    return [];
  }

  // Guardar todos los usuarios
  saveAllUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // Guardar usuario en localStorage
  saveUser() {
    if (this.currentUser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser.toJSON()));
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  // Registrar un nuevo usuario
  async registerUser({ email, firstName, lastName, phone = '', password }) {
    try {
      // Consumir backend: /api/auth/registro/
      const payload = {
        nombre: firstName,
        apellido: lastName,
        email,
        telefono: phone,
        password,
        password_confirm: password
      };
      console.log('Enviando registro al backend:', payload);
      const resp = await apiService.register(payload);
      console.log('Respuesta del backend:', resp);
      
      // resp: { token, user }
      // Adaptar a nuestro modelo User para UI existente
      const idStr = String(resp.user.id_usuario);
      const newUser = new User(idStr, resp.user.email, resp.user.nombre, resp.user.apellido, '');
      newUser.phone = resp.user.telefono || '';
      this.currentUser = newUser;
      this.saveUser();
      this.syncPendingFavorite();
      this.notifyAuthChange();
      
      // Migrar carrito del localStorage al backend
      const CartController = require('./CartController').default;
      await CartController.migrateToBackend();
      
      // Migrar favoritos de localStorage (guest) al backend
      await this.migrateFavoritesToBackend();
      
      // Notificaciones/Cupón (solo local, opcional)
      NotificationController.createWelcomeNotifications(idStr);
      CouponController.createWelcomeCoupon(idStr);
      return { success: true, user: this.currentUser };
    } catch (error) {
      console.error('Error en registerUser:', error);
      return { success: false, error: error.message || 'Error al registrar usuario' };
    }
  }

  // Verificar si el correo ya está registrado
  async isEmailRegistered(email) {
    try {
      const response = await apiService.checkEmailExists(email);
      return response.existe; // Retorna true si existe, false si no
    } catch (error) {
      console.error('Error verificando email:', error);
      // En caso de error, permitir continuar con el registro
      return false;
    }
  }

  // Iniciar sesión
  async login(email, password) {
    try {
      const resp = await apiService.login(email, password);
      // Obtener perfil para datos consistentes
      const profile = await apiService.getProfile();
      const idStr = String(profile.id_usuario);
      const user = new User(idStr, profile.email, profile.nombre, profile.apellido, '');
      user.phone = profile.telefono || '';
      this.currentUser = user;
      this.saveUser();
      this.syncPendingFavorite();
      this.notifyAuthChange();
      
      // Migrar carrito del localStorage al backend
      const CartController = require('./CartController').default;
      await CartController.migrateToBackend();
      
      // Migrar favoritos de localStorage (guest) al backend
      await this.migrateFavoritesToBackend();
      
      return { success: true, user: this.currentUser };
    } catch (e) {
      return { success: false, error: 'Credenciales incorrectas' };
    }
  }

  // Login simulado por código (flujo UX)
  loginWithCode(email) {
    // Uso educativo: valida que exista en la lista local y crea sesión local
    const users = this.getAllUsers();
    const found = users.find(u => String(u.email).toLowerCase() === String(email).toLowerCase());
    if (!found) {
      return { success: false, error: 'Usuario no registrado' };
    }
    const user = new User(found.id, found.email, found.firstName, found.lastName, '');
    user.phone = found.phone || '';
    this.currentUser = user;
    this.saveUser();
    this.syncPendingFavorite();
    this.notifyAuthChange();
    return { success: true, user: this.currentUser };
  }

  // Cerrar sesión
  async logout() {
    try {
      await apiService.logout();
    } catch (e) {
      // ignorar errores de red en logout
    }
    this.currentUser = null;
    this.saveUser();
    this.notifyAuthChange();
    return true;
  }

  // Verificar si hay un usuario logueado
  isLoggedIn() {
    return !!this.currentUser;
  }

  // Obtener usuario actual
  getCurrentUser() {
    return this.currentUser;
  }

  // Actualizar información del usuario
  updateUserInfo(updates) {
    if (!this.currentUser) return false;
    
    const allowedUpdates = ['firstName', 'lastName', 'email', 'phone'];
    allowedUpdates.forEach(prop => {
      if (updates[prop]) {
        this.currentUser[prop] = updates[prop];
      }
    });
    
    this.saveUser();
    return true;
  }

  // Actualizar contraseña del usuario actual y persistir en lista de usuarios
  updatePassword(newPassword) {
    if (!this.currentUser) return false;
    const users = this.getAllUsers();
    const idx = users.findIndex(u => u.id === this.currentUser.id);
    if (idx !== -1) {
      users[idx].password = newPassword;
      this.saveAllUsers(users);
    }
    this.currentUser.password = newPassword;
    this.saveUser();
    return true;
  }

  // Agregar una dirección al usuario
  addAddress(address) {
    if (!this.currentUser) return false;
    this.currentUser.addAddress(address);
    this.saveUser();
    return true;
  }

  // Métodos para verificación RF04
  
  // Marcar email como verificado
  verifyEmail(email) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
      users[userIndex].emailVerified = true;
      this.checkAndActivateAccount(users[userIndex]);
      this.saveAllUsers(users);
      
      // Si es el usuario actual, actualizar también
      if (this.currentUser && this.currentUser.email === email) {
        this.currentUser.emailVerified = true;
        this.checkAndActivateAccount(this.currentUser);
        this.saveUser();
      }
      
      return { success: true, message: 'Correo verificado exitosamente' };
    }
    
    return { success: false, message: 'Usuario no encontrado' };
  }

  // Marcar teléfono como verificado
  verifyPhone(email) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
      users[userIndex].phoneVerified = true;
      this.checkAndActivateAccount(users[userIndex]);
      this.saveAllUsers(users);
      
      // Si es el usuario actual, actualizar también
      if (this.currentUser && this.currentUser.email === email) {
        this.currentUser.phoneVerified = true;
        this.checkAndActivateAccount(this.currentUser);
        this.saveUser();
      }
      
      return { success: true, message: 'Teléfono verificado exitosamente' };
    }
    
    return { success: false, message: 'Usuario no encontrado' };
  }

  // Verificar y activar cuenta si correo o teléfono están verificados
  checkAndActivateAccount(user) {
    if (user.emailVerified || user.phoneVerified) {
      user.estadoCuenta = 'validado';
    }
  }

  // Obtener usuario con información de verificación
  getUserVerificationStatus(email) {
    const user = this.getUserByEmail(email);
    if (user) {
      return {
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified || false,
        phoneVerified: user.phoneVerified || false,
        estadoCuenta: user.estadoCuenta || 'pendiente'
      };
    }
    return null;
  }
}


// Exportar una única instancia (Singleton)
export default new UserController();