# MEJORA 019 — Correcciones UX: Favoritos, Filtros y Navegación

- Fecha: 2025-11-17
- Autoría: Alexánder Mesa Gómez

## Resumen
Se corrigieron cuatro problemas críticos de experiencia de usuario reportados tras la implementación de MEJORA_010:
1. **Error de navegación en productos vistos**: Corregido error `setShowSearchDropdown is not defined` al hacer clic en productos del dropdown de búsqueda.
2. **Filtros de precio reactivos incorrectos**: Cambiados para aplicarse SOLO al hacer clic en la flecha naranja (→), no automáticamente.
3. **UI de filtros de precio compacta**: Reducido tamaño de inputs y botones para caber correctamente en el sidebar lateral (alineado con diseño de Alkosto.com).
4. **Chips de filtros unificados**: Cuando se aplican tanto precio mínimo como máximo, ahora se muestra un solo chip "Precio: $X - $Y" en lugar de dos separados.

## Cambios principales

### 1. Error de navegación en productos vistos
**Problema**: Al implementar el cierre del dropdown de búsqueda antes de navegar, se utilizó `setShowSearchDropdown(false)` que no existe en el componente Header.

**Error reportado**:
```
[eslint] 
src\components\Header\Header.js
  Line 525:27:  'setShowSearchDropdown' is not defined  no-undef
```

**Causa**: El componente Header no tenía un estado `showSearchDropdown`. El dropdown de búsqueda se maneja con `showSearchOverlay`.

**Solución**: Removido el intento de cerrar el dropdown manualmente. El overlay se cierra automáticamente al navegar a otra ruta (comportamiento por defecto de React Router).

**Código corregido (Header.js)**:
```javascript
onClick={() => {
  navigate(`/producto/${p.id}`); // Simplemente navegar
}}
```

**Archivos modificados**:
- `src/components/Header/Header.js`

### 2. Filtros de precio NO reactivos (aplicación manual)
**Problema**: Los filtros de precio se aplicaban automáticamente al escribir en los inputs (comportamiento reactivo), pero la flecha naranja no tenía función. El usuario esperaba que los filtros se aplicaran SOLO al hacer clic en la flecha.

**Solución implementada**:
- Agregados estados temporales `tempPriceMin` y `tempPriceMax` (Category.js) / `tempPrecioMin` y `tempPrecioMax` (SearchResults.js).
- Los inputs ahora modifican los estados **temporales**, no los filtros activos.
- Al hacer clic en la flecha naranja (→), se ejecuta `aplicarFiltroPrecio()` que copia los valores temporales a los estados de filtros activos.
- Los filtros solo se aplican cuando los estados activos cambian, **NO** cuando el usuario escribe en los inputs.

**Código implementado (Category.js)**:
```javascript
// Estados temporales para inputs (no aplican filtro hasta hacer clic en flecha)
const [tempPriceMin, setTempPriceMin] = useState('');
const [tempPriceMax, setTempPriceMax] = useState('');

// Función para aplicar filtro manualmente
const aplicarFiltroPrecio = () => {
  setPriceMin(tempPriceMin);
  setPriceMax(tempPriceMax);
};

// JSX
<input value={tempPriceMin} onChange={(e) => setTempPriceMin(e.target.value)} />
<button className="btn-apply-price" onClick={aplicarFiltroPrecio}>→</button>
```

**Archivos modificados**:
- `src/views/Category/Category.js`
- `src/views/Search/SearchResults.js`

### 3. UI de filtros compacta
**Problema**: Los inputs de precio eran demasiado grandes y no cabían correctamente en el sidebar lateral. En la página original de Alkosto.com, los inputs son más compactos.

**Solución**:
- Reducido `padding` de inputs de `6px 8px` a `4px 6px`.
- Reducido `font-size` de `14px` (default) a `13px`.
- Reducido tamaño del botón de flecha de `32x32px` a `28x28px`.
- Reducido `gap` entre elementos de `8px` a `4px`.
- Agregado `min-width: 0` para permitir que los inputs se encojan correctamente con `flex: 1`.

**Estilos CSS actualizados**:
```css
.price-range { display:flex; gap:4px; align-items:center; }
.price-range input { flex:1; min-width:0; padding:4px 6px; font-size:13px; }
.price-range span { font-size:12px; }
.btn-apply-price { width:28px; height:28px; font-size:16px; }
```

**Archivos modificados**:
- `src/views/Category/Category.css`
- `src/views/Search/SearchResults.css`

### 4. Chips de filtros unificados
**Problema**: Cuando se aplicaban tanto precio mínimo como máximo, se mostraban dos chips separados:
- "Precio mín: $10.000"
- "Precio máx: $200.000"

