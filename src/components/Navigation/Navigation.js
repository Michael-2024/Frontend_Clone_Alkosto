import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [activeTab, setActiveTab] = useState(null);

  const categories = [
    {
      id: 'tecnologia',
      name: 'Tecnología',
      subcategories: [
        { name: 'Celulares', highlight: true },
        { name: 'Computadores' },
        { name: 'Televisores' },
        { name: 'Accesorios de tecnología' },
        { name: 'Audio' },
        { name: 'Consolas y videojuegos' },
        { name: 'Cámaras' },
        { name: 'Casa inteligente' },
        { name: 'Impresoras' },
        { name: 'Monitores' },
        { name: 'Proyectores' },
      ],
      content: {
        title: 'Celulares',
        brands: [
          { name: 'Apple', icon: '🍎' },
          { name: 'Samsung', icon: '📱' },
          { name: 'Motorola', icon: '📲' },
          { name: 'Honor', icon: '🏆' },
          { name: 'Xiaomi', icon: '📳' },
          { name: 'Huawei', icon: '📴' },
          { name: 'Oppo', icon: '📞' },
          { name: 'Vivo', icon: '📟' },
          { name: 'Tecno', icon: '🔋' },
          { name: 'realme', icon: '⚡' },
          { name: 'Poco', icon: '🚀' },
          { name: 'TCL', icon: '📺' }
        ],
        related: [
          'Accesorios para celulares',
          'Seguro gratis para celulares',
          'Plan Retoma'
        ]
      }
    },
    {
      id: 'electrodomesticos',
      name: 'Electrodomésticos',
      subcategories: [
        { name: 'Neveras', highlight: true },
        { name: 'Lavadoras' },
        { name: 'Microondas' },
        { name: 'Estufas y Hornos' },
        { name: 'Licuadoras' },
        { name: 'Cafeteras' },
        { name: 'Aspiradoras' },
        { name: 'Ventiladores' },
        { name: 'Planchas' },
        { name: 'Aires Acondicionados' }
      ],
      content: {
        title: 'Neveras',
        brands: [
          { name: 'Samsung', icon: '❄️' },
          { name: 'LG', icon: '🧊' },
          { name: 'Whirlpool', icon: '🌀' },
          { name: 'Electrolux', icon: '⚡' },
          { name: 'Haceb', icon: '🔷' },
          { name: 'Mabe', icon: '💎' }
        ],
        related: [
          'Neveras side by side',
          'Neveras dos puertas',
          'Minineveras'
        ]
      }
    },
    {
      id: 'llantas-y-vehiculos',
      name: 'Llantas y vehículos',
      subcategories: [
        { name: 'Llantas', highlight: true },
        { name: 'Aceites y lubricantes' },
        { name: 'Baterías' },
        { name: 'Accesorios para auto' },
        { name: 'Herramientas' },
        { name: 'Audio para auto' },
        { name: 'GPS y navegación' },
        { name: 'Limpieza automotriz' }
      ],
      content: {
        title: 'Llantas',
        brands: [
          { name: 'Michelin', icon: '🚗' },
          { name: 'Bridgestone', icon: '🏎️' },
          { name: 'Goodyear', icon: '🛞' },
          { name: 'Continental', icon: '🚙' },
          { name: 'Pirelli', icon: '🏁' },
          { name: 'Hankook', icon: '🚕' }
        ],
        related: [
          'Llantas para camioneta',
          'Llantas deportivas',
          'Servicio de montaje'
        ]
      }
    },
    {
      id: 'muebles-y-colchones',
      name: 'Muebles y colchones',
      subcategories: [
        { name: 'Colchones', highlight: true },
        { name: 'Sofás' },
        { name: 'Camas' },
        { name: 'Mesas' },
        { name: 'Sillas' },
        { name: 'Comedores' },
        { name: 'Closets' },
        { name: 'Escritorios' },
        { name: 'Muebles de TV' }
      ],
      content: {
        title: 'Colchones',
        brands: [
          { name: 'Spring', icon: '🛏️' },
          { name: 'Simmons', icon: '💤' },
          { name: 'Dormiluna', icon: '🌙' },
          { name: 'Paraíso', icon: '☁️' },
          { name: 'Fantasía', icon: '✨' },
          { name: 'Restelite', icon: '⭐' }
        ],
        related: [
          'Colchones ortopédicos',
          'Colchones semidobles',
          'Bases camas'
        ]
      }
    },
    {
      id: 'hogar',
      name: 'Hogar',
      subcategories: [
        { name: 'Decoración', highlight: true },
        { name: 'Cocina' },
        { name: 'Baño' },
        { name: 'Organización' },
        { name: 'Iluminación' },
        { name: 'Textiles' },
        { name: 'Jardín' },
        { name: 'Ferretería' }
      ],
      content: {
        title: 'Decoración',
        brands: [
          { name: 'Home', icon: '🏠' },
          { name: 'Deco', icon: '🎨' },
          { name: 'Living', icon: '🛋️' },
          { name: 'Ambient', icon: '💡' },
          { name: 'Style', icon: '🖼️' },
          { name: 'Cozy', icon: '🕯️' }
        ],
        related: [
          'Cuadros decorativos',
          'Plantas artificiales',
          'Espejos'
        ]
      }
    },
    {
      id: 'juguetes',
      name: 'Juguetes',
      subcategories: [
        { name: 'Juguetes educativos', highlight: true },
        { name: 'Muñecas y figuras' },
        { name: 'Juegos de mesa' },
        { name: 'Vehículos de juguete' },
        { name: 'Peluches' },
        { name: 'Juguetes electrónicos' },
        { name: 'Para exterior' },
        { name: 'Construcción' }
      ],
      content: {
        title: 'Juguetes educativos',
        brands: [
          { name: 'Lego', icon: '🧱' },
          { name: 'Fisher Price', icon: '🎪' },
          { name: 'Mattel', icon: '🎮' },
          { name: 'Hasbro', icon: '🎲' },
          { name: 'Playmobil', icon: '👨‍👩‍👧' },
          { name: 'Hot Wheels', icon: '🏎️' }
        ],
        related: [
          'Juguetes didácticos',
          'Juguetes STEM',
          'Sets de arte'
        ]
      }
    },
    {
      id: 'deportes',
      name: 'Deportes',
      subcategories: [
        { name: 'Fitness y gimnasio', highlight: true },
        { name: 'Ciclismo' },
        { name: 'Camping' },
        { name: 'Natación' },
        { name: 'Fútbol' },
        { name: 'Basketball' },
        { name: 'Tenis' },
        { name: 'Running' },
        { name: 'Deportes extremos' }
      ],
      content: {
        title: 'Fitness y gimnasio',
        brands: [
          { name: 'Nike', icon: '✔️' },
          { name: 'Adidas', icon: '🏃' },
          { name: 'Reebok', icon: '💪' },
          { name: 'Puma', icon: '🐆' },
          { name: 'Under Armour', icon: '⚡' },
          { name: 'Everlast', icon: '🥊' }
        ],
        related: [
          'Pesas y mancuernas',
          'Bandas elásticas',
          'Colchonetas yoga'
        ]
      }
    },
    {
      id: 'pines',
      name: 'Pines',
      subcategories: [
        { name: 'Recargas móviles', highlight: true },
        { name: 'Gift cards' },
        { name: 'Streaming' },
        { name: 'Gaming' },
        { name: 'Software' },
        { name: 'Música' }
      ],
      content: {
        title: 'Recargas móviles',
        brands: [
          { name: 'Claro', icon: '📱' },
          { name: 'Movistar', icon: '📞' },
          { name: 'Tigo', icon: '📲' },
          { name: 'WOM', icon: '📳' },
          { name: 'Virgin', icon: '📴' },
          { name: 'ETB', icon: '☎️' }
        ],
        related: [
          'Recargas todo operador',
          'Paquetes de datos',
          'Netflix gift cards'
        ]
      }
    },
    {
      id: 'gildan',
      name: 'Ropa Gildan',
      subcategories: [
        { name: 'Camisetas', highlight: true },
        { name: 'Sudaderas' },
        { name: 'Polo' },
        { name: 'Tank tops' },
        { name: 'Hoodies' },
        { name: 'Pantalones' }
      ],
      content: {
        title: 'Camisetas',
        brands: [
          { name: 'Gildan', icon: '👕' },
          { name: 'Fruit of Loom', icon: '🍎' },
          { name: 'Hanes', icon: '👔' },
          { name: 'Bella Canvas', icon: '✨' },
          { name: 'Next Level', icon: '🔝' }
        ],
        related: [
          'Camisetas blancas',
          'Camisetas de colores',
          'Paquetes x3'
        ]
      }
    },
    {
      id: 'mercado',
      name: 'Mercado',
      subcategories: [
        { name: 'Frutas y verduras', highlight: true },
        { name: 'Lácteos' },
        { name: 'Carnes y pescados' },
        { name: 'Granos y cereales' },
        { name: 'Panadería' },
        { name: 'Bebidas' },
        { name: 'Snacks' },
        { name: 'Despensa' },
        { name: 'Aseo' }
      ],
      content: {
        title: 'Frutas y verduras',
        brands: [
          { name: 'Frutas frescas', icon: '🍎' },
          { name: 'Verduras', icon: '🥬' },
          { name: 'Orgánicos', icon: '🌱' },
          { name: 'Del campo', icon: '🌾' },
          { name: 'Premium', icon: '⭐' }
        ],
        related: [
          'Frutas de temporada',
          'Verduras orgánicas',
          'Canastas familiares'
        ]
      }
    }
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.megamenu-nav')) {
        setActiveTab(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="megamenu-nav">
      <div className="megamenu-wrapper">
        <div className="megamenu-container-fluid">
          <ul className="megamenu-list">
            {categories.map((category) => (
              <li key={category.id} className="megamenu-item">
                <button
                  className={`megamenu-button ${activeTab === category.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(activeTab === category.id ? null : category.id);
                  }}
                >
                  {category.name}
                </button>

                {activeTab === category.id && (
                  <div className="megamenu-dropdown">
                    {/* Columna izquierda - Subcategorías */}
                    <div className="megamenu-sidebar">
                      {category.subcategories.map((sub, index) => (
                        <a
                          key={index}
                          href="#!"
                          className={`megamenu-sidebar-item ${sub.highlight ? 'highlight' : ''}`}
                          onClick={(e) => e.preventDefault()}
                        >
                          <span>{sub.name || sub}</span>
                          <span className="megamenu-arrow">›</span>
                        </a>
                      ))}
                    </div>

                    {/* Columna derecha - Contenido */}
                    <div className="megamenu-content">
                      {category.content && (
                        <>
                          <div className="megamenu-header">
                            <h3 className="megamenu-title">{category.content.title}</h3>
                            <a href="#!" className="megamenu-view-all" onClick={(e) => e.preventDefault()}>
                              Ver todo →
                            </a>
                          </div>

                          <div className="megamenu-section">
                            <p className="megamenu-section-title">
                              {category.id === 'tecnologia' ? 'Marca' : 
                               category.id === 'mercado' ? 'Categorías' : 'Marcas destacadas'}
                            </p>
                            <div className="megamenu-brands">
                              {category.content.brands.map((brand, index) => (
                                <a
                                  key={index}
                                  href="#!"
                                  className="megamenu-brand-card"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <div className="megamenu-brand-icon">{brand.icon}</div>
                                  <span className="megamenu-brand-name">{brand.name}</span>
                                </a>
                              ))}
                            </div>
                          </div>

                          <div className="megamenu-related">
                            <strong>Productos relacionados:</strong>
                            <div className="megamenu-related-links">
                              {category.content.related.map((item, index) => (
                                <React.Fragment key={index}>
                                  <a href="#!" onClick={(e) => e.preventDefault()}>
                                    {item}
                                  </a>
                                  {index < category.content.related.length - 1 && (
                                    <span className="megamenu-separator">•</span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}

            <li className="megamenu-special">
              <Link to="/ofertas/c/ofertas#megamenuAB" className="megamenu-special-link">
                Navidad
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;