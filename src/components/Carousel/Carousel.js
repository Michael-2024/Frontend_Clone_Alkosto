import React, { useState, useEffect } from 'react';
import './Carousel.css';

const Carousel = ({ slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-avanzar cada 5 segundos
  useEffect(() => {
    if (slides.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="carousel">
      <div className="carousel-container">
        <div 
          className="carousel-slides" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="carousel-slide">
              <img src={slide.image} alt={slide.title} />
              <div className="carousel-content">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
                {slide.buttonText && (
                  <button className="carousel-button">{slide.buttonText}</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Controles de navegación */}
        <button className="carousel-control prev" onClick={prevSlide}>
          ‹
        </button>
        <button className="carousel-control next" onClick={nextSlide}>
          ›
        </button>

        {/* Indicadores */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
