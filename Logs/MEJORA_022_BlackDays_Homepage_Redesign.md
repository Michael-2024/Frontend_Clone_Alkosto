# MEJORA_022: Rediseño Homepage para Black Days

**Fecha:** 21 de noviembre de 2025  
**Tipo:** Mejora UX/UI - Campaña Black Days  
**Prioridad:** Alta  
**Estado:** ✅ Completado

## 📋 Resumen

Rediseño de la página principal para alinearse con la campaña Black Days de Alkosto, reemplazando el carrusel principal con un banner promocional impactante y reorganizando la disposición de las categorías.

## 🎯 Objetivo

Actualizar el diseño de la homepage para reflejar la campaña Black Days, similar al sitio oficial de Alkosto (www.alkosto.com), mejorando el impacto visual de las ofertas especiales.

## ✨ Cambios Implementados

### 1. Nuevo Componente: BlackDaysBanner

**Ubicación:** `src/components/BlackDaysBanner/`

**Características:**
- Banner de ancho completo con diseño dividido (40% imagen, 60% contenido)
- Fondo degradado oscuro (#1a1a1a → #2d2d2d)
- Logo "BLACK DAYS" con efectos visuales (texto blanco + badge naranja)
- Título principal: "¡Llegaron los días que esperabas!"
- Descripción de ofertas
- CTA (Call-to-Action) con botón destacado → `/ofertas`
- Imagen de persona con efecto `mix-blend-mode: lighten`
- Elementos decorativos con gradientes radiales

**Diseño Responsive:**
- Desktop (>1024px): Layout de dos columnas
- Tablet/Mobile (<1024px): Layout de una columna, imagen oculta
- Ajustes de tipografía progresivos (72px → 56px → 42px → 36px)

### 2. Reorganización del Home

**Antes:**
```jsx
<div className="hero-section">
  <Carousel slides={carouselSlides} />
  <CategorySection />
</div>
```

**Después:**
```jsx
<BlackDaysBanner />
<div className="home-categories-section">
  <CategorySection />
</div>
```

**Cambios en `Home.js`:**
- ❌ Eliminado: Componente `Carousel` y datos de `carouselSlides`
- ✅ Agregado: Componente `BlackDaysBanner`
- ✅ Movido: `CategorySection` debajo del banner en contenedor independiente
- ✅ Actualizado: Estilos en `Home.css` para nueva estructura

### 3. Ajustes de Estilos

**Home.css:**
```css
/* Antes */
.hero-section {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Carousel + Categorías lado a lado */
  gap: 20px;
}

/* Después */
.home-categories-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
  background-color: var(--bg-primary);
}
```

**CategorySection.css:**
- Cambiado `height: 450px` → `min-height: 450px`
- Agregada sombra sutil para destacar sobre el fondo

## 🎨 Paleta de Colores Black Days

```css
/* Fondo principal */
--black-days-bg-start: #1a1a1a;
--black-days-bg-end: #2d2d2d;

/* Elementos destacados */
--black-days-orange: #FF6B35;
--black-days-orange-light: #FF8C5A;

/* Texto */
--text-white: #ffffff;
--text-gray: #e0e0e0;
```

## 📁 Archivos Creados

```
src/components/BlackDaysBanner/
├── BlackDaysBanner.js
└── BlackDaysBanner.css
```

## 📝 Archivos Modificados

```
src/views/Home/
├── Home.js (eliminado Carousel, agregado BlackDaysBanner)
└── Home.css (nueva estructura .home-categories-section)

src/components/CategorySection/
└── CategorySection.css (min-height + sombra)
```

## 🔗 Integración

El banner Black Days se integra con:
- **Ofertas:** Botón CTA redirige a `/ofertas`
- **CategorySection:** Flujo visual natural banner → categorías
- **ProductGrid:** Secciones de ofertas destacadas debajo

## 🖼️ Assets Requeridos

**Imagen recomendada:** `/public/assets/black-days-person.jpg`
- Dimensiones: 400x600px (aprox)
- Contenido: Persona sonriente con audífonos (similar a sitio original)
- Formato: JPG/PNG
- **Fallback:** Si no existe, usa imagen de Unsplash automáticamente

## 📱 Responsive

| Breakpoint | Comportamiento |
|------------|----------------|
| >1024px    | Layout 2 columnas (imagen + texto) |
| 768-1024px | Layout 1 columna, sin imagen, texto centrado |
| <768px     | Logo + título reducidos, padding ajustado |
| <480px     | Tipografía mínima, botón compacto |

## ✅ Pruebas Realizadas

- [x] Renderizado correcto en desktop (1920x1080)
- [x] Renderizado correcto en tablet (768x1024)
- [x] Renderizado correcto en móvil (375x667)
- [x] Fallback de imagen funcional
- [x] Navegación a `/ofertas` correcta
- [x] Sin errores de compilación
- [x] Integración con CategorySection correcta

## 🚀 Impacto

**Beneficios:**
- ✅ Diseño alineado con campaña oficial de Alkosto
- ✅ Mayor impacto visual en ofertas Black Days
- ✅ Mejora en jerarquía de contenido (ofertas primero, categorías después)
- ✅ Reducción de complejidad (carrusel → banner estático)
- ✅ Mejor rendimiento (menos JS, menos animaciones)

**UX Mejorada:**
- Mensaje promocional claro y directo
- CTA prominente con alto contraste
- Flujo visual optimizado: Banner → Categorías → Ofertas → Productos

## 📊 Métricas Esperadas

- ⬆️ CTR en botón "Ver ofertas Black Days"
- ⬆️ Tiempo de permanencia en homepage
- ⬆️ Conversión en productos en oferta
- ⬇️ Tiempo de carga de homepage (sin carrusel pesado)

## 🔄 Reversión

Para volver al diseño anterior:

```bash
# 1. Revertir Home.js
git checkout HEAD~1 src/views/Home/Home.js src/views/Home/Home.css

# 2. Eliminar componente BlackDaysBanner
rm -rf src/components/BlackDaysBanner/

# 3. Restaurar importación de Carousel
# (editar manualmente src/views/Home/Home.js)
```

## 📚 Documentación Relacionada

- `docs/MEJORA_017_Categorias_Vistas_y_Filtros.md`
- `src/components/Carousel/Carousel.js` (componente anterior)
- `.github/copilot-instructions.md` (actualizar sección de componentes)

## 👨‍💻 Implementado por

GitHub Copilot + Usuario  
Branch: `alkosto_appearance`

---

**Notas:**
- El Carousel no se eliminó del código fuente, solo se dejó de usar en Home
- Puede reutilizarse en otras vistas si es necesario
- BlackDaysBanner es independiente y puede desactivarse fácilmente
- Diseño inspirado en www.alkosto.com (noviembre 2025)
