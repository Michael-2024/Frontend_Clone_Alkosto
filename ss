[1mdiff --git a/.env b/.env[m
[1mdeleted file mode 100644[m
[1mindex a4c49d1..0000000[m
[1m--- a/.env[m
[1m+++ /dev/null[m
[36m@@ -1,5 +0,0 @@[m
[31m-# URL del backend Django[m
[31m-REACT_APP_API_URL=http://127.0.0.1:8000/api[m
[31m-[m
[31m-# Puerto del frontend (opcional, por defecto es 3000)[m
[31m-PORT=3000[m
[1mdiff --git a/CHANGELOG_MEJORAS.md b/CHANGELOG_MEJORAS.md[m
[1mdeleted file mode 100644[m
[1mindex 1a7e990..0000000[m
[1m--- a/CHANGELOG_MEJORAS.md[m
[1m+++ /dev/null[m
[36m@@ -1,269 +0,0 @@[m
[31m-# 📋 Changelog de Mejoras - Alkosto Clone[m
[31m-[m
[31m-## 🎨 Mejoras Visuales y de Diseño (22 de Octubre, 2025)[m
[31m-[m
[31m-### ✨ Página de Inicio Completamente Renovada[m
[31m-[m
[31m-#### 1. **Banner Promocional Superior**[m
[31m-- ✅ Nuevo banner superior con degradado naranja[m
[31m-- ✅ Muestra promociones destacadas (Cyber Days, envío gratis, cuotas)[m
[31m-- ✅ Diseño sticky para mayor visibilidad[m
[31m-- ✅ Responsive en móviles[m
[31m-[m
[31m-#### 2. **Carrusel Hero Mejorado**[m
[31m-- ✅ Overlay gradiente para mejor legibilidad del texto[m
[31m-- ✅ Filtro de brillo en imágenes de fondo[m
[31m-- ✅ Controles de navegación con mejor UX[m
[31m-- ✅ Indicadores de slide rediseñados[m
[31m-- ✅ Auto-avance cada 5 segundos[m
[31m-[m
[31m-#### 3. **Sección de Categorías**[m
[31m-- ✅ Grid responsive con íconos coloridos[m
[31m-- ✅ 24+ categorías con diseño tipo Alkosto[m
[31m-- ✅ Hover effects suaves[m
[31m-- ✅ Categoría "Hiperofertas" destacada con animación[m
[31m-[m
[31m-#### 4. **Nuevas Secciones de Contenido**[m
[31m-[m
[31m-**Banners Promocionales Duales:**[m
[31m-- Banner de Tecnología (azul)[m
[31m-- Banner de Hogar (naranja)[m
[31m-- Efectos hover 3D[m
[31m-- CTAs destacados[m
[31m-[m
[31m-**Ofertas del Día:**[m
[31m-- Fondo degradado azul[m
[31m-- Temporizador con bloques animados[m
[31m-- Overlay con efectos visuales[m
[31m-- Grid de productos optimizado[m
[31m-[m
[31m-**Banner Full Width:**[m
[31m-- Degradado verde (envío gratis)[m
[31m-- Tag "EXCLUSIVO ONLINE"[m
[31m-- CTA prominente[m
[31m-[m
[31m-**Banner Triple de Categorías:**[m
[31m-- Gaming (morado)[m
[31m-- Smartphones (azul)[m
[31m-- Audio (rojo)[m
[31m-- Efectos de gradiente y hover[m
[31m-[m
[31m-**Sección de Beneficios:**[m
[31m-- 4 tarjetas: Envío Gratis, Pago en Cuotas, Compra Segura, Garantía[m
[31m-- Íconos grandes[m
[31m-- Grid responsive[m
[31m-[m
[31m-#### 5. **Mejoras en Secciones de Productos**[m
[31m-- ✅ Headers con título y link "Ver todos"[m
[31m-- ✅ Separadores con color primario[m
[31m-- ✅ Subtítulos descriptivos[m
[31m-- ✅ Secciones: Ofertas del Día, Lo Más Vendido, Novedades, Destacados, Recomendados[m
[31m-[m
[31m-### 🎨 Sistema de Diseño Implementado[m
[31m-[m
[31m-#### Variables CSS Globales (`index.css`):[m
[31m-```css[m
[31m---color-primary: #004797[m
[31m---color-secondary: #FF6B00[m
[31m---color-success: #00A859[m
[31m---spacing-* (xs, sm, md, lg, xl, 2xl)[m
[31m---font-size-* (xs a 4xl)[m
[31m---shadow-* (sm, md, lg, xl)[m
[31m---radius-* (sm, md, lg, xl, full)[m
[31m---transition-* (fast, base, slow)[m
[31m-```[m
[31m-[m
[31m-#### Utilidades Globales:[m
[31m-- `.container` - Contenedor centrado max-width 1400px[m
[31m-- `.sr-only` - Clase para screen readers[m
[31m-- Reset CSS mejorado[m
[31m-- Scroll suave[m
[31m-- Focus visible mejorado[m
[31m-[m
[31m-### ♿ Accesibilidad Mejorada[m
[31m-[m
[31m-#### 1. **Componente SkipLink**[m
[31m-- ✅ Link "Saltar al contenido principal"[m
[31m-- ✅ Visible solo con Tab/foco de teclado[m
[31m-- ✅ Posición fija en esquina superior[m
[31m-- ✅ Outline destacado[m
[31m-[m
[31m-#### 2. **Landmarks ARIA**[m
[31m-- ✅ `<main id="main" role="main">` en contenido principal[m
[31m-- ✅ Navegación con `role="navigation"`[m
[31m-- ✅ Banner con `role="banner"`[m
[31m-[m
[31m-#### 3. **Mejoras de Contraste y Foco**[m
[31m-- ✅ Outline de 3px para elementos en foco[m
[31m-- ✅ Offset de 2px para mejor visibilidad[m
[31m-- ✅ Border radius en focus states[m
[31m-[m
[31m-### 🖼️ Header Renovado[m
[31m-[m
[31m-#### Logo Real de Alkosto:[m
[31m-- ✅ SVG del logo oficial[m
[31m-- ✅ Altura optimizada (45px)[m
[31m-- ✅ Object-fit: contain[m
[31m-[m
[31m-#### Mejoras Visuales:[m
[31m-- ✅ Color azul corporativo (#004797)[m
[31m-- ✅ Barra superior con links útiles[m
[31m-- ✅ Selector de ubicación con dropdown[m
[31m-- ✅ Menú de cuenta mejorado[m
[31m-- ✅ Carrito con contador[m
[31m-[m
[31m-### 📱 Responsive Design[m
[31m-[m
[31m-#### Breakpoints Optimizados:[m
[31m-- **Desktop:** > 1024px[m
[31m-- **Tablet:** 768px - 1024px[m
[31m-- **Mobile:** < 768px[m
[31m-- **Mobile Small:** < 480px[m
[31m-[m
[31m-#### Adaptaciones:[m
[31m-- ✅ Banners duales → columna única en móvil[m
[31m-- ✅ Triple banner → 2 columnas tablet, 1 columna móvil[m
[31m-- ✅ Grid de beneficios → 2 columnas tablet, 1 móvil[m
[31m-- ✅ Categorías → 3 columnas móvil[m
[31m-- ✅ Temporizador responsive[m
[31m-- ✅ Fonts escalados[m
[31m-[m
[31m-### 🎨 Paleta de Colores Actualizada[m
[31m-[m
[31m-#### Colores Primarios:[m
[31m-- **Azul Alkosto:** #004797 (header, CTAs)[m
[31m-- **Azul Oscuro:** #002875 (hover states)[m
[31m-- **Naranja:** #FF6B00 (promociones, secundario)[m
[31m-- **Verde:** #00A859 (envío gratis, éxito)[m
[31m-- **Rojo:** #FF4444 (descuentos, badges)[m
[31m-[m
[31m-#### Colores de Soporte:[m
[31m-- **Morado Gaming:** #8B5CF6[m
[31m-- **Azul Smartphones:** #3B82F6[m
[31m-- **Rojo Audio:** #EF4444[m
[31m-[m
[31m-### 🚀 Performance[m
[31m-[m
[31m-#### Optimizaciones:[m
[31m-- ✅ CSS Variables para re-rendering eficiente[m
[31m-- ✅ Transiciones suaves (300ms base)[m
[31m-- ✅ Box-sizing: border-box global[m
[31m-- ✅ Image optimization preparado[m
[31m-- ✅ Lazy loading ready[m
[31m-[m
[31m-### 📦 Nuevos Componentes Creados[m
[31m-[m
[31m-1. **SkipLink** (`src/components/SkipLink/`)[m
[31m-   - `SkipLink.js`[m
[31m-   - `SkipLink.css`[m
[31m-[m
[31m-### 📄 Archivos Modificados[m
[31m-[m
[31m-#### Vistas:[m
[31m-- ✅ `src/views/Home/Home.js` - Estructura completa renovada[m
[31m-- ✅ `src/views/Home/Home.css` - 400+ líneas de CSS nuevo[m
[31m-[m
[31m-#### Componentes:[m
[31m-- ✅ `src/components/Header/Header.js` - Logo actualizado[m
[31m-- ✅ `src/components/Header/Header.css` - Estilos del logo[m
[31m-- ✅ `src/components/Carousel/Carousel.css` - Overlay gradiente[m
[31m-[m
[31m-#### Estilos Globales:[m
[31m-- ✅ `src/index.css` - Variables CSS + utilidades[m
[31m-- ✅ `src/App.css` - Mejoras de accesibilidad[m
[31m-[m
[31m-#### Core:[m
[31m-- ✅ `src/App.js` - SkipLink + role="main"[m
[31m-[m
[31m-## 🎯 Características Destacadas[m
[31m-[m
[31m-### 1. **Fidelidad al Diseño Original**[m
[31m-- Colores corporativos exactos[m
[31m-- Estructura de página idéntica[m
[31m-- Tipografía consistente[m
[31m-- Espaciado profesional[m
[31m-[m
[31m-### 2. **Experiencia de Usuario**[m
[31m-- Navegación intuitiva[m
[31m-- Feedback visual en interacciones[m
[31m-- Carga de contenido clara[m
[31m-- CTAs prominentes[m
[31m-[m
[31m-### 3. **Accesibilidad (A11y)**[m
[31m-- WCAG 2.1 Level AA compliance[m
[31m-- Navegación por teclado[m
[31m-- Screen reader friendly[m
[31m-- Contraste adecuado[m
[31m-[m
[31m-### 4. **Responsive First**[m
[31m-- Mobile-first approach[m
[31m-- Touch-friendly en móviles[m
[31m-- Layout adaptativo[m
[31m-- Performance optimizado[m
[31m-[m
[31m-## 📊 Métricas Estimadas[m
[31m-[m
[31m-### Antes vs Después:[m
[31m-[m
[31m-| Métrica | Antes | Después | Mejora |[m
[31m-|---------|-------|---------|--------|[m
[31m-| Componentes Visuales | 8 | 15+ | +87% |[m
[31m-| Secciones en Home | 4 | 10 | +150% |[m
[31m-| Variables CSS | 0 | 50+ | ∞ |[m
[31m-| Accesibilidad Score | ~65 | ~92 | +42% |[m
[31m-| Mobile UX | Básico | Optimizado | +200% |[m
[31m-[m
[31m-## 🔜 Próximos Pasos Recomendados[m
[31m-[m
[31m-### Corto Plazo:[m
[31m-1. ⏳ Implementar búsqueda en tiempo real[m
[31m-2. ⏳ Agregar filtros avanzados[m
[31m-3. ⏳ Animaciones de transición entre páginas[m
[31m-4. ⏳ Loading skeletons[m
[31m-[m
[31m-### Mediano Plazo:[m
[31m-1. ⏳ Migrar a TypeScript[m
[31m-2. ⏳ Implementar Context API para estado global[m
[31m-3. ⏳ Lazy loading de imágenes[m
[31m-4. ⏳ Code splitting por ruta[m
[31m-[m
[31m-### Largo Plazo:[m
[31m-1. ⏳ PWA (Progressive Web App)[m
[31m-2. ⏳ Server-Side Rendering (Next.js)[m
[31m-3. ⏳ Optimización de bundle[m
[31m-4. ⏳ CI/CD pipeline[m
[31m-[m
[31m-## 📝 Notas Técnicas[m
[31m-[m
[31m-### Compatibilidad:[m
[31m-- ✅ Chrome/Edge (último)[m
[31m-- ✅ Firefox (último)[m
[31m-- ✅ Safari (último)[m
[31m-- ✅ Mobile browsers[m
[31m-[m
[31m-### Dependencias:[m
[31m-- Sin nuevas dependencias añadidas[m
[31m-- Solo CSS y JavaScript vanilla[m
[31m-- React 18 compatible[m
[31m-- React Router v6 compatible[m
[31m-[m
[31m-## 🎓 Aprendizajes Aplicados[m
[31m-[m
[31m-1. **CSS Grid & Flexbox** - Layouts modernos[m
[31m-2. **CSS Variables** - Design system escalable[m
[31m-3. **Semantic HTML** - Mejor accesibilidad[m
[31m-4. **BEM Methodology** - Nomenclatura CSS[m
[31m-5. **Mobile-First** - Responsive design[m
[31m-[m
[31m-## 🔗 Referencias[m
[31m-[m
[31m-- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)[m
[31m-- [React Accessibility](https://react.dev/learn/accessibility)[m
[31m-- [CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)[m
[31m-- [Alkosto.com](https://www.alkosto.com) - Inspiración de diseño[m
[31m-[m
[31m----[m
[31m-[m
[31m-**Fecha de Actualización:** 22 de Octubre, 2025  [m
[31m-**Autor:** Equipo de Desarrollo  [m
[31m-**Versión:** 2.0.0[m
[1mdiff --git a/GUIA_EJECUCION.md b/GUIA_EJECUCION.md[m
[1mdeleted file mode 100644[m
[1mindex 9d18077..0000000[m
[1m--- a/GUIA_EJECUCION.md[m
[1m+++ /dev/null[m
[36m@@ -1,285 +0,0 @@[m
[31m-# 🚀 Guía de Ejecución - Alkosto Clone[m
[31m-[m
[31m-## 📋 Requisitos Previos[m
[31m-[m
[31m-- Node.js (v14 o superior)[m
[31m-- npm (v6 o superior)[m
[31m-- Navegador moderno (Chrome, Firefox, Safari, Edge)[m
[31m-[m
[31m-## 🛠️ Instalación[m
[31m-[m
[31m-### 1. Clonar el repositorio (si aplica)[m
[31m-[m
[31m-```bash[m
[31m-git clone <url-del-repositorio>[m
[31m-cd Frontend_Clone_Alkosto[m
[31m-```[m
[31m-[m
[31m-### 2. Instalar dependencias[m
[31m-[m
[31m-```bash[m
[31m-npm install[m
[31m-```[m
[31m-[m
[31m-Esto instalará:[m
[31m-- React 18.2.0[m
[31m-- React Router DOM 6.20.0[m
[31m-- React Scripts 5.0.1[m
[31m-- Testing Library & Cypress (dev)[m
[31m-[m
[31m-## ▶️ Ejecutar el Proyecto[m
[31m-[m
[31m-### Modo Desarrollo[m
[31m-[m
[31m-```bash[m
[31m-npm start[m
[31m-```[m
[31m-[m
[31m-Esto:[m
[31m-- ✅ Compilará el proyecto en modo desarrollo[m
[31m-- ✅ Abrirá automáticamente `http://localhost:3000`[m
[31m-- ✅ Habilitará hot-reload (recarga automática al guardar)[m
[31m-- ✅ Mostrará errores en la consola del navegador[m
[31m-[m
[31m-**Tiempo estimado de inicio:** 15-30 segundos[m
[31m-[m
[31m-### Modo Producción[m
[31m-[m
[31m-```bash[m
[31m-# 1. Crear build optimizado[m
[31m-npm run build[m
[31m-[m
[31m-# 2. Servir la build (requiere servidor estático)[m
[31m-npx serve -s build[m
[31m-```[m
[31m-[m
[31m-## 🧪 Ejecutar Tests[m
[31m-[m
[31m-### Tests Unitarios[m
[31m-[m
[31m-```bash[m
[31m-npm test[m
[31m-```[m
[31m-[m
[31m-### Tests E2E (Cypress)[m
[31m-[m
[31m-```bash[m
[31m-# Modo interactivo[m
[31m-npx cypress open[m
[31m-[m
[31m-# Modo headless[m
[31m-npx cypress run[m
[31m-```[m
[31m-[m
[31m-## 📱 Acceder a la Aplicación[m
[31m-[m
[31m-Una vez iniciado el servidor de desarrollo:[m
[31m-[m
[31m-### Desde el Navegador Host[m
[31m-[m
[31m-```bash[m
[31m-# Si estás en un contenedor o codespace[m
[31m-$BROWSER http://localhost:3000[m
[31m-```[m
[31m-[m
[31m-### URLs Principales[m
[31m-[m
[31m-- **Home:** `http://localhost:3000/`[m
[31m-- **Búsqueda:** `http://localhost:3000/search?q=laptop`[m
[31m-- **Producto:** `http://localhost:3000/producto/1`[m
[31m-- **Carrito:** `http://localhost:3000/carrito`[m
[31m-- **Registro:** `http://localhost:3000/register`[m
[31m-- **Login:** `http://localhost:3000/login/options`[m
[31m-- **Perfil:** `http://localhost:3000/perfil`[m
[31m-[m
[31m-## 🔍 Verificar que Todo Funciona[m
[31m-[m
[31m-### Checklist Visual[m
[31m-[m
[31m-1. ✅ **Header**[m
[31m-   - Logo de Alkosto visible[m
[31m-   - Barra de búsqueda funcional[m
[31m-   - Menú de cuenta con dropdown[m
[31m-   - Carrito con contador[m
[31m-[m
[31m-2. ✅ **Banner Promocional**[m
[31m-   - Banner naranja superior con promociones[m
[31m-[m
[31m-3. ✅ **Carrusel Hero**[m
[31m-   - 4 slides con imágenes[m
[31m-   - Controles de navegación funcionando[m
[31m-   - Auto-avance cada 5 segundos[m
[31m-   - Indicadores activos[m
[31m-[m
[31m-4. ✅ **Sección de Categorías**[m
[31m-   - Grid con 24 categorías[m
[31m-   - Hover effects[m
[31m-   - Íconos coloridos[m
[31m-[m
[31m-5. ✅ **Banners Promocionales**[m
[31m-   - Banner dual (Tecnología + Hogar)[m
[31m-   - Efectos hover 3D[m
[31m-[m
[31m-6. ✅ **Ofertas del Día**[m
[31m-   - Fondo azul degradado[m
[31m-   - Temporizador funcionando[m
[31m-   - Grid de productos[m
[31m-[m
[31m-7. ✅ **Banner de Envío Gratis**[m
[31m-   - Banner verde full-width[m
[31m-   - CTA destacado[m
[31m-[m
[31m-8. ✅ **Triple Banner**[m
[31m-   - Gaming, Smartphones, Audio[m
[31m-   - Degradados de colores[m
[31m-[m
[31m-9. ✅ **Secciones de Productos**[m
[31m-   - Lo Más Vendido[m
[31m-   - Novedades[m
[31m-   - Destacados[m
[31m-   - Recomendados[m
[31m-[m
[31m-10. ✅ **Beneficios**[m
[31m-    - 4 tarjetas de beneficios[m
[31m-[m
[31m-11. ✅ **Footer**[m
[31m-    - Links organizados por secciones[m
[31m-    - Redes sociales[m
[31m-    - Newsletter[m
[31m-[m
[31m-### Checklist Funcional[m
[31m-[m
[31m-1. ✅ **Navegación**[m
[31m-   - Click en categorías[m
[31m-   - Búsqueda de productos[m
[31m-   - Links del header[m
[31m-[m
[31m-2. ✅ **Productos**[m
[31m-   - Click en tarjeta → ver detalle[m
[31m-   - Agregar al carrito[m
[31m-   - Ver contador actualizado[m
[31m-[m
[31m-3. ✅ **Carrito**[m
[31m-   - Ver productos agregados[m
[31m-   - Aumentar/disminuir cantidad[m
[31m-   - Eliminar productos[m
[31m-   - Calcular total[m
[31m-[m
[31m-4. ✅ **Responsive**[m
[31m-   - Cambiar tamaño de ventana[m
[31m-   - Probar en móvil (F12 → Toggle device)[m
[31m-   - Verificar breakpoints[m
[31m-[m
[31m-5. ✅ **Accesibilidad**[m
[31m-   - Navegar con Tab (ver Skip Link)[m
[31m-   - Enter en Skip Link[m
[31m-   - Focus visible en elementos[m
[31m-[m
[31m-## 🐛 Troubleshooting[m
[31m-[m
[31m-### El servidor no inicia[m
[31m-[m
[31m-```bash[m
[31m-# Limpiar cache de node_modules[m
[31m-rm -rf node_modules package-lock.json[m
[31m-npm install[m
[31m-npm start[m
[31m-```[m
[31m-[m
[31m-### Puerto 3000 ocupado[m
[31m-[m
[31m-```bash[m
[31m-# Cambiar puerto[m
[31m-PORT=3001 npm start[m
[31m-```[m
[31m-[m
[31m-### Errores de compilación[m
[31m-[m
[31m-```bash[m
[31m-# Verificar versión de Node[m
[31m-node --version  # Debe ser v14+[m
[31m-[m
[31m-# Reinstalar react-scripts[m
[31m-npm install react-scripts@5.0.1[m
[31m-```[m
[31m-[m
[31m-### No se ven las imágenes[m
[31m-[m
[31m-- Verificar que `/public/assets/logo-alkosto.svg` existe[m
[31m-- Verificar URLs de imágenes en componentes[m
[31m-- Revisar consola del navegador (F12)[m
[31m-[m
[31m-### CSS no se aplica[m
[31m-[m
[31m-- Hacer hard refresh: `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac)[m
[31m-- Verificar imports de CSS en componentes[m
[31m-- Revisar errores en consola[m
[31m-[m
[31m-## 📊 Monitoreo de Performance[m
[31m-[m
[31m-### Abrir DevTools[m
[31m-[m
[31m-1. Presiona `F12` o `Ctrl + Shift + I`[m
[31m-2. Ve a la pestaña **Network**[m
[31m-3. Recarga la página (`Ctrl + R`)[m
[31m-[m
[31m-### Métricas Esperadas[m
[31m-[m
[31m-- **First Contentful Paint:** < 1.5s[m
[31m-- **Time to Interactive:** < 3s[m
[31m-- **Bundle Size:** ~450KB (sin gzip)[m
[31m-- **Requests:** ~10-15 inicial[m
[31m-[m
[31m-### Lighthouse Audit[m
[31m-[m
[31m-1. Abre DevTools (`F12`)[m
[31m-2. Ve a pestaña **Lighthouse**[m
[31m-3. Click en "Generate report"[m
[31m-[m
[31m-**Scores Esperados:**[m
[31m-- Performance: 85-95[m
[31m-- Accessibility: 90-95[m
[31m-- Best Practices: 90-95[m
[31m-- SEO: 85-90[m
[31m-[m
[31m-## 🔥 Tips para Desarrollo[m
[31m-[m
[31m-### Hot Reload[m
[31m-[m
[31m-Los cambios en archivos `.js` y `.css` se reflejan automáticamente sin recargar la página completa.[m
[31m-[m
[31m-### Console Logs[m
[31m-[m
[31m-Usa `console.log()` para debugging:[m
[31m-[m
[31m-```javascript[m
[31m-console.log('Producto agregado:', product);[m
[31m-```[m
[31m-[m
[31m-### React DevTools[m
[31m-[m
[31m-Instala la extensión [React Developer Tools](https://react.dev/learn/react-developer-tools) para inspeccionar componentes.[m
[31m-[m
[31m-### Shortcuts Útiles[m
[31m-[m
[31m-- `Ctrl + C` en terminal → Detener servidor[m
[31m-- `Ctrl + Shift + R` → Hard refresh[m
[31m-- `Ctrl + Shift + I` → Abrir DevTools[m
[31m-- `Ctrl + K` → Limpiar consola[m
[31m-[m
[31m-## 📞 Soporte[m
[31m-[m
[31m-Si encuentras problemas:[m
[31m-[m
[31m-1. Revisa la consola del navegador (F12)[m
[31m-2. Revisa la terminal donde corre `npm start`[m
[31m-3. Consulta [React Docs](https://react.dev)[m
[31m-4. Revisa los issues del proyecto[m
[31m-[m
[31m-## 🎉 ¡Listo![m
[31m-[m
[31m-Tu clon de Alkosto debería estar funcionando perfectamente. Explora todas las funcionalidades y disfruta del desarrollo.[m
[31m-[m
[31m----[m
[31m-[m
[31m-**Última actualización:** 22 de Octubre, 2025[m
[1mdiff --git a/README.md b/README.md[m
[1mindex b5b2cc7..bf2a505 100644[m
[1m--- a/README.md[m
[1m+++ b/README.md[m
[36m@@ -68,11 +68,6 @@[m [mnpm start[m
 [m
 El frontend estará disponible en `http://localhost:3000`[m
 [m
[31m-### Rutas relevantes[m
[31m-[m
[31m-- `/perfil/mi-cuenta` Vista de "Mi cuenta" del usuario (dashboard con accesos rápidos)[m
[31m-- `/perfil` Favoritos del usuario[m
[31m-[m
 ## 🎨 Patrón de Diseño MVC[m
 [m
 ### Models (Modelos)[m
[1mdiff --git a/cypress/e2e/RF01_Register_E2E.cy.js b/cypress/e2e/RF01_Register_E2E.cy.js[m
[1mdeleted file mode 100644[m
[1mindex fc40e64..0000000[m
[1m--- a/cypress/e2e/RF01_Register_E2E.cy.js[m
[1m+++ /dev/null[m
[36m@@ -1,520 +0,0 @@[m
[31m-/**[m
[31m- * RF01 - REGISTRAR USUARIO[m
[31m- * Pruebas End-to-End con Cypress - SWEBOK Capítulo 5[m
[31m- * [m
[31m- * Estas pruebas verifican el flujo completo desde la perspectiva del usuario:[m
[31m- * - Interacciones reales con la UI[m
[31m- * - Navegación entre páginas[m
[31m- * - Validaciones visuales[m
[31m- * - Persistencia de datos[m
[31m- * - Comportamiento del navegador[m
[31m- */[m
[31m-[m
[31m-describe('RF01 - REGISTRAR USUARIO - Pruebas E2E Completas', () => {[m
[31m-  [m
[31m-  beforeEach(() => {[m
[31m-    // Limpiar localStorage antes de cada prueba[m
[31m-    cy.clearLocalStorage();[m
[31m-    cy.clearCookies();[m
[31m-  });[m
[31m-[m
[31m-  // ========================================[m
[31m-  // SECCIÓN 1: CASO FELIZ (HAPPY PATH)[m
[31m-  // ========================================[m
[31m-  describe('1. Flujo Completo de Registro Exitoso', () => {[m
[31m-    [m
[31m-