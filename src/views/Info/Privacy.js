import React from 'react';
import './Info.css';

const Privacy = () => {
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="container">
          <h1>🔒 Política de Privacidad</h1>
          <p>Protegemos tu información personal</p>
        </div>
      </div>

      <div className="container">
        <div className="info-content">
          <p><strong>Última actualización:</strong> Noviembre 2025</p>

          <h2>1. Información que Recopilamos</h2>
          <p>Recopilamos la siguiente información cuando usas nuestro sitio:</p>
          <ul>
            <li><strong>Información de cuenta:</strong> nombre, email, teléfono, dirección</li>
            <li><strong>Información de pago:</strong> datos de tarjetas (encriptados)</li>
            <li><strong>Historial de compras:</strong> productos adquiridos, preferencias</li>
            <li><strong>Información técnica:</strong> dirección IP, navegador, dispositivo</li>
            <li><strong>Cookies:</strong> para mejorar tu experiencia de navegación</li>
          </ul>

          <h2>2. Cómo Usamos tu Información</h2>
          <ul>
            <li>Procesar tus pedidos y pagos</li>
            <li>Comunicarnos contigo sobre tu cuenta y pedidos</li>
            <li>Personalizar tu experiencia de compra</li>
            <li>Enviarte promociones y ofertas (si aceptaste)</li>
            <li>Mejorar nuestros servicios y productos</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>

          <h2>3. Compartir Información</h2>
          <p>No vendemos tu información personal. La compartimos únicamente con:</p>
          <ul>
            <li><strong>Proveedores de servicio:</strong> para procesar pagos y envíos</li>
            <li><strong>Autoridades:</strong> cuando sea requerido por ley</li>
            <li><strong>Socios comerciales:</strong> con tu consentimiento explícito</li>
          </ul>

          <h2>4. Seguridad de Datos</h2>
          <p>Implementamos medidas de seguridad para proteger tu información:</p>
          <ul>
            <li>Encriptación SSL para todas las transacciones</li>
            <li>Servidores seguros con certificaciones internacionales</li>
            <li>Acceso restringido a información sensible</li>
            <li>Monitoreo constante de seguridad</li>
          </ul>

          <h2>5. Cookies</h2>
          <p>Usamos cookies para:</p>
          <ul>
            <li>Mantener tu sesión activa</li>
            <li>Recordar tus preferencias</li>
            <li>Analizar el tráfico del sitio</li>
            <li>Personalizar contenido y anuncios</li>
          </ul>
          <p>Puedes desactivar las cookies en tu navegador, pero esto puede afectar la funcionalidad del sitio.</p>

          <h2>6. Tus Derechos</h2>
          <p>Tienes derecho a:</p>
          <ul>
            <li><strong>Acceder</strong> a tu información personal</li>
            <li><strong>Rectificar</strong> datos incorrectos</li>
            <li><strong>Eliminar</strong> tu cuenta y datos</li>
            <li><strong>Oponerte</strong> al uso de tus datos para marketing</li>
            <li><strong>Portabilidad:</strong> obtener una copia de tus datos</li>
          </ul>

          <h2>7. Menores de Edad</h2>
          <p>
            Nuestro sitio no está dirigido a menores de 18 años. No recopilamos intencionalmente información
            de menores sin el consentimiento de los padres.
          </p>

          <h2>8. Cambios a esta Política</h2>
          <p>
            Podemos actualizar esta política periódicamente. Te notificaremos sobre cambios significativos
            por email o mediante aviso en el sitio web.
          </p>

          <h2>9. Contacto</h2>
          <p>Para ejercer tus derechos o consultas sobre privacidad:</p>
          <ul>
            <li>Email: privacidad@alkosto.com</li>
            <li>Teléfono: (601) 746 8001 opción 4</li>
            <li>Dirección: Calle 80 # 69A - 35, Bogotá, Colombia</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
