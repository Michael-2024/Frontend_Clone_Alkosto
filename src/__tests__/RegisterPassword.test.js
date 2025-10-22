import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import '@testing-library/jest-dom';
import RegisterPassword from '../views/Register/RegisterPassword';
import UserController from '../controllers/UserController';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

// Mock UserController
jest.mock('../controllers/UserController', () => ({
  __esModule: true,
  default: {
    registerUser: jest.fn(),
  },
}));

describe('RF01 - Register User - RegisterPassword Component', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    localStorage.clear();
    jest.clearAllMocks();
  });

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  const mockValidLocation = {
    search: '?email=test@example.com&firstName=Juan&lastName=Pérez&phone=3001234567',
  };

  describe('Inicialización del componente', () => {
    test('debe cargar datos desde URL correctamente', () => {
      useLocation.mockReturnValue(mockValidLocation);

      renderWithRouter(<RegisterPassword />);
      
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText(/Crea tu contraseña/i)).toBeInTheDocument();
    });

    test('debe redirigir a /register si faltan datos requeridos', () => {
      useLocation.mockReturnValue({
        search: '?email=test@example.com',
      });

      renderWithRouter(<RegisterPassword />);
      
      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });

    test('debe redirigir a /register si falta el email', () => {
      useLocation.mockReturnValue({
        search: '?firstName=Juan&lastName=Pérez',
      });

      renderWithRouter(<RegisterPassword />);
      
      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });
  });

  describe('Validación de contraseñas', () => {
    beforeEach(() => {
      useLocation.mockReturnValue(mockValidLocation);
    });

    test('debe mostrar error si la contraseña está vacía', async () => {
      renderWithRouter(<RegisterPassword />);

      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Ingresa una contraseña')).toBeInTheDocument();
      });
    });

    test('debe mostrar error si la contraseña tiene menos de 6 caracteres', async () => {
      renderWithRouter(<RegisterPassword />);

      const passwordInput = screen.getByPlaceholderText('Contraseña');
      fireEvent.change(passwordInput, { target: { value: '12345' } });

      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
      });
    });

    test('debe mostrar error si las contraseñas no coinciden', async () => {
      renderWithRouter(<RegisterPassword />);

      const passwordInput = screen.getByPlaceholderText('Contraseña');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirmar contraseña');
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });

      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
      });
    });

    test('debe limpiar errores al modificar el campo', async () => {
      renderWithRouter(<RegisterPassword />);

      const passwordInput = screen.getByPlaceholderText('Contraseña');
      
      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Ingresa una contraseña')).toBeInTheDocument();
      });

      fireEvent.change(passwordInput, { target: { value: 'newpassword' } });

      await waitFor(() => {
        expect(screen.queryByText('Ingresa una contraseña')).not.toBeInTheDocument();
      });
    });
  });

  describe('Registro de usuario exitoso', () => {
    beforeEach(() => {
      useLocation.mockReturnValue(mockValidLocation);
      UserController.registerUser.mockReturnValue({
        success: true,
        user: {
          email: 'test@example.com',
          firstName: 'Juan',
          lastName: 'Pérez',
        },
      });
    });

    test('debe llamar a UserController.registerUser con datos correctos', async () => {
      renderWithRouter(<RegisterPassword />);

      const passwordInput = screen.getByPlaceholderText('Contraseña');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirmar contraseña');
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(UserController.registerUser).toHaveBeenCalledWith({
          email: 'test@example.com',
          firstName: 'Juan',
          lastName: 'Pérez',
          phone: '3001234567',
          password: 'password123',
        });
      });
    });

    test('debe navegar a página de verificación después de registro exitoso', async () => {
      renderWithRouter(<RegisterPassword />);

      const passwordInput = screen.getByPlaceholderText('Contraseña');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirmar contraseña');
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          '/verify',
          expect.objectContaining({
            state: expect.objectContaining({
              email: 'test@example.com',
              phone: '3001234567',
              fromRegister: true,
            }),
          })
        );
      });
    });

    test('debe deshabilitar el botón durante el envío', async () => {
      renderWithRouter(<RegisterPassword />);

      const passwordInput = screen.getByPlaceholderText('Contraseña');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirmar contraseña');
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      
      expect(submitButton).not.toBeDisabled();
      
      fireEvent.click(submitButton);

      // Durante el envío el botón debería estar deshabilitado
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Manejo de errores en registro', () => {
    beforeEach(() => {
      useLocation.mockReturnValue(mockValidLocation);
    });

    test('debe mostrar error general si falla el registro', async () => {
      UserController.registerUser.mockImplementation(() => {
        throw new Error('Error de red');
      });

      renderWithRouter(<RegisterPassword />);

      const passwordInput = screen.getByPlaceholderText('Contraseña');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirmar contraseña');
      
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

      const submitButton = screen.getByRole('button', { name: /crear cuenta/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Ocurrió un error durante el registro/i)).toBeInTheDocument();
      });
    });
  });

  describe('Renderizado de elementos', () => {
    beforeEach(() => {
      useLocation.mockReturnValue(mockValidLocation);
    });

    test('debe renderizar título principal', () => {
      renderWithRouter(<RegisterPassword />);
      expect(screen.getByText(/Crea tu contraseña/i)).toBeInTheDocument();
    });

    test('debe renderizar el email ingresado', () => {
      renderWithRouter(<RegisterPassword />);
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    test('debe renderizar campos de contraseña', () => {
      renderWithRouter(<RegisterPassword />);
      
      expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirmar contraseña')).toBeInTheDocument();
    });

    test('debe renderizar botón de crear cuenta', () => {
      renderWithRouter(<RegisterPassword />);
      
      expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument();
    });

    test('debe renderizar botón de volver con link correcto', () => {
      renderWithRouter(<RegisterPassword />);
      
      const backButton = screen.getByText('Volver').closest('a');
      expect(backButton).toBeInTheDocument();
      expect(backButton.getAttribute('href')).toContain('/register');
      expect(backButton.getAttribute('href')).toContain('email=test%40example.com');
    });
  });

  describe('Campos de tipo password', () => {
    beforeEach(() => {
      useLocation.mockReturnValue(mockValidLocation);
    });

    test('deben ser de tipo password para ocultar texto', () => {
      renderWithRouter(<RegisterPassword />);
      
      const passwordInput = screen.getByPlaceholderText('Contraseña');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirmar contraseña');
      
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    });
  });
});
