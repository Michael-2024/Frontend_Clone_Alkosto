import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
// iconos
import { IoLogoGooglePlaystore } from "react-icons/io5"; // google play
import { FaAppStoreIos } from "react-icons/fa"; // app store
import { FaCcVisa } from "react-icons/fa"; // visa


const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Servicio al Cliente</h3>
            <ul>
              <li><Link to="/ayuda">Centro de Ayuda</Link></li>
              <li><Link to="/cambios">Cambios y Devoluciones</Link></li>
              <li><Link to="/garantias">Garantías</Link></li>
              <li><Link to="/envios">Información de Envíos</Link></li>
              <li><Link to="/seguimiento">Rastrear Pedido</Link></li>
              <li><Link to="/pqrs">PQRS</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Sobre Alkosto</h3>
            <ul>
              <li><Link to="/nosotros">Quiénes Somos</Link></li>
              <li><Link to="/tiendas">Nuestras Tiendas</Link></li>
              <li><Link to="/trabaja">Trabaja con Nosotros</Link></li>
              <li><Link to="/terminos">Términos y Condiciones</Link></li>
              <li><Link to="/privacidad">Política de Privacidad</Link></li>
              <li><Link to="/responsabilidad">Responsabilidad Social</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Compra y Ahorra</h3>
            <ul>
              <li><Link to="/credito">Crédito Alkosto</Link></li>
              <li><Link to="/tarjeta">Tarjeta Alkosto</Link></li>
              <li><Link to="/promociones">Promociones</Link></li>
              <li><Link to="/ofertas">Ofertas del Día</Link></li>
              <li><Link to="/cupones">Cupones y Descuentos</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Medios de Pago</h3>
            <div className="payment-methods">
              <div className="payment-item"><FaCcVisa /> Visa</div>
              <div className="payment-item">💳 Mastercard</div>
              <div className="payment-item">💳 American Express</div>
              <div className="payment-item">💰 Tarjetas Débito</div>
              <div className="payment-item">🏦 PSE</div>
              <div className="payment-item">📱 Daviplata</div>
              <div className="payment-item">📱 Nequi</div>
              <div className="payment-item">💵 Efectivo</div>
            </div>
          </div>

          <div className="footer-section">
            <h3>Apps Móviles</h3>
            <div className="app-downloads">
              <a href="#ios" className="app-button">
                <span className="app-icon"><FaAppStoreIos /></span>
                <div className="app-text">
                  <small>Descarga en</small>
                  <strong>App Store</strong>
                </div>
              </a>
              <a href="#android" className="app-button">
                <span className="app-icon"><IoLogoGooglePlaystore /></span>
                <div className="app-text">
                  <small>Disponible en</small>
                  <strong>Google Play</strong>
                </div>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Síguenos</h3>
            <div className="social-links">
              <a href="#facebook" className="social-link">📘</a>
              <a href="#instagram" className="social-link">📷</a>
              <a href="#twitter" className="social-link">🐦</a>
              <a href="#youtube" className="social-link">📺</a>
              <a href="#tiktok" className="social-link">🎵</a>
              <a href="#linkedin" className="social-link">💼</a>
            </div>
            <div className="newsletter">
              <h4>Suscríbete a nuestro newsletter</h4>
              <form className="newsletter-form">
                <input type="email" placeholder="Tu correo electrónico" />
                <button type="submit">Suscribirse</button>
              </form>
            </div>
          </div>
        </div>

        <div className="footer-certifications">
          <h4>Compramos de forma segura</h4>
          <div className="cert-badges">
            <div className="cert-badge">🔒 SSL Seguro</div>
            <div className="cert-badge">✅ Compra Protegida</div>
            <div className="cert-badge">📦 Envío Confiable</div>
            <div className="cert-badge">⭐ Garantía Oficial</div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>© 2025 Alkosto S.A. Todos los derechos reservados.</p>
            <p className="legal-notice">Clon educativo - No es el sitio oficial de Alkosto</p>
          </div>
          <div className="footer-bottom-links">
            <Link to="/terminos">Términos de Uso</Link>
            <span className="separator">|</span>
            <Link to="/privacidad">Privacidad</Link>
            <span className="separator">|</span>
            <Link to="/cookies">Política de Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
