import React from 'react';
import './Info.css';

const Returns = () => {
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="container">
          <h1>🔄 Cambios y Devoluciones</h1>
          <p>Conoce nuestra política de cambios y devoluciones</p>
        </div>
      </div>

      <div className="container">
        <div className="info-content">
          <h2>Política de Cambios y Devoluciones</h2>
          <p>
            En Alkosto queremos que estés completamente satisfecho con tu compra. Si por alguna razón no lo estás,
            puedes solicitar un cambio o devolución dentro de los 30 días calendario siguientes a la entrega del producto.
          </p>

          <h2>¿Qué puedo cambiar o devolver?</h2>
          <ul>
            <li>Productos en perfecto estado, sin uso y con su empaque original</li>
            <li>Productos con todos sus accesorios, manuales y etiquetas</li>
            <li>Electrodomésticos sin instalación ni conexión eléctrica</li>
            <li>Productos con su factura de compra original</li>
          </ul>

          <h2>Productos NO reembolsables</h2>
          <ul>
            <li>Productos de higiene personal (afeitadoras, secadores de cabello, etc.)</li>
            <li>Ropa interior y trajes de baño</li>
            <li>Productos de software abiertos</li>
            <li>Productos personalizados o hechos a medida</li>
            <li>Productos perecederos</li>
          </ul>

          <h2>¿Cómo solicitar un cambio o devolución?</h2>
          <p><strong>Opción 1: En tienda física</strong></p>
          <ul>
            <li>Dirígete a cualquiera de nuestras tiendas con tu producto y factura</li>
            <li>Nuestro personal te ayudará con el proceso</li>
            <li>El cambio o devolución se realizará de inmediato</li>
          </ul>

          <p><strong>Opción 2: Online</strong></p>
          <ul>
            <li>Ingresa a tu cuenta en <a href="/perfil/devoluciones">Mi Cuenta &gt; Devoluciones</a></li>
            <li>Selecciona el pedido y producto que deseas devolver</li>
            <li>Indica el motivo de la devolución</li>
            <li>Coordinaremos la recolección del producto sin costo</li>
          </ul>

          <h2>Tiempos de Reembolso</h2>
          <p>
            Una vez recibamos y verifiquemos el producto devuelto, procesaremos tu reembolso en un plazo de 5 a 10 días hábiles.
            El dinero será devuelto al mismo método de pago utilizado en la compra original.
          </p>

          <div className="contact-cards">
            <div className="contact-card">
              <h3>
                <span className="contact-icon">📞</span>
                ¿Necesitas Ayuda?
              </h3>
              <div className="contact-detail">
                <strong>Línea de Atención:</strong>
                (601) 407 3033
              </div>
              <div className="contact-detail">
                <strong>Email:</strong>
                devoluciones@alkosto.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;
