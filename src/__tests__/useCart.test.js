// src/hooks/__tests__/useCart.test.js
import { renderHook, act } from '@testing-library/react';
import useCart from '../useCart';

describe('useCart - Unit Tests', () => {
  test('debería agregar productos al carrito', () => {
    const { result } = renderHook(() => useCart());
    
    const product = { id: 1, name: 'Test', price: 100 };
    
    act(() => {
      result.current.addToCart(product);
    });
    
    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].product).toEqual(product);
  });

  test('debería calcular el total correctamente', () => {
    const { result } = renderHook(() => useCart());
    
    const products = [
      { id: 1, name: 'Test 1', price: 100 },
      { id: 2, name: 'Test 2', price: 200 }
    ];
    
    act(() => {
      products.forEach(product => result.current.addToCart(product));
    });
    
    expect(result.current.total).toBe(300);
  });
});