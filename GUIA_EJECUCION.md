# 🚀 Guía de Ejecución - Alkosto Clone

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- npm (v6 o superior)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

## 🛠️ Instalación

### 1. Clonar el repositorio (si aplica)

```bash
git clone <url-del-repositorio>
cd Frontend_Clone_Alkosto
```

### 2. Instalar dependencias

```bash
npm install
```

Esto instalará:
- React 18.2.0
- React Router DOM 6.20.0
- React Scripts 5.0.1
- Testing Library & Cypress (dev)

## ▶️ Ejecutar el Proyecto

### Modo Desarrollo

```bash
npm start
```

Esto:
- ✅ Compilará el proyecto en modo desarrollo
- ✅ Abrirá automáticamente `http://localhost:3000`
- ✅ Habilitará hot-reload (recarga automática al guardar)
- ✅ Mostrará errores en la consola del navegador

**Tiempo estimado de inicio:** 15-30 segundos

### Modo Producción

```bash
# 1. Crear build optimizado
npm run build

# 2. Servir la build (requiere servidor estático)
npx serve -s build
```

## 🧪 Ejecutar Tests

### Tests Unitarios

```bash
npm test
```

### Tests E2E (Cypress)

```bash
# Modo interactivo
npx cypress open

# Modo headless
npx cypress run
```

## 📱 Acceder a la Aplicación

Una vez iniciado el servidor de desarrollo:

### Desde el Navegador Host

```bash
# Si estás en un contenedor o codespace
$BROWSER http://localhost:3000
```

### URLs Principales

- **Home:** `http://localhost:3000/`
- **Búsqueda:** `http://localhost:3000/search?q=laptop`
- **Producto:** `http://localhost:3000/producto/1`
- **Carrito:** `http://localhost:3000/carrito`
- **Registro:** `http://localhost:3000/register`
- **Login:** `http://localhost:3000/login/options`
- **Perfil:** `http://localhost:3000/perfil`

## 🔍 Verificar que Todo Funciona

### Checklist Visual

1. ✅ **Header**
   - Logo de Alkosto visible
   - Barra de búsqueda funcional
   - Menú de cuenta con dropdown
   - Carrito con contador

2. ✅ **Banner Promocional**
   - Banner naranja superior con promociones

3. ✅ **Carrusel Hero**
   - 4 slides con imágenes
   - Controles de navegación funcionando
   - Auto-avance cada 5 segundos
   - Indicadores activos

4. ✅ **Sección de Categorías**
   - Grid con 24 categorías
   - Hover effects
   - Íconos coloridos

5. ✅ **Banners Promocionales**
   - Banner dual (Tecnología + Hogar)
   - Efectos hover 3D

6. ✅ **Ofertas del Día**
   - Fondo azul degradado
   - Temporizador funcionando
   - Grid de productos

7. ✅ **Banner de Envío Gratis**
   - Banner verde full-width
   - CTA destacado

8. ✅ **Triple Banner**
   - Gaming, Smartphones, Audio
   - Degradados de colores

9. ✅ **Secciones de Productos**
   - Lo Más Vendido
   - Novedades
   - Destacados
   - Recomendados

10. ✅ **Beneficios**
    - 4 tarjetas de beneficios

11. ✅ **Footer**
    - Links organizados por secciones
    - Redes sociales
    - Newsletter

### Checklist Funcional

1. ✅ **Navegación**
   - Click en categorías
   - Búsqueda de productos
   - Links del header

2. ✅ **Productos**
   - Click en tarjeta → ver detalle
   - Agregar al carrito
   - Ver contador actualizado

3. ✅ **Carrito**
   - Ver productos agregados
   - Aumentar/disminuir cantidad
   - Eliminar productos
   - Calcular total

4. ✅ **Responsive**
   - Cambiar tamaño de ventana
   - Probar en móvil (F12 → Toggle device)
   - Verificar breakpoints

5. ✅ **Accesibilidad**
   - Navegar con Tab (ver Skip Link)
   - Enter en Skip Link
   - Focus visible en elementos

## 🐛 Troubleshooting

### El servidor no inicia

```bash
# Limpiar cache de node_modules
rm -rf node_modules package-lock.json
npm install
npm start
```

### Puerto 3000 ocupado

```bash
# Cambiar puerto
PORT=3001 npm start
```

### Errores de compilación

```bash
# Verificar versión de Node
node --version  # Debe ser v14+

# Reinstalar react-scripts
npm install react-scripts@5.0.1
```

### No se ven las imágenes

- Verificar que `/public/assets/logo-alkosto.svg` existe
- Verificar URLs de imágenes en componentes
- Revisar consola del navegador (F12)

### CSS no se aplica

- Hacer hard refresh: `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac)
- Verificar imports de CSS en componentes
- Revisar errores en consola

## 📊 Monitoreo de Performance

### Abrir DevTools

1. Presiona `F12` o `Ctrl + Shift + I`
2. Ve a la pestaña **Network**
3. Recarga la página (`Ctrl + R`)

### Métricas Esperadas

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Bundle Size:** ~450KB (sin gzip)
- **Requests:** ~10-15 inicial

### Lighthouse Audit

1. Abre DevTools (`F12`)
2. Ve a pestaña **Lighthouse**
3. Click en "Generate report"

**Scores Esperados:**
- Performance: 85-95
- Accessibility: 90-95
- Best Practices: 90-95
- SEO: 85-90

## 🔥 Tips para Desarrollo

### Hot Reload

Los cambios en archivos `.js` y `.css` se reflejan automáticamente sin recargar la página completa.

### Console Logs

Usa `console.log()` para debugging:

```javascript
console.log('Producto agregado:', product);
```

### React DevTools

Instala la extensión [React Developer Tools](https://react.dev/learn/react-developer-tools) para inspeccionar componentes.

### Shortcuts Útiles

- `Ctrl + C` en terminal → Detener servidor
- `Ctrl + Shift + R` → Hard refresh
- `Ctrl + Shift + I` → Abrir DevTools
- `Ctrl + K` → Limpiar consola

## 📞 Soporte

Si encuentras problemas:

1. Revisa la consola del navegador (F12)
2. Revisa la terminal donde corre `npm start`
3. Consulta [React Docs](https://react.dev)
4. Revisa los issues del proyecto

## 🎉 ¡Listo!

Tu clon de Alkosto debería estar funcionando perfectamente. Explora todas las funcionalidades y disfruta del desarrollo.

---

**Última actualización:** 22 de Octubre, 2025
