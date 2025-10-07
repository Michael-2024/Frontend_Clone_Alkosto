import React from 'react';
import './CategorySection.css';

const CategorySection = () => {
  const categories = [
    {
      name: 'Celulares',
      icon: '📱',
      bgColor: '#E8F5E9',
      link: '/categoria/celulares'
    },
    {
      name: 'Electro',
      icon: '🔌',
      bgColor: '#FFF3E0',
      link: '/categoria/electrodomesticos'
    },
    {
      name: 'Cómputo e Impresión',
      icon: '💻',
      bgColor: '#E3F2FD',
      link: '/categoria/computo'
    },
    {
      name: 'Televisores',
      icon: '📺',
      bgColor: '#F3E5F5',
      link: '/categoria/televisores'
    },
    {
      name: 'Videojuegos',
      icon: '🎮',
      bgColor: '#E8F5E9',
      link: '/categoria/videojuegos'
    },
    {
      name: 'Zona Gamer',
      icon: '🎯',
      bgColor: '#FFF9C4',
      link: '/categoria/gamer'
    },
    {
      name: 'Audio',
      icon: '�',
      bgColor: '#FFE0E0',
      link: '/categoria/audio'
    },
    {
      name: 'Electrohogar',
      icon: '🏠',
      bgColor: '#E0F2F1',
      link: '/categoria/electrohogar'
    },
    {
      name: 'Pines',
      icon: '🎁',
      bgColor: '#FCE4EC',
      link: '/categoria/pines'
    },
    {
      name: 'Smartwatch',
      icon: '⌚',
      bgColor: '#F1F8E9',
      link: '/categoria/smartwatch'
    },
    {
      name: 'Audífonos',
      icon: '🎧',
      bgColor: '#FFF8E1',
      link: '/categoria/audifonos'
    },
    {
      name: 'Muebles',
      icon: '🛋️',
      bgColor: '#EFEBE9',
      link: '/categoria/muebles'
    },
    {
      name: 'Colchones',
      icon: '🛏️',
      bgColor: '#E8EAF6',
      link: '/categoria/colchones'
    },
    {
      name: 'Domótica',
      icon: '🏡',
      bgColor: '#E0F7FA',
      link: '/categoria/domotica'
    },
    {
      name: 'Juguetes',
      icon: '🧸',
      bgColor: '#FFF9C4',
      link: '/categoria/juguetes'
    },
    {
      name: 'Accesorios',
      icon: '🔧',
      bgColor: '#F5F5F5',
      link: '/categoria/accesorios'
    },
    {
      name: 'Deportes',
      icon: '⚽',
      bgColor: '#E8F5E9',
      link: '/categoria/deportes'
    },
    {
      name: 'Cámaras',
      icon: '📷',
      bgColor: '#FFF3E0',
      link: '/categoria/camaras'
    },
    {
      name: 'Llantas',
      icon: '🚗',
      bgColor: '#ECEFF1',
      link: '/categoria/llantas'
    },
    {
      name: 'Hogar',
      icon: '🏠',
      bgColor: '#E1F5FE',
      link: '/categoria/hogar'
    },
    {
      name: 'Ropa Hogar',
      icon: '🛏️',
      bgColor: '#F3E5F5',
      link: '/categoria/ropa-hogar'
    },
    {
      name: 'Proyectores',
      icon: '📽️',
      bgColor: '#E8EAF6',
      link: '/categoria/proyectores'
    },
    {
      name: 'Navidad',
      icon: '🎄',
      bgColor: '#FFEBEE',
      link: '/categoria/navidad'
    },
    {
      name: 'Hiperofertas',
      icon: '⚡',
      bgColor: '#FFF3E0',
      link: '/categoria/hiperofertas',
      highlight: true
    }
  ];

  return (
    <section className="category-section">
      <div className="container">
        <h2 className="section-title">Compra por categoría</h2>
        <div className="category-grid">
          {categories.map((category, index) => (
            <a 
              key={index} 
              href={category.link} 
              className={`category-card ${category.highlight ? 'highlight' : ''}`}
              onClick={(e) => e.preventDefault()}
            >
              <div 
                className="category-icon-container"
                style={{ backgroundColor: category.bgColor }}
              >
                <span className="category-icon">{category.icon}</span>
              </div>
              <h3 className="category-name">{category.name}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
