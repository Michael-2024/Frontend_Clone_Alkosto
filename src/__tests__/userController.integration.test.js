import UserController from '../controllers/UserController';

describe('UserController integration (localStorage)', () => {
  beforeEach(() => {
    // limpiar localStorage
    localStorage.clear();
    // Reiniciar singleton estado (UserController es singleton exportado)
    // No hay API pública para resetear; crear nueva instancia directa si es necesario
  });

  test('registrar usuario guarda en localStorage y permite login', () => {
    const email = 'test@user.com';
    expect(UserController.isEmailRegistered(email)).toBe(false);

    const result = UserController.registerUser({
      email,
      firstName: 'Test',
      lastName: 'User',
      phone: '3001234567',
      password: 'secret'
    });

    expect(result.success).toBe(true);
    expect(UserController.isEmailRegistered(email)).toBe(true);

    // Logout and login
    UserController.logout();
    const login = UserController.login(email, 'secret');
    expect(login.success).toBe(true);
    const current = UserController.getCurrentUser();
    expect(current.email).toBe(email);
    // Verificar que localStorage contiene USERS_KEY
    const usersJSON = localStorage.getItem(UserController.USERS_KEY);
    expect(usersJSON).not.toBeNull();
    const users = JSON.parse(usersJSON);
    expect(users.some(u => u.email === email)).toBe(true);
  });

  test('login con credenciales incorrectas falla', () => {
    const res = UserController.login('noexiste@x.com', 'pwd');
    expect(res.success).toBe(false);
  });
});
