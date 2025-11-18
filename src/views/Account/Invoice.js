import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import OrderController from '../../controllers/OrderController';
import InvoiceService from '../../services/InvoiceService';
import './Account.css';
import AccountSidebar from './AccountSidebar';

const formatCOP = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

const Invoice = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(UserController.getCurrentUser());
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!UserController.isLoggedIn()) {
      const email = localStorage.getItem('pendingEmail') || '';
      navigate(`/login/options${email ? `?email=${encodeURIComponent(email)}` : ''}`);
      return;
    }
    const u = UserController.getCurrentUser();
    setUser(u);
    const list = OrderController.getUserOrders(u.id) || [];
    setOrders(list);
  }, [navigate]);

  const onLogout = () => { UserController.logout(); navigate('/'); };

  const onDownload = (order) => {
    try {
      InvoiceService.generate(order, user);
    } catch (e) {
      console.error('Error generando factura', e);
      alert('No se pudo generar la factura. Intenta nuevamente.');
    }
  };

  const hasOrders = orders.length > 0;

  const totalSpent = useMemo(() => orders.reduce((s, o) => s + (o.total || 0), 0), [orders]);

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-layout">
          <AccountSidebar onLogout={onLogout} />

          <section className="account-content">
            <div className="account-hero">
              <div className="hero-icon" aria-hidden>📄</div>
              <div className="hero-texts">
                <h1 className="account-title">Facturas de compra</h1>
                <p className="account-subtitle">Descarga las facturas electrónicas de tus pedidos</p>
              </div>
            </div>

            {!hasOrders ? (
              <div className="account-grid">
                <div className="account-card" style={{gridColumn: '1 / -1', textAlign: 'center'}}>
                  <div className="card-icon" aria-hidden>📄</div>
                  <div className="card-title">No tienes facturas disponibles</div>
                  <div className="card-desc">
                    Las facturas de tus compras aparecerán aquí una vez que realices un pedido.
                  </div>
                </div>
              </div>
            ) : (
              <div className="account-grid">
                <div className="account-card" style={{gridColumn: '1 / -1'}}>
                  <div className="card-title">Resumen</div>
                  <div className="card-desc">Pedidos: {orders.length} · Total acumulado: {formatCOP(totalSpent)}</div>
                </div>
                {orders.map(order => (
                  <div key={order.id} className="account-card">
                    <div className="card-title">Pedido {order.id}</div>
                    <div className="card-desc">
                      <div><strong>Tracking:</strong> {order.trackingNumber}</div>
                      <div><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleString('es-CO')}</div>
                      <div><strong>Estado:</strong> {order.getStatusText ? order.getStatusText() : order.status}</div>
                      <div><strong>Total:</strong> {formatCOP(order.total)}</div>
                    </div>
                    <div className="card-actions">
                      <button className="btn-primary" onClick={() => onDownload(order)}>Descargar factura (PDF)</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
