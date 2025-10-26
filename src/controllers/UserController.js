import User from '../models/User';

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
    } catch (_) { /* noop */ }
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
  registerUser({ email, firstName, lastName, phone = '', password }) {
    const id = 'user_' + Date.now();
    const newUser = new User(id, email, firstName, lastName, password);
    newUser.phone = phone;
    // Guardar en la lista de usuarios
    const users = this.getAllUsers();
    users.push(newUser.toJSON());
    this.saveAllUsers(users);
    // Guardar como usuario actual
    this.currentUser = newUser;
    this.saveUser();
    // Aplicar intento de favorito si existe
    this.syncPendingFavorite();
    this.notifyAuthChange();
    return { success: true, user: this.currentUser };
  }

  // Verificar si el correo ya está registrado
  isEmailRegistered(email) {
    const users = this.getAllUsers();
    return users.some(user => user.email === email);
  }

  // Iniciar sesión
  login(email, password) {
    // En producción, esto consultaría al backend
    if (email === 'admin@alkosto.com' && password === 'admin123') {
      this.currentUser = new User('admin', email, 'Admin', 'Alkosto');
      this.saveUser();
      this.syncPendingFavorite();
      this.notifyAuthChange();
      return { success: true, user: this.currentUser };
    }
    // Buscar usuario en la lista de usuarios
    const users = this.getAllUsers();
    const userData = users.find(u => u.email === email);
    if (userData) {
      // En un sistema real verificaríamos la contraseña con hash
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
      this.saveUser();
      this.syncPendingFavorite();
      this.notifyAuthChange();
      return { success: true, user: this.currentUser };
    }
    return { success: false, error: 'Credenciales incorrectas' };
  }

  // Cerrar sesión
  logout() {
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