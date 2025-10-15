import UserController from '../controllers/UserController';

// Devuelve los últimos 4 dígitos del teléfono registrado para un email
export function getLast4PhoneDigitsByEmail(email) {
  const users = UserController.getAllUsers();
  const user = users.find(u => u.email === email);
  if (user && user.phone && user.phone.length >= 4) {
    return user.phone.slice(-4);
  }
  return '';
}
