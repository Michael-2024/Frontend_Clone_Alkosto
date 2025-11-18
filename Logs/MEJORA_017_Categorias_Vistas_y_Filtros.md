# MEJORA 017 — Vistas de Categorías + Filtros laterales

- Fecha: 2025-11-17
- Autoría: Alexánder Mesa Gómez

## Resumen
Se implementó una vista dedicada para categorías con listado de productos y panel de filtros en el costado izquierdo, alineado con el comportamiento esperado (similar a Alkosto.com). Se habilitó la navegación desde el mega–menú superior y las tarjetas de categorías del home hacia la ruta `/categoria/:categoria`.

## Cambios principales
- Nueva vista: `src/views/Category/Category.js` + estilos `Category.css`.
- Ruta actualizada en `src/App.js` para renderizar `Category` en `/categoria/:categoria`.
- Navegación activada en:
  - `src/components/Navigation/Navigation.js` (subcategorías, "Ver todo", marcas y relacionados).
  - `src/components/CategorySection/CategorySection.js` (tarjetas de categorías junto al carrusel).
- Comportamiento de carrito unificado: al agregar desde la vista de categoría se abre el `CartDrawer` con resumen.

## Detalles funcionales
- Carga de productos por categoría vía `ProductController.porCategoria(slug)`.
- Filtros laterales:
  - Ordenar por: relevancia, precio asc/desc, rating.
  - Marca: detectada automáticamente a partir del nombre de producto (Samsung, LG, Mabe, etc.).
  - Precio: mínimo y máximo.
- Grilla de resultados reutiliza `ProductCard` y soporta "Agregar al carrito" con `CartDrawer` (UX consistente con Home).

## Notas técnicas
- Se agregó utilitario local para “slugify” y navegación mediante `useNavigate` en el megamenú.
- La detección de marca se realiza por coincidencia en el nombre del producto; si el backend provee la marca explícita, se puede mapear directamente para mayor precisión.
- La lógica de filtros es reactiva; el botón "Aplicar" es visual para alinearse con el patrón de UI.

## Archivos modificados/añadidos
- `src/views/Category/Category.js` (nuevo)
- `src/views/Category/Category.css` (nuevo)
- `src/App.js` (ruta de categoría → `Category`)
- `src/components/Navigation/Navigation.js` (habilitar navegación)
- `src/components/CategorySection/CategorySection.js` (habilitar navegación)

## Pruebas sugeridas
- Navegar a una subcategoría desde el mega–menú y validar que se renderiza la vista con filtros.
- Aplicar filtro por marca y rango de precios y verificar conteo de resultados.
- Agregar un producto al carrito y confirmar apertura del `CartDrawer`.

## Próximos pasos (opcional)
- Integrar tipos específicos por categoría (por ejemplo, "Carga superior"/"Frontal" para lavadoras) si el backend lo expone.
- Añadir paginación.
- Guardar el estado de filtros en la URL (querystring) para enlaces compartibles.
