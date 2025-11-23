import React from 'react';
import './Info.css';

const Warranties = () => {
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="container">
          <h1>🛡️ Garantías</h1>
          <p>Información sobre garantías de productos</p>
        </div>
      </div>

      <div className="container">
        <div className="info-content">
          <h2>Garantía de Satisfacción Alkosto</h2>
          <p>
            Todos los productos vendidos por Alkosto cuentan con garantía del fabricante y nuestra garantía de satisfacción.
            Estamos comprometidos con la calidad de nuestros productos y el respaldo postventa.
          </p>

          <h2>Tipos de Garantía</h2>
          
          <h3>Garantía del Fabricante</h3>
          <p>
            Todos nuestros productos cuentan con garantía directa del fabricante. El tiempo de garantía varía según
            el tipo de producto:
          </p>
          <ul>
            <li><strong>Electrodomésticos grandes:</strong> 1 a 2 años</li>
            <li><strong>Electrodomésticos pequeños:</strong> 6 meses a 1 año</li>
            <li><strong>Electrónica (TV, audio, cómputo):</strong> 1 a 2 años</li>
            <li><strong>Celulares y tablets:</strong> 1 año</li>
            <li><strong>Muebles:</strong> 6 meses a 1 año</li>
          </ul>

          <h3>Garantía Extendida (Opcional)</h3>
          <p>
            Puedes adquirir una garantía extendida que amplía el período de cobertura hasta por 3 años adicionales.
            Esta garantía incluye:
          </p>
          <ul>
            <li>Reparaciones por defectos de fabricación</li>
            <li>Reemplazo de piezas</li>
            <li>Mano de obra especializada</li>
            <li>Servicio técnico a domicilio (según producto)</li>
          </ul>

          <h2>¿Qué cubre la garantía?</h2>
          <ul>
            <li>Defectos de fabricación</li>
            <li>Fallas en el funcionamiento normal del producto</li>
            <li>Problemas con componentes originales</li>
            <li>Materiales defectuosos</li>
          </ul>

          <h2>¿Qué NO cubre la garantía?</h2>
          <ul>
            <li>Daños por mal uso o negligencia</li>
            <li>Daños por caídas o golpes</li>
            <li>Exposición a condiciones extremas (humedad, calor excesivo)</li>
            <li>Reparaciones realizadas por personal no autorizado</li>
            <li>Daños estéticos que no afecten el funcionamiento</li>
            <li>Desgaste normal por uso</li>
          </ul>

          <h2>¿Cómo hacer efectiva la garantía?</h2>
          <p><strong>Paso 1:</strong> Ten a mano tu factura de compra y el certificado de garantía</p>
          <p><strong>Paso 2:</strong> Contacta nuestro servicio técnico:</p>
          <ul>
            <li>📞 Línea de garantías: (601) 407 3033 opción 3</li>
            <li>✉️ Email: garantias@alkosto.com</li>
            <li>🏢 Acércate a cualquiera de nuestras tiendas</li>
          </ul>
          <p><strong>Paso 3:</strong> Describe el problema y proporciona los datos del producto</p>
          <p><strong>Paso 4:</strong> Coordinaremos la revisión técnica (a domicilio o en centro de servicio)</p>

          <h2>Tiempos de Respuesta</h2>
          <ul>
            <li><strong>Diagnóstico inicial:</strong> 2-5 días hábiles</li>
            <li><strong>Reparación:</strong> 10-15 días hábiles (según disponibilidad de repuestos)</li>
            <li><strong>Reemplazo:</strong> 5-10 días hábiles (si aplica)</li>
          </ul>

          <div className="contact-cards">
            <div className="contact-card">
              <h3>
                <span className="contact-icon">🔧</span>
                Servicio Técnico
              </h3>
              <div className="contact-detail">
                <strong>Teléfono:</strong>
                (601) 407 3033 opción 3
              </div>
              <div className="contact-detail">
                <strong>Email:</strong>
                garantias@alkosto.com
              </div>
              <div className="contact-detail">
                <strong>Horario:</strong>
                Lun - Vie: 8:00 AM - 6:00 PM
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Warranties;
