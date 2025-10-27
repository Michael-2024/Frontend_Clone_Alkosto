describe('Registro E2E - RF01 (caso feliz)', () => {
  const email = `e2e_${Date.now()}@example.com`;

  it('completa el flujo de registro y crea usuario', () => {
    // Visitar la página de registro con email como parámetro
    cy.visit(`/register?email=${encodeURIComponent(email)}`);

    // Rellenar nombres y teléfono
    cy.get('input[name="firstName"]').type('E2E');
    cy.get('input[name="lastName"]').type('Tester');
    cy.get('input[name="phone"]').type('3001234567');
    cy.get('input[name="agreeTerms"]').check();

    // Continuar al paso de contraseña
    cy.get('button.continue-button').click();

    // En la página de contraseña
    cy.url().should('include', '/register/password');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('button.continue-button, button[type="submit"]').click();

    // Después de crear, debe redirigir a / (home)
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);

    // Verificar localStorage que el usuario quedó guardado
    cy.window().then((win) => {
      const current = win.localStorage.getItem('alkosto_user');
      expect(current).to.exist;
      const user = JSON.parse(current);
      expect(user.email).to.equal(email);
    });
  });
});
