import React from 'react';
import './Banner.css';

const Banner = () => {
  return (
    <div className="banner">
      <div className="container">
        <div className="banner-content">
          <h2>¡Super Ofertas de Tecnología! 🎉</h2>
          <p>Hasta 40% de descuento en productos seleccionados</p>
          <button className="banner-btn">Ver Ofertas</button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
