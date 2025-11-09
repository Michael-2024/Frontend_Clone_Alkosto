/**
 * Tests para utilidades de usuario - userUtils.js
 * Incluye pruebas exhaustivas de validación de contraseñas
 */

import { validateEmail, validatePassword } from './userUtils';

describe('userUtils - Validación de Email', () => {
  test('validateEmail acepta emails válidos', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.user@domain.co')).toBe(true);
    expect(validateEmail('name+tag@company.com')).toBe(true);
  });

  test('validateEmail rechaza emails inválidos', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('no@domain')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
  });
});

describe('userUtils - Validación de Contraseñas', () => {
  
  describe('Contraseñas Válidas', () => {
    test('Acepta contraseña que cumple todos los requisitos básicos', () => {
      const result = validatePassword('MyP@ssw0rd');
      expect(result.isValid).toBe(true);
      expect(result.validations.length).toBe(true);
      expect(result.validations.upperCase).toBe(true);
      expect(result.validations.lowerCase).toBe(true);
      expect(result.validations.numbers).toBe(true);
      expect(result.validations.specialChar).toBe(true);
    });

    test('Acepta contraseña compleja', () => {
      const result = validatePassword('C0mpl3x!Pass#2024');
      expect(result.isValid).toBe(true);
      expect(result.level).toBe('strong');
    });

    test('Acepta contraseña con múltiples caracteres especiales', () => {
      const result = validatePassword('Test@123!Pass#');
      expect(result.isValid).toBe(true);
      expect(result.validations.specialChar).toBe(true);
    });
  });

  describe('Contraseñas Inválidas - Requisitos Básicos', () => {
    test('Rechaza contraseña muy corta', () => {
      const result = validatePassword('Test1!');
      expect(result.isValid).toBe(false);
      expect(result.validations.length).toBe(false);
      expect(result.messages).toContain('Debe tener al menos 8 caracteres');
    });

    test('Rechaza contraseña sin mayúsculas', () => {
      const result = validatePassword('test123!pass');
      expect(result.isValid).toBe(false);
      expect(result.validations.upperCase).toBe(false);
      expect(result.messages).toContain('Debe incluir al menos una letra mayúscula (A-Z)');
    });

    test('Rechaza contraseña sin minúsculas', () => {
      const result = validatePassword('TEST123!PASS');
      expect(result.isValid).toBe(false);
      expect(result.validations.lowerCase).toBe(false);
      expect(result.messages).toContain('Debe incluir al menos una letra minúscula (a-z)');
    });

    test('Rechaza contraseña sin números', () => {
      const result = validatePassword('TestPass!word');
      expect(result.isValid).toBe(false);
      expect(result.validations.numbers).toBe(false);
      expect(result.messages).toContain('Debe incluir al menos un número (0-9)');
    });

    test('Rechaza contraseña sin caracteres especiales', () => {
      const result = validatePassword('TestPass1word');
      expect(result.isValid).toBe(false);
      expect(result.validations.specialChar).toBe(false);
    });

    test('Rechaza contraseña con espacios', () => {
      const result = validatePassword('Test Pass1!');
      expect(result.isValid).toBe(false);
      expect(result.validations.noSpaces).toBe(false);
      expect(result.messages).toContain('No debe contener espacios');
    });
  });

  describe('Contraseñas Comunes', () => {
    test('Rechaza contraseñas comunes - password', () => {
      const result = validatePassword('Password123!');
      expect(result.isValid).toBe(false);
      expect(result.validations.notCommon).toBe(false);
      expect(result.messages).toContain('Es una contraseña muy común. Elige una más segura');
    });

    test('Rechaza contraseñas comunes - 12345678', () => {
      const result = validatePassword('12345678Aa!');
      expect(result.isValid).toBe(false);
      expect(result.validations.notCommon).toBe(false);
    });

    test('Rechaza contraseñas comunes - qwerty', () => {
      const result = validatePassword('Qwerty123!');
      expect(result.isValid).toBe(false);
      expect(result.validations.notCommon).toBe(false);
    });

    test('Rechaza contraseñas comunes - alkosto', () => {
      const result = validatePassword('Alkosto123!');
      expect(result.isValid).toBe(false);
      expect(result.validations.notCommon).toBe(false);
    });
  });

  describe('Patrones de Seguridad', () => {
    test('Rechaza secuencias numéricas', () => {
      const result = validatePassword('Test123456!');
      expect(result.validations.noSequential).toBe(false);
      expect(result.messages).toContain('Evita secuencias de caracteres (ej: 123, abc)');
    });

    test('Rechaza secuencias alfabéticas', () => {
      const result = validatePassword('Abcdef1!Pass');
      expect(result.validations.noSequential).toBe(false);
    });

    test('Rechaza secuencias de teclado', () => {
      const result = validatePassword('Qwerty1!Pass');
      expect(result.validations.noSequential).toBe(false);
    });

    test('Rechaza caracteres repetidos excesivamente', () => {
      const result = validatePassword('Testaaa123!');
      expect(result.validations.noRepeated).toBe(false);
      expect(result.messages).toContain('Evita repetir el mismo carácter muchas veces');
    });
  });

  describe('Fortaleza de Contraseña', () => {
    test('Clasifica contraseña débil correctamente', () => {
      const result = validatePassword('Test1!ab');
      expect(result.level).toBe('weak');
      expect(result.strength).toBeLessThan(60);
    });

    test('Clasifica contraseña media correctamente', () => {
      const result = validatePassword('MyG00d!Pass');
      expect(result.level).toBe('medium');
      expect(result.strength).toBeGreaterThanOrEqual(60);
      expect(result.strength).toBeLessThan(80);
    });

    test('Clasifica contraseña fuerte correctamente', () => {
      const result = validatePassword('MyStr0ng!P@ssw0rd2024');
      expect(result.level).toBe('strong');
      expect(result.strength).toBeGreaterThanOrEqual(80);
    });

    test('Aumenta fortaleza con longitud adicional', () => {
      const resultShort = validatePassword('MyP@ss1!');
      const resultLong = validatePassword('MyP@ss1!ExtraLong');
      expect(resultLong.strength).toBeGreaterThan(resultShort.strength);
    });
  });

  describe('Mensajes de Validación', () => {
    test('Retorna mensajes descriptivos para todos los errores', () => {
      const result = validatePassword('test');
      expect(result.messages.length).toBeGreaterThan(0);
      expect(result.messages).toEqual(expect.arrayContaining([
        expect.any(String)
      ]));
    });

    test('No retorna mensajes cuando la contraseña es válida', () => {
      const result = validatePassword('MyV@lid!P@ss1');
      expect(result.messages.length).toBe(0);
    });

    test('Limita mensajes a errores relevantes', () => {
      const result = validatePassword('test123!');
      const expectedMessages = result.messages;
      expect(expectedMessages).not.toContain('Debe incluir al menos un número (0-9)');
      expect(expectedMessages).not.toContain('Debe incluir al menos un carácter especial (!@#$%^&*...)');
    });
  });

  describe('Casos Límite', () => {
    test('Maneja contraseña vacía', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.strength).toBe(0);
    });

    test('Rechaza contraseña muy larga (>128 caracteres)', () => {
      const longPassword = 'A1!' + 'a'.repeat(130);
      const result = validatePassword(longPassword);
      expect(result.validations.length).toBe(false);
    });

    test('Acepta exactamente 8 caracteres si cumple requisitos', () => {
      const result = validatePassword('MyP@ss1!');
      expect(result.isValid).toBe(true);
      expect(result.validations.length).toBe(true);
    });

    test('Acepta 128 caracteres si cumple requisitos', () => {
      const password = 'MyP@ss1!' + 'Secure'.repeat(20);
      const result = validatePassword(password);
      expect(result.validations.length).toBe(true);
    });

    test('Maneja todos los caracteres especiales permitidos', () => {
      const specialChars = '!@#$%^&*()_+-=[]{};\':"|,.<>/?';
      const result = validatePassword(`Test123${specialChars}`);
      expect(result.validations.specialChar).toBe(true);
    });
  });

  describe('Estructura del Objeto de Retorno', () => {
    test('Retorna estructura completa con todos los campos', () => {
      const result = validatePassword('MyP@ss1!');
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('strength');
      expect(result).toHaveProperty('level');
      expect(result).toHaveProperty('validations');
      expect(result).toHaveProperty('messages');
      
      expect(typeof result.isValid).toBe('boolean');
      expect(typeof result.strength).toBe('number');
      expect(typeof result.level).toBe('string');
      expect(typeof result.validations).toBe('object');
      expect(Array.isArray(result.messages)).toBe(true);
    });

    test('Objeto validations contiene todos los campos esperados', () => {
      const result = validatePassword('MyP@ss1!');
      expect(result.validations).toHaveProperty('length');
      expect(result.validations).toHaveProperty('upperCase');
      expect(result.validations).toHaveProperty('lowerCase');
      expect(result.validations).toHaveProperty('numbers');
      expect(result.validations).toHaveProperty('specialChar');
      expect(result.validations).toHaveProperty('noSpaces');
      expect(result.validations).toHaveProperty('notCommon');
      expect(result.validations).toHaveProperty('noSequential');
      expect(result.validations).toHaveProperty('noRepeated');
    });
  });
});
