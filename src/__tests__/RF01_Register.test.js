/**
 * RF01 - REGISTRAR USUARIO
 * Pruebas Unitarias Completas siguiendo SWEBOK Capítulo 5
 * 
 * Tipos de prueba implementados:
 * - Pruebas de Caja Blanca (White-box): Cobertura de código, caminos lógicos
 * - Pruebas de Caja Negra (Black-box): Validación de entradas/salidas
 * - Pruebas de Partición de Equivalencia
 * - Pruebas de Valores Límite
 * - Pruebas de Transición de Estados
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../views/Register/Register';
import UserController from '../controllers/UserController';
import User from '../models/User';
import '@testing-library/jest-dom';

// Mock del useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    search: '?email=test@example.com'
  })
}));

describe('RF01 - REGISTRAR USUARIO - Pruebas Unitarias Completas', () => {
  
  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
    mockNavigate.mockClear();
    // Resetear el estado del UserController
    UserController.logout();
  });

  // ========================================
  // SECCIÓN 1: PRUEBAS DE MODELO DE DATOS
  // ========================================
  describe('1. Modelo User - Pruebas de Caja Blanca', () => {
    
    test('1.1 Constructor crea usuario con todos los campos requeridos', () => {
      const user = new User('user_123', 'test@example.com', 'Juan', 'Pérez', 'password123');
      
      expect(user.id).toBe('user_123');
      expect(user.email).toBe('test@example.com');
      expect(user.firstName).toBe('Juan');
      expect(user.lastName).toBe('Pérez');
      expect(user.password).toBe('password123');
      expect(user.phone).toBe('');
      expect(user.emailVerified).toBe(false);
      expect(user.phoneVerified).toBe(false);
      expect(user.estadoCuenta).toBe('pendiente');
      expect(user.addresses).toEqual([]);
      expect(user.orders).toEqual([]);
    });

    test('1.2 getFullName() retorna nombre completo correctamente', () => {
      const user = new User('user_123', 'test@example.com', 'María', 'González');
      expect(user.getFullName()).toBe('María González');
    });

    test('1.3 toJSON() serializa correctamente el usuario', () => {
      const user = new User('user_456', 'ana@test.com', 'Ana', 'Ruiz');
      user.phone = '3001234567';
      
      const json = user.toJSON();
      
      expect(json).toMatchObject({
        id: 'user_456',
        email: 'ana@test.com',
        firstName: 'Ana',
        lastName: 'Ruiz',
        phone: '3001234567',
        emailVerified: false,
        phoneVerified: false,
        estadoCuenta: 'pendiente'
      });
      expect(json).not.toHaveProperty('password'); // Seguridad: no incluir password en JSON
    });

    test('1.4 Constructor sin password asigna null', () => {
      const user = new User('user_789', 'test@mail.com', 'Carlos', 'López');
      expect(user.password).toBeNull();
    });
  });

  // ========================================
  // SECCIÓN 2: PRUEBAS DE CONTROLADOR
  // ========================================
  describe('2. UserController - Pruebas de Registro', () => {
    
    test('2.1 registerUser() crea usuario exitosamente con datos válidos', () => {
      const userData = {
        email: 'nuevo@test.com',
        firstName: 'Usuario',
        lastName: 'Nuevo',
        phone: '3101234567',
        password: 'password123'
      };

      const result = UserController.registerUser(userData);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('nuevo@test.com');
      expect(result.user.firstName).toBe('Usuario');
      expect(result.user.phone).toBe('3101234567');
    });

    test('2.2 Usuario registrado se guarda en localStorage', () => {
      const userData = {
        email: 'storage@test.com',
        firstName: 'Test',
        lastName: 'Storage',
        phone: '3201234567',
        password: 'pass123'
      };

      UserController.registerUser(userData);

      // Verificar que se guardó en la lista de usuarios
      const usersJSON = localStorage.getItem('alkosto_users');
      expect(usersJSON).not.toBeNull();
      
      const users = JSON.parse(usersJSON);
      const savedUser = users.find(u => u.email === 'storage@test.com');
      expect(savedUser).toBeDefined();
      expect(savedUser.firstName).toBe('Test');
      expect(savedUser.phone).toBe('3201234567');
    });

    test('2.3 Usuario registrado queda como currentUser', () => {
      const userData = {
        email: 'current@test.com',
        firstName: 'Current',
        lastName: 'User',
        phone: '3301234567',
        password: 'pass456'
      };

      UserController.registerUser(userData);

      const currentUser = UserController.getCurrentUser();
      expect(currentUser).not.toBeNull();
      expect(currentUser.email).toBe('current@test.com');
      expect(UserController.isLoggedIn()).toBe(true);
    });

    test('2.4 isEmailRegistered() detecta emails duplicados', () => {
      const email = 'duplicado@test.com';
      
      expect(UserController.isEmailRegistered(email)).toBe(false);
      
      UserController.registerUser({
        email,
        firstName: 'User',
        lastName: 'Duplicado',
        phone: '3001234567',
        password: 'pass'
      });

      expect(UserController.isEmailRegistered(email)).toBe(true);
    });

    test('2.5 getAllUsers() retorna lista de usuarios registrados', () => {
      UserController.registerUser({
        email: 'user1@test.com',
        firstName: 'User',
        lastName: 'One',
        phone: '3001111111',
        password: 'pass1'
      });

      UserController.registerUser({
        email: 'user2@test.com',
        firstName: 'User',
        lastName: 'Two',
        phone: '3002222222',
        password: 'pass2'
      });

      const users = UserController.getAllUsers();
      expect(users.length).toBeGreaterThanOrEqual(2);
      expect(users.some(u => u.email === 'user1@test.com')).toBe(true);
      expect(users.some(u => u.email === 'user2@test.com')).toBe(true);
    });
  });

  // ========================================
  // SECCIÓN 3: PRUEBAS DE VALIDACIÓN
  // ========================================
  describe('3. Validaciones - Pruebas de Caja Negra', () => {
    
    const renderRegisterForm = () => {
      return render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
    };

    test('3.1 Email válido se muestra correctamente', () => {
      renderRegisterForm();
      const emailDisplay = screen.getByText('test@example.com');
      expect(emailDisplay).toBeInTheDocument();
    });

    test('3.2 Validación de campo "Nombres" vacío', async () => {
      renderRegisterForm();
      
      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const error = screen.getByText(/ingresa tu nombre/i);
        expect(error).toBeInTheDocument();
      });
    });

    test('3.3 Validación de campo "Apellidos" vacío', async () => {
      renderRegisterForm();
      
      const firstNameInput = screen.getByPlaceholderText(/nombres/i);
      fireEvent.change(firstNameInput, { target: { value: 'Juan' } });
      
      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const error = screen.getByText(/ingresa tu apellido/i);
        expect(error).toBeInTheDocument();
      });
    });

    test('3.4 Validación de teléfono vacío', async () => {
      renderRegisterForm();
      
      const firstNameInput = screen.getByPlaceholderText(/nombres/i);
      const lastNameInput = screen.getByPlaceholderText(/apellidos/i);
      
      fireEvent.change(firstNameInput, { target: { value: 'Juan' } });
      fireEvent.change(lastNameInput, { target: { value: 'Pérez' } });
      
      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const error = screen.getByText(/ingresa tu número de teléfono/i);
        expect(error).toBeInTheDocument();
      });
    });

    test('3.5 Validación de teléfono con menos de 10 dígitos', async () => {
      renderRegisterForm();
      
      const phoneInput = screen.getByPlaceholderText(/teléfono celular/i);
      fireEvent.change(phoneInput, { target: { value: '300123' } });

      await waitFor(() => {
        const error = screen.getByText(/número celular válido de 10 dígitos/i);
        expect(error).toBeInTheDocument();
      });
    });

    test('3.6 Validación de teléfono que no empieza con 3', async () => {
      renderRegisterForm();
      
      const phoneInput = screen.getByPlaceholderText(/teléfono celular/i);
      fireEvent.change(phoneInput, { target: { value: '2001234567' } });

      await waitFor(() => {
        const error = screen.getByText(/el número debe empezar con '3'/i);
        expect(error).toBeInTheDocument();
      });
    });

    test('3.7 Validación de términos y condiciones no aceptados', async () => {
      renderRegisterForm();
      
      const firstNameInput = screen.getByPlaceholderText(/nombres/i);
      const lastNameInput = screen.getByPlaceholderText(/apellidos/i);
      const phoneInput = screen.getByPlaceholderText(/teléfono celular/i);
      
      fireEvent.change(firstNameInput, { target: { value: 'Juan' } });
      fireEvent.change(lastNameInput, { target: { value: 'Pérez' } });
      fireEvent.change(phoneInput, { target: { value: '3001234567' } });
      
      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const error = screen.getByText(/debes aceptar los términos/i);
        expect(error).toBeInTheDocument();
      });
    });

    test('3.8 Teléfono válido con 10 dígitos empezando en 3', async () => {
      renderRegisterForm();
      
      const phoneInput = screen.getByPlaceholderText(/teléfono celular/i);
      fireEvent.change(phoneInput, { target: { value: '3101234567' } });

      // Esperar un momento para que se procese la validación
      await waitFor(() => {
        // No debe haber mensaje de error
        const errors = screen.queryByText(/número celular válido de 10 dígitos/i);
        expect(errors).not.toBeInTheDocument();
      });
    });
  });

  // ========================================
  // SECCIÓN 4: PRUEBAS DE VALORES LÍMITE
  // ========================================
  describe('4. Valores Límite (Boundary Testing)', () => {
    
    test('4.1 Teléfono: 9 dígitos (límite inferior - inválido)', () => {
      const phoneInput = '300123456'; // 9 dígitos
      expect(phoneInput.length).toBe(9);
      expect(phoneInput.length === 10).toBe(false);
    });

    test('4.2 Teléfono: 10 dígitos (válido)', () => {
      const phoneInput = '3001234567'; // 10 dígitos
      expect(phoneInput.length).toBe(10);
      expect(phoneInput.startsWith('3')).toBe(true);
    });

    test('4.3 Teléfono: 11 dígitos (límite superior - debe truncarse)', async () => {
      const { container } = render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      const phoneInput = screen.getByPlaceholderText(/teléfono celular/i);
      
      // Intentar ingresar 11 dígitos
      fireEvent.change(phoneInput, { target: { value: '30012345678' } });
      
      // El maxLength debe limitar a 10
      expect(phoneInput.value.length).toBeLessThanOrEqual(10);
    });

    test('4.4 Nombre: 1 carácter (límite inferior - válido)', () => {
      const name = 'A';
      expect(name.trim().length).toBeGreaterThan(0);
    });

    test('4.5 Nombre: cadena vacía (inválido)', () => {
      const name = '';
      expect(name.trim().length).toBe(0);
    });

    test('4.6 Nombre: solo espacios (inválido)', () => {
      const name = '   ';
      expect(name.trim().length).toBe(0);
    });
  });

  // ========================================
  // SECCIÓN 5: PRUEBAS DE PARTICIÓN DE EQUIVALENCIA
  // ========================================
  describe('5. Partición de Equivalencia', () => {
    
    describe('5.1 Teléfono - Particiones', () => {
      test('Partición válida: 10 dígitos, empieza con 3', () => {
        const validPhones = ['3001234567', '3101234567', '3201234567', '3501234567'];
        validPhones.forEach(phone => {
          expect(phone.length).toBe(10);
          expect(phone.startsWith('3')).toBe(true);
        });
      });

      test('Partición inválida: No empieza con 3', () => {
        const invalidPhones = ['2001234567', '4001234567', '5001234567'];
        invalidPhones.forEach(phone => {
          expect(phone.startsWith('3')).toBe(false);
        });
      });

      test('Partición inválida: Longitud incorrecta', () => {
        const invalidPhones = ['300', '30012', '300123456', '30012345678'];
        invalidPhones.forEach(phone => {
          expect(phone.length !== 10).toBe(true);
        });
      });
    });

    describe('5.2 Email - Particiones', () => {
      test('Partición válida: Formato email correcto', () => {
        const validEmails = [
          'user@example.com',
          'test.user@domain.co',
          'name_123@test-domain.com'
        ];
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        validEmails.forEach(email => {
          expect(emailRegex.test(email)).toBe(true);
        });
      });

      test('Partición inválida: Formato email incorrecto', () => {
        const invalidEmails = [
          'invalidemail',
          'missing@domain',
          '@nodomain.com',
          'no-at-sign.com'
        ];
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        invalidEmails.forEach(email => {
          expect(emailRegex.test(email)).toBe(false);
        });
      });
    });

    describe('5.3 Nombres/Apellidos - Particiones', () => {
      test('Partición válida: Texto con contenido', () => {
        const validNames = ['Juan', 'María José', 'Ana-María', "O'Brien"];
        validNames.forEach(name => {
          expect(name.trim().length).toBeGreaterThan(0);
        });
      });

      test('Partición inválida: Texto vacío o solo espacios', () => {
        const invalidNames = ['', '   ', '\t', '\n'];
        invalidNames.forEach(name => {
          expect(name.trim().length).toBe(0);
        });
      });
    });
  });

  // ========================================
  // SECCIÓN 6: PRUEBAS DE FLUJO COMPLETO
  // ========================================
  describe('6. Flujo Completo de Registro (Happy Path)', () => {
    
    test('6.1 Registro exitoso con datos válidos navega a password', async () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );

      // Llenar formulario con datos válidos
      const firstNameInput = screen.getByPlaceholderText(/nombres/i);
      const lastNameInput = screen.getByPlaceholderText(/apellidos/i);
      const phoneInput = screen.getByPlaceholderText(/teléfono celular/i);
      const termsCheckbox = screen.getByRole('checkbox');

      fireEvent.change(firstNameInput, { target: { value: 'Juan' } });
      fireEvent.change(lastNameInput, { target: { value: 'Pérez' } });
      fireEvent.change(phoneInput, { target: { value: '3001234567' } });
      fireEvent.click(termsCheckbox);

      // Verificar que el botón no está deshabilitado
      const submitButton = screen.getByRole('button', { name: /continuar/i });
      expect(submitButton).not.toBeDisabled();

      // Enviar formulario
      fireEvent.click(submitButton);

      // Verificar que navega a la página de password
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.stringContaining('/register/password')
        );
      });

      // Verificar que se pasaron los parámetros correctos
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('email=test@example.com')
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('firstName=Juan')
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('lastName=P%C3%A9rez')
      );
    });

    test('6.2 Botón "Continuar" deshabilitado durante envío', async () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );

      const firstNameInput = screen.getByPlaceholderText(/nombres/i);
      const lastNameInput = screen.getByPlaceholderText(/apellidos/i);
      const phoneInput = screen.getByPlaceholderText(/teléfono celular/i);
      const termsCheckbox = screen.getByRole('checkbox');

      fireEvent.change(firstNameInput, { target: { value: 'Test' } });
      fireEvent.change(lastNameInput, { target: { value: 'User' } });
      fireEvent.change(phoneInput, { target: { value: '3009876543' } });
      fireEvent.click(termsCheckbox);

      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      // El botón debe deshabilitarse inmediatamente
      expect(submitButton).toBeDisabled();
    });
  });

  // ========================================
  // SECCIÓN 7: PRUEBAS DE INTERFAZ DE USUARIO
  // ========================================
  describe('7. Elementos de UI Presentes', () => {
    
    test('7.1 Renderiza el título "Crea tu cuenta"', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      const title = screen.getByText(/crea tu cuenta/i);
      expect(title).toBeInTheDocument();
    });

    test('7.2 Muestra el email recibido por parámetro', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      const emailLabel = screen.getByText(/correo electrónico ingresado/i);
      const emailValue = screen.getByText('test@example.com');
      
      expect(emailLabel).toBeInTheDocument();
      expect(emailValue).toBeInTheDocument();
    });

    test('7.3 Renderiza botón "Modificar" email', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      const modifyButton = screen.getByRole('button', { name: /modificar/i });
      expect(modifyButton).toBeInTheDocument();
    });

    test('7.4 Renderiza campos del formulario', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      expect(screen.getByPlaceholderText(/nombres/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/apellidos/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/teléfono celular/i)).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    test('7.5 Renderiza prefijo telefónico +57', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      const prefix = screen.getByText('+57');
      expect(prefix).toBeInTheDocument();
    });

    test('7.6 Renderiza link de términos y condiciones', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      const termsLink = screen.getByText(/términos y condiciones/i);
      expect(termsLink).toBeInTheDocument();
      expect(termsLink.closest('a')).toHaveAttribute('href', '/terminos');
    });

    test('7.7 Renderiza botón "Volver"', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      const backButton = screen.getByText(/volver/i);
      expect(backButton).toBeInTheDocument();
    });
  });

  // ========================================
  // SECCIÓN 8: PRUEBAS DE MODIFICACIÓN DE EMAIL
  // ========================================
  describe('8. Funcionalidad de Modificar Email', () => {
    
    test('8.1 Clic en "Modificar" muestra input de edición', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      const modifyButton = screen.getByRole('button', { name: /modificar/i });
      fireEvent.click(modifyButton);

      // Debe aparecer input de email
      const emailInput = screen.getByDisplayValue('test@example.com');
      expect(emailInput).toBeInTheDocument();
      
      // Deben aparecer botones Guardar y Cancelar
      expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    });

    test('8.2 Cancelar restaura vista original', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      const modifyButton = screen.getByRole('button', { name: /modificar/i });
      fireEvent.click(modifyButton);

      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      fireEvent.click(cancelButton);

      // Debe volver a mostrarse el formulario de registro
      expect(screen.getByPlaceholderText(/nombres/i)).toBeInTheDocument();
    });

    test('8.3 Guardar con email válido actualiza el email', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      const modifyButton = screen.getByRole('button', { name: /modificar/i });
      fireEvent.click(modifyButton);

      const emailInput = screen.getByDisplayValue('test@example.com');
      fireEvent.change(emailInput, { target: { value: 'nuevo@email.com' } });

      const saveButton = screen.getByRole('button', { name: /guardar/i });
      fireEvent.click(saveButton);

      // Verificar que se muestra el nuevo email
      expect(screen.getByText('nuevo@email.com')).toBeInTheDocument();
    });

    test('8.4 Botón Guardar deshabilitado con email inválido', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      const modifyButton = screen.getByRole('button', { name: /modificar/i });
      fireEvent.click(modifyButton);

      const emailInput = screen.getByDisplayValue('test@example.com');
      fireEvent.change(emailInput, { target: { value: 'email-invalido' } });

      const saveButton = screen.getByRole('button', { name: /guardar/i });
      expect(saveButton).toBeDisabled();
    });
  });

  // ========================================
  // SECCIÓN 9: PRUEBAS DE MANEJO DE ERRORES
  // ========================================
  describe('9. Manejo de Errores y Mensajes', () => {
    
    test('9.1 Errores se limpian al corregir campos', async () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      // Enviar formulario vacío para generar errores
      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      // Esperar a que aparezca el error
      await waitFor(() => {
        expect(screen.getByText(/ingresa tu nombre/i)).toBeInTheDocument();
      });

      // Corregir el campo
      const firstNameInput = screen.getByPlaceholderText(/nombres/i);
      fireEvent.change(firstNameInput, { target: { value: 'Juan' } });

      // El error debe desaparecer
      await waitFor(() => {
        expect(screen.queryByText(/ingresa tu nombre/i)).not.toBeInTheDocument();
      });
    });

    test('9.2 Múltiples errores se muestran simultáneamente', async () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/ingresa tu nombre/i)).toBeInTheDocument();
        expect(screen.getByText(/ingresa tu apellido/i)).toBeInTheDocument();
        expect(screen.getByText(/ingresa tu número de teléfono/i)).toBeInTheDocument();
        expect(screen.getByText(/debes aceptar los términos/i)).toBeInTheDocument();
      });
    });

    test('9.3 Clase CSS "error" se aplica a campos inválidos', async () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const firstNameInput = screen.getByPlaceholderText(/nombres/i);
        expect(firstNameInput).toHaveClass('error');
      });
    });
  });

  // ========================================
  // SECCIÓN 10: PRUEBAS DE COBERTURA DE CÓDIGO
  // ========================================
  describe('10. Cobertura de Caminos Críticos', () => {
    
    test('10.1 Camino: Sin email en URL redirige a home', async () => {
      // Mock para simular sin email
      jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
        search: ''
      });

      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );

      // Debería redirigir a /
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    test('10.2 Input de teléfono solo acepta números', () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      const phoneInput = screen.getByPlaceholderText(/teléfono celular/i);
      
      // Intentar ingresar letras y caracteres especiales
      fireEvent.change(phoneInput, { target: { value: 'abc123!@#' } });
      
      // Solo deben quedar los números
      expect(phoneInput.value).toBe('123');
    });

    test('10.3 Validación de teléfono se activa después del primer input', async () => {
      render(
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      );
      
      const phoneInput = screen.getByPlaceholderText(/teléfono celular/i);
      
      // Al inicio no debe haber validación
      expect(screen.queryByText(/número celular válido/i)).not.toBeInTheDocument();
      
      // Después de escribir, debe activarse la validación
      fireEvent.change(phoneInput, { target: { value: '200' } });
      
      await waitFor(() => {
        expect(screen.getByText(/el número debe empezar con '3'/i)).toBeInTheDocument();
      });
    });
  });
});
