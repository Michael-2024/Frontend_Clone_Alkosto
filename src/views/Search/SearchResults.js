// src/views/Search/SearchResults.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SearchService from '../../services/SearchService';
import ProductCard from '../../components/ProductCard/ProductCard';
import CartController from '../../controllers/CartController';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    categoria: '',
    ordenar: '',
    precioMin: '',
    precioMax: '',
  });

  useEffect(() => {
    realizarBusqueda();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const realizarBusqueda = () => {
    setLoading(true);
    
    // Simular delay de búsqueda
    setTimeout(() => {
      const filtrosActivos = {
        categoria: filtros.categoria || undefined,
        ordenar: filtros.ordenar || undefined,
        precioMin: filtros.precioMin ? parseFloat(filtros.precioMin) : undefined,
        precioMax: filtros.precioMax ? parseFloat(filtros.precioMax) : undefined,
      };

      const resultados = SearchService.buscarConFiltros(query, filtrosActivos);
      setProductos(resultados);
      setLoading(false);
    }, 300);
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const aplicarFiltros = () => {
    realizarBusqueda();
  };

  const limpiarFiltros = () => {
    setFiltros({
      categoria: '',
      ordenar: '',
      precioMin: '',
      precioMax: '',
    });
    setTimeout(() => {
      const resultados = SearchService.buscarCoincidencias(query);
      setProductos(resultados);
    }, 100);
  };

  // Obtener categorías únicas de los resultados
  const categorias = [...new Set(productos.map(p => p.category))];

  const handleAddToCart = (product) => {
    CartController.addToCart(product, 1);
    alert(`${product.name} agregado al carrito`);
  };

  return (
    <div className="search-results-page">
      <div className="search-results-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span className="separator">›</span>
          <span>Resultados de búsqueda</span>
        </div>

        {/* Header de búsqueda */}
        <div className="search-header">
          <h1>Resultados para: <span className="search-term">"{query}"</span></h1>
          {!loading && (
            <p className="results-count">
              {productos.length === 0 
                ? 'No se encontraron productos' 
                : `${productos.length} producto${productos.length !== 1 ? 's' : ''} encontrado${productos.length !== 1 ? 's' : ''}`
              }
            </p>
          )}
        </div>

        <div className="search-content">
          {/* Sidebar de filtros */}
          <aside className="search-filters">
            <h2>Filtros</h2>

            {/* Ordenar por */}
            <div className="filter-group">
              <h3>Ordenar por</h3>
              <select 
                value={filtros.ordenar}
                onChange={(e) => handleFiltroChange('ordenar', e.target.value)}
              >
                <option value="">Relevancia</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor Valorados</option>
                <option value="descuento">Mayor Descuento</option>
              </select>
            </div>

            {/* Categoría */}
            {categorias.length > 1 && (
              <div className="filter-group">
                <h3>Categoría</h3>
                <select 
                  value={filtros.categoria}
                  onChange={(e) => handleFiltroChange('categoria', e.target.value)}
                >
                  <option value="">Todas</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Rango de precio */}
            <div className="filter-group">
              <h3>Rango de precio</h3>
              <div className="price-range">
                <input 
                  type="number" 
                  placeholder="Mínimo"
                  value={filtros.precioMin}
                  onChange={(e) => handleFiltroChange('precioMin', e.target.value)}
                />
                <span>-</span>
                <input 
                  type="number" 
                  placeholder="Máximo"
                  value={filtros.precioMax}
                  onChange={(e) => handleFiltroChange('precioMax', e.target.value)}
                />
              </div>
            </div>

            {/* Botones de filtros */}
            <div className="filter-actions">
              <button className="btn-apply-filters" onClick={aplicarFiltros}>
                Aplicar Filtros
              </button>
              <button className="btn-clear-filters" onClick={limpiarFiltros}>
                Limpiar
              </button>
            </div>
          </aside>

          {/* Resultados */}
          <main className="search-results">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Buscando productos...</p>
              </div>
            ) : productos.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h2>No se encontraron productos</h2>
                <p>No hay productos que coincidan con tu búsqueda "{query}"</p>
                <div className="suggestions">
                  <h3>Sugerencias:</h3>
                  <ul>
                    <li>Verifica la ortografía de las palabras</li>
                    <li>Intenta con palabras más generales</li>
                    <li>Usa menos palabras clave</li>
                    <li>Prueba con sinónimos o términos relacionados</li>
                  </ul>
                </div>
                <Link to="/" className="btn-back-home">
                  Volver al inicio
                </Link>
              </div>
            ) : (
              <div className="products-grid">
                {productos.map(producto => (
                  <ProductCard key={producto.id} product={producto} onAddToCart={handleAddToCart} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
