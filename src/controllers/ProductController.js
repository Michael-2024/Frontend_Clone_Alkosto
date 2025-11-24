import apiService from '../services/ApiService';
import Product from '../models/Product';

// Controlador de Productos conectado al backend
class ProductController {
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
    const qs = Object.keys(extra).length ? '?' + new URLSearchParams(extra).toString() : '';
    const resp = await apiService.get(`/categoria/${slug}/${qs}`);
    return resp.productos ? resp.productos.map(p => this.toProductModel(p)) : [];
  }

  // Alias para compatibilidad con código existente
  async getProductById(id) {
    return this.getById(id);
  }
}

const productController = new ProductController();
export default productController;
