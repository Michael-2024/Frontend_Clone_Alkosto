import React from 'react';
import { Link, useLocation } from 'react-router-dom';
//iconos
import { HiOutlineUserCircle, HiQuestionMarkCircle } from "react-icons/hi2";// usuario redondo
import { AiOutlineHome } from "react-icons/ai"; // icono home Mi cuenta
import { SlSocialDropbox } from "react-icons/sl"; //  segui tu pedido
import { GrMapLocation } from "react-icons/gr"; // Dirrecion de envio - ubicacion
import { MdOutlinePayments } from "react-icons/md"; // metodos de pagos
import { FaRegHeart } from "react-icons/fa"; //  corazon favoritos
import { IoReceiptOutline, IoTicketOutline } from "react-icons/io5"; // Descargar factura, Cupones
import { BsFileText } from "react-icons/bs"; // PQRS
import { TbLogout } from "react-icons/tb"; // icono logout cerrar sesión
import { BiPackage } from "react-icons/bi"; // Devoluciones (RF25)


const links = [
  { to: '/perfil/mi-cuenta',  icon: <AiOutlineHome size={30} color="#004797" />  , label: '  Mi cuenta' },
  { to: '/perfil/datos', icon: <HiOutlineUserCircle size={30} color="#004797" />, label: ' Mi Perfil' },
  { to: '/perfil/direcciones', icon: <GrMapLocation size={30} color="#004797" />, label: 'Direcciones de envío' },
  { to: '/perfil/pedidos', icon:<SlSocialDropbox size={30} color="#004797" />, label: 'Mis Pedidos' },
  { to: '/perfil/devoluciones', icon: <BiPackage size={30} color="#004797" />, label: 'Devoluciones y Garantías' },
  { to: '/perfil/pagos', icon:<MdOutlinePayments size={30} color="#004797" />, label: 'Métodos de Pago' },
  { to: '/perfil/favoritos', icon: <FaRegHeart size={30} color="#004797" />, label: 'Mi lista de Favoritos' },
  { to: '/perfil/cupones', icon: <IoTicketOutline size={30} color="#004797" />, label: 'Cupones' },
  { to: '/perfil/pqrs', icon: <BsFileText size={30} color="#004797" />, label: 'PQRS' },
  { to: '/seguimiento', icon: <SlSocialDropbox size={30} color="#004797" />, label: 'Sigue tu pedido' },
  { to: '/perfil/factura', icon: <IoReceiptOutline size={30} color="#004797" />, label: 'Descarga tu factura' },
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
              <span className="icon" aria-hidden><TbLogout size={30} color="#004797" /></span>
              <span>Cerrar Sesión</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AccountSidebar;
