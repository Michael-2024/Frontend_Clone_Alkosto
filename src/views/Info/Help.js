import React from 'react';
import './Info.css';

const Help = () => {
  const faqs = [
    {
      question: '¿Cómo puedo rastrear mi pedido?',
      answer: 'Puedes rastrear tu pedido ingresando a "Sigue tu pedido" en la parte superior de la página. Necesitarás tu número de pedido y documento de identidad.'
    },
    {
      question: '¿Cuáles son los métodos de pago disponibles?',
      answer: 'Aceptamos tarjetas de crédito (Visa, Mastercard, American Express), tarjetas débito, PSE, Daviplata, Nequi y efectivo contra entrega.'
    },
    {
      question: '¿Cuánto tarda en llegar mi pedido?',
      answer: 'El tiempo de entrega varía según la ciudad. En Bogotá, Medellín y Cali, entre 2-4 días hábiles. En otras ciudades, entre 4-8 días hábiles.'
    },
    {
      question: '¿Cómo puedo cambiar o devolver un producto?',
      answer: 'Tienes 30 días calendario desde la fecha de entrega para realizar cambios o devoluciones. El producto debe estar en perfecto estado con su empaque original.'
    },
    {
      question: '¿Ofrecen garantía en los productos?',
      answer: 'Sí, todos nuestros productos cuentan con garantía del fabricante. El tiempo varía según el producto (generalmente entre 6 meses y 2 años).'
    }
  ];

  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="container">
          <h1>❓ Centro de Ayuda</h1>
          <p>Encuentra respuestas a las preguntas más frecuentes</p>
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
                <strong>Horario:</strong>
                Lun - Vie: 8:00 AM - 7:00 PM<br/>
                Sáb: 9:00 AM - 5:00 PM
              </div>
            </div>

            <div className="contact-card">
              <h3>
                <span className="contact-icon">✉️</span>
                Correo Electrónico
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
                <strong>Tiempo de respuesta:</strong>
                24-48 horas hábiles
              </div>
            </div>

            <div className="contact-card">
              <h3>
                <span className="contact-icon">💬</span>
                Chat en Vivo
              </h3>
              <div className="contact-detail">
                <strong>Disponibilidad:</strong>
                Lun - Vie: 8:00 AM - 7:00 PM<br/>
                Sáb: 9:00 AM - 5:00 PM
              </div>
              <div className="contact-detail">
                Haz clic en el botón de chat en la esquina inferior derecha para iniciar una conversación con nuestro equipo.
              </div>
            </div>
          </div>

          <div className="faq-section">
            <h2>Preguntas Frecuentes</h2>
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div className="faq-question">
                  {faq.question}
                  <span>▼</span>
                </div>
                <div className="faq-answer">
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>

          <h2>Otros Recursos</h2>
          <ul>
            <li>Consulta nuestros <a href="/terminos">Términos y Condiciones</a></li>
            <li>Revisa nuestra <a href="/privacidad">Política de Privacidad</a></li>
            <li>Información sobre <a href="/envios">Envíos y Entregas</a></li>
            <li>Políticas de <a href="/cambios">Cambios y Devoluciones</a></li>
            <li>Información de <a href="/garantias">Garantías</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Help;
