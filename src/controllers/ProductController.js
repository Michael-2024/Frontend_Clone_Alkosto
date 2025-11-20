import apiService from '../services/ApiService';
import Product from '../models/Product';

// Controlador de Productos conectado al backend
class ProductController {
  // Mapeo de slugs del frontend a slugs reales en la BD
  constructor() {
    this.slugMap = {
      // Celulares - categoría principal redirige a smartphones
      'celulares': 'celulares-smartphones',
      'smartphones': 'celulares-smartphones',
      'celulares-basicos': 'celulares-celulares-basicos',
      'accesorios': 'celulares-accesorios',
      
      // Computadores - categoría principal redirige a portátiles
      'computadores': 'computadores-portatiles',
      'portatiles': 'computadores-portatiles',
      'gaming': 'computadores-gaming',
      'accesorios-pc': 'computadores-accesorios-pc',
      
      // Electrodomésticos - categoría principal redirige a neveras
      'electrodomesticos': 'electrodomesticos-neveras',
      'neveras': 'electrodomesticos-neveras',
      'lavadoras': 'electrodomesticos-lavadoras',
      'microondas': 'electrodomesticos-microondas',
      
      // TV y Video - categoría principal redirige a smart tv
      'tv': 'tv-smart-tv',
      'smart-tv': 'tv-smart-tv',
      'tv-led': 'tv-led',
      'tv-oled': 'tv-tv-oled',  // Nota: slug real es tv-tv-oled
      'televisores': 'tv-smart-tv',
      
      // Audio - categoría principal redirige a parlantes
      'audio': 'audio-parlantes',
      'parlantes': 'audio-parlantes',
      'audifonos': 'audio-audifonos',
      'barras-de-sonido': 'audio-barras-de-sonido',
    };
  }

  // Obtener el slug correcto para la BD
  getRealSlug(frontendSlug) {
    return this.slugMap[frontendSlug] || frontendSlug;
  }

  // Adaptar respuesta del backend a instancias de Product (si se requiere para métodos locales)
  toProductModel(raw) {
    return new Product(
      raw.id_producto,
      raw.nombre,
      Number(raw.precio),
      raw.precio_original ? Number(raw.precio_original) : null,
      raw.descuento_porcentaje ? Number(raw.descuento_porcentaje) : 0,
      // Imagen principal (si existe array de imágenes)
      raw.imagenes && raw.imagenes.length > 0 ? raw.imagenes[0].url_imagen : null,
      raw.categoria_nombre || '',
      raw.calificacion_promedio ? Number(raw.calificacion_promedio) : 0,
      raw.stock ? Number(raw.stock) : 0,
      raw.descripcion_corta || raw.descripcion || ''
    );
  }

  async list(params = {}) {
    const data = await apiService.get(`/productos/${Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : ''}`);
    return Array.isArray(data) ? data.map(p => this.toProductModel(p)) : [];
  }

  async getById(id) {
    const raw = await apiService.get(`/productos/${id}/`);
    return this.toProductModel(raw);
  }

  async destacados() {
    const data = await apiService.get('/destacados/');
    return data.map(p => this.toProductModel(p));
  }

  async ofertas() {
    const data = await apiService.get('/ofertas/');
    return data.map(p => this.toProductModel(p));
  }

  async buscar(query, extra = {}) {
    const params = { q: query, ...extra };
    const qs = new URLSearchParams(params).toString();
    const resp = await apiService.get(`/buscar/?${qs}`);
    return resp.resultados ? resp.resultados.map(p => this.toProductModel(p)) : [];
  }

  async porCategoria(slug, extra = {}) {
    // Convertir slug del frontend al slug real de la BD
    const realSlug = this.getRealSlug(slug);
    const qs = Object.keys(extra).length ? '?' + new URLSearchParams(extra).toString() : '';
    const resp = await apiService.get(`/categoria/${realSlug}/${qs}`);
    return resp.productos ? resp.productos.map(p => this.toProductModel(p)) : [];
  }

  // Alias para compatibilidad con código existente
  async getProductById(id) {
    return this.getById(id);
  }
}

const productController = new ProductController();
export default productController;
