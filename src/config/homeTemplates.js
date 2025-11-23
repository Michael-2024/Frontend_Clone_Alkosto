/**
 * Configuración de Plantillas para Homepage
 * 
 * Este archivo define las diferentes plantillas visuales disponibles
 * para la página principal de Alkosto.
 * 
 * Para cambiar la plantilla activa, modifica la variable ACTIVE_TEMPLATE.
 */

// ============================================
// CONFIGURACIÓN PRINCIPAL
// ============================================

/**
 * Plantilla actualmente activa
 * 
 * Opciones disponibles:
 * - 'plant_general': Diseño estándar con carrusel y categorías lado a lado
 * - 'plant_blackdays': Diseño especial para campaña Black Days
 * 
 * 🔧 CAMBIA AQUÍ LA PLANTILLA ACTIVA:
 */
export const ACTIVE_TEMPLATE = 'plant_blackdays'

// ============================================
// DEFINICIÓN DE PLANTILLAS
// ============================================

export const HOME_TEMPLATES = {
  /**
   * PLANTILLA GENERAL (Diseño estándar)
   * 
   * Características:
   * - Carrusel de banners en la parte superior
   * - Sección de categorías al lado del carrusel
   * - Layout de dos columnas (50% carrusel, 50% categorías)
   * - Diseño clásico de e-commerce
   */
  plant_general: {
    id: 'plant_general',
    name: 'Plantilla General',
    description: 'Diseño estándar con carrusel y categorías',
    enabled: true,
    
    // Configuración de layout
    layout: {
      type: 'carousel_sidebar', // Carrusel + sidebar de categorías
      showCarousel: true,
      showBanner: false,
      categoriesPosition: 'sidebar', // 'sidebar' | 'below'
    },
    
    // Configuración del carrusel
    carousel: {
      slides: [
        {
          image: 'https://okdiario.com/img/2024/12/08/iphone-17-1-635x358.jpeg',
          title: '¡Tu nuevo iPhone te espera!',
          description: 'Hasta 50% de descuento en productos seleccionados',
          buttonText: 'Ver Ofertas',
          link: '/ofertas'
        },
        {
          image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1400&h=450&fit=crop',
          title: 'Lo Último en Laptops',
          description: 'Potencia y rendimiento para tu trabajo',
          buttonText: 'Comprar Ahora',
          link: '/categoria/computadores'
        },
        {
          image: 'https://live.mrf.io/statics/i/ps/www.muycomputer.com/wp-content/uploads/2018/07/smartphone.jpg?width=1200&enable=upscale',
          title: 'Smartphones al Mejor Precio',
          description: 'Los modelos más recientes con increíbles descuentos',
          buttonText: 'Explorar',
          link: '/categoria/celulares'
        },
        {
          image: 'https://hiraoka.com.pe/media/mageplaza/blog/post/a/u/audio_premium-parlantes-audifonos-hiraoka.jpg',
          title: 'Audio Premium',
          description: 'Audífonos y parlantes de alta calidad',
          buttonText: 'Descubrir',
          link: '/categoria/audio'
        },
      ],
      autoplay: true,
      interval: 5000, // ms
    },
    
    // Estilos personalizados
    styles: {
      heroSection: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '40px',
      }
    }
  },

  /**
   * PLANTILLA BLACK DAYS (Campaña especial)
   * 
   * Características:
   * - Banner promocional de ancho completo
   * - Sin carrusel (banner estático)
   * - Categorías debajo del banner
   * - Diseño impactante con colores oscuros y naranja
   * - Optimizado para conversión de ofertas
   */
  plant_blackdays: {
    id: 'plant_blackdays',
    name: 'Plantilla Black Days',
    description: 'Diseño especial para campaña Black Days',
    enabled: true,
    
    // Configuración de layout
    layout: {
      type: 'banner_fullwidth', // Banner de ancho completo
      showCarousel: false,
      showBanner: true,
      categoriesPosition: 'below', // Categorías debajo del banner
    },
    
    // Configuración del banner Black Days
    banner: {
      type: 'BlackDaysBanner',
      title: '¡Llegaron los días que esperabas!',
      description: 'Las mejores ofertas del año en tecnología, electrodomésticos, hogar y mucho más.',
      ctaText: 'Ver ofertas Black Days',
      ctaLink: '/ofertas',
      
      // Colores de la campaña
      colors: {
        primary: '#FF6B35',
        secondary: '#FF8C5A',
        background: '#1a1a1a',
        text: '#ffffff',
      },
      
      // Asset de imagen (opcional)
      image: '/assets/black-days-person.jpg',
      imageFallback: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=800&fit=crop',
    },
    
    // Estilos personalizados
    styles: {
      heroSection: {
        display: 'block',
        marginBottom: '0',
      },
      categoriesSection: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '30px 20px',
      }
    }
  },

  // ============================================
  // PLANTILLAS FUTURAS (Deshabilitadas por ahora)
  // ============================================
  
  /**
   * PLANTILLA NAVIDAD (Próximamente)
   * 
   * Descomenta y configura cuando esté lista para usar
   */
  /*
  plant_navidad: {
    id: 'plant_navidad',
    name: 'Plantilla Navidad',
    description: 'Diseño festivo para temporada navideña',
    enabled: false,
    
    layout: {
      type: 'banner_fullwidth',
      showCarousel: false,
      showBanner: true,
      categoriesPosition: 'below',
    },
    
    banner: {
      type: 'ChristmasBanner',
      title: '🎄 ¡Feliz Navidad! 🎁',
      description: 'Encuentra los mejores regalos para tus seres queridos',
      ctaText: 'Ver regalos navideños',
      ctaLink: '/categoria/navidad',
      colors: {
        primary: '#C41E3A',
        secondary: '#00A859',
        background: '#0F4D2B',
        text: '#ffffff',
      },
    },
  },
  */

  /**
   * PLANTILLA CYBER MONDAY (Próximamente)
   */
  /*
  plant_cybermonday: {
    id: 'plant_cybermonday',
    name: 'Plantilla Cyber Monday',
    description: 'Diseño tecnológico para Cyber Monday',
    enabled: false,
    
    layout: {
      type: 'banner_fullwidth',
      showCarousel: false,
      showBanner: true,
      categoriesPosition: 'below',
    },
    
    banner: {
      type: 'CyberMondayBanner',
      title: '⚡ CYBER MONDAY ⚡',
      description: 'Tecnología al mejor precio del año',
      ctaText: 'Ver ofertas tech',
      ctaLink: '/categoria/tecnologia',
      colors: {
        primary: '#00D9FF',
        secondary: '#7000FF',
        background: '#000033',
        text: '#ffffff',
      },
    },
  },
  */
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Obtiene la configuración de la plantilla activa
 * @returns {Object} Configuración de la plantilla activa
 */
