import React, { useEffect, useMemo, useState } from 'react';
import ReviewController from '../../controllers/ReviewController';
import UserController from '../../controllers/UserController';
import './ProductReviews.css';

const Stars = ({ value = 0 }) => {
  const full = Math.round(Number(value) || 0);
  return <span className="stars" aria-label={`${full} de 5`}>{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>;
};

const ProductReviews = ({ productId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const isLoggedIn = UserController.isLoggedIn();
  const userName = isLoggedIn ? UserController.getCurrentUser()?.getFullName() : '';

  const summary = useMemo(() => {
    if (!reviews.length) return { avg: 0, count: 0 };
    const avg = reviews.reduce((a, r) => a + (r.rating || 0), 0) / reviews.length;
    return { avg: Number(avg.toFixed(1)), count: reviews.length };
  }, [reviews]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const list = await ReviewController.listByProduct(productId);
        if (mounted) setReviews(list);
      } catch (e) {
        if (mounted) setError('No se pudieron cargar las reseñas');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [productId]);

  const canSubmit = isLoggedIn && rating >= 1 && rating <= 5 && comment.trim().length >= 5;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!canSubmit) {
      setError('Completa la calificación y un comentario (mínimo 5 caracteres).');
      return;
    }
    try {
      setLoading(true);
      const created = await ReviewController.createReview(productId, rating, comment.trim());
      setReviews(prev => [created, ...prev]);
      setComment('');
      setRating(5);
      setSuccess('¡Gracias por tu reseña!');
    } catch (e) {
      setError(e?.message || 'No se pudo enviar tu reseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="reviews-section" aria-labelledby="reviews-title">
      <div className="reviews-header">
        <h2 id="reviews-title" className="reviews-title">Opiniones y calificaciones</h2>
        <div className="rating-summary">
          <Stars value={summary.avg} />
          <span>{summary.avg.toFixed(1)} / 5</span>
          <span>·</span>
          <span>{summary.count} reseña{summary.count === 1 ? '' : 's'}</span>
        </div>
      </div>

      {isLoggedIn ? (
        <form className="review-form" onSubmit={submit}>
          <div className="form-row">
            <label htmlFor="rating">Tu calificación:</label>
            <select id="rating" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[5,4,3,2,1].map(v => (
                <option key={v} value={v}>{v} estrellas</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <textarea
              id="comment"
              placeholder="Cuéntanos tu experiencia con el producto..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              aria-label="Comentario de reseña"
            />
          </div>
          <p className="helper-text">Mínimo 5 caracteres. Tu nombre se mostrará como {userName || 'Usuario'}.</p>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => { setComment(''); setRating(5); }} disabled={loading}>Limpiar</button>
            <button type="submit" className="btn-primary" disabled={!canSubmit || loading}>Enviar reseña</button>
          </div>
          {error && <div className="error-text" role="alert">{error}</div>}
          {success && <div className="success-text">{success}</div>}
        </form>
      ) : (
        <p className="helper-text">Inicia sesión para escribir una reseña.</p>
      )}

      {loading && <p>Cargando reseñas…</p>}
      {!loading && reviews.length === 0 && (
        <p className="empty-state">Aún no hay reseñas para este producto.</p>
      )}

      {!loading && reviews.length > 0 && (
        <div className="reviews-list">
          {reviews.map(r => (
            <article key={r.id} className="review-card">
              <div className="review-header">
                <div className="review-user">{r.userName || 'Usuario'}</div>
                <div>
                  <Stars value={r.rating} />
                </div>
              </div>
              <div className="review-date">{r.getFormattedDate()}</div>
              <p className="review-comment">{r.comment}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductReviews;
