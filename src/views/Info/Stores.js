import React from 'react';
import './Info.css';

const Stores = () => {
  const stores = [
    {
      city: 'Bogotá',
      locations: [
        { name: 'Alkosto Calle 80', address: 'Calle 80 # 69A - 35', phone: '(601) 746 8001', hours: 'Lun - Sáb: 9:00 AM - 8:00 PM, Dom: 10:00 AM - 6:00 PM' },
        { name: 'Alkosto Suba', address: 'Av. Suba # 106 - 10', phone: '(601) 746 8002', hours: 'Lun - Sáb: 9:00 AM - 8:00 PM, Dom: 10:00 AM - 6:00 PM' },
        { name: 'Alkosto Sur', address: 'Autopista Sur # 45 - 15', phone: '(601) 746 8003', hours: 'Lun - Sáb: 9:00 AM - 8:00 PM, Dom: 10:00 AM - 6:00 PM' }
      ]
    },
    {
      city: 'Medellín',
      locations: [
        { name: 'Alkosto Bello', address: 'Calle 50 # 78 - 45', phone: '(604) 407 3033', hours: 'Lun - Sáb: 9:00 AM - 8:00 PM, Dom: 10:00 AM - 6:00 PM' },
        { name: 'Alkosto Envigado', address: 'Cra. 48 # 32 Sur - 122', phone: '(604) 407 3034', hours: 'Lun - Sáb: 9:00 AM - 8:00 PM, Dom: 10:00 AM - 6:00 PM' }
      ]
    },
    {
      city: 'Cali',
      locations: [
        { name: 'Alkosto Norte', address: 'Calle 70 # 5A - 10', phone: '(602) 485 7000', hours: 'Lun - Sáb: 9:00 AM - 8:00 PM, Dom: 10:00 AM - 6:00 PM' }
      ]
    },
    {
      city: 'Barranquilla',
      locations: [
        { name: 'Alkosto Barranquilla', address: 'Calle 84 # 52 - 50', phone: '(605) 330 1500', hours: 'Lun - Sáb: 9:00 AM - 8:00 PM, Dom: 10:00 AM - 6:00 PM' }
      ]
    }
  ];

  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="container">
          <h1>🏢 Nuestras Tiendas</h1>
          <p>Visítanos en nuestras tiendas físicas en toda Colombia</p>
        </div>
      </div>

      <div className="container">
        <div className="info-content">
          <div className="stores-intro">
            <p>Tenemos presencia en las principales ciudades del país. Encuentra la tienda más cercana a tu ubicación.</p>
          </div>

          {stores.map((cityData, index) => (
            <div key={index} className="city-stores">
              <h2 className="city-name">{cityData.city}</h2>
              <div className="stores-grid">
                {cityData.locations.map((store, idx) => (
                  <div key={idx} className="store-card">
                    <h3>{store.name}</h3>
                    <div className="store-details">
                      <p><strong>📍 Dirección:</strong> {store.address}</p>
                      <p><strong>📞 Teléfono:</strong> {store.phone}</p>
                      <p><strong>🕐 Horario:</strong> {store.hours}</p>
                    </div>
                    <button className="btn-secondary">Ver en mapa</button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="stores-services">
            <h2>Servicios en Tienda</h2>
            <div className="services-grid">
              <div className="service-item">
                <span className="service-icon">🛒</span>
                <h3>Compra y recoge</h3>
                <p>Compra online y recoge en tienda sin costo adicional</p>
              </div>
              <div className="service-item">
                <span className="service-icon">💳</span>
                <h3>Múltiples métodos de pago</h3>
                <p>Efectivo, tarjetas, PSE y más opciones</p>
              </div>
              <div className="service-item">
                <span className="service-icon">🎁</span>
                <h3>Asesoría especializada</h3>
                <p>Personal capacitado para ayudarte</p>
              </div>
              <div className="service-item">
                <span className="service-icon">🚚</span>
                <h3>Envío a domicilio</h3>
                <p>Coordina tu envío desde la tienda</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stores;
