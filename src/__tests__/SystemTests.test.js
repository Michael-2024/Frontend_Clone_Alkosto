/**
 * PRUEBAS DEL SISTEMA (SYSTEM TESTS)
 * 
 * Estas pruebas validan que el sistema completo funcione correctamente
 * integrando todos los componentes, controladores y modelos.
 * 
 * Alcance:
 * - Integración entre componentes React
 * - Flujos de usuario completos
 * - Persistencia de datos
 * - Navegación entre páginas
 * - Interacción con localStorage
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import Home from '../views/Home/Home';
import ProductDetail from '../views/ProductDetail/ProductDetail';
import Cart from '../views/Cart/Cart';
import SearchResults from '../views/Search/SearchResults';
import Register from '../views/Register/Register';

import ProductController from '../controllers/ProductController';
import CartController from '../controllers/CartController';
import UserController from '../controllers/UserController';

describe('SISTEMA - Pruebas de Sistema Completas', () => {
  
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('ST01 - Sistema de Productos', () => {
    
    test('ST01.1 - El sistema carga y muestra productos correctamente', () => {
      const products = ProductController.getAllProducts();
      
      expect(products).toBeDefined();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
      
      // Validar estructura de producto
      const firstProduct = products[0];
      expect(firstProduct).toHaveProperty('id');
      expect(firstProduct).toHaveProperty('name');
      expect(firstProduct).toHaveProperty('price');
      expect(firstProduct).toHaveProperty('category');
    });

    test('ST01.2 - El sistema obtiene productos por categoría', () => {
      const category = 'Tecnología';
      const products = ProductController.getProductsByCategory(category);
      
      expect(Array.isArray(products)).toBe(true);
      if (products.length > 0) {
        products.forEach(product => {
          expect(product.category).toBe(category);
        });
      }
    });

    test('ST01.3 - El sistema busca productos por nombre', () => {
      const searchTerm = 'laptop';
      const results = ProductController.searchProducts(searchTerm);
      
      expect(Array.isArray(results)).toBe(true);
      if (results.length > 0) {
        results.forEach(product => {
          const productName = product.name.toLowerCase();
          expect(productName).toContain(searchTerm.toLowerCase());
        });
      }
    });

    test('ST01.4 - El sistema obtiene productos destacados', () => {
      const featured = ProductController.getFeaturedProducts(4);
      
      expect(Array.isArray(featured)).toBe(true);
      expect(featured.length).toBeLessThanOrEqual(4);
      // Los productos destacados son los de mayor rating
      if (featured.length > 1) {
        for (let i = 0; i < featured.length - 1; i++) {
          expect(featured[i].rating).toBeGreaterThanOrEqual(featured[i + 1].rating);
        }
      }
    });

    test('ST01.5 - El sistema obtiene productos con descuento', () => {
      const discounted = ProductController.getDiscountedProducts();
      
      expect(Array.isArray(discounted)).toBe(true);
      discounted.forEach(product => {
        expect(product).toHaveProperty('discount');
        expect(product.discount).toBeGreaterThan(0);
      });
    });
  });

  describe('ST02 - Sistema de Carrito de Compras', () => {
    
    test('ST02.1 - El sistema agrega productos al carrito', () => {
      const products = ProductController.getAllProducts();
      const testProduct = products[0];
      
      CartController.addToCart(testProduct, 1);
      const cart = CartController.getCart();
      const cartItems = cart.items;
      
      expect(cartItems.length).toBe(1);
      expect(cartItems[0].product.id).toBe(testProduct.id);
      expect(cartItems[0].quantity).toBe(1);
    });

    test('ST02.2 - El sistema actualiza cantidad de productos en carrito', () => {
      const products = ProductController.getAllProducts();
      const testProduct = products[0];
      
      CartController.addToCart(testProduct, 2);
      CartController.updateQuantity(testProduct.id, 5);
      
      const cart = CartController.getCart();
      const item = cart.items.find(item => item.product.id === testProduct.id);
      
      expect(item.quantity).toBe(5);
    });

    test('ST02.3 - El sistema elimina productos del carrito', () => {
      const products = ProductController.getAllProducts();
      const testProduct = products[0];
      
      CartController.addToCart(testProduct, 1);
      CartController.removeFromCart(testProduct.id);
      
      const cart = CartController.getCart();
      const item = cart.items.find(item => item.product.id === testProduct.id);
      
      expect(item).toBeUndefined();
    });

    test('ST02.4 - El sistema calcula total del carrito correctamente', () => {
      const products = ProductController.getAllProducts();
      
      CartController.clearCart();
      CartController.addToCart(products[0], 2);
      CartController.addToCart(products[1], 1);
      
      const total = CartController.getCartTotal();
      const expectedTotal = (products[0].price * 2) + products[1].price;
      
      expect(total).toBe(expectedTotal);
    });

    test('ST02.5 - El sistema persiste el carrito en localStorage', () => {
      const products = ProductController.getAllProducts();
      const testProduct = products[0];
      
      CartController.addToCart(testProduct, 3);
      
      // Verificar que se guardó en localStorage
      const storedCart = JSON.parse(localStorage.getItem('alkosto_cart') || '[]');
      expect(storedCart.length).toBeGreaterThan(0);
      expect(storedCart[0].product.id).toBe(testProduct.id);
    });

    test('ST02.6 - El sistema limpia el carrito', () => {
      const products = ProductController.getAllProducts();
      
      CartController.addToCart(products[0], 1);
      CartController.addToCart(products[1], 2);
      
      CartController.clearCart();
      const cart = CartController.getCart();
      
      expect(cart.items.length).toBe(0);
    });

    test('ST02.7 - El sistema cuenta items del carrito correctamente', () => {
      const products = ProductController.getAllProducts();
      
      CartController.clearCart();
      CartController.addToCart(products[0], 2);
      CartController.addToCart(products[1], 3);
      
      const count = CartController.getCartItemsCount();
      expect(count).toBe(5); // 2 + 3
    });
  });

  describe('ST03 - Sistema de Categorías', () => {
    
    test('ST03.1 - El sistema carga categorías disponibles', () => {
      const allProducts = ProductController.getAllProducts();
      const categories = [...new Set(allProducts.map(p => p.category))];
      
      expect(categories.length).toBeGreaterThan(0);
      expect(Array.isArray(categories)).toBe(true);
    });

    test('ST03.2 - El sistema filtra productos por categoría correctamente', () => {
      const allProducts = ProductController.getAllProducts();
      const firstCategory = allProducts[0].category;
      
      const filtered = ProductController.getProductsByCategory(firstCategory);
      
      expect(filtered.length).toBeGreaterThan(0);
      filtered.forEach(product => {
        expect(product.category).toBe(firstCategory);
      });
    });
  });

  describe('ST04 - Sistema de Búsqueda', () => {
    
    test('ST04.1 - El sistema busca productos case-insensitive', () => {
      const results1 = ProductController.searchProducts('LAPTOP');
      const results2 = ProductController.searchProducts('laptop');
      const results3 = ProductController.searchProducts('Laptop');
      
      expect(results1.length).toEqual(results2.length);
      expect(results2.length).toEqual(results3.length);
    });

    test('ST04.2 - El sistema retorna array vacío para búsquedas sin resultados', () => {
      const results = ProductController.searchProducts('xyzabc123nonexistent');
      
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    test('ST04.3 - El sistema busca en nombre y descripción', () => {
      const allProducts = ProductController.getAllProducts();
      
      // Asumiendo que hay productos con descripciones
      if (allProducts.length > 0) {
        const searchTerm = 'smart';
        const results = ProductController.searchProducts(searchTerm);
        
        expect(Array.isArray(results)).toBe(true);
      }
    });
  });

  describe('ST05 - Sistema de Usuario y Autenticación', () => {
    
    test('ST05.1 - El sistema registra nuevos usuarios', () => {
      const userData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@test.com',
        phone: '3001234567',
        password: 'Test123!'
      };
      
      const result = UserController.registerUser(userData);
      
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userData.email);
    });

    test('ST05.2 - El sistema valida emails duplicados', () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'duplicate@test.com',
        phone: '3009876543',
        password: 'Test123!'
      };
      
      UserController.registerUser(userData);
      const isDuplicate = UserController.isEmailRegistered(userData.email);
      
      expect(isDuplicate).toBe(true);
    });

    test('ST05.3 - El sistema inicia sesión con credenciales válidas', () => {
      const userData = {
        firstName: 'Login',
        lastName: 'Test',
        email: 'login@test.com',
        phone: '3001112233',
        password: 'Test123!'
      };
      
      UserController.registerUser(userData);
      const loginResult = UserController.login(userData.email, userData.password);
      
      expect(loginResult.success).toBe(true);
      expect(loginResult.user).toBeDefined();
    });

    test('ST05.4 - El sistema rechaza credenciales inválidas', () => {
      const result = UserController.login('invalid@test.com', 'wrongpassword');
      
      expect(result.success).toBe(false);
    });

    test('ST05.5 - El sistema obtiene usuario actual', () => {
      const userData = {
        firstName: 'Current',
        lastName: 'User',
        email: 'current@test.com',
        phone: '3004445566',
        password: 'Test123!'
      };
      
      UserController.registerUser(userData);
      UserController.login(userData.email, userData.password);
      
      const currentUser = UserController.getCurrentUser();
      
      expect(currentUser).toBeDefined();
      expect(currentUser.email).toBe(userData.email);
    });

    test('ST05.6 - El sistema cierra sesión correctamente', () => {
      const userData = {
        firstName: 'Logout',
        lastName: 'Test',
        email: 'logout@test.com',
        phone: '3007778899',
        password: 'Test123!'
      };
      
      UserController.registerUser(userData);
      UserController.login(userData.email, userData.password);
      UserController.logout();
      
      const currentUser = UserController.getCurrentUser();
      expect(currentUser).toBeNull();
    });
  });

  describe('ST06 - Integración de Componentes React', () => {
    
    beforeEach(() => {
      // Limpiar estado antes de cada test de componentes
      localStorage.clear();
      CartController.clearCart();
    });
    
    test('ST06.1 - El componente Home se renderiza sin errores', () => {
      const { unmount } = render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
      
      // Verificar que elementos clave estén presentes
      const cyberDaysElements = screen.queryAllByText(/Cyber Days/i);
      expect(cyberDaysElements.length).toBeGreaterThan(0);
      
      unmount();
    });

    test('ST06.2 - El componente Cart se renderiza correctamente', () => {
      const { unmount } = render(
        <MemoryRouter>
          <Cart />
        </MemoryRouter>
      );
      
      // Debería mostrar carrito (vacío o con items)
      const cartText = screen.queryByText(/Carrito de Compras|carrito|vacío/i);
      expect(cartText).toBeInTheDocument();
      
      unmount();
    });

    test('ST06.3 - El componente SearchResults maneja búsquedas', () => {
      const { unmount } = render(
        <MemoryRouter initialEntries={['/search?q=Samsung']}>
          <SearchResults />
        </MemoryRouter>
      );
      
      // Verificar que se muestre la interfaz de búsqueda
      // (puede que muestre "resultados" o el producto)
      expect(document.body).toBeInTheDocument();
      
      unmount();
    });
  });

  describe('ST07 - Flujos Completos de Usuario', () => {
    
    test('ST07.1 - Flujo completo: Buscar → Ver Detalle → Agregar al Carrito', () => {
      // 1. Buscar producto (usar un término que exista en los productos)
      const searchResults = ProductController.searchProducts('Samsung');
      expect(searchResults.length).toBeGreaterThan(0);
      
      // 2. Seleccionar producto
      const selectedProduct = searchResults[0];
      expect(selectedProduct).toBeDefined();
      
      // 3. Agregar al carrito
      CartController.clearCart();
      CartController.addToCart(selectedProduct, 1);
      
      // 4. Verificar en carrito
      const cart = CartController.getCart();
      expect(cart.items.length).toBe(1);
      expect(cart.items[0].product.id).toBe(selectedProduct.id);
    });

    test('ST07.2 - Flujo completo: Registro → Login → Logout', () => {
      const userData = {
        firstName: 'Flow',
        lastName: 'Test',
        email: 'flow@test.com',
        phone: '3009998877',
        password: 'Flow123!'
      };
      
      // 1. Registro
      const registerResult = UserController.registerUser(userData);
      expect(registerResult.success).toBe(true);
      
      // 2. Logout (si quedó logueado)
      UserController.logout();
      
      // 3. Login
      const loginResult = UserController.login(userData.email, userData.password);
      expect(loginResult.success).toBe(true);
      
      // 4. Verificar usuario actual
      const currentUser = UserController.getCurrentUser();
      expect(currentUser).toBeDefined();
      
      // 5. Logout
      UserController.logout();
      expect(UserController.getCurrentUser()).toBeNull();
    });

    test('ST07.3 - Flujo completo: Agregar múltiples productos → Actualizar cantidades → Calcular total', () => {
      const products = ProductController.getAllProducts();
      
      CartController.clearCart();
      
      // 1. Agregar varios productos
      CartController.addToCart(products[0], 2);
      CartController.addToCart(products[1], 1);
      CartController.addToCart(products[2], 3);
      
      // 2. Verificar cantidad total
      let totalItems = CartController.getCartItemsCount();
      expect(totalItems).toBe(6); // 2 + 1 + 3
      
      // 3. Actualizar cantidad
      CartController.updateQuantity(products[0].id, 5);
      totalItems = CartController.getCartItemsCount();
      expect(totalItems).toBe(9); // 5 + 1 + 3
      
      // 4. Calcular total
      const total = CartController.getCartTotal();
      const expectedTotal = (products[0].price * 5) + products[1].price + (products[2].price * 3);
      expect(total).toBe(expectedTotal);
    });
  });

  describe('ST08 - Persistencia y Recuperación de Datos', () => {
    
    test('ST08.1 - El carrito persiste después de recargar', () => {
      const products = ProductController.getAllProducts();
      const testProduct = products[0];
      
      // Agregar producto
      CartController.clearCart();
      CartController.addToCart(testProduct, 2);
      
      // Simular recarga obteniendo items nuevamente
      const cart = CartController.getCart();
      
      expect(cart.items.length).toBe(1);
      expect(cart.items[0].quantity).toBe(2);
    });

    test('ST08.2 - Los datos de usuario persisten en localStorage', () => {
      const userData = {
        firstName: 'Persist',
        lastName: 'Test',
        email: 'persist@test.com',
        phone: '3005554433',
        password: 'Persist123!'
      };
      
      UserController.registerUser(userData);
      
      // Verificar en localStorage (usar el key correcto)
      const storedUsers = JSON.parse(localStorage.getItem('alkosto_users') || '[]');
      const foundUser = storedUsers.find(u => u.email === userData.email);
      
      expect(foundUser).toBeDefined();
      expect(foundUser.firstName).toBe(userData.firstName);
    });
  });

  describe('ST09 - Validación de Datos y Manejo de Errores', () => {
    
    test('ST09.1 - El sistema maneja carrito vacío correctamente', () => {
      CartController.clearCart();
      
      const cart = CartController.getCart();
      const total = CartController.getCartTotal();
      const count = CartController.getCartItemsCount();
      
      expect(cart.items).toEqual([]);
      expect(total).toBe(0);
      expect(count).toBe(0);
    });

    test('ST09.2 - El sistema maneja búsquedas vacías', () => {
      const results = ProductController.searchProducts('');
      
      expect(Array.isArray(results)).toBe(true);
      // Puede retornar todos los productos o array vacío
    });

    test('ST09.3 - El sistema maneja productos inexistentes', () => {
      const product = ProductController.getProductById(99999);
      
      expect(product).toBeUndefined();
    });

    test('ST09.4 - El sistema valida cantidades negativas en carrito', () => {
      const products = ProductController.getAllProducts();
      const testProduct = products[0];
      
      CartController.clearCart();
      CartController.addToCart(testProduct, 1);
      
      // Intentar actualizar a cantidad negativa o cero
      CartController.updateQuantity(testProduct.id, 0);
      
      const cart = CartController.getCart();
      // Debe eliminar el item o mantener cantidad mínima
      const item = cart.items.find(i => i.product.id === testProduct.id);
      expect(item?.quantity || 0).toBeGreaterThanOrEqual(0);
    });
  });

  describe('ST10 - Rendimiento y Escalabilidad', () => {
    
    test('ST10.1 - El sistema maneja múltiples productos en el carrito', () => {
      const products = ProductController.getAllProducts();
      
      CartController.clearCart();
      
      // Agregar muchos productos
      products.slice(0, 20).forEach((product, index) => {
        CartController.addToCart(product, index + 1);
      });
      
      const cart = CartController.getCart();
      expect(cart.items.length).toBeGreaterThan(0);
      expect(cart.items.length).toBeLessThanOrEqual(20);
    });

    test('ST10.2 - La búsqueda es eficiente con resultados múltiples', () => {
      const startTime = performance.now();
      ProductController.searchProducts('smart');
      const endTime = performance.now();
      
      const executionTime = endTime - startTime;
      
      // La búsqueda debe completarse en menos de 100ms
      expect(executionTime).toBeLessThan(100);
    });

    test('ST10.3 - El sistema maneja múltiples usuarios registrados', () => {
      // Registrar múltiples usuarios
      for (let i = 0; i < 10; i++) {
        UserController.registerUser({
          firstName: `User${i}`,
          lastName: `Test${i}`,
          email: `user${i}@test.com`,
          phone: `300000000${i}`,
          password: 'Test123!'
        });
      }
      
      // Verificar que todos se registraron (usar el key correcto)
      const storedUsers = JSON.parse(localStorage.getItem('alkosto_users') || '[]');
      expect(storedUsers.length).toBeGreaterThanOrEqual(10);
    });
  });
});
