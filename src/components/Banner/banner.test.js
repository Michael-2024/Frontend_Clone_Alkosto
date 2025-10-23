import React from 'react';
import { render, screen } from '@testing-library/react';
import Banner from './Banner';

describe('Banner Component', () => {
  test('renders HOT SALE promotion text', () => {
    render(<Banner />);
    
    const promoText = screen.getByText(/HOT SALE con descuentos irresistibles/i);
    expect(promoText).toBeInTheDocument();
  });

  test('banner is visible to users', () => {
    render(<Banner />);
    
    const banner = screen.getByText(/HOT SALE/i);
    expect(banner).toBeVisible();
  });

  test('banner has correct styling classes', () => {
    render(<Banner />);
    
    const banner = screen.getByText(/HOT SALE/i).closest('[class*="banner"]');
    expect(banner).toBeInTheDocument();
  });
});