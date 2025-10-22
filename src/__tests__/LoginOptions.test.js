import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import '@testing-library/jest-dom';
import LoginOptions from '../views/Login/LoginOptions';
import { getLast4PhoneDigitsByEmail } from '../utils/userUtils';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

// Mock userUtils
jest.mock('../utils/userUtils', () => ({
  getLast4PhoneDigitsByEmail: jest.fn(),
}));

describe('RF02 - Login - LoginOptions Component', () => {
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
      getLast4PhoneDigitsByEmail.mockReturnValue('4567');

      renderWithRouter(<LoginOptions />);
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    test('debe cargar el email desde localStorage', () => {
      localStorage.setItem('pendingEmail', 'stored@example.com');
      useLocation.mockReturnValue({ search: '' });
      getLast4PhoneDigitsByEmail.mockReturnValue('4567');

      renderWithRouter(<LoginOptions />);
      expect(screen.getByText('stored@example.com')).toBeInTheDocument();
    });

    test('debe redirigir a home si no hay email', () => {
      useLocation.mockReturnValue({ search: '' });
      getLast4PhoneDigitsByEmail.mockReturnValue('');

      renderWithRouter(<LoginOptions />);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('debe limpiar pendingEmail de localStorage después de usarlo', () => {
      localStorage.setItem('pendingEmail', 'stored@example.com');
      useLocation.mockReturnValue({ search: '' });
      getLast4PhoneDigitsByEmail.mockReturnValue('4567');

      renderWithRouter(<LoginOptions />);
      
      expect(localStorage.getItem('pendingEmail')).toBeNull();
    });
  });

  describe('Opciones de inicio de sesión', () => {
    beforeEach(() => {
      useLocation.mockReturnValue({
        search: '?email=test@example.com',
      });
      getLast4PhoneDigitsByEmail.mockReturnValue('4567');
    });

    test('debe mostrar opción de WhatsApp', () => {
      renderWithRouter(<LoginOptions />);
      
      expect(screen.getByText('Whatsapp')).toBeInTheDocument();
      const phoneTexts = screen.getAllByText(/Recibirás un código al número terminado en 4567/i);
      expect(phoneTexts.length).toBeGreaterThanOrEqual(1);
    });

    test('debe mostrar opción de SMS', () => {
      renderWithRouter(<LoginOptions />);
      
      expect(screen.getByText('SMS')).toBeInTheDocument();
      const phoneTexts = screen.getAllByText(/Recibirás un código al número terminado en 4567/i);
      expect(phoneTexts.length).toBeGreaterThanOrEqual(2);
    });

    test('debe mostrar opción de Correo', () => {
      renderWithRouter(<LoginOptions />);
      
      expect(screen.getByText('Correo')).toBeInTheDocument();
      expect(screen.getByText(/Recibirás un código a test@example.com/i)).toBeInTheDocument();
    });

    test('debe mostrar opción de Contraseña', () => {
      renderWithRouter(<LoginOptions />);
      
      expect(screen.getByText('Contraseña')).toBeInTheDocument();
      expect(screen.getByText(/Ingresa con la contraseña que asignaste/i)).toBeInTheDocument();
    });

    test('debe mostrar ---- cuando no hay número de teléfono', () => {
      getLast4PhoneDigitsByEmail.mockReturnValue('');
      
      renderWithRouter(<LoginOptions />);
      
      const phoneTexts = screen.getAllByText(/Recibirás un código al número terminado en ----/i);
      expect(phoneTexts.length).toBeGreaterThan(0);
    });
  });

  describe('Navegación a métodos de login', () => {
    beforeEach(() => {
      useLocation.mockReturnValue({
        search: '?email=test@example.com',
      });
      getLast4PhoneDigitsByEmail.mockReturnValue('4567');
    });

    test('debe navegar a login por WhatsApp al hacer clic', () => {
      renderWithRouter(<LoginOptions />);
      
      const whatsappButton = screen.getByText('Whatsapp').closest('button');
      fireEvent.click(whatsappButton);

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('/login/code')
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('method=whatsapp')
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('email=test%40example.com')
      );
    });

    test('debe navegar a login por SMS al hacer clic', () => {
      renderWithRouter(<LoginOptions />);
      
      const smsButton = screen.getByText('SMS').closest('button');
      fireEvent.click(smsButton);

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('/login/code')
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('method=sms')
      );
    });

    test('debe navegar a login por Correo al hacer clic', () => {
      renderWithRouter(<LoginOptions />);
      
      const emailButton = screen.getByText('Correo').closest('button');
      fireEvent.click(emailButton);

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('/login/code')
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('method=email')
      );
    });

    test('debe navegar a login por Contraseña al hacer clic', () => {
      renderWithRouter(<LoginOptions />);
      
      const passwordButton = screen.getByText('Contraseña').closest('button');
      fireEvent.click(passwordButton);

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('/login/password')
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('email=test%40example.com')
      );
    });
  });

  describe('Modificación de email', () => {
    beforeEach(() => {
      useLocation.mockReturnValue({
        search: '?email=test@example.com',
      });
      getLast4PhoneDigitsByEmail.mockReturnValue('4567');
    });

    test('debe mostrar formulario de edición al hacer clic en Modificar', async () => {
      renderWithRouter(<LoginOptions />);

      const modifyButton = screen.getByRole('button', { name: /modificar/i });
      fireEvent.click(modifyButton);

      await waitFor(() => {
        expect(screen.getByText(/Correo electrónico:/i)).toBeInTheDocument();
        const emailInput = screen.getByDisplayValue('test@example.com');
        expect(emailInput).toBeInTheDocument();
      });
    });

    test('debe permitir editar el email', async () => {
      renderWithRouter(<LoginOptions />);

      const modifyButton = screen.getByRole('button', { name: /modificar/i });
      fireEvent.click(modifyButton);

      await waitFor(() => {
        const emailInput = screen.getByDisplayValue('test@example.com');
        expect(emailInput).toHaveValue('test@example.com');
        
        fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });
        expect(emailInput).toHaveValue('newemail@example.com');
      });
    });

    test('debe validar el formato del email', async () => {
      renderWithRouter(<LoginOptions />);

      const modifyButton = screen.getByRole('button', { name: /modificar/i });
      fireEvent.click(modifyButton);

      await waitFor(() => {
        const emailInput = screen.getByDisplayValue('test@example.com');
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      });

      const saveButton = screen.getByRole('button', { name: /guardar/i });
      expect(saveButton).toBeDisabled();
    });

    test('debe mostrar mensaje de error con email inválido', async () => {
      renderWithRouter(<LoginOptions />);

      const modifyButton = screen.getByRole('button', { name: /modificar/i });
      fireEvent.click(modifyButton);

      await waitFor(() => {
        const emailInput = screen.getByDisplayValue('test@example.com');
        fireEvent.change(emailInput, { target: { value: 'invalid' } });

        const form = emailInput.closest('form');
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(screen.getByText(/correo electrónico inválido/i)).toBeInTheDocument();
      });
    });

    test('debe navegar con nuevo email al guardar', async () => {
      renderWithRouter(<LoginOptions />);

      const modifyButton = screen.getByRole('button', { name: /modificar/i });
      fireEvent.click(modifyButton);

      await waitFor(() => {
        const emailInput = screen.getByDisplayValue('test@example.com');
        fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });

        const saveButton = screen.getByRole('button', { name: /guardar/i });
        fireEvent.click(saveButton);
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.stringContaining('email=newemail%40example.com')
        );
      });
    });

    test('debe cancelar la edición al hacer clic en Cancelar', async () => {
      renderWithRouter(<LoginOptions />);

      const modifyButton = screen.getByRole('button', { name: /modificar/i });
      fireEvent.click(modifyButton);

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /cancelar/i });
        fireEvent.click(cancelButton);
      });

      await waitFor(() => {
        expect(screen.queryByDisplayValue('test@example.com')).not.toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
      });
    });

    test('debe limpiar el error al modificar email después de error', async () => {
      renderWithRouter(<LoginOptions />);

      const modifyButton = screen.getByRole('button', { name: /modificar/i });
      fireEvent.click(modifyButton);

      await waitFor(() => {
        const emailInput = screen.getByDisplayValue('test@example.com');
        fireEvent.change(emailInput, { target: { value: 'invalid' } });

        const form = emailInput.closest('form');
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(screen.getByText(/correo electrónico inválido/i)).toBeInTheDocument();
      });

      const emailInput = screen.getByDisplayValue('invalid');
      fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });

      await waitFor(() => {
        expect(screen.queryByText(/correo electrónico inválido/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Renderizado de elementos', () => {
    beforeEach(() => {
      useLocation.mockReturnValue({
        search: '?email=test@example.com',
      });
      getLast4PhoneDigitsByEmail.mockReturnValue('4567');
    });

    test('debe renderizar título principal', () => {
      renderWithRouter(<LoginOptions />);
      expect(screen.getByText(/Elige un método para ingresar/i)).toBeInTheDocument();
    });

    test('debe renderizar el botón de volver', () => {
      renderWithRouter(<LoginOptions />);
      expect(screen.getByText('Volver')).toBeInTheDocument();
    });

    test('debe renderizar texto "Estás ingresando con"', () => {
      renderWithRouter(<LoginOptions />);
      expect(screen.getByText(/Estás ingresando con:/i)).toBeInTheDocument();
    });

    test('debe renderizar todas las opciones de login con íconos', () => {
      renderWithRouter(<LoginOptions />);
      
      // Verificar que existan las 4 opciones
      const buttons = screen.getAllByRole('button').filter(btn => 
        !btn.classList.contains('back-button') && 
        !btn.textContent.includes('Volver') &&
        !btn.textContent.includes('Modificar')
      );
      
      expect(buttons.length).toBeGreaterThanOrEqual(4);
    });
  });
});
