# MEJORA 018 — UX: Auto-tracking, Favoritos con redirección, Chips de filtros

- Fecha: 2025-11-17
- Autoría: Alexánder Mesa Gómez

## Resumen
Se implementaron tres mejoras de experiencia de usuario (UX) solicitadas para optimizar flujos críticos:
1. **Auto-rastreo de pedidos**: Desde la página de pedidos, al hacer clic en "Rastrear pedido" se auto-rellenan los campos y se busca automáticamente.
2. **Favoritos con redirección post-login**: Cuando un usuario sin sesión intenta agregar un favorito, se guarda el producto pendiente y tras login/registro se redirige directamente a la página de favoritos para verlo.
3. **Chips de filtros aplicados**: En vistas de búsqueda y categorías, se muestran en la parte superior los filtros activos en forma de chips removibles (similar a Alkosto.com).

## Cambios principales

### 1. Auto-rastreo de pedidos
**Archivos modificados:**
- `src/views/Tracking/Tracking.js`
- `src/views/Account/Orders.js` (ya navegaba con parámetros)

**Lógica:**
- Al hacer clic en "Rastrear pedido" desde Orders, se navega a `/seguimiento?tracking=XXX&doc=YYY`.
- En la vista Tracking, `useEffect` lee los parámetros de URL (`searchParams.get('tracking')` y `searchParams.get('doc')`).
- Si ambos están presentes, se auto-rellenan los campos y se ejecuta la búsqueda del pedido automáticamente (sin requerir que el usuario presione "Consultar pedido").
- Si el pedido se encuentra, se muestra directamente el resultado; si no, se muestra un mensaje de error.

### 2. Favoritos con redirección post-login
**Archivos modificados:**
- `src/components/ProductCard/ProductCard.js`
- `src/controllers/UserController.js`
- `src/views/Register/RegisterPassword.js`
- `src/views/Login/LoginPassword.js`

**Flujo:**
- **Sin sesión**: Al hacer clic en el botón de favoritos (❤️) en ProductCard:
  - Se guarda el ID del producto en `localStorage` con clave `pendingFavoriteProductId`.
  - Se marca una señal de redirección con clave `pendingFavoriteRedirect = 'true'`.
  - Se redirige al usuario a `/login/options`.
- **Durante login/registro**:
  - `UserController.registerUser()` y `UserController.login()` detectan la señal `pendingFavoriteRedirect`.
  - Al completar la autenticación, sincronizan el favorito pendiente (`syncPendingFavorite()`).
  - Retornan `{ success: true, user, redirectToFavorites: true }`.
- **Post-autenticación**:
  - Las vistas de login/registro verifican `result.redirectToFavorites`.
  - Si es `true`, redirigen a `/perfil/favoritos` (en lugar de home o verify).
  - El usuario ve inmediatamente el producto que agregó a favoritos.

**Nota**: El botón de favoritos en ProductCard es opcional (prop `showFavorite`). Actualmente solo está habilitado en algunas vistas para demostración; se puede activar globalmente si se desea.

### 3. Chips de filtros aplicados
**Archivos modificados:**
- `src/views/Category/Category.js` + `Category.css`
- `src/views/Search/SearchResults.js` + `SearchResults.css`

**Implementación:**
- **Conteo de filtros activos**: Funciones `getActiveFiltersCount()` en ambas vistas cuentan filtros aplicados (marca, precio, orden, categoría).
- **Renderizado de chips**:
  - Se muestra un bloque `<div className="applied-filters">` justo después del header de resultados.
  - Cada filtro activo se representa como un chip con etiqueta descriptiva y botón `×` para removerlo.
  - Ejemplo: `Marca: Samsung`, `Precio mín: $1.000.000`, `Orden: Precio menor`.
- **Interacción**:
  - Clic en `×` de un chip: llama a `removeFilter(tipo, valor)` que actualiza el estado y re-ejecuta la búsqueda/filtrado sin ese filtro.
  - Botón "Limpiar todos": llama a `clearFilters()` o `limpiarFiltros()` para resetear todos los filtros a valores por defecto.
- **Estilo**: Chips con fondo blanco, borde gris, bordes redondeados (`border-radius: 16px`), botón de cierre rojo al hover (alineado con Alkosto.com).

**Comportamiento reactivo**: Los filtros son reactivos (no requieren "Aplicar" para mostrar chips); los chips se actualizan automáticamente al cambiar selecciones en el sidebar de filtros.

## Detalles técnicos

