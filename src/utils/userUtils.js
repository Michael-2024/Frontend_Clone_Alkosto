import UserController from '../controllers/UserController';

// Función para validar el formato del email
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Función para validar la fortaleza de la contraseña
export function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return password.length >= minLength &&
         hasUpperCase &&
         hasLowerCase &&
         hasNumbers &&
         hasSpecialChar;
}

// Devuelve los últimos 4 dígitos del teléfono registrado para un email
export function getLast4PhoneDigitsByEmail(email) {
  const users = UserController.getAllUsers();
  const user = users.find(u => u.email === email);
  if (user && user.phone && user.phone.length >= 4) {
    return user.phone.slice(-4);
  }
  return '';
}
