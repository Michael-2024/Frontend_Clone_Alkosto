// Modelo de Usuario
class User {
  constructor(id, name, email, phone, address) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
  }

  getFullName() {
    return this.name;
  }
}

export default User;
