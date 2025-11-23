import React from 'react';
import './Info.css';

const Offers = () => {
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="container">
          <h1>🔥 Ofertas del Día</h1>
          <p>Las mejores promociones y descuentos especiales</p>
        </div>
      </div>

      <div className="container">
        <div className="info-content">
          <div className="stores-intro" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <h2 style={{ fontSize: '32px', color: '#ff9a27', marginBottom: '20px' }}>
              ⚡ ¡Ofertas Increíbles Todos los Días!
            </h2>
            <p style={{ fontSize: '18px', marginBottom: '30px' }}>
              Encuentra descuentos de hasta el 70% en tus productos favoritos
            </p>
            <a href="/" className="btn-secondary" style={{ display: 'inline-block', padding: '15px 40px', fontSize: '18px' }}>
              Ver Todas las Ofertas
            </a>
          </div>

          <h2>¿Cómo Funcionan Nuestras Ofertas?</h2>
          <div className="services-grid">
            <div className="service-item">
              <span className="service-icon">⏰</span>
              <h3>Ofertas Relámpago</h3>
              <p>Descuentos especiales por tiempo limitado. ¡No te las pierdas!</p>
            </div>
            <div className="service-item">
              <span className="service-icon">📅</span>
              <h3>Ofertas del Día</h3>
              <p>Nuevas ofertas cada día en diferentes categorías</p>
            </div>
            <div className="service-item">
              <span className="service-icon">🎯</span>
              <h3>Ofertas Personalizadas</h3>
              <p>Descuentos exclusivos basados en tus preferencias</p>
            </div>
            <div className="service-item">
              <span className="service-icon">📢</span>
              <h3>Ofertas Destacadas</h3>
              <p>Los mejores descuentos de la semana</p>
            </div>
          </div>

          <h2>Categorías en Oferta</h2>
          <ul>
            <li>🖥️ <strong>Tecnología:</strong> Computadores, tablets, celulares y accesorios</li>
            <li>📺 <strong>Electrónica:</strong> Televisores, equipos de sonido y cámaras</li>
            <li>🏠 <strong>Electrodomésticos:</strong> Neveras, lavadoras, estufas y más</li>
            <li>🛋️ <strong>Hogar y Muebles:</strong> Muebles, decoración y organización</li>
            <li>👕 <strong>Moda:</strong> Ropa, zapatos y accesorios para toda la familia</li>
            <li>🎮 <strong>Juguetería:</strong> Juguetes, videojuegos y consolas</li>
          </ul>

          <h2>Consejos para Aprovechar las Ofertas</h2>
          <ul>
            <li>✅ Suscríbete a nuestro newsletter para recibir alertas de ofertas</li>
            <li>✅ Síguenos en redes sociales para ofertas exclusivas</li>
            <li>✅ Activa las notificaciones de la app móvil</li>
            <li>✅ Agrega productos a tu lista de favoritos para recibir alertas de precio</li>
            <li>✅ Compra temprano: las ofertas tienen stock limitado</li>
          </ul>

          <h2>Eventos Especiales</h2>
          <div className="services-grid">
            <div className="service-item">
              <span className="service-icon">⚫</span>
              <h3>Black Days</h3>
              <p>Noviembre - Los descuentos más grandes del año</p>
            </div>
            <div className="service-item">
              <span className="service-icon">🎄</span>
              <h3>Navidad</h3>
              <p>Diciembre - Ofertas especiales de temporada</p>
            </div>
            <div className="service-item">
              <span className="service-icon">🎒</span>
              <h3>Regreso a Clases</h3>
              <p>Enero - Todo para el regreso al colegio</p>
            </div>
            <div className="service-item">
              <span className="service-icon">❤️</span>
              <h3>Amor y Amistad</h3>
              <p>Septiembre - Regalos con descuento</p>
            </div>
          </div>

          <div className="contact-cards">
            <div className="contact-card">
              <h3>
                <span className="contact-icon">🔔</span>
                No te Pierdas Ninguna Oferta
              </h3>
              <div className="contact-detail">
                <p>Suscríbete a nuestro newsletter y recibe alertas de las mejores ofertas directamente en tu correo.</p>
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

export default Offers;
