import React from 'react';
import { Link } from 'react-router-dom';
import { getActiveTemplate } from '../../config/homeTemplates';
import './BlackDaysBanner.css';

/**
 * BlackDaysBanner Component
 * 
 * Banner promocional para Black Days que reemplaza el slider principal.
 * Muestra la campaña de ofertas especiales del evento.
 * Usa la configuración de homeTemplates.js para textos e imágenes.
 */
const BlackDaysBanner = () => {
  const template = getActiveTemplate();
  const bannerConfig = template.banner || {};
  
  const {
    title = '¡Llegaron los días que esperabas!',
    description = 'Las mejores ofertas del año en tecnología, electrodomésticos, hogar y mucho más.',
    ctaText = 'Ver ofertas Black Days',
    ctaLink = '/ofertas',
    image = '/assets/black-days-person.jpg',
    imageFallback = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=800&fit=crop'
  } = bannerConfig;

  return (
    <div className="black-days-banner">
      <div className="black-days-content">
        {/* Sección izquierda con persona */}
        <div className="black-days-left">
          <img 
            src={image} 
            alt="Black Days" 
            className="black-days-person"
            onError={(e) => {
              // Fallback a la imagen configurada si la principal no existe
              e.target.src = imageFallback;
            }}
          />
        </div>

        {/* Sección derecha con texto promocional */}
        <div className="black-days-right">
          <div className="black-days-badge">
            <span className="badge-icon">🛒</span>
            <span className="badge-text">Llegaron los</span>
          </div>
          
          <div className="black-days-logo">
            <span className="black-text">BLACK</span>
            <span className="days-text">DAYS</span>
          </div>
          
          <h1 className="black-days-title">
            {title}
          </h1>
          
          <p className="black-days-description">
            {description}
          </p>
          
          <div className="black-days-cta">
            <Link to={ctaLink} className="btn-black-days">
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlackDaysBanner;
