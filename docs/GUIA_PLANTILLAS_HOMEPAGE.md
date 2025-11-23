# 📘 Guía de Uso - Sistema de Plantillas para Homepage

**Versión:** 1.1 (Actualizada - Sistema Funcional)  
**Fecha:** 23 de noviembre de 2025  
**Estado:** ✅ **SISTEMA CORREGIDO Y FUNCIONAL**

---

## 🎯 Actualización Importante

**El sistema de plantillas ha sido corregido y ahora funciona correctamente.**

### ¿Qué se corrigió?

**ANTES:** `Home.js` siempre renderizaba el banner Black Days sin importar la configuración.

**AHORA:** El cambio de `ACTIVE_TEMPLATE` en `homeTemplates.js` **realmente cambia** el diseño de la homepage.

### Cambios implementados:
- ✅ Renderizado condicional en `Home.js` basado en `activeTemplate.layout`
- ✅ `BlackDaysBanner` usa configuración dinámica de `homeTemplates.js`
- ✅ Tests completos (20 tests pasando)
- ✅ Script de cambio rápido entre plantillas

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Plantillas Disponibles](#plantillas-disponibles)
3. [Cómo Cambiar de Plantilla](#cómo-cambiar-de-plantilla)
4. [Personalizar Plantillas](#personalizar-plantillas)
5. [Crear Nueva Plantilla](#crear-nueva-plantilla)
6. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 🎯 Introducción

El sistema de plantillas permite cambiar el diseño de la página principal (Home) de forma rápida y sencilla, sin necesidad de modificar múltiples archivos. Simplemente cambia una variable y toda la homepage se adapta al nuevo diseño.

**Beneficios:**
- ✅ Cambio de diseño en **un solo archivo**
- ✅ Múltiples diseños para diferentes campañas
- ✅ Fácil de mantener y extender
- ✅ No requiere conocimientos técnicos avanzados

---

## 🎨 Plantillas Disponibles

### 1. **plant_general** (Plantilla General)

**Descripción:** Diseño estándar de e-commerce con carrusel de banners y categorías.

**Características:**
- Carrusel de imágenes en la parte superior izquierda
- Sección de categorías a la derecha del carrusel
- Layout de dos columnas (50% - 50%)
- Ideal para operación diaria sin campañas especiales

**Vista previa:**
```
┌─────────────┬─────────────┐
│  CARRUSEL   │ CATEGORÍAS  │
│  (Banners)  │  (Grid)     │
└─────────────┴─────────────┘
     OFERTAS DEL DÍA
     PRODUCTOS DESTACADOS
     ...
```

---

### 2. **plant_blackdays** (Plantilla Black Days)

**Descripción:** Diseño especial para campaña Black Days con impacto visual.

**Características:**
- Banner promocional de ancho completo
- Sin carrusel (más impacto, menos distracción)
- Categorías debajo del banner
- Colores oscuros con acentos naranjas
- Optimizado para conversión de ofertas

**Vista previa:**
```
┌─────────────────────────────────┐
│   BANNER BLACK DAYS             │
│   (Imagen + Logo + CTA)         │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│   CATEGORÍAS                    │
│   (Grid completo)               │
└─────────────────────────────────┘
     OFERTAS DEL DÍA
     PRODUCTOS DESTACADOS
     ...
```

---

## 🔧 Cómo Cambiar de Plantilla

### Método Simple (Recomendado)

**Paso 1:** Abre el archivo de configuración:
```
src/config/homeTemplates.js
```

**Paso 2:** Encuentra la línea que dice `ACTIVE_TEMPLATE`:
```javascript
export const ACTIVE_TEMPLATE = 'plant_blackdays'; // ← Línea 20
```

**Paso 3:** Cambia el valor según la plantilla deseada:
```javascript
// Para usar la plantilla general
export const ACTIVE_TEMPLATE = 'plant_general';

// Para usar la plantilla Black Days
export const ACTIVE_TEMPLATE = 'plant_blackdays';
```

**Paso 4:** Guarda el archivo (Ctrl+S / Cmd+S)

**Paso 5:** La página se recargará automáticamente mostrando la nueva plantilla.

---

## ⚙️ Personalizar Plantillas

### Cambiar Imágenes del Carrusel (plant_general)

Edita el archivo `src/config/homeTemplates.js` en la sección `plant_general`:

```javascript
carousel: {
  slides: [
    {
      image: 'TU_IMAGEN_1.jpg',          // ← Cambia la URL
      title: 'Tu Título Aquí',           // ← Cambia el título
      description: 'Tu descripción',     // ← Cambia la descripción
      buttonText: 'Ver Más',             // ← Texto del botón
      link: '/tu-enlace'                 // ← Enlace de destino
    },
    // ... más slides
  ],
  autoplay: true,
  interval: 5000, // Tiempo en milisegundos entre slides
}
```

### Cambiar Textos del Banner Black Days (plant_blackdays)

Edita el archivo `src/config/homeTemplates.js` en la sección `plant_blackdays`:

```javascript
banner: {
  title: '¡Tu nuevo título aquí!',                // ← Cambia el título principal
  description: 'Tu descripción personalizada',    // ← Cambia la descripción
  ctaText: 'Tu botón personalizado',              // ← Texto del botón
  ctaLink: '/tu-enlace',                          // ← Enlace del botón
  
  // Cambiar colores de la campaña
  colors: {
    primary: '#FF6B35',       // Color principal (naranja)
    secondary: '#FF8C5A',     // Color secundario
    background: '#1a1a1a',    // Color de fondo
    text: '#ffffff',          // Color del texto
  },
}
```

### Cambiar Imagen del Banner Black Days

**Opción 1:** Usar imagen local
1. Coloca tu imagen en: `public/assets/black-days-person.jpg`
2. La plantilla la detectará automáticamente

**Opción 2:** Usar imagen externa
```javascript
banner: {
  // ... otras propiedades
  image: 'https://tu-sitio.com/tu-imagen.jpg',
  imageFallback: 'https://url-backup.com/imagen.jpg', // Imagen de respaldo
}
```

---

## 🆕 Crear Nueva Plantilla

### Ejemplo: Plantilla de Navidad

**Paso 1:** Abre `src/config/homeTemplates.js`

**Paso 2:** Agrega tu nueva plantilla al objeto `HOME_TEMPLATES`:

```javascript
plant_navidad: {
  id: 'plant_navidad',
  name: 'Plantilla Navidad',
  description: 'Diseño festivo para temporada navideña',
  enabled: true, // ← Importante: activar la plantilla
  
  layout: {
    type: 'banner_fullwidth', // Tipo de layout
    showCarousel: false,
    showBanner: true,
    categoriesPosition: 'below',
  },
  
  banner: {
    type: 'ChristmasBanner', // ← Nombre del componente (créalo si no existe)
    title: '🎄 ¡Feliz Navidad! 🎁',
    description: 'Encuentra los mejores regalos para tus seres queridos',
    ctaText: 'Ver regalos navideños',
    ctaLink: '/categoria/navidad',
    
    colors: {
      primary: '#C41E3A',      // Rojo navideño
      secondary: '#00A859',    // Verde navideño
      background: '#0F4D2B',   // Verde oscuro
      text: '#ffffff',
    },
  },
},
```

**Paso 3:** Crea el componente del banner (si usas tipo personalizado):
```bash
src/components/ChristmasBanner/
├── ChristmasBanner.js
└── ChristmasBanner.css
```

**Paso 4:** Actualiza `Home.js` para reconocer el nuevo tipo de banner (opcional):
```javascript
if (layout.type === 'banner_fullwidth') {
  // Renderizar el banner correspondiente según banner.type
  if (activeTemplate.banner.type === 'ChristmasBanner') {
    return (
      <>
        <ChristmasBanner />
        <div className="home-categories-section">
          <CategorySection />
        </div>
      </>
    );
  }
  // ... otros banners
}
```

**Paso 5:** Activa tu plantilla:
```javascript
export const ACTIVE_TEMPLATE = 'plant_navidad';
```

---

## ❓ Preguntas Frecuentes

### ¿Cómo sé qué plantilla está activa?

Abre la consola del navegador (F12) y busca el mensaje:
```
🎨 Plantilla activa: Plantilla Black Days
```

### ¿Puedo tener varias plantillas activas al mismo tiempo?

No. Solo una plantilla puede estar activa a la vez. Sin embargo, puedes cambiar entre ellas rápidamente.

### ¿Qué pasa si la plantilla no existe?

El sistema automáticamente carga `plant_general` como respaldo y muestra una advertencia en consola:
```
⚠️ Plantilla "plant_xyz" no encontrada. Usando plant_general por defecto.
```

### ¿Puedo deshabilitar una plantilla temporalmente?

Sí. En el archivo de configuración, cambia `enabled: true` a `enabled: false`:
```javascript
plant_blackdays: {
  id: 'plant_blackdays',
  name: 'Plantilla Black Days',
  enabled: false, // ← Plantilla deshabilitada
  // ...
}
```

### ¿Los cambios requieren reiniciar el servidor?

No. Los cambios en `homeTemplates.js` se reflejan automáticamente gracias al hot-reload de React.

### ¿Cómo vuelvo al diseño original?

Simplemente cambia a la plantilla general:
```javascript
export const ACTIVE_TEMPLATE = 'plant_general';
```

### ¿Puedo usar plantillas diferentes en diferentes páginas?

Actualmente, el sistema de plantillas solo aplica a la Homepage. Para otras páginas, necesitarías implementar sistemas similares.

### ¿Dónde puedo ver ejemplos de código?

Revisa estos archivos:
- **Configuración:** `src/config/homeTemplates.js`
- **Implementación:** `src/views/Home/Home.js`
- **Componentes:** `src/components/BlackDaysBanner/` y `src/components/Carousel/`

---

## 📚 Recursos Adicionales

### Archivos Relacionados

```
src/
├── config/
│   └── homeTemplates.js          ← Configuración principal ⭐
├── views/
│   └── Home/
│       ├── Home.js               ← Lógica de renderizado
│       └── Home.css              ← Estilos base
├── components/
│   ├── BlackDaysBanner/          ← Banner Black Days
│   │   ├── BlackDaysBanner.js
│   │   └── BlackDaysBanner.css
│   └── Carousel/                 ← Carrusel (plant_general)
│       ├── Carousel.js
│       └── Carousel.css
```

### Logs y Documentación

- `Logs/MEJORA_022_BlackDays_Homepage_Redesign.md` - Implementación Black Days
- `docs/GUIA_PLANTILLAS_HOMEPAGE.md` - Esta guía

---

## 🎓 Tutorial Paso a Paso

### Caso de Uso: Activar Black Days el viernes, volver a General el lunes

**Viernes (Inicio de Black Days):**
```javascript
// En src/config/homeTemplates.js
export const ACTIVE_TEMPLATE = 'plant_blackdays';
```

**Lunes (Fin de Black Days):**
```javascript
// En src/config/homeTemplates.js
export const ACTIVE_TEMPLATE = 'plant_general';
```

¡Listo! Solo dos cambios de línea para campañas completas.

---

## 🆘 Soporte

Si tienes problemas o preguntas:

1. **Revisa la consola del navegador** (F12) para mensajes de error
2. **Verifica que la plantilla exista** en `HOME_TEMPLATES`
3. **Asegúrate de que `enabled: true`** en la plantilla deseada
4. **Recarga con caché limpio** (Ctrl+F5 / Cmd+Shift+R)

---

**¡Disfruta del nuevo sistema de plantillas! 🎉**
