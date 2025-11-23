import React from 'react';
import './Info.css';

const Careers = () => {
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="container">
          <h1>💼 Trabaja con Nosotros</h1>
          <p>Únete a nuestro equipo y crece profesionalmente</p>
        </div>
      </div>

      <div className="container">
        <div className="info-content">
          <h2>¿Por Qué Trabajar en Alkosto?</h2>
          <p>
            En Alkosto creemos que nuestro mayor activo son nuestros colaboradores. Ofrecemos un ambiente de trabajo
            dinámico, oportunidades de crecimiento y un paquete de beneficios competitivo.
          </p>

          <div className="services-grid">
            <div className="service-item">
              <span className="service-icon">📈</span>
              <h3>Crecimiento Profesional</h3>
              <p>Programas de capacitación y desarrollo de carrera</p>
            </div>
            <div className="service-item">
              <span className="service-icon">💰</span>
              <h3>Beneficios Competitivos</h3>
              <p>Salario justo, bonos y beneficios adicionales</p>
            </div>
            <div className="service-item">
              <span className="service-icon">🤝</span>
              <h3>Buen Ambiente</h3>
              <p>Cultura organizacional positiva y colaborativa</p>
            </div>
            <div className="service-item">
              <span className="service-icon">⚖️</span>
              <h3>Balance Vida-Trabajo</h3>
              <p>Horarios flexibles y días de descanso</p>
            </div>
          </div>

          <h2>Nuestros Beneficios</h2>
          <ul>
            <li>✅ Salario competitivo acorde al mercado</li>
            <li>✅ Bonos por desempeño</li>
            <li>✅ Descuentos especiales en productos</li>
            <li>✅ Seguro médico y de vida</li>
            <li>✅ Auxilio de transporte</li>
            <li>✅ Prima extralegal</li>
            <li>✅ Capacitación continua</li>
            <li>✅ Oportunidades de ascenso</li>
            <li>✅ Días adicionales de descanso</li>
            <li>✅ Actividades de integración</li>
          </ul>

          <h2>Áreas de Oportunidad</h2>
          <div className="stores-grid">
            <div className="store-card">
              <h3>🏪 Ventas y Servicio al Cliente</h3>
              <div className="store-details">
                <p>Asesores comerciales, cajeros, supervisores de piso</p>
                <p><strong>Requisitos:</strong> Bachiller, experiencia en ventas, orientación al cliente</p>
              </div>
            </div>

            <div className="store-card">
              <h3>📦 Logística y Almacén</h3>
              <div className="store-details">
                <p>Operarios de bodega, coordinadores logísticos, conductores</p>
                <p><strong>Requisitos:</strong> Bachiller, experiencia en logística, manejo de montacargas</p>
              </div>
            </div>

            <div className="store-card">
              <h3>💻 Tecnología</h3>
              <div className="store-details">
                <p>Desarrolladores, analistas de datos, soporte técnico</p>
                <p><strong>Requisitos:</strong> Profesional en sistemas, experiencia en desarrollo, conocimientos en tecnologías web</p>
              </div>
            </div>

            <div className="store-card">
              <h3>📊 Administrativo</h3>
              <div className="store-details">
                <p>Contadores, analistas financieros, recursos humanos</p>
                <p><strong>Requisitos:</strong> Profesional, experiencia en el área, conocimientos en software de gestión</p>
              </div>
            </div>

            <div className="store-card">
              <h3>📱 Marketing y Comunicación</h3>
              <div className="store-details">
                <p>Community managers, diseñadores, analistas de marketing</p>
                <p><strong>Requisitos:</strong> Profesional, creatividad, manejo de herramientas digitales</p>
              </div>
            </div>

            <div className="store-card">
              <h3>🔧 Mantenimiento</h3>
              <div className="store-details">
                <p>Técnicos eléctricos, plomeros, personal de aseo</p>
                <p><strong>Requisitos:</strong> Técnico, experiencia en mantenimiento, certificaciones si aplica</p>
              </div>
            </div>
          </div>

          <h2>Proceso de Selección</h2>
          <ul>
            <li><strong>1. Postulación:</strong> Envía tu hoja de vida a través de nuestro portal</li>
            <li><strong>2. Revisión:</strong> Nuestro equipo evaluará tu perfil (3-5 días)</li>
            <li><strong>3. Entrevista inicial:</strong> Llamada o videollamada con RRHH (30 min)</li>
            <li><strong>4. Pruebas:</strong> Evaluaciones técnicas o psicotécnicas según el cargo</li>
            <li><strong>5. Entrevista final:</strong> Con el líder del área</li>
            <li><strong>6. Oferta:</strong> Presentación formal de la oferta laboral</li>
          </ul>

          <h2>¿Cómo Aplicar?</h2>
          <p>Para postularte, envía tu hoja de vida actualizada a:</p>
          <ul>
            <li>📧 Email: trabajo@alkosto.com</li>
            <li>💼 LinkedIn: linkedin.com/company/alkosto</li>
            <li>🌐 Portal de empleos: www.alkosto.com/empleos</li>
          </ul>

          <div className="contact-cards">
            <div className="contact-card">
              <h3>
                <span className="contact-icon">📞</span>
                Información de Empleo
              </h3>
              <div className="contact-detail">
                <strong>Teléfono:</strong>
                (601) 746 8001 opción 5
              </div>
              <div className="contact-detail">
                <strong>Email:</strong>
                trabajo@alkosto.com
              </div>
              <div className="contact-detail">
                <strong>Horario de atención:</strong>
                Lun - Vie: 9:00 AM - 5:00 PM
              </div>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '40px', fontSize: '18px', color: '#004797', fontWeight: 'bold' }}>
            ¡Te esperamos para hacer parte de la familia Alkosto! 🎉
          </p>
        </div>
      </div>
    </div>
  );
};

export default Careers;
