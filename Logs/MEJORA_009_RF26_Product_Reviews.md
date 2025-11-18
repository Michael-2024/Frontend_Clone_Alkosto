# MEJORA 009 – RF26: Calificaciones y Reseñas de Productos

- Autor: Alexánder Mesa Gómez
- Fecha: 16/11/2025
- Estado: Implementado en frontend (SPA React) e integrado a flujo MVC

## Objetivo
Completar el RF26 para permitir a los usuarios:
- Ver reseñas/calificaciones por producto
- Enviar una reseña (requiere sesión iniciada)
- Mostrar promedio de calificación y conteo de reseñas

## Alcance y Arquitectura
- Patrón MVC respetado: Modelos puros, Controladores orquestan API, Vistas consumen controladores.
- Integración con backend Django (endpoints existentes):
  - GET `/api/resenas/producto/{id}/`
  - POST `/api/resenas/crear/` (con `Authorization: Token {token}`)

## Archivos Nuevos
- `src/models/Review.js`
  - Modelo plano con: `id, productId, userId, userName, rating, comment, createdAt, approved`
  - Helper: `getFormattedDate()`

- `src/controllers/ReviewController.js`
  - `listByProduct(productId)`: Obtiene reseñas y las adapta a `Review`
  - `createReview(productId, rating, comment)`: Crea reseña (requiere login)
  - `toReviewModel(dto)`: Adaptador flexible de DTO → Modelo

- `src/components/ProductReviews/ProductReviews.js`
- `src/components/ProductReviews/ProductReviews.css`
  - Sección de reseñas con:
    - Resumen: estrellas promedio y número de reseñas
    - Lista de reseñas
    - Formulario para enviar reseña (si está logueado)
    - Validaciones mínimas: rating 1–5, comentario ≥ 5 caracteres

## Archivos Actualizados
- `src/services/ApiService.js`
  - Métodos conveniencia:
    - `getProductReviews(productId)`
    - `createReview(data)`

- `src/views/ProductDetail/ProductDetail.js`
  - Integración de la sección: `<ProductReviews productId={product.id} />`

## Flujo de Usuario
1. En `ProductDetail`, se carga resumen y lista de reseñas del producto.
2. Usuario autenticado puede seleccionar estrellas y escribir comentario.
3. Al enviar, se llama `ReviewController.createReview` → se agrega en memoria y se limpia el formulario.

## Consideraciones de UX/Accesibilidad
- Etiquetas ARIA para la sección de reseñas y estrellas.
- Mensajes de error/success y estados vacíos.

## Pruebas sugeridas (pendiente incluir en Jest)
- Listado de reseñas adapta correctamente los DTO.
- Crear reseña falla sin login.
- Crear reseña con rating inválido.
- UI: Muestra promedio correcto con 1, n reseñas.

## Resultado
RF26 queda completamente funcional en frontend, alineado con la arquitectura y con integración mínima al backend.
