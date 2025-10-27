// Mock the UserController used by userUtils
jest.mock('../controllers/UserController', () => ({
  __esModule: true,
  default: { getAllUsers: jest.fn() }
}));

import UserController from '../controllers/UserController';
import { getLast4PhoneDigitsByEmail } from '../utils/userUtils';

describe('userUtils.getLast4PhoneDigitsByEmail', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('devuelve últimos 4 dígitos cuando existe usuario con teléfono válido', () => {
    UserController.getAllUsers.mockReturnValueOnce([
      { email: 'a@b.com', phone: '3001234567' }
    ]);

    const res = getLast4PhoneDigitsByEmail('a@b.com');
    expect(res).toBe('4567');
  });

  test('devuelve cadena vacía si usuario no existe o teléfono inválido', () => {
    UserController.getAllUsers.mockReturnValueOnce([]);
    expect(getLast4PhoneDigitsByEmail('no@existe.com')).toBe('');

    UserController.getAllUsers.mockReturnValueOnce([
      { email: 'b@c.com', phone: '123' }
    ]);
    expect(getLast4PhoneDigitsByEmail('b@c.com')).toBe('');
  });
});
