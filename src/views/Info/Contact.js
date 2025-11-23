import React from 'react';
import './Info.css';

const Contact = () => {
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="container">
          <h1>📞 Contáctanos</h1>
          <p>Estamos aquí para ayudarte</p>
        </div>
      </div>

      <div className="container">
        <div className="info-content">
          <div className="contact-cards">
            <div className="contact-card">
              <h3>
                <span className="contact-icon">📞</span>
                Línea de Atención
              </h3>
              <div className="contact-detail">
                <strong>Ventas:</strong>
                (601) 746 8001
              </div>
              <div className="contact-detail">
                <strong>Servicio al Cliente:</strong>
                (601) 407 3033
              </div>
              <div className="contact-detail">
                <strong>WhatsApp:</strong>
                +57 310 123 4567
              </div>
              <div className="contact-detail">
                <strong>Horario:</strong>
                Lun - Vie: 8:00 AM - 7:00 PM<br/>
                Sáb: 9:00 AM - 5:00 PM
              </div>
            </div>

            <div className="contact-card">
              <h3>
                <span className="contact-icon">✉️</span>
                Correos Electrónicos
              </h3>
              <div className="contact-detail">
                <strong>Servicio al Cliente:</strong>
                servicioalcliente@alkosto.com
              </div>
              <div className="contact-detail">
                <strong>Ventas Corporativas:</strong>
                ventascorporativas@alkosto.com
              </div>
              <div className="contact-detail">
                <strong>Devoluciones:</strong>
                devoluciones@alkosto.com
              </div>
              <div className="contact-detail">
                <strong>PQRS:</strong>
                pqrs@alkosto.com
              </div>
            </div>

            <div className="contact-card">
              <h3>
                <span className="contact-icon">🏢</span>
                Oficina Principal
              </h3>
              <div className="contact-detail">
                <strong>Dirección:</strong>
                Calle 80 # 69A - 35<br/>
                Bogotá, Colombia
              </div>
              <div className="contact-detail">
                <strong>Horario:</strong>
                Lun - Vie: 8:00 AM - 6:00 PM
              </div>
            </div>
          </div>

          <h2>Envíanos un Mensaje</h2>
          <form className="contact-form" style={{ marginTop: '30px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Nombre *</label>
                <input type="text" placeholder="Tu nombre completo" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px' }} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email *</label>
                <input type="email" placeholder="tu@email.com" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px' }} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Teléfono</label>
                <input type="tel" placeholder="310 123 4567" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Asunto *</label>
                <select style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px' }} required>
                  <option value="">Selecciona un asunto</option>
                  <option value="ventas">Consulta de Ventas</option>
                  <option value="servicio">Servicio al Cliente</option>
                  <option value="devolucion">Devolución</option>
                  <option value="garantia">Garantía</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Mensaje *</label>
              <textarea placeholder="Escribe tu mensaje aquí..." rows="6" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', resize: 'vertical' }} required></textarea>
            </div>
            <button type="submit" className="btn-secondary" style={{ width: '100%', padding: '15px' }}>
              Enviar Mensaje
            </button>
          </form>

          <h2>Síguenos en Redes Sociales</h2>
          <div className="services-grid">
            <div className="service-item">
              <span className="service-icon">📘</span>
              <h3>Facebook</h3>
              <p>@AlkostoOficial</p>
            </div>
            <div className="service-item">
              <span className="service-icon">📷</span>
              <h3>Instagram</h3>
              <p>@alkosto</p>
            </div>
            <div className="service-item">
              <span className="service-icon">🐦</span>
              <h3>Twitter</h3>
              <p>@Alkosto</p>
            </div>
            <div className="service-item">
              <span className="service-icon">📺</span>
              <h3>YouTube</h3>
              <p>Alkosto Colombia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
