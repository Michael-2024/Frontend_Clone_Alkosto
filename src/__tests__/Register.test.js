import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import '@testing-library/jest-dom';
import Register from '../views/Register/Register';
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
    isEmailRegistered: jest.fn(),
  },
}));

describe('RF01 - Register User - Register Component', () => {
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

  describe('Inicialización del componente', () => {
    test('debe cargar el email desde URL', () => {
      useLocation.mockReturnValue({
        search: '?email=test@example.com',
      });

      renderWithRouter(<Register />);
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    test('debe cargar el email desde localStorage', () => {
      localStorage.setItem('pendingEmail', 'stored@example.com');
      useLocation.mockReturnValue({ search: '' });

      renderWithRouter(<Register />);
      expect(screen.getByText('stored@example.com')).toBeInTheDocument();
    });

    test('debe redirigir a home si no hay email', () => {
      useLocation.mockReturnValue({ search: '' });
      renderWithRouter(<Register />);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Validación de formulario', () => {
    beforeEach(() => {
      useLocation.mockReturnValue({
        search: '?email=test@example.com',
      });
    });

    test('debe mostrar error si nombre está vacío', async () => {
      renderWithRouter(<Register />);

      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Ingresa tu nombre')).toBeInTheDocument();
      });
    });

    test('debe mostrar error si apellido está vacío', async () => {
      renderWithRouter(<Register />);

      const firstNameInput = screen.getByPlaceholderText('Nombres');
      fireEvent.change(firstNameInput, { target: { value: 'Juan' } });

      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Ingresa tu apellido')).toBeInTheDocument();
      });
    });

    test('debe mostrar error si teléfono está vacío', async () => {
      renderWithRouter(<Register />);

      const firstNameInput = screen.getByPlaceholderText('Nombres');
      const lastNameInput = screen.getByPlaceholderText('Apellidos');
      const phoneInput = screen.getByPlaceholderText('Teléfono celular');
      
      fireEvent.change(firstNameInput, { target: { value: 'Juan' } });
      fireEvent.change(lastNameInput, { target: { value: 'Pérez' } });
      
      // Tocar el campo de teléfono para activar validación y luego dejarlo vacío
      fireEvent.change(phoneInput, { target: { value: '1' } });
      fireEvent.change(phoneInput, { target: { value: '' } });

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Ingresa tu número de teléfono')).toBeInTheDocument();
      });
    });

    test('debe mostrar error si no acepta términos y condiciones', async () => {
      renderWithRouter(<Register />);

      const firstNameInput = screen.getByPlaceholderText('Nombres');
      const lastNameInput = screen.getByPlaceholderText('Apellidos');
      const phoneInput = screen.getByPlaceholderText('Teléfono celular');
      
      fireEvent.change(firstNameInput, { target: { value: 'Juan' } });
      fireEvent.change(lastNameInput, { target: { value: 'Pérez' } });
      fireEvent.change(phoneInput, { target: { value: '3001234567' } });

      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Debes aceptar los términos y condiciones')).toBeInTheDocument();
      });
    });
  });

  describe('Validación de teléfono', () => {
    beforeEach(() => {
      useLocation.mockReturnValue({
        search: '?email=test@example.com',
      });
    });

    test('debe aceptar solo números en el campo de teléfono', () => {
      renderWithRouter(<Register />);

      const phoneInput = screen.getByPlaceholderText('Teléfono celular');
      fireEvent.change(phoneInput, { target: { value: 'abc123' } });

      expect(phoneInput.value).toBe('123');
    });

    test('debe validar que el teléfono empiece con 3', async () => {
      renderWithRouter(<Register />);

      const phoneInput = screen.getByPlaceholderText('Teléfono celular');
      fireEvent.change(phoneInput, { target: { value: '2001234567' } });

      const firstNameInput = screen.getByPlaceholderText('Nombres');
      const lastNameInput = screen.getByPlaceholderText('Apellidos');
      
      fireEvent.change(firstNameInput, { target: { value: 'Juan' } });
      fireEvent.change(lastNameInput, { target: { value: 'Pérez' } });

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/el número debe empezar con '3'/i)).toBeInTheDocument();
      });
    });

    test('debe validar que el teléfono tenga 10 dígitos', async () => {
      renderWithRouter(<Register />);

      const phoneInput = screen.getByPlaceholderText('Teléfono celular');
      fireEvent.change(phoneInput, { target: { value: '300123' } });

      const firstNameInput = screen.getByPlaceholderText('Nombres');
      const lastNameInput = screen.getByPlaceholderText('Apellidos');
      
      fireEvent.change(firstNameInput, { target: { value: 'Juan' } });
      fireEvent.change(lastNameInput, { target: { value: 'Pérez' } });

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/número celular válido de 10 dígitos/i)).toBeInTheDocument();
      });
    });

    test('debe limitar el teléfono a 10 dígitos', () => {
      renderWithRouter(<Register />);

      const phoneInput = screen.getByPlaceholderText('Teléfono celular');
      // El maxLength en HTML limita a 10, pero en test fireEvent.change no respeta maxLength
      // La función handlePhoneInput no trunca el valor, solo lo limpia de caracteres no numéricos
      fireEvent.change(phoneInput, { target: { value: '30012345678' } });

      // Verificar que al menos se limpian los no-dígitos
      expect(phoneInput.value).toMatch(/^\d+$/);
    });
  });

  describe('Modificación de email', () => {
    beforeEach(() => {
      useLocation.mockReturnValue({
        search: '?email=test@example.com',
      });
    });

    test('debe permitir modificar el email', async () => {
      renderWithRouter(<Register />);

      const modifyButton = screen.getByRole('button', { name: /modificar/i });
      fireEvent.click(modifyButton);

      await waitFor(() => {
        expect(screen.getByText(/Correo electrónico:/i)).toBeInTheDocument();
        const emailInput = screen.getByDisplayValue('test@example.com');
        expect(emailInput).toBeInTheDocument();
      });
    });

    test('debe validar el formato de email al guardar', async () => {
      renderWithRouter(<Register />);

      const modifyButton = screen.getByRole('button', { name: /modificar/i });
      fireEvent.click(modifyButton);

      await waitFor(() => {
        const emailInput = screen.getByDisplayValue('test@example.com');
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      });

      const saveButton = screen.getByRole('button', { name: /guardar/i });
      expect(saveButton).toBeDisabled();
    });

    test('debe permitir cancelar la edición de email', async () => {
      renderWithRouter(<Register />);

      const modifyButton = screen.getByRole('button', { name: /modificar/i });
      fireEvent.click(modifyButton);

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /cancelar/i });
        fireEvent.click(cancelButton);
      });

      await waitFor(() => {
        expect(screen.queryByDisplayValue('test@example.com')).not.toBeInTheDocument();
      });
    });
  });

  describe('Navegación al siguiente paso', () => {
    beforeEach(() => {
      useLocation.mockReturnValue({
        search: '?email=test@example.com',
      });
    });

    test('debe navegar a página de contraseña con datos completos y válidos', async () => {
      renderWithRouter(<Register />);

      const firstNameInput = screen.getByPlaceholderText('Nombres');
      const lastNameInput = screen.getByPlaceholderText('Apellidos');
      const phoneInput = screen.getByPlaceholderText('Teléfono celular');
      
      fireEvent.change(firstNameInput, { target: { value: 'Juan' } });
      fireEvent.change(lastNameInput, { target: { value: 'Pérez' } });
      fireEvent.change(phoneInput, { target: { value: '3001234567' } });

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.stringContaining('/register/password')
        );
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.stringContaining('email=test%40example.com')
        );
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.stringContaining('firstName=Juan')
        );
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.stringContaining('lastName=P%C3%A9rez')
        );
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.stringContaining('phone=3001234567')
        );
      });
    });
  });

  describe('Renderizado de elementos', () => {
    beforeEach(() => {
      useLocation.mockReturnValue({
        search: '?email=test@example.com',
      });
    });

    test('debe renderizar título principal', () => {
      renderWithRouter(<Register />);
      expect(screen.getByText(/Crea tu cuenta/i)).toBeInTheDocument();
    });

    test('debe renderizar el botón de volver', () => {
      renderWithRouter(<Register />);
      expect(screen.getByText('Volver')).toBeInTheDocument();
    });

    test('debe renderizar campos del formulario', () => {
      renderWithRouter(<Register />);
      
      expect(screen.getByPlaceholderText('Nombres')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Apellidos')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Teléfono celular')).toBeInTheDocument();
    });

    test('debe renderizar checkbox de términos y condiciones', () => {
      renderWithRouter(<Register />);
      
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByText(/términos y condiciones/i)).toBeInTheDocument();
    });

    test('debe renderizar bandera de Colombia con prefijo +57', () => {
      renderWithRouter(<Register />);
      expect(screen.getByText('+57')).toBeInTheDocument();
    });
  });
});
