class Review {
  constructor({
    id,
    productId,
    userId,
    userName,
    rating,
    comment,
    createdAt,
    approved = true,
  }) {
    this.id = id;
    this.productId = productId;
    this.userId = userId;
    this.userName = userName;
    this.rating = Number(rating) || 0;
    this.comment = comment || '';
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
    this.approved = !!approved;
  }

  getFormattedDate(locale = 'es-CO') {
    try {
      return this.createdAt.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });
    } catch (_) {
      return String(this.createdAt);
    }
  }
}

export default Review;
