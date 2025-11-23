import React from 'react';
import './Info.css';

const Terms = () => {
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="container">
          <h1>📜 Términos y Condiciones</h1>
          <p>Lee nuestros términos de uso</p>
        </div>
      </div>

      <div className="container">
        <div className="info-content">
          <p><strong>Última actualización:</strong> Noviembre 2025</p>

          <h2>1. Aceptación de Términos</h2>
          <p>
            Al acceder y usar el sitio web de Alkosto, aceptas estar sujeto a estos términos y condiciones,
            así como a todas las leyes y regulaciones aplicables. Si no estás de acuerdo con alguno de estos
            términos, no debes usar este sitio.
          </p>

          <h2>2. Uso del Sitio</h2>
          <p>Este sitio web está destinado únicamente para uso personal y no comercial. No está permitido:</p>
          <ul>
            <li>Modificar o copiar los materiales sin autorización</li>
            <li>Usar los materiales para cualquier propósito comercial</li>
            <li>Intentar descompilar o realizar ingeniería inversa del software</li>
            <li>Eliminar cualquier derecho de autor u otras notaciones propietarias</li>
            <li>Transferir los materiales a otra persona</li>
          </ul>

          <h2>3. Registro de Cuenta</h2>
          <p>Para realizar compras, debes crear una cuenta proporcionando información veraz, actual y completa. Eres responsable de:</p>
          <ul>
            <li>Mantener la confidencialidad de tu contraseña</li>
            <li>Todas las actividades que ocurran bajo tu cuenta</li>
            <li>Notificarnos inmediatamente sobre cualquier uso no autorizado</li>
          </ul>

          <h2>4. Precios y Disponibilidad</h2>
          <p>
            Los precios mostrados están sujetos a cambio sin previo aviso. Nos esforzamos por mostrar información
            precisa, pero no podemos garantizar que todos los precios, descripciones o disponibilidades sean exactos,
            completos, confiables, actuales o libres de errores.
          </p>

          <h2>5. Proceso de Compra</h2>
          <ul>
            <li>Las ofertas de compra están sujetas a disponibilidad de inventario</li>
            <li>Nos reservamos el derecho de limitar cantidades de productos</li>
            <li>Todos los pedidos están sujetos a aceptación y disponibilidad</li>
            <li>Podemos cancelar pedidos en caso de error de precio o disponibilidad</li>
          </ul>

          <h2>6. Métodos de Pago</h2>
          <p>
            Aceptamos varios métodos de pago. Al proporcionar información de pago, garantizas que tienes el derecho
            legal de usar el método de pago. Todas las transacciones están sujetas a verificación.
          </p>

          <h2>7. Envíos y Entregas</h2>
          <p>
            Los tiempos de entrega son estimados y pueden variar. No somos responsables por retrasos causados por
            transportistas externos o circunstancias fuera de nuestro control.
          </p>

          <h2>8. Devoluciones y Reembolsos</h2>
          <p>
            Nuestra política de devoluciones se aplica según lo establecido en la sección de Cambios y Devoluciones.
            Los reembolsos se procesarán de acuerdo con nuestras políticas después de recibir y verificar el producto.
          </p>

          <h2>9. Garantías</h2>
          <p>
            Los productos vienen con las garantías del fabricante. Alkosto no ofrece garantías adicionales más allá
            de las proporcionadas por los fabricantes, excepto donde la ley lo requiera.
          </p>

          <h2>10. Propiedad Intelectual</h2>
          <p>
            Todo el contenido de este sitio web, incluyendo textos, gráficos, logos, imágenes y software, es propiedad
            de Alkosto o sus proveedores de contenido y está protegido por leyes de propiedad intelectual.
          </p>

          <h2>11. Limitación de Responsabilidad</h2>
          <p>
            Alkosto no será responsable por daños indirectos, incidentales, especiales o consecuentes que resulten
            del uso o la imposibilidad de uso de nuestros productos o servicios.
          </p>

          <h2>12. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor
            inmediatamente después de su publicación en el sitio web.
          </p>

          <h2>13. Ley Aplicable</h2>
          <p>
            Estos términos se regirán e interpretarán de acuerdo con las leyes de la República de Colombia,
            sin dar efecto a ningún principio de conflictos de leyes.
          </p>

          <h2>14. Contacto</h2>
          <p>
            Si tienes preguntas sobre estos términos, contáctanos en:
          </p>
          <ul>
            <li>Email: legal@alkosto.com</li>
            <li>Teléfono: (601) 746 8001</li>
            <li>Dirección: Calle 80 # 69A - 35, Bogotá, Colombia</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Terms;
