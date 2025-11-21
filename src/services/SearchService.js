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
    
    // Mapeo de términos de búsqueda a categorías padre
    this.categoryMap = {
      'celulares': 'Celulares',
      'smartphones': 'Celulares',
      'telefonos': 'Celulares',
      'teléfonos': 'Celulares',
      'moviles': 'Celulares',
      'móviles': 'Celulares',
      
      'computadores': 'computadores',
      'portatiles': 'computadores',
      'portátiles': 'computadores',
      'laptops': 'computadores',
      'pc': 'computadores',
      
      'electrodomesticos': 'electrodomesticos',
      'electrodomésticos': 'electrodomesticos',
      'lavadoras': 'electrodomesticos',
      'neveras': 'electrodomesticos',
      'estufas': 'electrodomesticos',
      
      'televisores': 'tv',
      'televisiones': 'tv',
      'tv': 'tv',
      'smart tv': 'tv',
      
      'audio': 'audio',
      'parlantes': 'audio',
      'audifonos': 'audio',
      'audífonos': 'audio',
      'auriculares': 'audio',
    };
    
    // Mapeo de términos de búsqueda populares y sus variantes (fallback)
    this.searchTermsMap = {
      // Celulares y smartphones
      'celulares': ['smartphone', 'celular', 'iphone', 'galaxy', 'teléfono', 'telefono', 'móvil', 'movil'],
      'smartphones': ['smartphone', 'celular', 'iphone', 'galaxy', 'teléfono', 'telefono'],
      'telefonos': ['teléfono', 'telefono', 'celular', 'smartphone', 'iphone', 'galaxy'],
      'moviles': ['móvil', 'movil', 'celular', 'smartphone', 'iphone'],
      
      // Computadores
      'computadores': ['portátil', 'portatil', 'laptop', 'computador', 'macbook', 'pc'],
      'portatiles': ['portátil', 'portatil', 'laptop', 'computador', 'macbook'],
      'laptops': ['laptop', 'portátil', 'portatil', 'computador', 'macbook'],
      
      // Electrodomésticos
      'lavadoras': ['lavadora'],
      'neveras': ['nevera', 'refrigerador', 'refrigeradora'],
      'refrigeradores': ['refrigerador', 'refrigeradora', 'nevera'],
      'estufas': ['estufa', 'cocina'],
      
      // TV y Video
      'televisores': ['televisor', 'tv', 'smart tv', 'television'],
      'televisiones': ['televisión', 'television', 'tv', 'televisor'],
      
      // Audio
      'audifonos': ['audífono', 'audifono', 'auricular', 'headphone'],
      'auriculares': ['auricular', 'audífono', 'audifono'],
      'parlantes': ['parlante', 'altavoz', 'bocina'],
      'altavoces': ['altavoz', 'parlante', 'bocina'],
      
      // Tablets
      'tablets': ['tablet', 'tableta'],
      'tabletas': ['tableta', 'tablet'],
      
      // Otros
      'licuadoras': ['licuadora', 'batidora'],
      'ventiladores': ['ventilador'],
      'cafeteras': ['cafetera'],
    };
  }

  /**
   * Normaliza el término de búsqueda para buscar variantes
   * @param {string} term - Término a normalizar
   * @returns {Array} Array de variantes del término
   */
  normalizeSearchTerm(term) {
    const normalized = term.toLowerCase().trim();
    
    // Si el término está en el mapa, devolver sus variantes
    if (this.searchTermsMap[normalized]) {
      return [normalized, ...this.searchTermsMap[normalized]];
    }
    
    // Si no está en el mapa, devolver el término original
    return [normalized];
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
      // PRIMERO: Verificar si el término corresponde a una categoría padre
      if (this.categoryMap[searchTerm]) {
        const categoria = this.categoryMap[searchTerm];
        console.log(`🔍 Buscando por categoría padre: "${categoria}"`);
        
        try {
          const productos = await this.productController.porCategoria(categoria);
          console.log(`✅ Encontrados ${productos.length} productos en categoría "${categoria}"`);
          
          if (productos.length > 0) {
            return productos;
          }
        } catch (categoryError) {
          console.warn(`⚠️ Error buscando categoría "${categoria}":`, categoryError);
          // Continuar con búsqueda por variantes si falla la categoría
        }
      }
      
      // SEGUNDO: Búsqueda por variantes (fallback)
      const searchVariants = this.normalizeSearchTerm(searchTerm);
      console.log(`🔍 Buscando "${searchTerm}" con variantes:`, searchVariants);
      
      // Buscar con cada variante y combinar resultados
      const allResults = [];
      const seenIds = new Set();
      
      for (const variant of searchVariants) {
        try {
          console.log(`  ➜ Probando variante: "${variant}"`);
          const productos = await this.productController.buscar(variant);
          console.log(`  ✓ Encontrados ${productos.length} productos con "${variant}"`);
          
          // Agregar solo productos que no hayamos visto antes
          productos.forEach(producto => {
            if (!seenIds.has(producto.id)) {
              seenIds.add(producto.id);
              allResults.push(producto);
            }
          });
        } catch (variantError) {
          // Continuar con la siguiente variante si hay error
          console.warn(`❌ Error buscando variante "${variant}":`, variantError);
        }
      }
      
      console.log(`✅ Total de resultados únicos encontrados: ${allResults.length}`);
      
      if (allResults.length === 0) {
        console.log(`❌ No se encontraron resultados para "${searchTerm}"`);
      }
      
      // Ordenar por relevancia (primero coincidencias en nombre, luego en categoría)
      allResults.sort((a, b) => {
        const aNameMatch = a.name.toLowerCase().includes(searchTerm);
        const bNameMatch = b.name.toLowerCase().includes(searchTerm);
        
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        
        // Si ambos coinciden en nombre o ambos no, ordenar por rating
        return b.rating - a.rating;
      });

      return allResults;
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
