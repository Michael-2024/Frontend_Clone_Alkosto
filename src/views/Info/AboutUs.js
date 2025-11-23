import React from 'react';
import './Info.css';

const AboutUs = () => {
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="container">
          <h1>🏢 Quiénes Somos</h1>
          <p>Conoce la historia y valores de Alkosto</p>
        </div>
      </div>

      <div className="container">
        <div className="info-content">
          <h2>Nuestra Historia</h2>
          <p>
            Alkosto es una de las cadenas de almacenes más importantes de Colombia, con más de 30 años de experiencia
            ofreciendo productos de calidad a precios competitivos. Nacimos con el objetivo de llevar bienestar
            a los hogares colombianos, ofreciendo una amplia variedad de productos en electrodomésticos, tecnología,
            muebles, vestuario y más.
          </p>

          <h2>Nuestra Misión</h2>
          <p>
            Ser el aliado de confianza de las familias colombianas, brindando productos de calidad, precios justos
            y un servicio excepcional que mejore la calidad de vida de nuestros clientes.
          </p>

          <h2>Nuestra Visión</h2>
          <p>
            Consolidarnos como la cadena retail líder en Colombia, reconocidos por nuestra innovación, compromiso
            con la sostenibilidad y excelencia en el servicio al cliente.
          </p>

          <h2>Nuestros Valores</h2>
          <div className="services-grid">
            <div className="service-item">
              <span className="service-icon">🤝</span>
              <h3>Compromiso</h3>
              <p>Con nuestros clientes, colaboradores y comunidad</p>
            </div>
            <div className="service-item">
              <span className="service-icon">⭐</span>
              <h3>Excelencia</h3>
              <p>En cada producto y servicio que ofrecemos</p>
            </div>
            <div className="service-item">
              <span className="service-icon">🌱</span>
              <h3>Sostenibilidad</h3>
              <p>Cuidamos el medio ambiente y la sociedad</p>
            </div>
            <div className="service-item">
              <span className="service-icon">💡</span>
              <h3>Innovación</h3>
              <p>Siempre buscando nuevas formas de servir mejor</p>
            </div>
          </div>

          <h2>Nuestras Cifras</h2>
          <ul>
            <li>Más de 30 años de experiencia</li>
            <li>15 tiendas a nivel nacional</li>
            <li>Más de 3,000 colaboradores</li>
            <li>Más de 50,000 productos en catálogo</li>
            <li>Presencia en las principales ciudades de Colombia</li>
          </ul>

          <h2>Premios y Reconocimientos</h2>
          <ul>
            <li>🏆 Mejor cadena retail 2024 - Revista Semana</li>
            <li>⭐ Top of Mind en electrodomésticos</li>
            <li>🌟 Certificación ISO 9001 en calidad de servicio</li>
            <li>💚 Reconocimiento a prácticas sostenibles</li>
          </ul>

          <h2>Compromiso Social</h2>
          <p>
            En Alkosto creemos en el poder transformador del comercio responsable. Por eso, trabajamos activamente
            en programas de responsabilidad social que incluyen:
          </p>
          <ul>
            <li>Apoyo a comunidades vulnerables</li>
            <li>Programas de inclusión laboral</li>
            <li>Educación financiera para nuestros clientes</li>
            <li>Iniciativas de sostenibilidad ambiental</li>
            <li>Apoyo a emprendedores colombianos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
