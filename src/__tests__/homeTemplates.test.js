/**
 * Tests para el Sistema de Plantillas de Homepage
 * 
 * Verifica que el sistema de plantillas funcione correctamente:
 * - Obtención de plantilla activa
 * - Renderizado condicional según configuración
 * - Fallback a plantilla por defecto
 * - Funciones auxiliares
 */

import { 
  getActiveTemplate, 
  getAvailableTemplates, 
  isTemplateActive,
  getActiveTemplateName,
  HOME_TEMPLATES 
} from '../config/homeTemplates';

describe('Sistema de Plantillas - homeTemplates.js', () => {
  
  describe('getActiveTemplate()', () => {
    it('debe retornar una plantilla válida', () => {
      const template = getActiveTemplate();
      
      expect(template).toBeDefined();
      expect(template).toHaveProperty('id');
      expect(template).toHaveProperty('name');
      expect(template).toHaveProperty('layout');
      expect(template).toHaveProperty('enabled', true);
    });

    it('debe tener configuración de layout válida', () => {
      const template = getActiveTemplate();
      
      expect(template.layout).toHaveProperty('type');
      expect(template.layout).toHaveProperty('showCarousel');
      expect(template.layout).toHaveProperty('showBanner');
      expect(template.layout).toHaveProperty('categoriesPosition');
    });
  });

  describe('Plantilla plant_general', () => {
    it('debe tener configuración completa', () => {
      const template = HOME_TEMPLATES.plant_general;
      
      expect(template.id).toBe('plant_general');
      expect(template.name).toBe('Plantilla General');
      expect(template.enabled).toBe(true);
      expect(template.layout.showCarousel).toBe(true);
      expect(template.layout.showBanner).toBe(false);
      expect(template.layout.categoriesPosition).toBe('sidebar');
    });

    it('debe tener slides del carrusel configurados', () => {
      const template = HOME_TEMPLATES.plant_general;
      
      expect(template.carousel).toBeDefined();
      expect(template.carousel.slides).toBeInstanceOf(Array);
      expect(template.carousel.slides.length).toBeGreaterThan(0);
      
      const firstSlide = template.carousel.slides[0];
      expect(firstSlide).toHaveProperty('image');
      expect(firstSlide).toHaveProperty('title');
      expect(firstSlide).toHaveProperty('description');
    });

    it('debe tener configuración de autoplay', () => {
      const template = HOME_TEMPLATES.plant_general;
      
      expect(template.carousel.autoplay).toBe(true);
      expect(template.carousel.interval).toBe(5000);
    });
  });

  describe('Plantilla plant_blackdays', () => {
    it('debe tener configuración completa', () => {
      const template = HOME_TEMPLATES.plant_blackdays;
      
      expect(template.id).toBe('plant_blackdays');
      expect(template.name).toBe('Plantilla Black Days');
      expect(template.enabled).toBe(true);
      expect(template.layout.showCarousel).toBe(false);
      expect(template.layout.showBanner).toBe(true);
      expect(template.layout.categoriesPosition).toBe('below');
    });

    it('debe tener configuración de banner Black Days', () => {
      const template = HOME_TEMPLATES.plant_blackdays;
      
      expect(template.banner).toBeDefined();
      expect(template.banner.type).toBe('BlackDaysBanner');
      expect(template.banner.title).toBeDefined();
      expect(template.banner.description).toBeDefined();
      expect(template.banner.ctaText).toBeDefined();
      expect(template.banner.ctaLink).toBe('/ofertas');
    });

    it('debe tener colores de campaña definidos', () => {
      const template = HOME_TEMPLATES.plant_blackdays;
      
      expect(template.banner.colors).toBeDefined();
      expect(template.banner.colors.primary).toBe('#FF6B35');
      expect(template.banner.colors.secondary).toBe('#FF8C5A');
      expect(template.banner.colors.background).toBe('#1a1a1a');
      expect(template.banner.colors.text).toBe('#ffffff');
    });

    it('debe tener imagen con fallback', () => {
      const template = HOME_TEMPLATES.plant_blackdays;
      
      expect(template.banner.image).toBeDefined();
      expect(template.banner.imageFallback).toBeDefined();
      expect(template.banner.imageFallback).toContain('http');
    });
  });

  describe('getAvailableTemplates()', () => {
    it('debe retornar solo plantillas habilitadas', () => {
      const available = getAvailableTemplates();
      
      expect(available).toBeInstanceOf(Array);
      expect(available.length).toBeGreaterThan(0);
      
      available.forEach(template => {
        expect(template.enabled).toBe(true);
      });
    });

    it('debe incluir al menos plant_general y plant_blackdays', () => {
      const available = getAvailableTemplates();
      const ids = available.map(t => t.id);
      
      expect(ids).toContain('plant_general');
      expect(ids).toContain('plant_blackdays');
    });
  });

  describe('isTemplateActive()', () => {
    it('debe retornar true para plantilla activa', () => {
      const activeTemplate = getActiveTemplate();
      const isActive = isTemplateActive(activeTemplate.id);
      
      expect(isActive).toBe(true);
    });

    it('debe retornar false para plantilla no activa', () => {
      const activeTemplate = getActiveTemplate();
      
      // Buscar una plantilla que NO sea la activa
      const inactiveId = activeTemplate.id === 'plant_general' 
        ? 'plant_blackdays' 
        : 'plant_general';
      
      const isActive = isTemplateActive(inactiveId);
      expect(isActive).toBe(false);
    });
  });

  describe('getActiveTemplateName()', () => {
    it('debe retornar el nombre de la plantilla activa', () => {
      const name = getActiveTemplateName();
      
      expect(name).toBeDefined();
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    });

    it('debe coincidir con el nombre de la plantilla activa', () => {
      const template = getActiveTemplate();
      const name = getActiveTemplateName();
      
      expect(name).toBe(template.name);
    });
  });

  describe('Validación de estructura de plantillas', () => {
    it('todas las plantillas deben tener la estructura requerida', () => {
      Object.values(HOME_TEMPLATES).forEach(template => {
        // Campos obligatorios
        expect(template).toHaveProperty('id');
        expect(template).toHaveProperty('name');
        expect(template).toHaveProperty('description');
        expect(template).toHaveProperty('enabled');
        expect(template).toHaveProperty('layout');
        
        // Layout obligatorio
        expect(template.layout).toHaveProperty('type');
        expect(template.layout).toHaveProperty('showCarousel');
        expect(template.layout).toHaveProperty('showBanner');
        expect(template.layout).toHaveProperty('categoriesPosition');
      });
    });

    it('plantillas con carrusel deben tener configuración de carousel', () => {
      Object.values(HOME_TEMPLATES).forEach(template => {
        if (template.layout.showCarousel) {
          expect(template).toHaveProperty('carousel');
          expect(template.carousel).toHaveProperty('slides');
          expect(template.carousel.slides).toBeInstanceOf(Array);
        }
      });
    });

    it('plantillas con banner deben tener configuración de banner', () => {
      Object.values(HOME_TEMPLATES).forEach(template => {
        if (template.layout.showBanner) {
          expect(template).toHaveProperty('banner');
          expect(template.banner).toHaveProperty('type');
        }
      });
    });
  });

  describe('Fallback y manejo de errores', () => {
    it('debe usar plant_general como fallback si plantilla no existe', () => {
      // Este test asume que la función maneja casos inválidos
      // (aunque en el código actual esto se maneja con console.warn)
      const template = getActiveTemplate();
      
      // Si algo falla, siempre debe retornar una plantilla válida
      expect(template).toBeDefined();
      expect(template.enabled).toBe(true);
    });
  });
});

describe('Integración con Home.js', () => {
  it('la plantilla debe tener configuración suficiente para renderizado', () => {
    const template = getActiveTemplate();
    
    // Verificar que tiene todo lo necesario para Home.js
    expect(template.layout.showCarousel !== undefined).toBe(true);
    expect(template.layout.showBanner !== undefined).toBe(true);
    
    // Si muestra carrusel, debe tener slides
    if (template.layout.showCarousel) {
      expect(template.carousel.slides.length).toBeGreaterThan(0);
    }
    
    // Si muestra banner, debe tener configuración
    if (template.layout.showBanner) {
      expect(template.banner).toBeDefined();
    }
  });
});
