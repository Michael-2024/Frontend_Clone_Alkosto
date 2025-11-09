import React from 'react';
import './CategorySection.css';

const CategorySection = () => {
  const categories = [
    {
      name: 'Celulares',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/agosto-alkosto/home/assets/c-celulares.webp',
      //bgColor: '#E8F5E9',
      link: '/categoria/celulares'
    },
    {
      name: 'Cómputo e Impresión',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/agosto-alkosto/home/assets/c-computadores.webp',
      //bgColor: '#E3F2FD',
      link: '/categoria/computo'
    },
    {
      name: 'Televisores',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/agosto-alkosto/home/assets/c-televisores.webp',
      //bgColor: '#F3E5F5',
      link: '/categoria/televisores'
    },
    {
      name: 'Electro',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/home/categs/c-refrigeracion.webp',
      //bgColor: '#FFF3E0',
      link: '/categoria/electrodomesticos'
    },
    {
      name: 'Llantas',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/agosto-alkosto/home/assets/c-llantas.webp',
      //bgColor: '#ECEFF1',
      link: '/categoria/llantas'
    },
    {
      name: 'Electrohogar',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/agosto-alkosto/home/assets/c-electrohogar.webp',
      //bgColor: '#E0F2F1',
      link: '/categoria/electrohogar'
    },
    {
      name: 'Videojuegos',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/agosto-alkosto/home/assets/c-videojuegos.webp',
      //bgColor: '#E8F5E9',
      link: '/categoria/videojuegos'
    },
    {
      name: 'Colchones',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/agosto-alkosto/home/assets/c-colchones.webp',
      //bgColor: '#E8EAF6',
      link: '/categoria/colchones'
    },
    {
      name: 'Muebles',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/agosto-alkosto/home/assets/c-muebles.webp',
      //bgColor: '#EFEBE9',
      link: '/categoria/muebles'
    },
    {
      name: 'Audio',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/home/categs/c-audifonos.webp',
      //bgColor: '#FFE0E0',
      link: '/categoria/audio'
    },
    {
      name: 'Navidad',
      image: 'https://alkosto-ktronix.sirv.com/Alkosto/Home/navidad-icono.webp',
      //bgColor: '#FFEBEE',
      link: '/categoria/navidad'
    },
    {
      name: 'Zona Gamer',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/setup-gmar/portatiles-gaming-2.webp',
      //bgColor: '#FFF9C4',
      link: '/categoria/gamer'
    },
    {
      name: 'Smartwatch',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/setup-gmar/portatiles-gaming-2.webp',
      //bgColor: '#F1F8E9',
      link: '/categoria/smartwatch'
    },
    {
      name: 'Accesorios',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/home/accesorios.webp',
      //bgColor: '#F5F5F5',
      link: '/categoria/accesorios'
    },
    {
      name: 'Hogar',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2025/abril/header-foto-baterias.webp',
      //bgColor: '#E1F5FE',
      link: '/categoria/hogar'
    },
    {
      name: 'Juguetes',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/home/juguetes-2.webp',
      //bgColor: '#FFF9C4',
      link: '/categoria/juguetes'
    },
    {
      name: 'Deportes',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/agosto-alkosto/home/assets/c-deportes.webp',
      //bgColor: '#E8F5E9',
      link: '/categoria/deportes'
    },
    {
      name: 'Domótica',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/agosto-alkosto/home/c-domotica-2.webp',
      //bgColor: '#E0F7FA',
      link: '/categoria/domotica'
    },
    {
      name: 'Cámaras',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/agosto-alkosto/home/assets/c-camera-2.webp',
      //bgColor: '#FFF3E0',
      link: '/categoria/camaras'
    },
    {
      name: 'Ropa Hogar',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2025/home/ropa-hogar-2.webp',
      //bgColor: '#F3E5F5',
      link: '/categoria/ropa-hogar'
    },
    {
      name: 'Proyectores',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2025/home/proyectores-2.webp',
      //bgColor: '#E8EAF6',
      link: '/categoria/proyectores'
    },
    {
      name: 'Audífonos',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/home/categs/c-audifonos.webp',
      //bgColor: '#FFF8E1',
      link: '/categoria/audifonos'
    },
    {
      name: 'Pines',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/agosto-alkosto/home/assets/c-tarjetas-pines.webp',
      //bgColor: '#FCE4EC',
      link: '/categoria/pines'
    },
    {
      name: 'Hiperofertas',
      image: 'https://media.aws.alkomprar.com/ymarketingcolcomercio/Alkosto/2024/agosto-alkosto/home/assets/c-hiperofertas.webp',
      //bgColor: '#FFF3E0',
      link: '/categoria/hiperofertas',
      highlight: true
    }
  ];

  return (
    <section className="category-section">
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
              <img
                src={category.image}
                alt={category.name}
                className="category-image"
              />
            </div>
            <h3 className="category-name">{category.name}</h3>
          </a>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