En Alkosto.com, se muestra un solo chip: "Precio: $10.000 - $200.000"

**Solución**: Lógica condicional para mostrar un chip unificado cuando ambos valores están presentes:
```javascript
{priceMin !== '' && priceMax !== '' ? (
  <div className="filter-chip">
    <span>Precio: ${Number(priceMin).toLocaleString('es-CO')} - ${Number(priceMax).toLocaleString('es-CO')}</span>
    <button onClick={() => { removeFilter('priceMin'); removeFilter('priceMax'); }}>×</button>
  </div>
) : (
  <>
    {priceMin !== '' && <div>Precio mín...</div>}
    {priceMax !== '' && <div>Precio máx...</div>}
  </>
)}
```

**Archivos modificados**:
- `src/views/Category/Category.js`
- `src/views/Search/SearchResults.js`

## Detalles técnicos

### Flujo de filtros de precio (NO reactivo)
**Antes (incorrecto - reactivo)**:
1. Usuario escribe en input → `setPriceMin(value)` → Filtro se aplica inmediatamente
2. Flecha naranja no tenía función

**Ahora (correcto - manual)**:
1. Usuario escribe en input → `setTempPriceMin(value)` → Nada cambia visualmente
2. Usuario hace clic en flecha → `aplicarFiltroPrecio()` ejecuta `setPriceMin(tempPriceMin)` → Filtro se aplica
3. El hook `useMemo` del filtrado detecta el cambio en `priceMin` y actualiza resultados

**Sincronización al limpiar filtros**:
- `clearFilters()` limpia tanto estados activos (`priceMin/Max`) como temporales (`tempPriceMin/Max`)
- `removeFilter()` hace lo mismo al quitar un chip individual

### Estados de precio en Category.js
```javascript
// Estados activos (usados en filtrado)
const [priceMin, setPriceMin] = useState('');
const [priceMax, setPriceMax] = useState('');

// Estados temporales (usados en inputs)
const [tempPriceMin, setTempPriceMin] = useState('');
const [tempPriceMax, setTempPriceMax] = useState('');

// useMemo solo observa priceMin/priceMax (no tempPrice*)
const filtered = useMemo(() => {
  // ... filtrado basado en priceMin y priceMax
}, [products, selectedBrands, priceMin, priceMax, sort]);
```

### Dimensiones de UI compacta
| Elemento | Antes | Ahora | Razón |
|----------|-------|-------|-------|
| Input padding | `6px 8px` | `4px 6px` | Reducir altura |
| Input font-size | `14px` (default) | `13px` | Más compacto |
| Botón flecha | `32x32px` | `28x28px` | Proporcional a inputs |
| Gap entre elementos | `8px` | `4px` | Menos espacio desperdiciado |
| Span separador | `14px` (default) | `12px` | Proporcional |

## Pruebas realizadas

### 1. Error de navegación corregido
✅ Página carga sin errores de compilación
✅ ESLint no reporta `setShowSearchDropdown is not defined`
✅ Click en productos vistos navega correctamente a detalle del producto
✅ Sin errores en runtime

### 2. Filtros de precio NO reactivos
✅ Escribir en input de precio mínimo → Productos NO cambian inmediatamente
✅ Escribir en input de precio máximo → Productos NO cambian inmediatamente
✅ Click en flecha naranja (→) → Filtros se aplican y productos se actualizan
✅ Flecha naranja es funcional (no decorativa)

### 3. UI compacta
✅ Inputs de precio caben correctamente dentro del sidebar de 260px de ancho
✅ Botón de flecha naranja proporcional a inputs (28x28px)
✅ Gap reducido entre elementos (4px) mantiene compacidad
✅ Font-size reducido (13px) mejora densidad de información

### 4. Chips unificados
✅ Aplicar solo precio mínimo → Muestra chip "Precio mín: $X"
✅ Aplicar solo precio máximo → Muestra chip "Precio máx: $Y"
✅ Aplicar ambos → Muestra UN solo chip "Precio: $X - $Y"
✅ Click en × del chip unificado → Elimina ambos filtros
✅ Chips individuales siguen funcionando cuando solo uno está activo

## Archivos modificados

1. **src/components/Header/Header.js** - Removido setShowSearchDropdown inexistente en onClick de productos vistos
2. **src/views/Category/Category.js** - Agregados estados temporales de precio, función aplicarFiltroPrecio, chips unificados
3. **src/views/Category/Category.css** - Inputs y botón de precio más compactos (28px botón, 13px font, 4px gap)
4. **src/views/Search/SearchResults.js** - Agregados estados temporales de precio, función aplicarFiltroPrecio, chips unificados
5. **src/views/Search/SearchResults.css** - Inputs y botón de precio más compactos (28px botón, 13px font, 4px gap)

