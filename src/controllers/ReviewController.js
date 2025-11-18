import apiService from '../services/ApiService';
import Review from '../models/Review';
import UserController from './UserController';

class ReviewController {
  constructor() {
    if (ReviewController.instance) return ReviewController.instance;
    ReviewController.instance = this;
  }

  toReviewModel(dto) {
    return new Review({
      id: dto.id || dto.id_resena || dto.pk,
      productId: dto.id_producto || dto.producto_id || dto.productId,
      userId: dto.id_usuario || dto.usuario_id || dto.userId,
      userName: dto.usuario_nombre || dto.userName || dto.usuario || 'Usuario',
      rating: dto.calificacion || dto.rating,
      comment: dto.comentario || dto.comment,
      createdAt: dto.fecha_creacion || dto.createdAt,
      approved: dto.aprobada !== undefined ? dto.aprobada : true,
    });
  }

  async listByProduct(productId) {
    const data = await apiService.get(`/resenas/producto/${productId}/`);
    const reviews = Array.isArray(data) ? data.map(r => this.toReviewModel(r)) : [];
    return reviews;
  }

  async createReview(productId, rating, comment) {
    if (!UserController.isLoggedIn()) {
      throw new Error('Debes iniciar sesión para calificar');
    }
    const payload = {
      id_producto: productId,
      calificacion: Number(rating),
      comentario: String(comment || '').trim(),
    };
    const dto = await apiService.post('/resenas/crear/', payload, true);
    return this.toReviewModel(dto);
  }
}

export default new ReviewController();
