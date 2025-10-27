import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('Integration Tests - Alkosto Master', () => {
  test('complete application renders header and banner', () => {
    render(<App />);
    
    // Verifica que el banner promocional esté presente
    expect(screen.getByText(/HOT SALE/i)).toBeInTheDocument();
    
    // Verifica que el header con la información de contacto esté presente
    expect(screen.getByText('Tiewacuces')).toBeInTheDocument();
    expect(screen.getByText('(601) 746 8001')).toBeInTheDocument();
    expect(screen.getByText('(601) 407 3033')).toBeInTheDocument();
  });

  test('navigation menu is functional', () => {
    render(<App />);
    
    const navigationItems = [
      'Siguetupedido',
      'Nuestrastiendas', 
      'Catálogo',
      'Ayuda'
    ];

    navigationItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });
});