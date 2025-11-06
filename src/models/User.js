// Modelo de Usuario
class User {
  constructor(id, email, firstName, lastName, password = null) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password; // En producción, nunca almacenaríamos contraseñas en frontend
    this.phone = ''; // Nuevo campo
    this.emailVerified = false; // Estado de verificación de correo
    this.phoneVerified = false; // Estado de verificación de teléfono
    this.estadoCuenta = 'pendiente'; // pendiente | validado
    this.createdAt = new Date();
    this.addresses = [];
    this.orders = [];
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  addAddress(address) {
    this.addresses.push(address);
  }

  getAddresses() {
    return [...this.addresses];
  }

  addOrder(order) {
    this.orders.push(order);
  }

  getOrders() {
    return [...this.orders];
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password, // Incluir contraseña (en producción debería ser hasheada)
      phone: this.phone, // Incluir teléfono
      emailVerified: this.emailVerified,
      phoneVerified: this.phoneVerified,
      estadoCuenta: this.estadoCuenta,
      createdAt: this.createdAt,
      addresses: this.addresses,
      orders: this.orders
    };
  }
}

export default User;
