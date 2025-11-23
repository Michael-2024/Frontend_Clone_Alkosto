import React from 'react';
import './Info.css';

const Catalog = () => {
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="container">
          <h1>📖 Catálogo de Productos</h1>
          <p>Descarga nuestros catálogos digitales</p>
        </div>
      </div>

      <div className="container">
        <div className="info-content">
          <div className="stores-intro">
            <p style={{ fontSize: '18px', textAlign: 'center' }}>
              Explora nuestros catálogos digitales con las últimas novedades, ofertas y promociones especiales
            </p>
          </div>

          <h2>Catálogos Disponibles</h2>
          <div className="stores-grid">
            <div className="store-card">
              <h3>📱 Catálogo Tecnología</h3>
              <div className="store-details">
                <p>Celulares, tablets, computadores y accesorios tecnológicos</p>
                <p><strong>Vigencia:</strong> Noviembre 2025</p>
                <p><strong>Páginas:</strong> 48</p>
              </div>
              <button className="btn-secondary">Descargar PDF</button>
            </div>

            <div className="store-card">
              <h3>🏠 Catálogo Hogar</h3>
              <div className="store-details">
                <p>Electrodomésticos, muebles y decoración para tu hogar</p>
                <p><strong>Vigencia:</strong> Noviembre 2025</p>
                <p><strong>Páginas:</strong> 64</p>
              </div>
              <button className="btn-secondary">Descargar PDF</button>
            </div>

            <div className="store-card">
              <h3>⚫ Catálogo Black Days</h3>
              <div className="store-details">
                <p>Ofertas especiales del evento más esperado del año</p>
                <p><strong>Vigencia:</strong> Noviembre 2025</p>
                <p><strong>Páginas:</strong> 120</p>
              </div>
              <button className="btn-secondary">Descargar PDF</button>
            </div>

            <div className="store-card">
              <h3>🎄 Catálogo Navidad</h3>
              <div className="store-details">
                <p>Regalos, decoración y ofertas navideñas</p>
                <p><strong>Vigencia:</strong> Diciembre 2025</p>
                <p><strong>Páginas:</strong> 56</p>
              </div>
              <button className="btn-secondary">Descargar PDF</button>
            </div>

            <div className="store-card">
              <h3>👕 Catálogo Moda</h3>
              <div className="store-details">
                <p>Ropa, calzado y accesorios para toda la familia</p>
                <p><strong>Vigencia:</strong> Noviembre 2025</p>
                <p><strong>Páginas:</strong> 40</p>
              </div>
              <button className="btn-secondary">Descargar PDF</button>
            </div>

            <div className="store-card">
              <h3>🎮 Catálogo Juguetería</h3>
              <div className="store-details">
                <p>Juguetes, videojuegos y entretenimiento</p>
                <p><strong>Vigencia:</strong> Noviembre 2025</p>
                <p><strong>Páginas:</strong> 36</p>
              </div>
              <button className="btn-secondary">Descargar PDF</button>
            </div>
          </div>

          <h2>Ventajas de Nuestros Catálogos</h2>
          <div className="services-grid">
            <div className="service-item">
              <span className="service-icon">📱</span>
              <h3>Formato Digital</h3>
              <p>Accede desde cualquier dispositivo, en cualquier momento</p>
            </div>
            <div className="service-item">
              <span className="service-icon">🔍</span>
              <h3>Fácil Búsqueda</h3>
              <p>Encuentra rápidamente lo que buscas</p>
            </div>
            <div className="service-item">
              <span className="service-icon">💰</span>
              <h3>Precios Actualizados</h3>
              <p>Todos los precios y ofertas vigentes</p>
            </div>
            <div className="service-item">
              <span className="service-icon">🛒</span>
              <h3>Compra Directa</h3>
              <p>Enlaces para comprar en línea fácilmente</p>
            </div>
          </div>

          <h2>¿Cómo Usar los Catálogos?</h2>
          <ul>
            <li>Descarga el catálogo de tu categoría favorita</li>
            <li>Explora los productos y ofertas disponibles</li>
            <li>Anota los códigos de producto que te interesen</li>
            <li>Visita nuestra tienda online o física con los códigos</li>
            <li>¡Realiza tu compra y disfruta de nuestras ofertas!</li>
          </ul>

          <div className="contact-cards">
            <div className="contact-card">
              <h3>
                <span className="contact-icon">📧</span>
                Recibe Nuestros Catálogos
              </h3>
              <div className="contact-detail">
                <p>Suscríbete para recibir nuestros nuevos catálogos directamente en tu correo electrónico.</p>
                <form className="newsletter-form" style={{ marginTop: '20px' }}>
                  <input type="email" placeholder="Tu correo electrónico" style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', width: '100%', marginBottom: '10px' }} />
                  <button type="submit" className="btn-secondary" style={{ width: '100%' }}>Suscribirme</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
