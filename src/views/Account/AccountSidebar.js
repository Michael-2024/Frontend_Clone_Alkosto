import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/perfil/mi-cuenta', icon: '🏠', label: 'Mi cuenta' },
  { to: '/perfil/datos', icon: '👤', label: 'Mi Perfil' },
  { to: '/perfil/direcciones', icon: '📍', label: 'Direcciones de envío' },
  { to: '/perfil/pedidos', icon: '📦', label: 'Mis Pedidos' },
  { to: '/perfil/pagos', icon: '💳', label: 'Métodos de Pago' },
  { to: '/perfil/favoritos', icon: '❤️', label: 'Mi lista de Favoritos' },
  { to: '/seguimiento', icon: '🔍', label: 'Sigue tu pedido' },
  { to: '/perfil/factura', icon: '📄', label: 'Descarga tu factura' },
];

const AccountSidebar = ({ onLogout }) => {
  const { pathname } = useLocation();

  return (
    <aside className="account-sidebar" aria-label="Menú de cuenta">
      <nav>
        <ul className="account-menu">
          {links.map((l) => (
            <li key={l.to} className={`account-menu-item ${pathname === l.to ? 'active' : ''}`}>
              <Link to={l.to} aria-current={pathname === l.to ? 'page' : undefined}>
                <span className="icon" aria-hidden>{l.icon}</span>
                <span>{l.label}</span>
              </Link>
            </li>
          ))}
          <li className="account-menu-item">
            <button className="linklike" onClick={onLogout}>
              <span className="icon" aria-hidden>🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AccountSidebar;
