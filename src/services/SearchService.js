// src/services/SearchService.js
// Motor de Búsqueda - RF06

import ProductController from '../controllers/ProductController';

class SearchService {
  constructor() {
    if (SearchService.instance) {
      return SearchService.instance;
    }
    SearchService.instance = this;
    this.productController = ProductController;
  }

  /**
   * Busca coincidencias de productos según palabra clave
   * @param {string} palabraClave - Término de búsqueda
   * @returns {Promise<Array>} Lista de productos que coinciden
   */
  async buscarCoincidencias(palabraClave) {
    if (!palabraClave || palabraClave.trim() === '') {
      return [];
    }

    const searchTerm = palabraClave.toLowerCase().trim();
    
    try {
      // Usar el método de búsqueda del backend si está disponible
      const productos = await this.productController.buscar(searchTerm);
      
      // Ordenar por relevancia (primero coincidencias en nombre, luego en categoría)
      productos.sort((a, b) => {
        const aNameMatch = a.name.toLowerCase().includes(searchTerm);
        const bNameMatch = b.name.toLowerCase().includes(searchTerm);
        
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        
        // Si ambos coinciden en nombre o ambos no, ordenar por rating
        return b.rating - a.rating;
      });

      return productos;
    } catch (error) {
      console.error('Error en búsqueda:', error);
      return [];
    }
  }

  /**
   * Muestra lista de productos encontrados
   * @param {Array} lista - Lista de productos
   * @returns {Object} Resultado formateado
   */
  mostrarResultados(lista) {
    return {
      total: lista.length,
      productos: lista,
      mensaje: lista.length === 0 
        ? 'No se encontraron productos' 
        : `${lista.length} producto(s) encontrado(s)`
    };
  }

  /**
   * Muestra mensaje específico
   * @param {string} mensaje - Mensaje a mostrar
   * @returns {Object} Mensaje formateado
   */
  mostrarMensaje(mensaje) {
    return {
      tipo: 'info',
      texto: mensaje
    };
  }

  /**
   * Obtiene sugerencias de búsqueda (autocompletado)
   * @param {string} query - Término parcial de búsqueda
   * @returns {Promise<Array>} Sugerencias de productos
   */
  async obtenerSugerencias(query) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const resultados = await this.buscarCoincidencias(query);
    return resultados.slice(0, 5); // Máximo 5 sugerencias
  }

  /**
   * Búsqueda avanzada con filtros
   * @param {string} palabraClave - Término de búsqueda
   * @param {Object} filtros - Filtros adicionales (categoría, precio, rating)
   * @returns {Promise<Array>} Productos filtrados
   */
  async buscarConFiltros(palabraClave, filtros = {}) {
    let resultados = await this.buscarCoincidencias(palabraClave);

    // Filtrar por categoría
    if (filtros.categoria) {
      resultados = resultados.filter(p => 
        p.category.toLowerCase() === filtros.categoria.toLowerCase()
      );
    }

    // Filtrar por rango de precio
    if (filtros.precioMin !== undefined) {
      resultados = resultados.filter(p => p.price >= filtros.precioMin);
    }
    if (filtros.precioMax !== undefined) {
      resultados = resultados.filter(p => p.price <= filtros.precioMax);
    }

    // Filtrar por rating mínimo
    if (filtros.ratingMin !== undefined) {
      resultados = resultados.filter(p => p.rating >= filtros.ratingMin);
    }

    // Ordenar resultados
    if (filtros.ordenar) {
      switch (filtros.ordenar) {
        case 'precio-asc':
          resultados.sort((a, b) => a.price - b.price);
          break;
        case 'precio-desc':
          resultados.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          resultados.sort((a, b) => b.rating - a.rating);
          break;
        case 'descuento':
          resultados.sort((a, b) => b.discount - a.discount);
          break;
        default:
          break;
      }
    }

    return resultados;
  }
}

// Exportar instancia única (Singleton)
export default new SearchService();
