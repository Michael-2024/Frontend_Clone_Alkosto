import React from 'react';
import './Info.css';

const Shipping = () => {
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="container">
          <h1>🚚 Información de Envíos</h1>
          <p>Todo lo que necesitas saber sobre nuestros envíos</p>
        </div>
      </div>

      <div className="container">
        <div className="info-content">
          <h2>Cobertura de Envíos</h2>
          <p>
            Realizamos envíos a nivel nacional. Llegamos a todas las ciudades y municipios de Colombia.
          </p>

          <h2>Tiempos de Entrega</h2>
          <p><strong>Ciudades principales (Bogotá, Medellín, Cali, Barranquilla, Cartagena):</strong></p>
          <ul>
            <li>Productos en stock: 2-4 días hábiles</li>
            <li>Electrodomésticos grandes: 3-5 días hábiles</li>
          </ul>

          <p><strong>Otras ciudades y municipios:</strong></p>
          <ul>
            <li>Productos en stock: 4-8 días hábiles</li>
            <li>Electrodomésticos grandes: 5-10 días hábiles</li>
          </ul>

          <h2>Costos de Envío</h2>
          <div className="services-grid">
            <div className="service-item">
              <span className="service-icon">📦</span>
              <h3>Productos Pequeños</h3>
              <p><strong>Gratis</strong> en compras superiores a $100.000</p>
              <p>$15.000 en compras inferiores</p>
            </div>
            <div className="service-item">
              <span className="service-icon">📺</span>
              <h3>Electrónica y Muebles</h3>
              <p><strong>Gratis</strong> en compras superiores a $500.000</p>
              <p>Desde $30.000 en compras inferiores</p>
            </div>
            <div className="service-item">
              <span className="service-icon">🏠</span>
              <h3>Electrodomésticos Grandes</h3>
              <p><strong>Gratis</strong> en compras superiores a $1.000.000</p>
              <p>Desde $50.000 en compras inferiores</p>
            </div>
          </div>

          <h2>Opciones de Entrega</h2>
          
          <h3>🏠 Entrega a Domicilio</h3>
          <ul>
            <li>Recibe tu pedido en la puerta de tu casa</li>
            <li>Coordina la fecha y hora de entrega</li>
            <li>Firma digital de recibido</li>
            <li>Instalación disponible para electrodomésticos (costo adicional)</li>
          </ul>

          <h3>🏪 Recoge en Tienda</h3>
          <ul>
            <li><strong>Totalmente gratis</strong></li>
            <li>Disponible en todas nuestras tiendas</li>
            <li>Tu pedido estará listo en 24-48 horas</li>
            <li>Te notificamos por email y SMS cuando esté listo</li>
          </ul>

          <h2>Rastreo de Pedido</h2>
          <p>
            Una vez despachado tu pedido, recibirás un número de rastreo por email y SMS. 
            Puedes seguir tu envío en tiempo real en nuestra sección de <a href="/seguimiento">Sigue tu Pedido</a>.
          </p>

          <h2>Recomendaciones</h2>
          <ul>
            <li>Verifica que la dirección de entrega esté completa y correcta</li>
            <li>Asegúrate de que alguien esté disponible para recibir el pedido</li>
            <li>Ten a mano tu documento de identidad para la entrega</li>
            <li>Revisa el producto al momento de la entrega antes de firmar</li>
            <li>Reporta cualquier inconformidad inmediatamente al transportador</li>
          </ul>

          <h2>¿Qué pasa si no estoy en casa?</h2>
          <p>
            Si no hay nadie disponible para recibir el pedido, el transportador intentará contactarte para
            reagendar la entrega. También puedes autorizar a otra persona mayor de edad para que reciba
            en tu nombre (debe presentar cédula).
          </p>

          <div className="contact-cards">
            <div className="contact-card">
              <h3>
                <span className="contact-icon">📞</span>
                Información de Envíos
              </h3>
              <div className="contact-detail">
                <strong>Línea de Atención:</strong>
                (601) 746 8001 opción 2
              </div>
              <div className="contact-detail">
                <strong>Email:</strong>
                envios@alkosto.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
