import User from '../models/User';

describe('User model', () => {
  test('getFullName retorna nombre completo', () => {
    const u = new User('id1', 'x@y.com', 'Juan', 'Perez');
    expect(u.getFullName()).toBe('Juan Perez');
  });

  test('toJSON incluye campos esperados', () => {
    const u = new User('id2', 'a@b.com', 'Ana', 'Gomez');
    u.phone = '3001112222';
    u.addAddress({ street: 'Calle 1' });
    const json = u.toJSON();
    expect(json).toMatchObject({
      id: 'id2',
      email: 'a@b.com',
      firstName: 'Ana',
      lastName: 'Gomez',
      phone: '3001112222'
    });
    expect(Array.isArray(json.addresses)).toBe(true);
  });
});