## Resumen de cambios por archivo

### Header.js
- **Antes**: `onClick={() => { setShowSearchDropdown(false); navigate(\`/producto/${p.id}\`); }}`
- **Ahora**: `onClick={() => { navigate(\`/producto/${p.id}\`); }}`
- **Impacto**: Elimina error de compilación y runtime

### Category.js & SearchResults.js
- **Agregados**: `tempPriceMin`, `tempPriceMax` estados
- **Agregada**: `aplicarFiltroPrecio()` función
- **Modificados**: Inputs usan estados temporales
- **Modificado**: Flecha naranja ejecuta `aplicarFiltroPrecio()`
- **Modificado**: `clearFilters()` limpia también estados temporales
- **Modificado**: `removeFilter()` limpia estados temporales cuando aplique
- **Modificado**: Chips de precio muestran versión unificada cuando ambos presentes

### Category.css & SearchResults.css
- **Modificado**: `.price-range` gap de `8px` → `4px`
- **Modificado**: `.price-range input` padding `6px 8px` → `4px 6px`, font-size → `13px`, agregado `min-width:0`
- **Modificado**: `.price-range span` font-size → `12px`
- **Modificado**: `.btn-apply-price` width/height `32px` → `28px`, font-size `18px` → `16px`

## Notas adicionales

### Comportamiento de filtros
- **Marcas**: Reactivos (aplican inmediatamente al seleccionar checkbox)
- **Ordenar**: Reactivo (aplica inmediatamente al cambiar select)
- **Precio**: NO reactivo (aplica SOLO al hacer clic en flecha naranja)

Esta diferencia de comportamiento es **intencional** y sigue el patrón de la página original de Alkosto.com.

### Navegación en Header
El dropdown de búsqueda (`showSearchOverlay`) se cierra automáticamente al navegar debido al comportamiento por defecto de React Router. No es necesario cerrarlo manualmente con un setter de estado inexistente.

### Lint warnings CSS
Los warnings sobre propiedades lógicas CSS (`inline-size` vs `width`, `block-size` vs `height`) son sugerencias de modernización del linter y no afectan la funcionalidad. Las propiedades tradicionales (`width`, `height`, `min-width`) son universalmente compatibles y preferidas en este proyecto.

### Compatibilidad con backend
Los filtros de precio siguen siendo compatibles con la API del backend. Los parámetros `precioMin` y `precioMax` se envían correctamente en las peticiones de búsqueda cuando los filtros están activos.

## Próximos pasos (opcional)
- Implementar estado inicial correcto del botón de favoritos (consultar favoritos al montar ProductCard).
- Agregar animación de transición al agregar/quitar favoritos.
- Persistir favoritos de invitado en una clave específica (`alkosto_guest_favorites`) para sincronizar tras login (ya implementado en `migrateFavoritesToBackend`).
- Agregar contador de favoritos en header o perfil de usuario.

---

## ACTUALIZACIÓN: Mejoras de Fluidez y UX (Scroll Automático)

### Problema Detectado
Después de la implementación inicial, se identificó que varias acciones importantes en la aplicación no llevaban al usuario automáticamente a la parte superior de la página, causando:
- Usuario queda viendo la parte inferior después de vaciar carrito
- Filtros aplicados pero usuario no ve los resultados en la parte superior
- Cancelar pedidos deja al usuario en el fondo de la lista
- Navegación entre steps de checkout sin scroll

### Soluciones Implementadas

#### 1. Cart.js - Scroll después de acciones
**Acciones con scroll automático:**
- Vaciar carrito completo (`handleClearCart`)
- Eliminar producto individual (`handleRemoveItem`)

```javascript
const handleClearCart = async () => {
  if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
    await CartController.clearCart();
    updateCart();
    window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ Scroll al top
  }
};
```

#### 2. Profile.js - Favoritos con confirmación y scroll
**Nuevas funcionalidades:**
- Botón "Eliminar todos" con confirmación
- Scroll automático después de eliminar todos los favoritos

```javascript
const removeAllFavorites = () => {
  if (!user) return;
  if (window.confirm('¿Estás seguro de que deseas eliminar todos tus favoritos?')) {
    const key = `alkosto_favorites_${user.id}`;
    localStorage.setItem(key, JSON.stringify([]));
    setFavorites([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
```

**UI del botón** (Profile.css):
```css
.btn-remove-all {
  margin-left: auto;
  padding: 6px 14px;
  background: #fff;
  border: 1px solid #eb5b25;
  color: #eb5b25;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-remove-all:hover {
  background: #eb5b25;
  color: #fff;
}
```

