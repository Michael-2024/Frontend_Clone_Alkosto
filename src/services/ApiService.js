// Servicio para conectarse con el backend Django
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
    this.token = localStorage.getItem('auth_token');
  }

  // Obtener headers con autenticación
  getHeaders(includeAuth = false) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }

    return headers;
  }

  // Obtener token actual
  getToken() {
    return this.token || localStorage.getItem('auth_token');
  }

  // Actualizar token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // GET request
  async get(endpoint, requiresAuth = false) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(requiresAuth),
        credentials: 'include', // Para manejar cookies/sesiones
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GET Error:', error);
      throw error;
    }
  }

  // POST request
  async post(endpoint, data, requiresAuth = false) {
    try {
      console.log(`POST ${endpoint}:`, data);
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(requiresAuth),
        credentials: 'include',
        body: JSON.stringify(data),
      });

      console.log(`Response status ${endpoint}:`, response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error response ${endpoint}:`, errorData);
        throw new Error(errorData.error || errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const jsonResponse = await response.json();
      console.log(`Success response ${endpoint}:`, jsonResponse);
      return jsonResponse;
    } catch (error) {
      console.error('POST Error:', error);
      throw error;
    }
  }

  // PUT request
  async put(endpoint, data, requiresAuth = false) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(requiresAuth),
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('PUT Error:', error);
      throw error;
    }
  }

  // DELETE request
  async delete(endpoint, requiresAuth = false) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(requiresAuth),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Algunos DELETE no retornan contenido
      const text = await response.text();
      return text ? JSON.parse(text) : { message: 'Deleted successfully' };
    } catch (error) {
      console.error('DELETE Error:', error);
      throw error;
    }
  }

  // PATCH request
  async patch(endpoint, data, requiresAuth = false) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(requiresAuth),
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('PATCH Error:', error);
      throw error;
    }
  }

  // === ENDPOINTS DE PRODUCTOS ===
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.get(`/productos/${queryString ? '?' + queryString : ''}`);
  }

  async getProductById(id) {
    return await this.get(`/productos/${id}/`);
  }

  async getFeaturedProducts() {
    return await this.get('/destacados/');
  }

  async getProductsOnSale() {
    return await this.get('/ofertas/');
  }

  async searchProducts(query, filters = {}) {
    const params = { q: query, ...filters };
    const queryString = new URLSearchParams(params).toString();
    return await this.get(`/buscar/?${queryString}`);
  }

  async getProductsByCategory(categorySlug) {
    return await this.get(`/categoria/${categorySlug}/`);
  }

  // === ENDPOINTS DE CATEGORÍAS ===
  async getCategories() {
    return await this.get('/categorias/');
  }

  // === ENDPOINTS DE MARCAS ===
  async getBrands() {
    return await this.get('/marcas/');
  }

  // === ENDPOINTS DE CARRITO ===
  async getCart() {
    return await this.get('/carrito/obtener/', true);
  }

  async addToCart(productId, quantity = 1) {
    return await this.post('/carrito/agregar/', {
      id_producto: productId,
      cantidad: quantity,
    }, true);
  }

  async updateCartItem(itemId, quantity) {
    return await this.patch(`/carrito/${itemId}/`, { cantidad: quantity }, true);
  }

  async removeFromCart(itemId) {
    return await this.delete(`/carrito/${itemId}/`, true);
  }

  async clearCart() {
    return await this.delete('/carrito/limpiar/', true);
  }

  // === ENDPOINTS DE AUTENTICACIÓN ===
  async register(userData) {
    const response = await this.post('/auth/registro/', userData);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async login(email, password) {
    const response = await this.post('/auth/login/', { email, password });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async logout() {
    try {
      await this.post('/auth/logout/', {}, true);
    } finally {
      this.setToken(null);
    }
  }

  async getProfile() {
    return await this.get('/auth/perfil/', true);
  }

  async updateProfile(userData) {
    return await this.put('/auth/actualizar-perfil/', userData, true);
  }

  async changePassword(passwordData) {
    return await this.post('/auth/cambiar-password/', passwordData, true);
  }

  async checkEmailExists(email) {
    return await this.get(`/auth/verificar_email/?email=${encodeURIComponent(email)}`);
  }

  // === ENDPOINTS DE RESEÑAS ===
  async getProductReviews(productId) {
    return await this.get(`/resenas/producto/${productId}/`);
  }

  async createReview(data) {
    return await this.post('/resenas/crear/', data, true);
  }
}

// Exportar instancia única
const apiService = new ApiService();
export default apiService;
