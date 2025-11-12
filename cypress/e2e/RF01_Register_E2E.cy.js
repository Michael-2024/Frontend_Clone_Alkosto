/**
 * RF01 - REGISTRAR USUARIO
 * Pruebas End-to-End con Cypress - SWEBOK Capítulo 5: Pruebas
 * 
 * Estas pruebas verifican el flujo completo desde la perspectiva del usuario:
 * - Interacciones reales con la UI
 * - Navegación entre páginas
 * - Validaciones visuales
 * - Persistencia de datos
 * - Comportamiento del navegador
 */

describe('RF01 - REGISTRAR USUARIO - Pruebas E2E Completas', () => {
  
  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  // ========================================
  // SECCIÓN 1: CASO FELIZ (HAPPY PATH)
  // ========================================
  describe('1. Flujo Completo de Registro Exitoso', () => {
    
    it('1.1 Completa el registro con todos los datos válidos', () => {
      const email = `e2e_success_${Date.now()}@example.com`;
      
      // PASO 1: Visitar página de registro
      cy.visit(`/register?email=${encodeURIComponent(email)}`);
      
      // Verificar que cargó correctamente
      cy.contains('Crea tu cuenta').should('be.visible');
      cy.contains('Correo electrónico ingresado:').should('be.visible');
      cy.contains(email).should('be.visible');

      // PASO 2: Llenar formulario
      cy.get('input[name="firstName"]').type('Juan');
      cy.get('input[name="lastName"]').type('Pérez');
      cy.get('input[name="phone"]').type('3001234567');
      cy.get('input[name="agreeTerms"]').check();

      // PASO 3: Verificar que el botón está habilitado
      cy.get('button.continue-button').should('not.be.disabled');
      
      // PASO 4: Continuar al paso de contraseña
      cy.get('button.continue-button').click();

      // PASO 5: Verificar navegación
      cy.url().should('include', '/register/password');
      cy.url().should('include', `email=${encodeURIComponent(email)}`);
      cy.url().should('include', 'firstName=Juan');
      cy.url().should('include', 'lastName=P%C3%A9rez');
      cy.url().should('include', 'phone=3001234567');

      // PASO 6: Llenar contraseña
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="confirmPassword"]').type('password123');
      cy.get('button.continue-button, button[type="submit"]').click();

      // PASO 7: Verificar redirección a home
      cy.url().should('eq', `${Cypress.config().baseUrl}/`);

      // PASO 8: Verificar que el usuario quedó guardado en localStorage
      cy.window().then((win) => {
        const currentUser = win.localStorage.getItem('alkosto_user');
        expect(currentUser).to.exist;
        
        const user = JSON.parse(currentUser);
        expect(user.email).to.equal(email);
        expect(user.firstName).to.equal('Juan');
        expect(user.lastName).to.equal('Pérez');
        expect(user.phone).to.equal('3001234567');
      });

      // PASO 9: Verificar que aparece el nombre en el header
      cy.contains('Juan').should('be.visible');
    });

    it('1.2 Permite registrarse con nombres compuestos y tildes', () => {
      const email = `e2e_tildes_${Date.now()}@example.com`;
      
      cy.visit(`/register?email=${encodeURIComponent(email)}`);
      
      cy.get('input[name="firstName"]').type('María José');
      cy.get('input[name="lastName"]').type('González Martínez');
      cy.get('input[name="phone"]').type('3109876543');
      cy.get('input[name="agreeTerms"]').check();
      cy.get('button.continue-button').click();

      cy.url().should('include', '/register/password');
      
      cy.get('input[name="password"]').type('SecurePass123!');
      cy.get('input[name="confirmPassword"]').type('SecurePass123!');
      cy.get('button.continue-button, button[type="submit"]').click();

      cy.url().should('eq', `${Cypress.config().baseUrl}/`);
      cy.contains('María José').should('be.visible');
    });
  });

  // ========================================
  // SECCIÓN 2: VALIDACIONES DE CAMPOS
  // ========================================
  describe('2. Validaciones de Campos Requeridos', () => {
    
    const testEmail = 'validation@test.com';
    
    beforeEach(() => {
      cy.visit(`/register?email=${encodeURIComponent(testEmail)}`);
    });

    it('2.1 Muestra error cuando el nombre está vacío', () => {
      // Dejar nombres vacío y llenar otros campos
      cy.get('input[name="lastName"]').type('Apellido');
      cy.get('input[name="phone"]').type('3001234567');
      cy.get('input[name="agreeTerms"]').check();
      
      cy.get('button.continue-button').click();
      
      // Debe mostrar error y no navegar
      cy.contains(/ingresa tu nombre/i).should('be.visible');
      cy.url().should('include', '/register');
      cy.url().should('not.include', '/password');
    });

    it('2.2 Muestra error cuando el apellido está vacío', () => {
      cy.get('input[name="firstName"]').type('Nombre');
      // Dejar apellidos vacío
      cy.get('input[name="phone"]').type('3001234567');
      cy.get('input[name="agreeTerms"]').check();
      
      cy.get('button.continue-button').click();
      
      cy.contains(/ingresa tu apellido/i).should('be.visible');
      cy.url().should('include', '/register');
    });

    it('2.3 Muestra error cuando el teléfono está vacío', () => {
      cy.get('input[name="firstName"]').type('Nombre');
      cy.get('input[name="lastName"]').type('Apellido');
      // Dejar teléfono vacío
      cy.get('input[name="agreeTerms"]').check();
      
      cy.get('button.continue-button').click();
      
      cy.contains(/ingresa tu número de teléfono/i).should('be.visible');
      cy.url().should('include', '/register');
    });

    it('2.4 Muestra error cuando no acepta términos y condiciones', () => {
      cy.get('input[name="firstName"]').type('Nombre');
      cy.get('input[name="lastName"]').type('Apellido');
      cy.get('input[name="phone"]').type('3001234567');
      // No marcar checkbox
      
      cy.get('button.continue-button').click();
      
      cy.contains(/debes aceptar los términos/i).should('be.visible');
      cy.url().should('include', '/register');
    });

    it('2.5 Muestra todos los errores simultáneamente', () => {
      // No llenar ningún campo, solo hacer clic
      cy.get('button.continue-button').click();
      
      // Deben aparecer todos los errores
      cy.contains(/ingresa tu nombre/i).should('be.visible');
      cy.contains(/ingresa tu apellido/i).should('be.visible');
      cy.contains(/ingresa tu número de teléfono/i).should('be.visible');
      cy.contains(/debes aceptar los términos/i).should('be.visible');
    });
  });

  // ========================================
  // SECCIÓN 3: VALIDACIÓN DE TELÉFONO
  // ========================================
  describe('3. Validaciones Específicas de Teléfono', () => {
    
    const testEmail = 'phone-validation@test.com';
    
    beforeEach(() => {
      cy.visit(`/register?email=${encodeURIComponent(testEmail)}`);
      cy.get('input[name="firstName"]').type('Test');
      cy.get('input[name="lastName"]').type('User');
      cy.get('input[name="agreeTerms"]').check();
    });

    it('3.1 Rechaza teléfono que no empieza con 3', () => {
      cy.get('input[name="phone"]').type('2001234567');
      
      // Esperar mensaje de error
      cy.contains(/el número debe empezar con '3'/i, { timeout: 1000 }).should('be.visible');
      
      cy.get('button.continue-button').click();
      cy.url().should('include', '/register');
      cy.url().should('not.include', '/password');
    });

    it('3.2 Rechaza teléfono con menos de 10 dígitos', () => {
      cy.get('input[name="phone"]').type('300123456'); // 9 dígitos
      
      cy.contains(/número celular válido de 10 dígitos/i, { timeout: 1000 }).should('be.visible');
      
      cy.get('button.continue-button').click();
      cy.url().should('include', '/register');
    });

    it('3.3 Limita entrada a 10 dígitos máximo', () => {
      cy.get('input[name="phone"]').type('30012345678901234567'); // Muchos dígitos
      
      // Verificar que solo se aceptaron 10
      cy.get('input[name="phone"]').should('have.value', '3001234567');
    });

    it('3.4 Solo permite números en el campo de teléfono', () => {
      cy.get('input[name="phone"]').type('abc123xyz456');
      
      // Solo deben quedar los números
      cy.get('input[name="phone"]').should('have.value', '123456');
    });

    it('3.5 Acepta teléfono válido: 10 dígitos comenzando con 3', () => {
      const validPhones = ['3001234567', '3101234567', '3201234567', '3501234567'];
      
      validPhones.forEach((phone, index) => {
        if (index > 0) {
          // Limpiar y volver a llenar para probar múltiples
          cy.get('input[name="phone"]').clear();
        }
        
        cy.get('input[name="phone"]').type(phone);
        
        // No debe haber error visible
        cy.get('.phone-error-message').should('not.exist');
      });
    });
  });

  // ========================================
  // SECCIÓN 4: MODIFICACIÓN DE EMAIL
  // ========================================
  describe('4. Funcionalidad de Modificar Email', () => {
    
    it('4.1 Permite modificar el email ingresado', () => {
      const originalEmail = 'original@test.com';
      const newEmail = 'nuevo@test.com';
      
      cy.visit(`/register?email=${encodeURIComponent(originalEmail)}`);
      
      // Verificar email original
      cy.contains(originalEmail).should('be.visible');
      
      // Hacer clic en modificar
      cy.contains('button', 'Modificar').click();
      
      // Debe aparecer input de edición
      cy.get('input[type="email"]').should('be.visible').should('have.value', originalEmail);
      
      // Cambiar email
      cy.get('input[type="email"]').clear().type(newEmail);
      
      // Guardar
      cy.contains('button', 'Guardar').click();
      
      // Verificar nuevo email
      cy.contains(newEmail).should('be.visible');
      cy.contains(originalEmail).should('not.exist');
    });

    it('4.2 Botón Guardar deshabilitado con email inválido', () => {
      cy.visit(`/register?email=valid@test.com`);
      
      cy.contains('button', 'Modificar').click();
      
      // Ingresar email inválido
      cy.get('input[type="email"]').clear().type('email-sin-arroba');
      
      // Botón debe estar deshabilitado
      cy.contains('button', 'Guardar').should('be.disabled');
    });

    it('4.3 Cancelar restaura email original', () => {
      const originalEmail = 'original@test.com';
      
      cy.visit(`/register?email=${encodeURIComponent(originalEmail)}`);
      
      cy.contains('button', 'Modificar').click();
      cy.get('input[type="email"]').clear().type('otro@test.com');
      
      // Cancelar
      cy.contains('button', 'Cancelar').click();
      
      // Debe volver a mostrar el original
      cy.contains(originalEmail).should('be.visible');
      cy.get('input[name="firstName"]').should('be.visible'); // Form visible
    });
  });

  // ========================================
  // SECCIÓN 5: ELEMENTOS DE UI
  // ========================================
  describe('5. Elementos de Interfaz de Usuario', () => {
    
    it('5.1 Muestra todos los elementos visuales correctamente', () => {
      cy.visit(`/register?email=ui-test@test.com`);
      
      // Verificar elementos principales
      cy.contains('Crea tu cuenta').should('be.visible');
      cy.contains('Volver').should('be.visible');
      cy.contains('Correo electrónico ingresado:').should('be.visible');
      cy.contains('Modificar').should('be.visible');
      
      // Verificar inputs
      cy.get('input[name="firstName"]').should('be.visible').should('have.attr', 'placeholder', 'Nombres');
      cy.get('input[name="lastName"]').should('be.visible').should('have.attr', 'placeholder', 'Apellidos');
      cy.get('input[name="phone"]').should('be.visible').should('have.attr', 'placeholder', 'Teléfono celular');
      
      // Verificar checkbox y términos
      cy.get('input[name="agreeTerms"]').should('exist');
      cy.contains('términos y condiciones').should('be.visible');
      
      // Verificar botón
      cy.get('button.continue-button').should('be.visible').should('contain', 'Continuar');
    });

    it('5.2 Muestra prefijo telefónico +57 con bandera', () => {
      cy.visit(`/register?email=phone-prefix@test.com`);
      
      cy.contains('+57').should('be.visible');
      cy.get('.colombia-flag').should('exist');
    });

    it('5.3 Link de términos y condiciones es clickeable', () => {
      cy.visit(`/register?email=terms@test.com`);
      
      cy.contains('términos y condiciones').should('have.attr', 'href', '/terminos');
    });

    it('5.4 Botón Volver navega correctamente', () => {
      cy.visit(`/register?email=back@test.com`);
      
      cy.contains('Volver').click();
      cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    });
  });

  // ========================================
  // SECCIÓN 6: INTERACCIONES Y UX
  // ========================================
  describe('6. Experiencia de Usuario e Interacciones', () => {
    
    it('6.1 Errores desaparecen al corregir campos', () => {
      cy.visit(`/register?email=ux-test@test.com`);
      
      // Generar error
      cy.get('button.continue-button').click();
      cy.contains(/ingresa tu nombre/i).should('be.visible');
      
      // Corregir
      cy.get('input[name="firstName"]').type('Nombre');
      
      // Error debe desaparecer
      cy.contains(/ingresa tu nombre/i).should('not.exist');
    });

    it('6.2 Campo de nombre acepta caracteres especiales válidos', () => {
      cy.visit(`/register?email=special-chars@test.com`);
      
      const specialNames = ["O'Connor", "María-José", "Jean-Luc", "D'Angelo"];
      
      specialNames.forEach(name => {
        cy.get('input[name="firstName"]').clear().type(name);
        cy.get('input[name="firstName"]').should('have.value', name);
      });
    });

    it('6.3 Botón se deshabilita durante el envío', () => {
      cy.visit(`/register?email=submit-disabled@test.com`);
      
      cy.get('input[name="firstName"]').type('Test');
      cy.get('input[name="lastName"]').type('User');
      cy.get('input[name="phone"]').type('3001234567');
      cy.get('input[name="agreeTerms"]').check();
      
      cy.get('button.continue-button').click();
      
      // Verificar que se deshabilita
      cy.get('button.continue-button').should('be.disabled');
    });
  });

  // ========================================
  // SECCIÓN 7: CASOS EDGE
  // ========================================
  describe('7. Casos Edge y Escenarios Especiales', () => {
    
    it('7.1 Redirige a home si no hay email en URL', () => {
      cy.visit('/register');
      
      // Debe redirigir a home
      cy.url().should('eq', `${Cypress.config().baseUrl}/`, { timeout: 5000 });
    });

    it('7.2 Maneja nombres muy largos', () => {
      cy.visit(`/register?email=long-name@test.com`);
      
      const longName = 'A'.repeat(50);
      cy.get('input[name="firstName"]').type(longName);
      cy.get('input[name="firstName"]').should('have.value', longName);
    });

    it('7.3 Maneja espacios al inicio y final de nombres', () => {
      cy.visit(`/register?email=spaces@test.com`);
      
      cy.get('input[name="firstName"]').type('  Juan  ');
      cy.get('input[name="lastName"]').type('  Pérez  ');
      cy.get('input[name="phone"]').type('3001234567');
      cy.get('input[name="agreeTerms"]').check();
      
      cy.get('button.continue-button').click();
      
      // Debería navegar correctamente (trim se aplica en validación)
      cy.url().should('include', '/register/password');
    });
  });

  // ========================================
  // SECCIÓN 8: RESPONSIVE DESIGN
  // ========================================
  describe('8. Diseño Responsive', () => {
    
    const testEmail = 'responsive@test.com';
    
    it('8.1 Funciona correctamente en móvil (375x667)', () => {
      cy.viewport(375, 667);
      cy.visit(`/register?email=${encodeURIComponent(testEmail)}`);
      
      cy.contains('Crea tu cuenta').should('be.visible');
      cy.get('input[name="firstName"]').should('be.visible');
      cy.get('button.continue-button').should('be.visible');
    });

    it('8.2 Funciona correctamente en tablet (768x1024)', () => {
      cy.viewport(768, 1024);
      cy.visit(`/register?email=${encodeURIComponent(testEmail)}`);
      
      cy.contains('Crea tu cuenta').should('be.visible');
      cy.get('input[name="firstName"]').should('be.visible');
    });

    it('8.3 Funciona correctamente en desktop (1920x1080)', () => {
      cy.viewport(1920, 1080);
      cy.visit(`/register?email=${encodeURIComponent(testEmail)}`);
      
      cy.contains('Crea tu cuenta').should('be.visible');
      cy.get('input[name="firstName"]').should('be.visible');
    });
  });

  // ========================================
  // SECCIÓN 9: ACCESIBILIDAD
  // ========================================
  describe('9. Pruebas de Accesibilidad', () => {
    
    it('9.1 Labels y placeholders están presentes', () => {
      cy.visit(`/register?email=a11y@test.com`);
      
      cy.get('input[name="firstName"]').should('have.attr', 'placeholder');
      cy.get('input[name="lastName"]').should('have.attr', 'placeholder');
      cy.get('input[name="phone"]').should('have.attr', 'placeholder');
    });

    it('9.2 Checkbox tiene label asociado', () => {
      cy.visit(`/register?email=checkbox-label@test.com`);
      
      cy.get('input[name="agreeTerms"]').parent('label').should('exist');
    });

    it('9.3 Mensajes de error son descriptivos', () => {
      cy.visit(`/register?email=error-messages@test.com`);
      
      cy.get('button.continue-button').click();
      
      // Verificar mensajes claros
      cy.contains('Ingresa tu nombre').should('be.visible');
      cy.contains('Ingresa tu apellido').should('be.visible');
      cy.contains('Ingresa tu número de teléfono').should('be.visible');
      cy.contains('Debes aceptar los términos').should('be.visible');
    });
  });

  // ========================================
  // SECCIÓN 10: PERFORMANCE
  // ========================================
  describe('10. Performance y Tiempos de Carga', () => {
    
    it('10.1 Página carga en menos de 3 segundos', () => {
      const startTime = Date.now();
      
      cy.visit(`/register?email=performance@test.com`);
      
      cy.contains('Crea tu cuenta').should('be.visible').then(() => {
        const endTime = Date.now();
        const loadTime = endTime - startTime;
        
        expect(loadTime).to.be.lessThan(3000);
      });
    });

    it('10.2 Validaciones responden instantáneamente', () => {
      cy.visit(`/register?email=validation-speed@test.com`);
      
      cy.get('input[name="phone"]').type('2001234567');
      
      // Error debe aparecer rápidamente
      cy.contains(/el número debe empezar con '3'/i, { timeout: 500 }).should('be.visible');
    });
  });
});
