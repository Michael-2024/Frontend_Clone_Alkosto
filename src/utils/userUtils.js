import UserController from '../controllers/UserController';

// Función para validar el formato del email
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida la fortaleza de una contraseña según criterios de seguridad
 * @param {string} password - Contraseña a validar
 * @returns {Object} - Objeto con resultado de validación y detalles
 */
export function validatePassword(password) {
  const minLength = 8;
  const maxLength = 128;
  
  // Patrones de validación
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  // Patrones de seguridad adicionales
  const hasNoSpaces = !/\s/.test(password);
  const isNotCommon = !isCommonPassword(password);
  const hasNoSequentialChars = !hasSequentialCharacters(password);
  const hasNoRepeatedChars = !hasTooManyRepeatedCharacters(password);
  
  // Validaciones básicas
  const validations = {
    length: password.length >= minLength && password.length <= maxLength,
    upperCase: hasUpperCase,
    lowerCase: hasLowerCase,
    numbers: hasNumbers,
    specialChar: hasSpecialChar,
    noSpaces: hasNoSpaces,
    notCommon: isNotCommon,
    noSequential: hasNoSequentialChars,
    noRepeated: hasNoRepeatedChars
  };
  
  // Calcular fortaleza (0-100)
  let strength = 0;
  if (validations.length) strength += 20;
  if (validations.upperCase) strength += 15;
  if (validations.lowerCase) strength += 15;
  if (validations.numbers) strength += 15;
  if (validations.specialChar) strength += 15;
  if (validations.noSpaces) strength += 5;
  if (validations.notCommon) strength += 10;
  if (validations.noSequential) strength += 5;
  
  // Bonus por longitud adicional
  if (password.length >= 12) strength += 5;
  if (password.length >= 16) strength += 5;
  
  // Determinar nivel
  let level = 'weak';
  if (strength >= 80) level = 'strong';
  else if (strength >= 60) level = 'medium';
  
  // La contraseña es válida si cumple los requisitos mínimos
  const isValid = 
    validations.length &&
    validations.upperCase &&
    validations.lowerCase &&
    validations.numbers &&
    validations.noSpaces &&
    validations.notCommon;
  
  return {
    isValid,
    strength,
    level,
    validations,
    messages: getPasswordMessages(validations, password.length)
  };
}

/**
 * Genera mensajes descriptivos sobre los requisitos de contraseña
 * @param {Object} validations - Objeto con validaciones
 * @param {number} length - Longitud de la contraseña
 * @returns {Array} - Array de mensajes
 */
function getPasswordMessages(validations, length) {
  const messages = [];
  
  if (!validations.length) {
    if (length < 8) {
      messages.push('Debe tener al menos 8 caracteres');
    } else {
      messages.push('Debe tener máximo 128 caracteres');
    }
  }
  if (!validations.upperCase) {
    messages.push('Debe incluir al menos una letra mayúscula (A-Z)');
  }
  if (!validations.lowerCase) {
    messages.push('Debe incluir al menos una letra minúscula (a-z)');
  }
  if (!validations.numbers) {
    messages.push('Debe incluir al menos un número (0-9)');
  }
  if (!validations.specialChar) {
    messages.push('Debe incluir al menos un carácter especial (!@#$%^&*...)');
  }
  if (!validations.noSpaces) {
    messages.push('No debe contener espacios');
  }
  if (!validations.notCommon) {
    messages.push('Es una contraseña muy común. Elige una más segura');
  }
  if (!validations.noSequential) {
    messages.push('Evita secuencias de caracteres (ej: 123, abc)');
  }
  if (!validations.noRepeated) {
    messages.push('Evita repetir el mismo carácter muchas veces');
  }
  
  return messages;
}

/**
 * Verifica si la contraseña está en la lista de contraseñas comunes
 * @param {string} password - Contraseña a verificar
 * @returns {boolean} - true si es común
 */
function isCommonPassword(password) {
  const commonPasswords = [
    'password', 'password123', '12345678', '123456789', '1234567890',
    'qwerty', 'qwerty123', 'abc123', 'password1', 'admin',
    'admin123', 'root', 'user', 'letmein', 'welcome',
    'monkey', 'dragon', 'master', 'sunshine', 'princess',
    'football', 'iloveyou', 'shadow', 'superman', 'batman',
    '654321', '123123', 'password!', 'Passw0rd', 'P@ssw0rd',
    'alkosto', 'alkosto123', 'colombia', 'bogota'
  ];
  
  return commonPasswords.includes(password.toLowerCase());
}

/**
 * Detecta secuencias de caracteres consecutivos
 * @param {string} password - Contraseña a verificar
 * @returns {boolean} - true si tiene secuencias
 */
function hasSequentialCharacters(password) {
  const sequences = [
    'abcdefghijklmnopqrstuvwxyz',
    '0123456789',
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm'
  ];
  
  const lowerPassword = password.toLowerCase();
  
  for (const sequence of sequences) {
    for (let i = 0; i < sequence.length - 2; i++) {
      const substring = sequence.substring(i, i + 3);
      if (lowerPassword.includes(substring) || lowerPassword.includes(substring.split('').reverse().join(''))) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Detecta demasiados caracteres repetidos
 * @param {string} password - Contraseña a verificar
 * @returns {boolean} - true si tiene muchas repeticiones
 */
function hasTooManyRepeatedCharacters(password) {
  // Buscar caracteres que se repiten 3 o más veces consecutivas
  const repeatedPattern = /(.)\1{2,}/;
  return repeatedPattern.test(password);
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