export const getActiveTemplate = () => {
  const template = HOME_TEMPLATES[ACTIVE_TEMPLATE];
  
  if (!template) {
    console.warn(`⚠️ Plantilla "${ACTIVE_TEMPLATE}" no encontrada. Usando plant_general por defecto.`);
    return HOME_TEMPLATES.plant_general;
  }
  
  if (!template.enabled) {
    console.warn(`⚠️ Plantilla "${ACTIVE_TEMPLATE}" está deshabilitada. Usando plant_general por defecto.`);
    return HOME_TEMPLATES.plant_general;
  }
  
  return template;
};

/**
 * Obtiene todas las plantillas disponibles (habilitadas)
 * @returns {Array} Lista de plantillas habilitadas
 */
export const getAvailableTemplates = () => {
  return Object.values(HOME_TEMPLATES).filter(template => template.enabled);
};

/**
 * Verifica si una plantilla específica está activa
 * @param {string} templateId - ID de la plantilla a verificar
 * @returns {boolean} true si la plantilla está activa
 */
export const isTemplateActive = (templateId) => {
  return ACTIVE_TEMPLATE === templateId;
};

/**
 * Obtiene el nombre de la plantilla activa
 * @returns {string} Nombre de la plantilla activa
 */
export const getActiveTemplateName = () => {
  const template = getActiveTemplate();
  return template.name;
};

// ============================================
// EXPORTACIÓN POR DEFECTO
// ============================================

export default {
  ACTIVE_TEMPLATE,
  HOME_TEMPLATES,
  getActiveTemplate,
  getAvailableTemplates,
  isTemplateActive,
  getActiveTemplateName,
};
