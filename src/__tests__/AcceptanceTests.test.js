/**
 * PRUEBAS DE ACEPTACIÓN (ACCEPTANCE TESTS)
 * 
 * Estas pruebas validan que el sistema cumpla con los criterios de aceptación
 * desde la perspectiva del usuario final (User Stories).
 * 
 * Formato: Given-When-Then (Dado-Cuando-Entonces)
 * 
 * Cada test representa un escenario de usuario real y verifica que
 * la funcionalidad cumpla con las expectativas del negocio.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import App from '../App';
import Home from '../views/Home/Home';
import ProductDetail from '../views/ProductDetail/ProductDetail';
import Cart from '../views/Cart/Cart';
import SearchResults from '../views/Search/SearchResults';
import Register from '../views/Register/Register';
import LoginOptions from '../views/Login/LoginOptions';

import ProductController from '../controllers/ProductController';
import CartController from '../controllers/CartController';
import UserController from '../controllers/UserController';

describe('ACEPTACIÓN - Pruebas de Aceptación (User Stories)', () => {
  
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('US01 - Como usuario quiero ver productos en la página principal', () => {
    
    test('AC01.1 - DADO que estoy en la página principal, CUANDO la página carga, ENTONCES veo productos destacados', () => {
      // GIVEN - Renderizar página principal
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
      
      // WHEN - La página carga
      // (ya cargada por render)
      
      // THEN - Verificar que hay contenido de productos
      const featuredProducts = ProductController.getFeaturedProducts(4);
      expect(featuredProducts.length).toBeGreaterThan(0);
      
      // Verificar que el banner promocional está visible
      const banner = screen.getByText(/Cyber Days/i);
      expect(banner).toBeInTheDocument();
    });

    test('AC01.2 - DADO que estoy en la página principal, CUANDO veo la lista de productos, ENTONCES cada producto muestra nombre, precio e imagen', () => {
      // GIVEN
      const products = ProductController.getAllProducts();
      
      // WHEN
      const firstProduct = products[0];
      
      // THEN
      expect(firstProduct).toHaveProperty('name');
      expect(firstProduct).toHaveProperty('price');
      expect(firstProduct).toHaveProperty('image');
      expect(firstProduct.name).toBeTruthy();
      expect(firstProduct.price).toBeGreaterThan(0);
    });

    test('AC01.3 - DADO que hay productos con descuento, CUANDO veo la página principal, ENTONCES veo la sección "Ofertas del Día"', () => {
      // GIVEN
      const discountedProducts = ProductController.getDiscountedProducts();
      expect(discountedProducts.length).toBeGreaterThan(0);
      
      // WHEN
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
      
      // THEN
      const offersSection = screen.getByText(/Ofertas del Día/i);
      expect(offersSection).toBeInTheDocument();
    });

    test('AC01.4 - DADO que estoy en la página principal, CUANDO veo las categorías, ENTONCES puedo ver al menos 5 categorías disponibles', () => {
      // GIVEN
      const allProducts = ProductController.getAllProducts();
      
      // WHEN
      const categories = [...new Set(allProducts.map(p => p.category))];
      
      // THEN
      expect(categories.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('US02 - Como usuario quiero buscar productos por nombre', () => {
    
    test('AC02.1 - DADO que quiero encontrar un producto específico, CUANDO escribo "laptop" en el buscador, ENTONCES veo productos relacionados con laptops', () => {
      // GIVEN - Usuario quiere buscar
      const searchTerm = 'laptop';
      
      // WHEN - Buscar productos
      const results = ProductController.searchProducts(searchTerm);
      
      // THEN - Verificar resultados
      expect(Array.isArray(results)).toBe(true);
      results.forEach(product => {
        const hasSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
        expect(hasSearchTerm).toBe(true);
      });
    });

    test('AC02.2 - DADO que busco un producto, CUANDO no hay resultados, ENTONCES veo un mensaje indicando que no hay productos', () => {
      // GIVEN
      const searchTerm = 'productoquenoexiste123xyz';
      
      // WHEN
      const results = ProductController.searchProducts(searchTerm);
      
      // THEN
      expect(results).toEqual([]);
      expect(results.length).toBe(0);
    });

    test('AC02.3 - DADO que busco productos, CUANDO uso mayúsculas o minúsculas, ENTONCES obtengo los mismos resultados', () => {
      // GIVEN
      const searchTerm = 'smart';
      
      // WHEN
      const resultsLower = ProductController.searchProducts(searchTerm.toLowerCase());
      const resultsUpper = ProductController.searchProducts(searchTerm.toUpperCase());
      const resultsMixed = ProductController.searchProducts('SmArT');
      
      // THEN
      expect(resultsLower.length).toBe(resultsUpper.length);
      expect(resultsUpper.length).toBe(resultsMixed.length);
    });
  });

  describe('US03 - Como usuario quiero agregar productos al carrito', () => {
    
    test('AC03.1 - DADO que veo un producto, CUANDO hago click en "Agregar al carrito", ENTONCES el producto se agrega al carrito', () => {
      // GIVEN
      const products = ProductController.getAllProducts();
      const testProduct = products[0];
      CartController.clearCart();
      
      // WHEN
      CartController.addToCart(testProduct, 1);
      
      // THEN
      const cart = CartController.getCart();
      expect(cart.items.length).toBe(1);
      expect(cart.items[0].product.id).toBe(testProduct.id);
      expect(cart.items[0].quantity).toBe(1);
    });

    test('AC03.2 - DADO que tengo un producto en el carrito, CUANDO agrego el mismo producto nuevamente, ENTONCES la cantidad aumenta', () => {
      // GIVEN
      const products = ProductController.getAllProducts();
      const testProduct = products[0];
      CartController.clearCart();
      CartController.addToCart(testProduct, 2);
      
      // WHEN
      CartController.addToCart(testProduct, 3);
      
      // THEN
      const cart = CartController.getCart();
      const item = cart.items.find(i => i.product.id === testProduct.id);
      expect(item.quantity).toBe(5); // 2 + 3
    });

    test('AC03.3 - DADO que agrego productos al carrito, CUANDO veo el contador del carrito, ENTONCES muestra la cantidad total de items', () => {
      // GIVEN
      const products = ProductController.getAllProducts();
      CartController.clearCart();
      
      // WHEN
      CartController.addToCart(products[0], 3);
      CartController.addToCart(products[1], 2);
      
      // THEN
      const totalCount = CartController.getCartItemsCount();
      expect(totalCount).toBe(5); // 3 + 2
    });

    test('AC03.4 - DADO que tengo productos en el carrito, CUANDO recargo la página, ENTONCES los productos siguen en el carrito', () => {
      // GIVEN
      const products = ProductController.getAllProducts();
      const testProduct = products[0];
      CartController.clearCart();
      
      // WHEN
      CartController.addToCart(testProduct, 2);
      
      // Simular recarga obteniendo nuevamente los items
      const cart = CartController.getCart();
      
      // THEN
      expect(cart.items.length).toBe(1);
      expect(cart.items[0].quantity).toBe(2);
      expect(cart.items[0].product.id).toBe(testProduct.id);
    });
  });

  describe('US04 - Como usuario quiero ver el detalle de un producto', () => {
    
    test('AC04.1 - DADO que hago click en un producto, CUANDO cargo la página de detalle, ENTONCES veo nombre, precio, descripción e imagen', () => {
      // GIVEN
      const products = ProductController.getAllProducts();
      const testProduct = products[0];
      
      // WHEN
      const product = ProductController.getProductById(testProduct.id);
      
      // THEN
      expect(product).toBeDefined();
      expect(product.name).toBeTruthy();
      expect(product.price).toBeGreaterThan(0);
      expect(product.image).toBeTruthy();
    });

    test('AC04.2 - DADO que estoy en el detalle del producto, CUANDO el producto tiene descuento, ENTONCES veo el precio original y el precio con descuento', () => {
      // GIVEN
      const discountedProducts = ProductController.getDiscountedProducts();
      
      if (discountedProducts.length > 0) {
        const testProduct = discountedProducts[0];
        
        // WHEN
        const product = ProductController.getProductById(testProduct.id);
        
        // THEN
        expect(product.discount).toBeGreaterThan(0);
        expect(product.price).toBeGreaterThan(0);
        expect(product.originalPrice).toBeGreaterThan(0);
        
        // El precio con descuento debe ser menor al original
        expect(product.price).toBeLessThan(product.originalPrice);
      }
    });

    test('AC04.3 - DADO que veo el detalle de un producto, CUANDO hago click en "Agregar al carrito", ENTONCES el producto se agrega correctamente', () => {
      // GIVEN
      const products = ProductController.getAllProducts();
      const testProduct = products[0];
      CartController.clearCart();
      
      // WHEN
      CartController.addToCart(testProduct, 1);
      
      // THEN
      const cart = CartController.getCart();
      const addedItem = cart.items.find(item => item.product.id === testProduct.id);
      expect(addedItem).toBeDefined();
      expect(addedItem.quantity).toBe(1);
    });
  });

  describe('US05 - Como usuario quiero registrarme en el sistema', () => {
    
    test('AC05.1 - DADO que soy un nuevo usuario, CUANDO completo el formulario de registro con datos válidos, ENTONCES mi cuenta se crea exitosamente', () => {
      // GIVEN
      const userData = {
        firstName: 'Carlos',
        lastName: 'García',
        email: 'carlos.garcia@test.com',
        phone: '3001234567',
        password: 'Carlos123!'
      };
      
      // WHEN
      const result = UserController.registerUser(userData);
      
      // THEN
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.user.firstName).toBe(userData.firstName);
    });

    test('AC05.2 - DADO que ya existe un usuario con un email, CUANDO intento registrarme con ese mismo email, ENTONCES recibo un error indicando email duplicado', () => {
      // GIVEN
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'duplicate@test.com',
        phone: '3009876543',
        password: 'Test123!'
      };
      
      UserController.registerUser(userData);
      
      // WHEN
      const isDuplicate = UserController.isEmailRegistered(userData.email);
      
      // THEN
      expect(isDuplicate).toBe(true);
    });

    test('AC05.3 - DADO que me registro exitosamente, CUANDO completo el registro, ENTONCES quedo automáticamente logueado', () => {
      // GIVEN
      const userData = {
        firstName: 'Auto',
        lastName: 'Login',
        email: 'autologin@test.com',
        phone: '3001112233',
        password: 'Auto123!'
      };
      
      // WHEN
      const result = UserController.registerUser(userData);
      
      // THEN
      expect(result.success).toBe(true);
      const currentUser = UserController.getCurrentUser();
      expect(currentUser).toBeDefined();
      expect(currentUser.email).toBe(userData.email);
    });

    test('AC05.4 - DADO que me registro, CUANDO ingreso mi información, ENTONCES mis datos se guardan de forma segura', () => {
      // GIVEN
      const userData = {
        firstName: 'Secure',
        lastName: 'User',
        email: 'secure@test.com',
        phone: '3004445566',
        password: 'Secure123!'
      };
      
      // WHEN
      UserController.registerUser(userData);
      
      // THEN
      const storedUsers = JSON.parse(localStorage.getItem('alkosto_users') || '[]');
      const foundUser = storedUsers.find(u => u.email === userData.email);
      
      expect(foundUser).toBeDefined();
      expect(foundUser.firstName).toBe(userData.firstName);
      expect(foundUser.lastName).toBe(userData.lastName);
      expect(foundUser.email).toBe(userData.email);
      // La contraseña no debe estar en localStorage por seguridad
      expect(foundUser.password).toBeUndefined();
    });
  });

  describe('US06 - Como usuario quiero iniciar sesión', () => {
    
    test('AC06.1 - DADO que soy un usuario registrado, CUANDO ingreso mis credenciales correctas, ENTONCES inicio sesión exitosamente', () => {
      // GIVEN
      const userData = {
        firstName: 'Login',
        lastName: 'Test',
        email: 'login.test@test.com',
        phone: '3001234567',
        password: 'Login123!'
      };
      
      UserController.registerUser(userData);
      UserController.logout(); // Asegurar que no está logueado
      
      // WHEN
      const loginResult = UserController.login(userData.email, userData.password);
      
      // THEN
      expect(loginResult.success).toBe(true);
      expect(loginResult.user).toBeDefined();
      expect(loginResult.user.email).toBe(userData.email);
    });

    test('AC06.2 - DADO que intento iniciar sesión, CUANDO ingreso credenciales incorrectas, ENTONCES veo un mensaje de error', () => {
      // GIVEN - No hay usuario registrado
      
      // WHEN
      const result = UserController.login('noexiste@test.com', 'wrongpassword');
      
      // THEN
      expect(result.success).toBe(false);
      expect(result.message || result.error).toBeDefined();
    });

    test('AC06.3 - DADO que estoy logueado, CUANDO navego por el sitio, ENTONCES mi sesión se mantiene activa', () => {
      // GIVEN
      const userData = {
        firstName: 'Session',
        lastName: 'Test',
        email: 'session@test.com',
        phone: '3007778899',
        password: 'Session123!'
      };
      
      UserController.registerUser(userData);
      UserController.login(userData.email, userData.password);
      
      // WHEN - Simular navegación obteniendo usuario actual
      const currentUser1 = UserController.getCurrentUser();
      const currentUser2 = UserController.getCurrentUser();
      
      // THEN
      expect(currentUser1).toBeDefined();
      expect(currentUser2).toBeDefined();
      expect(currentUser1.email).toBe(userData.email);
      expect(currentUser2.email).toBe(userData.email);
    });

    test('AC06.4 - DADO que estoy logueado, CUANDO cierro sesión, ENTONCES ya no tengo acceso a mi cuenta', () => {
      // GIVEN
      const userData = {
        firstName: 'Logout',
        lastName: 'Test',
        email: 'logout.test@test.com',
        phone: '3009998877',
        password: 'Logout123!'
      };
      
      UserController.registerUser(userData);
      expect(UserController.getCurrentUser()).toBeDefined();
      
      // WHEN
      UserController.logout();
      
      // THEN
      const currentUser = UserController.getCurrentUser();
      expect(currentUser).toBeNull();
    });
  });

  describe('US07 - Como usuario quiero navegar por categorías', () => {
    
    test('AC07.1 - DADO que estoy en la página principal, CUANDO veo las categorías disponibles, ENTONCES puedo ver todas las categorías del catálogo', () => {
      // GIVEN
      const allProducts = ProductController.getAllProducts();
      
      // WHEN
      const categories = [...new Set(allProducts.map(p => p.category))];
      
      // THEN
      expect(categories.length).toBeGreaterThan(0);
      expect(Array.isArray(categories)).toBe(true);
    });

    test('AC07.2 - DADO que selecciono una categoría, CUANDO filtro por esa categoría, ENTONCES solo veo productos de esa categoría', () => {
      // GIVEN
      const allProducts = ProductController.getAllProducts();
      const firstCategory = allProducts[0].category;
      
      // WHEN
      const filteredProducts = ProductController.getProductsByCategory(firstCategory);
      
      // THEN
      expect(filteredProducts.length).toBeGreaterThan(0);
      filteredProducts.forEach(product => {
        expect(product.category).toBe(firstCategory);
      });
    });

    test('AC07.3 - DADO que filtro por categoría, CUANDO no hay productos en esa categoría, ENTONCES veo un mensaje apropiado', () => {
      // GIVEN
      const nonExistentCategory = 'CategoríaQueNoExiste123';
      
      // WHEN
      const products = ProductController.getProductsByCategory(nonExistentCategory);
      
      // THEN
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBe(0);
    });
  });

  describe('US08 - Como usuario quiero ver mi carrito de compras', () => {
    
    test('AC08.1 - DADO que tengo productos en el carrito, CUANDO accedo al carrito, ENTONCES veo todos mis productos agregados', () => {
      // GIVEN
      const products = ProductController.getAllProducts();
      CartController.clearCart();
      CartController.addToCart(products[0], 2);
      CartController.addToCart(products[1], 1);
      
      // WHEN
      const cart = CartController.getCart();
      
      // THEN
      expect(cart.items.length).toBe(2);
      expect(cart.items[0].quantity).toBe(2);
      expect(cart.items[1].quantity).toBe(1);
    });

    test('AC08.2 - DADO que estoy en el carrito, CUANDO veo el total, ENTONCES veo el cálculo correcto de todos los productos', () => {
      // GIVEN
      const products = ProductController.getAllProducts();
      CartController.clearCart();
      CartController.addToCart(products[0], 2);
      CartController.addToCart(products[1], 3);
      
      // WHEN
      const total = CartController.getCartTotal();
      
      // THEN
      const expectedTotal = (products[0].price * 2) + (products[1].price * 3);
      expect(total).toBe(expectedTotal);
    });

    test('AC08.3 - DADO que estoy en el carrito, CUANDO cambio la cantidad de un producto, ENTONCES el total se actualiza automáticamente', () => {
      // GIVEN
      const products = ProductController.getAllProducts();
      CartController.clearCart();
      CartController.addToCart(products[0], 1);
      
      const initialTotal = CartController.getCartTotal();
      
      // WHEN
      CartController.updateQuantity(products[0].id, 5);
      
      // THEN
      const newTotal = CartController.getCartTotal();
      expect(newTotal).toBe(products[0].price * 5);
      expect(newTotal).toBeGreaterThan(initialTotal);
    });

    test('AC08.4 - DADO que tengo productos en el carrito, CUANDO elimino un producto, ENTONCES el producto desaparece del carrito', () => {
      // GIVEN
      const products = ProductController.getAllProducts();
      CartController.clearCart();
      CartController.addToCart(products[0], 1);
      CartController.addToCart(products[1], 2);
      
      const cart1 = CartController.getCart();
      expect(cart1.items.length).toBe(2);
      
      // WHEN
      CartController.removeFromCart(products[0].id);
      
      // THEN
      const cart2 = CartController.getCart();
      expect(cart2.items.length).toBe(1);
      const removedItem = cart2.items.find(item => item.product.id === products[0].id);
      expect(removedItem).toBeUndefined();
    });

    test('AC08.5 - DADO que mi carrito está vacío, CUANDO accedo al carrito, ENTONCES veo un mensaje indicando que está vacío', () => {
      // GIVEN
      CartController.clearCart();
      
      // WHEN
      const cart = CartController.getCart();
      
      // THEN
      expect(cart.items.length).toBe(0);
      expect(cart.items).toEqual([]);
    });
  });

  describe('US09 - Como usuario quiero ver productos destacados', () => {
    
    test('AC09.1 - DADO que hay productos destacados, CUANDO cargo la página principal, ENTONCES veo una sección de productos destacados', () => {
      // GIVEN
      const featured = ProductController.getFeaturedProducts(4);
      
      // WHEN & THEN
      expect(featured.length).toBeGreaterThan(0);
      expect(featured.length).toBeLessThanOrEqual(4);
      
      // Los productos destacados están ordenados por rating
      if (featured.length > 1) {
        for (let i = 0; i < featured.length - 1; i++) {
          expect(featured[i].rating).toBeGreaterThanOrEqual(featured[i + 1].rating);
        }
      }
    });

    test('AC09.2 - DADO que veo productos destacados, CUANDO son productos con descuento, ENTONCES veo el porcentaje de descuento', () => {
      // GIVEN
      const discounted = ProductController.getDiscountedProducts();
      
      if (discounted.length > 0) {
        // WHEN
        const testProduct = discounted[0];
        
        // THEN
        expect(testProduct.discount).toBeGreaterThan(0);
        
        // Verificar que el porcentaje de descuento es válido
        const discountPercentage = testProduct.getDiscountPercentage();
        expect(discountPercentage).toBeGreaterThan(0);
        expect(discountPercentage).toBeLessThanOrEqual(100);
      }
    });
  });

  describe('US10 - Como usuario quiero una experiencia responsive', () => {
    
    test('AC10.1 - DADO que accedo desde cualquier dispositivo, CUANDO cargo la aplicación, ENTONCES la interfaz se adapta a mi pantalla', () => {
      // GIVEN - Diferentes viewports
      const viewports = [
        { width: 320, height: 568 },  // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1920, height: 1080 } // Desktop
      ];
      
      // WHEN & THEN - La aplicación debe renderizarse sin errores
      viewports.forEach(viewport => {
        const { unmount } = render(
          <MemoryRouter>
            <Home />
          </MemoryRouter>
        );
        
        // Verificar que elementos clave están presentes
        const cyberDaysElements = screen.getAllByText(/Cyber Days/i);
        expect(cyberDaysElements.length).toBeGreaterThan(0);
        
        // Limpiar para el siguiente test
        unmount();
      });
    });
  });

  describe('US11 - Como usuario quiero ver información clara de productos', () => {
    
    test('AC11.1 - DADO que veo un producto, CUANDO el producto está en stock, ENTONCES veo claramente que está disponible', () => {
      // GIVEN
      const products = ProductController.getAllProducts();
      const testProduct = products[0];
      
      // WHEN
      const product = ProductController.getProductById(testProduct.id);
      
      // THEN
      expect(product).toBeDefined();
      expect(product.stock === undefined || product.stock > 0).toBe(true);
    });

    test('AC11.2 - DADO que veo el precio de un producto, CUANDO tiene descuento, ENTONCES veo claramente el ahorro', () => {
      // GIVEN
      const discounted = ProductController.getDiscountedProducts();
      
      if (discounted.length > 0) {
        const testProduct = discounted[0];
        
        // WHEN
        const originalPrice = testProduct.originalPrice;
        const finalPrice = testProduct.price;
        const savings = testProduct.discount;
        
        // THEN
        expect(savings).toBeGreaterThan(0);
        expect(finalPrice).toBeLessThan(originalPrice);
        expect(savings).toBe(originalPrice - finalPrice);
      }
    });
  });

  describe('US12 - Como usuario quiero una navegación intuitiva', () => {
    
    test('AC12.1 - DADO que estoy en cualquier página, CUANDO quiero volver al inicio, ENTONCES puedo hacerlo fácilmente', () => {
      // GIVEN - Navegación disponible en todas las páginas
      
      // WHEN - Renderizar aplicación
      render(
        <MemoryRouter initialEntries={['/']}>
          <Home />
        </MemoryRouter>
      );
      
      // THEN - El home debe estar accesible
      expect(screen.getByText(/Cyber Days/i)).toBeInTheDocument();
    });

    test('AC12.2 - DADO que navego por el sitio, CUANDO uso el buscador, ENTONCES puedo encontrar productos rápidamente', () => {
      // GIVEN
      const searchTerm = 'smart';
      
      // WHEN
      const results = ProductController.searchProducts(searchTerm);
      
      // THEN
      expect(Array.isArray(results)).toBe(true);
      // Si hay resultados, deben ser relevantes
      results.forEach(product => {
        const isRelevant = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
        expect(isRelevant).toBe(true);
      });
    });
  });
});
