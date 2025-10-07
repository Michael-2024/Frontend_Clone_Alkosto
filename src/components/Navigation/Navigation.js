import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [activeTab, setActiveTab] = useState('tecnologia');

  const categories = [
    {
      id: 'tecnologia',
      name: 'Tecnología',
      className: 'cat-tecnologia',
      link: '#tecnologia'
    },
    {
      id: 'electrodomesticos',
      name: 'Electrodomésticos',
      className: 'cat-electrodomesticos',
      link: '#electrodomesticos'
    },
    {
      id: 'llantas-y-vehiculos',
      name: 'Llantas y vehículos',
      className: 'cat-llantas-y-vehiculos',
      link: '#llantas-y-vehiculos'
    },
    {
      id: 'muebles-y-colchones',
      name: 'Muebles y colchones',
      className: 'cat-muebles-y-colchones',
      link: '#muebles-y-colchones'
    },
    {
      id: 'hogar',
      name: 'Hogar',
      className: 'cat-hogar',
      link: '#hogar'
    },
    {
      id: 'juguetes',
      name: 'Juguetes',
      className: 'cat-juguetes',
      link: '#juguetes'
    },
    {
      id: 'deportes',
      name: 'Deportes',
      className: 'cat-deportes',
      link: '#deportes'
    },
    {
      id: 'pines',
      name: 'Pines',
      className: 'cat-pines',
      link: '#pines'
    },
    {
      id: 'gildan',
      name: 'Ropa Gildan',
      className: 'cat-gildan',
      link: '#gildan'
    },
    {
      id: 'mercado',
      name: 'Mercado',
      className: 'cat-mercado',
      link: '#mercado'
    }
  ];

  return (
    <nav className="megamenu-position">
      <div className="cont-megamenu">
        <div className="container-fluid-k">
          <ul id="megamenu-container" className="d-md-flex megamenu-container">
            {categories.map((category) => (
              <li 
                key={category.id}
                className={`${category.className} ${activeTab === category.id ? 'active' : ''}`}
              >
                <a
                  data-toggle="tab"
                  className="category"
                  href={category.link}
                  aria-expanded={activeTab === category.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(category.id);
                  }}
                >
                  {category.name}
                </a>
              </li>
            ))}
            <li className="hiperofertas-menu">
              <Link to="/ofertas/c/ofertas#megamenuAB">
                Hiperofertas
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