### Auto-tracking
```javascript
// Tracking.js
useEffect(() => {
  const trackingFromUrl = searchParams.get('tracking');
  const docFromUrl = searchParams.get('doc');
  
  if (trackingFromUrl && docFromUrl) {
    setTrackingNumber(trackingFromUrl);
    setDocument(docFromUrl);
    setTimeout(() => {
      const foundOrder = OrderController.getOrderByTracking(trackingFromUrl, docFromUrl);
      if (foundOrder) setOrder(foundOrder);
      else setError('No se encontró el pedido...');
    }, 300);
  }
}, [searchParams]);
```

### Favoritos post-login
```javascript
// ProductCard.js
const handleToggleFavorite = async (e) => {
  e.preventDefault();
  if (!UserController.isLoggedIn()) {
    localStorage.setItem('pendingFavoriteProductId', String(product.id));
    localStorage.setItem('pendingFavoriteRedirect', 'true');
    navigate('/login/options');
    return;
  }
  // Toggle favorito si logueado
};

// UserController.js
async registerUser(...) {
  // ... registro exitoso ...
  const shouldRedirect = localStorage.getItem('pendingFavoriteRedirect');
  if (shouldRedirect === 'true') {
    localStorage.removeItem('pendingFavoriteRedirect');
    return { success: true, user, redirectToFavorites: true };
  }
  return { success: true, user };
}

// RegisterPassword.js / LoginPassword.js
if (result.redirectToFavorites) {
  navigate('/perfil/favoritos');
  return;
}
```

### Chips de filtros
```javascript
// Category.js / SearchResults.js
{getActiveFiltersCount() > 0 && (
  <div className="applied-filters">
    <span className="filters-label">Filtros aplicados ({getActiveFiltersCount()}):</span>
    <div className="filter-chips">
      {selectedBrands.map(brand => (
        <div key={brand} className="filter-chip">
          <span>Marca: {brand}</span>
          <button onClick={() => removeFilter('brand', brand)}>×</button>
        </div>
      ))}
      {/* ... más chips ... */}
      <button className="clear-all-filters" onClick={clearFilters}>Limpiar todos</button>
    </div>
  </div>
)}
```

## Pruebas sugeridas
1. **Auto-tracking**:
   - Navegar a `/perfil/pedidos` con un pedido existente.
   - Hacer clic en "Rastrear pedido".
   - Verificar que `/seguimiento` se abre con campos llenos y resultado mostrado.

2. **Favoritos con redirección**:
   - Cerrar sesión.
   - Intentar agregar un producto a favoritos desde home (si `showFavorite` está habilitado en ProductCard).
   - Registrarse o iniciar sesión.
   - Verificar redirección automática a `/perfil/favoritos` con el producto agregado.

3. **Chips de filtros**:
   - Buscar "samsung" en el buscador.
   - Aplicar filtros: categoría, precio mínimo, orden.
   - Verificar que aparecen chips en la parte superior con cada filtro.
   - Hacer clic en `×` de un chip y verificar que el filtro se remueve y los resultados se actualizan.
   - Hacer clic en "Limpiar todos" y verificar que todos los filtros se resetean.
   - Repetir en una vista de categoría (e.g., `/categoria/lavadoras`).

## Notas adicionales
- **ProductCard favoritos**: El botón de favoritos (❤️) está preparado pero deshabilitado por defecto. Para activarlo globalmente, pasar `showFavorite={true}` en cada uso de `<ProductCard>` (en Home, Search, Category, etc.).
- **Persistencia de favoritos**: La señal `pendingFavoriteRedirect` se limpia tras uso para evitar redirecciones no deseadas en futuros logins.
- **Compatibilidad backend**: La lógica de favoritos funciona con localStorage (local) y con la API del backend (`migrateFavoritesToBackend` sincroniza al autenticarse).

## Archivos modificados/añadidos
- `src/views/Tracking/Tracking.js` (auto-rellenar desde URL)
- `src/components/ProductCard/ProductCard.js` (botón de favoritos con redirección)
- `src/controllers/UserController.js` (señal `redirectToFavorites` en login/register)
- `src/views/Register/RegisterPassword.js` (redirección a favoritos)
- `src/views/Login/LoginPassword.js` (redirección a favoritos)
- `src/views/Category/Category.js` + `Category.css` (chips de filtros)
- `src/views/Search/SearchResults.js` + `SearchResults.css` (chips de filtros)

## Próximos pasos (opcional)
- Habilitar el botón de favoritos (❤️) en todos los ProductCard si se desea UX completa.
- Añadir analytics para rastrear clicks en chips de filtros.
- Persistir estado de filtros en URL (querystring) para enlaces compartibles.
- Agregar animaciones de transición al mostrar/ocultar chips.
