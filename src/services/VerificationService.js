// src/services/VerificationService.js
// Servicio de Verificación que simula proveedores de Correo y SMS

class VerificationService {
  constructor() {
    if (VerificationService.instance) {
      return VerificationService.instance;
    }
    VerificationService.instance = this;
    this.VERIFICATION_CODES_KEY = 'alkosto_verification_codes';
  }

  // Generar código de verificación de 6 dígitos
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Simular envío de correo de verificación (ProveedorCorreo)
  enviarCorreoVerificacion(destinatario, codigo) {
    console.log(`[ProveedorCorreo] Enviando correo a ${destinatario}`);
    console.log(`[ProveedorCorreo] Código de verificación: ${codigo}`);
    
    // Guardar código para validación posterior
    this.saveVerificationCode(destinatario, codigo, 'email');
    
    // Simular delay de envío
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Código enviado a ${destinatario}`,
          code: codigo // Solo para desarrollo/testing
        });
      }, 500);
    });
  }

  // Simular envío de SMS (ProveedorSMS)
  enviarSMS(telefono, codigo) {
    console.log(`[ProveedorSMS] Enviando SMS a ${telefono}`);
    console.log(`[ProveedorSMS] Código de verificación: ${codigo}`);
    
    // Guardar código para validación posterior
    this.saveVerificationCode(telefono, codigo, 'sms');
    
    // Simular delay de envío
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Código enviado a ${telefono}`,
          code: codigo // Solo para desarrollo/testing
        });
      }, 500);
    });
  }

  // Guardar código de verificación en localStorage
  saveVerificationCode(destinatario, codigo, tipo) {
    const codes = this.getVerificationCodes();
    const timestamp = Date.now();
    const expirationTime = 10 * 60 * 1000; // 10 minutos
    
    codes[destinatario] = {
      code: codigo,
      type: tipo,
      timestamp,
      expires: timestamp + expirationTime
    };
    
    localStorage.setItem(this.VERIFICATION_CODES_KEY, JSON.stringify(codes));
  }

  // Obtener códigos de verificación guardados
  getVerificationCodes() {
    const codesJSON = localStorage.getItem(this.VERIFICATION_CODES_KEY);
    return codesJSON ? JSON.parse(codesJSON) : {};
  }

  // Validar código de verificación
  validarConfirmacion(destinatario, codigoIngresado) {
    const codes = this.getVerificationCodes();
    const savedCode = codes[destinatario];
    
    if (!savedCode) {
      return {
        success: false,
        message: 'No se encontró código de verificación para este destinatario'
      };
    }
    
    // Verificar si el código ha expirado
    if (Date.now() > savedCode.expires) {
      delete codes[destinatario];
      localStorage.setItem(this.VERIFICATION_CODES_KEY, JSON.stringify(codes));
      return {
        success: false,
        message: 'El código de verificación ha expirado'
      };
    }
    
    // Validar código
    if (savedCode.code === codigoIngresado) {
      // Eliminar código usado
      delete codes[destinatario];
      localStorage.setItem(this.VERIFICATION_CODES_KEY, JSON.stringify(codes));
      
      return {
        success: true,
        message: 'Verificación exitosa',
        type: savedCode.type
      };
    }
    
    return {
      success: false,
      message: 'Código de verificación incorrecto'
    };
  }

  // Limpiar códigos expirados
  cleanExpiredCodes() {
    const codes = this.getVerificationCodes();
    const now = Date.now();
    let hasChanges = false;
    
    Object.keys(codes).forEach(key => {
      if (now > codes[key].expires) {
        delete codes[key];
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      localStorage.setItem(this.VERIFICATION_CODES_KEY, JSON.stringify(codes));
    }
  }
}

// Exportar instancia única (Singleton)
export default new VerificationService();
