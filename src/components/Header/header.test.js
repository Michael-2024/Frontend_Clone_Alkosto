import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Headers'; // Ajusta la ruta según tu estructura

describe('Header Component', () => {
  test('renders logo Tiewacuces correctly', () => {
    render(<Header />);
    
    const logo = screen.getByText('Tiewacuces');
    expect(logo).toBeInTheDocument();
  });

  test('renders venta phone number correctly', () => {
    render(<Header />);
    
    const ventaNumber = screen.getByText('(601) 746 8001');
    expect(ventaNumber).toBeInTheDocument();
  });

  test('renders servicio phone number correctly', () => {
    render(<Header />);
    
    const servicioNumber = screen.getByText('(601) 407 3033');
    expect(servicioNumber).toBeInTheDocument();
  });

  test('renders all navigation links', () => {
    render(<Header />);
    
    const links = [
      'Siguetupedido',
      'Nuestrastiendas',
      'Catálogo',
      'Ayuda'
    ];

    links.forEach(linkText => {
      const link = screen.getByText(linkText);
      expect(link).toBeInTheDocument();
    });
  });

  test('contact information labels are present', () => {
    render(<Header />);
    
    expect(screen.getByText('Venta:')).toBeInTheDocument();
    expect(screen.getByText('Servicio:')).toBeInTheDocument();
  });
});