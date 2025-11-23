import React from 'react';
import './Info.css';

const Cookies = () => {
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="container">
          <h1>🍪 Política de Cookies</h1>
          <p>Información sobre el uso de cookies</p>
        </div>
      </div>

      <div className="container">
        <div className="info-content">
          <p><strong>Última actualización:</strong> Noviembre 2025</p>

          <h2>¿Qué son las Cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web.
            Ayudan a que el sitio funcione correctamente y mejoran tu experiencia de navegación.
          </p>

          <h2>¿Qué Cookies Usamos?</h2>
          
          <h3>Cookies Esenciales (Necesarias)</h3>
          <p>Estas cookies son necesarias para el funcionamiento básico del sitio:</p>
          <ul>
            <li><strong>Sesión:</strong> Mantiene tu sesión activa mientras navegas</li>
            <li><strong>Carrito:</strong> Guarda los productos en tu carrito de compras</li>
            <li><strong>Seguridad:</strong> Protege contra ataques y fraude</li>
          </ul>

          <h3>Cookies de Rendimiento</h3>
          <p>Nos ayudan a entender cómo usas el sitio para mejorarlo:</p>
          <ul>
            <li><strong>Analytics:</strong> Recopila datos sobre el uso del sitio</li>
            <li><strong>Velocidad:</strong> Monitorea el rendimiento del sitio</li>
            <li><strong>Errores:</strong> Detecta y reporta problemas técnicos</li>
          </ul>

          <h3>Cookies Funcionales</h3>
          <p>Mejoran tu experiencia recordando tus preferencias:</p>
          <ul>
            <li><strong>Idioma:</strong> Recuerda tu idioma preferido</li>
            <li><strong>Ubicación:</strong> Guarda tu ubicación para mostrar tiendas cercanas</li>
            <li><strong>Preferencias:</strong> Tema oscuro/claro y otras configuraciones</li>
          </ul>

          <h3>Cookies de Marketing</h3>
          <p>Se usan para mostrar anuncios relevantes:</p>
          <ul>
            <li><strong>Publicidad:</strong> Muestra anuncios basados en tus intereses</li>
            <li><strong>Redes Sociales:</strong> Permite compartir contenido fácilmente</li>
            <li><strong>Remarketing:</strong> Muestra productos que viste anteriormente</li>
          </ul>

          <h2>Cookies de Terceros</h2>
          <p>También usamos cookies de servicios externos:</p>
          <ul>
            <li><strong>Google Analytics:</strong> Para análisis de tráfico</li>
            <li><strong>Facebook Pixel:</strong> Para publicidad en redes sociales</li>
            <li><strong>Procesadores de pago:</strong> Para transacciones seguras</li>
          </ul>

          <h2>Cómo Gestionar las Cookies</h2>
          
          <h3>En el Navegador</h3>
          <p>Puedes controlar las cookies desde la configuración de tu navegador:</p>
          <ul>
            <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
            <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</li>
            <li><strong>Safari:</strong> Preferencias → Privacidad → Cookies</li>
            <li><strong>Edge:</strong> Configuración → Privacidad → Cookies</li>
          </ul>

          <h3>Configuración de Cookies en Nuestro Sitio</h3>
          <p>
            Puedes aceptar o rechazar cookies no esenciales mediante nuestro banner de cookies.
            Ten en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad del sitio.
          </p>

          <h2>Duración de las Cookies</h2>
          <ul>
            <li><strong>Cookies de sesión:</strong> Se eliminan al cerrar el navegador</li>
            <li><strong>Cookies persistentes:</strong> Permanecen de 1 mes a 2 años</li>
          </ul>

          <h2>Tus Derechos</h2>
          <p>Tienes derecho a:</p>
          <ul>
            <li>Aceptar o rechazar cookies no esenciales</li>
            <li>Eliminar cookies almacenadas</li>
            <li>Cambiar tus preferencias en cualquier momento</li>
            <li>Ser informado sobre el uso de cookies</li>
          </ul>

          <h2>Contacto</h2>
          <p>Para consultas sobre cookies, contáctanos en:</p>
          <ul>
            <li>Email: privacidad@alkosto.com</li>
            <li>Teléfono: (601) 746 8001</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
