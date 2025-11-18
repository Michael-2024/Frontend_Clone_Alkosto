import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import UserController from '../../controllers/UserController';
import OrderController from '../../controllers/OrderController';
import '../Account/Account.css';
import './Tracking.css';

const Tracking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [document, setDocument] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    // Auto-rellenar desde URL si viene de página de pedidos
    const trackingFromUrl = searchParams.get('tracking');
    const docFromUrl = searchParams.get('doc');
    
    if (trackingFromUrl && docFromUrl) {
      setTrackingNumber(trackingFromUrl);
      setDocument(docFromUrl);
      // Auto-buscar el pedido
      setTimeout(() => {
        const foundOrder = OrderController.getOrderByTracking(trackingFromUrl.trim(), docFromUrl.trim());
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError('No se encontró el pedido con los datos proporcionados.');
        }
      }, 300);
    }
  }, [searchParams]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    
    if (!trackingNumber.trim() || !document.trim()) {
      setError('Por favor ingresa el número de pedido y tu documento.');
      return;
    }

    setSearching(true);

    // Simular delay de búsqueda
    setTimeout(() => {
      const foundOrder = OrderController.getOrderByTracking(trackingNumber.trim(), document.trim());
      
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError('No se encontró ningún pedido con el número y documento proporcionados. Verifica que los datos sean correctos.');
      }
      
      setSearching(false);
    }, 500);
  };

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-layout" style={{gridTemplateColumns: '1fr'}}>
          <section className="account-content">
            <div className="account-hero">
              <div className="hero-icon" aria-hidden>🔍</div>
              <div className="hero-texts">
                <h1 className="account-title">Sigue tu pedido</h1>
                <p className="account-sub">Consulta el estado actual de tu pedido</p>
              </div>
            </div>

            <form className="profile-form" onSubmit={onSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label>Número de pedido</label>
                  <input 
                    type="text"
                    value={trackingNumber} 
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Ej: ALK-20241215-12345"
                    disabled={searching}
                  />
                </div>
                <div className="form-field">
                  <label>Documento de identidad</label>
                  <input 
                    type="text"
                    value={document} 
                    onChange={(e) => setDocument(e.target.value)}
                    placeholder="Número sin puntos ni guiones"
                    disabled={searching}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={searching}>
                  {searching ? 'Buscando...' : 'Consultar pedido'}
                </button>
              </div>

              {error && (
                <div className="tracking-error">
                  <span className="error-icon">⚠️</span>
                  <p>{error}</p>
                </div>
              )}
            </form>

            {order && (
              <div className="tracking-result">
                <div className="tracking-header">
                  <h2>📦 Pedido encontrado</h2>
                  <span 
                    className="status-badge" 
                    style={{backgroundColor: order.getStatusColor()}}
                  >
                    {order.getStatusText()}
                  </span>
                </div>

                <div className="tracking-info">
                  <div className="info-row">
                    <span className="label">Número de pedido:</span>
                    <span className="value">#{order.trackingNumber}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Fecha de pedido:</span>
                    <span className="value">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Total:</span>
                    <span className="value total-price">{formatPrice(order.total)}</span>
                  </div>
                </div>

                <div className="tracking-timeline">
                  <h3>Estado del pedido</h3>
                  <div className="timeline">
                    <div className={`timeline-item ${order.status === 'pendiente' || order.status === 'procesando' || order.status === 'enviado' || order.status === 'entregado' ? 'active' : ''}`}>
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h4>Pedido recibido</h4>
                        <p>Tu pedido ha sido recibido y está en proceso</p>
                      </div>
                    </div>
                    <div className={`timeline-item ${order.status === 'procesando' || order.status === 'enviado' || order.status === 'entregado' ? 'active' : ''}`}>
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h4>En preparación</h4>
                        <p>Estamos preparando tu pedido</p>
                      </div>
                    </div>
                    <div className={`timeline-item ${order.status === 'enviado' || order.status === 'entregado' ? 'active' : ''}`}>
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h4>En camino</h4>
                        <p>Tu pedido está en camino a la dirección de entrega</p>
                      </div>
                    </div>
                    <div className={`timeline-item ${order.status === 'entregado' ? 'active' : ''}`}>
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h4>Entregado</h4>
                        <p>Tu pedido ha sido entregado exitosamente</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tracking-products">
                  <h3>Productos del pedido</h3>
                  <div className="products-list">
                    {order.items.map((item, index) => (
                      <div key={index} className="product-item">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="product-image"
                        />
                        <div className="product-info">
                          <h4>{item.product.name}</h4>
                          <p>Cantidad: {item.quantity}</p>
                          <p className="product-price">{formatPrice(item.product.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="tracking-actions">
                  <Link to="/perfil/pedidos" className="btn-secondary">
                    Ver mis pedidos
                  </Link>
                  <button 
                    className="btn-link" 
                    onClick={() => {
                      setOrder(null);
                      setTrackingNumber('');
                      setDocument('');
                      setError('');
                    }}
                  >
                    Consultar otro pedido
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