#### 3. Checkout.js - Navegación fluida entre steps
**Steps con scroll mejorado:**
- Step 1 → Step 2 (Envío → Pago)
- Step 2 → Step 3 (Pago → Confirmación)
- Volver de Step 2 → Step 1
- Volver de Step 3 → Step 2
- Editar desde Step 3 (volver a Step 1 o 2)

```javascript
const handleContinueToPayment = () => {
  if (validateShippingForm()) {
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ Smooth scroll
  }
};

// Botones de volver también tienen scroll
<button onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
  Volver
</button>
```

#### 4. Category.js & SearchResults.js - Filtros
**Scroll después de:**
- Aplicar filtro de precio con flecha naranja
- Limpiar todos los filtros

```javascript
const aplicarFiltroPrecio = () => {
  setPriceMin(tempPriceMin);
  setPriceMax(tempPriceMax);
  window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ Ver resultados al top
};

const clearFilters = () => {
  // ... limpiar estados
  window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ Ver productos filtrados
};
```

#### 5. Orders.js - Cancelación de pedidos
**Scroll después de:**
- Cancelar pedido exitosamente

```javascript
if (result.success) {
  setCancelMessage({ type: 'success', text: 'Pedido cancelado exitosamente' });
  loadOrders();
  setShowCancelModal(false);
  setSelectedOrder(null);
  window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ Ver lista actualizada
  // ...
}
```

#### 6. PaymentMethods.js - Gestión de métodos de pago
**Scroll después de:**
- Eliminar método de pago
- Agregar nuevo método de pago exitosamente

```javascript
const handleDelete = (id) => {
  if (window.confirm('¿Estás seguro de eliminar este método de pago?')) {
    const result = PaymentMethodController.deletePaymentMethod(id);
    if (result.success) {
      setSuccessMessage('Método de pago eliminado');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadPaymentMethods(currentUser.id);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ Ver mensaje de éxito
    }
  }
};
```

### Archivos Modificados (Actualización)

**Scroll y UX mejorada:**
1. `src/views/Cart/Cart.js` - Scroll en vaciar y eliminar items
2. `src/views/Profile/Profile.js` - Botón eliminar todos favoritos con confirmación y scroll
3. `src/views/Profile/Profile.css` - Estilos para botón eliminar todos
4. `src/views/Checkout/Checkout.js` - Scroll en todos los cambios de step (6 lugares)
5. `src/views/Category/Category.js` - Scroll en aplicar/limpiar filtros (2 lugares)
6. `src/views/Search/SearchResults.js` - Scroll en aplicar/limpiar filtros (2 lugares)
7. `src/views/Account/Orders.js` - Scroll después de cancelar pedido
8. `src/views/Account/PaymentMethods.js` - Scroll después de eliminar/agregar método (2 lugares)

### Resumen de Mejoras de UX

| Vista | Acción | Comportamiento Anterior | Comportamiento Nuevo |
|-------|--------|------------------------|---------------------|
| Cart | Vaciar carrito | Usuario queda en el fondo | Scroll automático al top con mensaje |
| Cart | Eliminar producto | Usuario queda en posición actual | Scroll al top para ver carrito actualizado |
| Profile | Eliminar todos favoritos | No existe botón | Botón con confirmación + scroll al top |
| Checkout | Cambiar step (adelante) | Nuevo contenido puede quedar abajo | Scroll suave al top en cada cambio |
| Checkout | Volver atrás (steps) | Contenido anterior puede quedar abajo | Scroll suave al top |
| Checkout | Editar desde confirmación | Salta a step pero no mueve scroll | Scroll suave al top del step |
| Category/Search | Aplicar filtros precio | Resultados pueden quedar fuera de vista | Scroll al top para ver productos |
| Category/Search | Limpiar filtros | Productos sin filtros pueden no verse | Scroll al top para ver todos |
| Orders | Cancelar pedido | Lista actualizada puede quedar abajo | Scroll al top con mensaje de éxito |
| PaymentMethods | Eliminar método | Mensaje puede quedar fuera de vista | Scroll al top con mensaje visible |
| PaymentMethods | Agregar método | Formulario se oculta pero usuario abajo | Scroll al top para ver lista actualizada |

### Patrón de Scroll Implementado

**Consistencia:**
```javascript
window.scrollTo({ top: 0, behavior: 'smooth' })
```

**Cuándo se aplica:**
- ✅ Después de acciones destructivas (eliminar, vaciar)
- ✅ Después de acciones exitosas con feedback (agregar, actualizar)
- ✅ Al cambiar de vista/step en flujos multi-paso
- ✅ Al aplicar/limpiar filtros que cambian resultados visibles
- ✅ Después de confirmar diálogos modales con cambios
