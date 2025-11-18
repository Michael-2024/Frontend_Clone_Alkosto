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
  const [tempPrecioMin, setTempPrecioMin] = useState('');
  const [tempPrecioMax, setTempPrecioMax] = useState('');

  useEffect(() => {
    realizarBusqueda();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Aplicar búsqueda automáticamente para cambios en filtros no asociados a los inputs temporales
  useEffect(() => {
    // Ejecuta búsqueda cuando los filtros activos cambian (categoría, orden o precios aplicados)
    realizarBusqueda();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros.categoria, filtros.ordenar, filtros.precioMin, filtros.precioMax]);

  const realizarBusqueda = async () => {
    setLoading(true);
    
    try {
      const filtrosActivos = {
        categoria: filtros.categoria || undefined,
        ordenar: filtros.ordenar || undefined,
        precioMin: filtros.precioMin ? parseFloat(filtros.precioMin) : undefined,
        precioMax: filtros.precioMax ? parseFloat(filtros.precioMax) : undefined,
      };

      const resultados = await SearchService.buscarConFiltros(query, filtrosActivos);
      setProductos(resultados);
      setLoading(false);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setProductos([]);
      setLoading(false);
    }
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

  const aplicarFiltroPrecio = () => {
    setFiltros(prev => ({
      ...prev,
      precioMin: tempPrecioMin,
      precioMax: tempPrecioMax
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const limpiarFiltros = async () => {
    setFiltros({
      categoria: '',
      ordenar: '',
      precioMin: '',
      precioMax: '',
    });
    setTempPrecioMin('');
    setTempPrecioMax('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const resultados = await SearchService.buscarCoincidencias(query);
      setProductos(resultados);
    } catch (error) {
      console.error('Error al limpiar filtros:', error);
      setProductos([]);
    }
  };

  const removeFilter = (campo) => {
    const nuevosFiltros = { ...filtros, [campo]: '' };
    setFiltros(nuevosFiltros);
    if (campo === 'precioMin') setTempPrecioMin('');
    if (campo === 'precioMax') setTempPrecioMax('');
    // Re-buscar sin ese filtro
    setTimeout(() => realizarBusqueda(), 100);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filtros.categoria) count++;
    if (filtros.ordenar) count++;
    if (filtros.precioMin) count++;
    if (filtros.precioMax) count++;
    return count;
  };

  // Obtener categorías únicas de los resultados
  const categorias = [...new Set(productos.map(p => p.category))];

  const handleAddToCart = async (product) => {
    try {
      await CartController.addToCart(product, 1);
      alert(`${product.name} agregado al carrito`);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
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

        {/* Chips de filtros aplicados */}
        {getActiveFiltersCount() > 0 && (
          <div className="applied-filters">
            <span className="filters-label">Filtros aplicados ({getActiveFiltersCount()}):</span>
            <div className="filter-chips">
              {filtros.categoria && (
                <div className="filter-chip">
                  <span>Categoría: {filtros.categoria}</span>
                  <button onClick={() => removeFilter('categoria')} aria-label="Quitar filtro">×</button>
                </div>
              )}
              {filtros.ordenar && (
                <div className="filter-chip">
                  <span>Orden: {
                    filtros.ordenar === 'precio-asc' ? 'Precio menor' :
                    filtros.ordenar === 'precio-desc' ? 'Precio mayor' :
                    filtros.ordenar === 'rating' ? 'Mejor valorados' :
                    filtros.ordenar === 'descuento' ? 'Mayor descuento' : filtros.ordenar
                  }</span>
                  <button onClick={() => removeFilter('ordenar')} aria-label="Quitar filtro">×</button>
                </div>
              )}
              {filtros.precioMin && filtros.precioMax ? (
                <div className="filter-chip">
                  <span>Precio: ${Number(filtros.precioMin).toLocaleString('es-CO')} - ${Number(filtros.precioMax).toLocaleString('es-CO')}</span>
                  <button onClick={() => { removeFilter('precioMin'); removeFilter('precioMax'); }} aria-label="Quitar filtro">×</button>
                </div>
              ) : (
                <>
                  {filtros.precioMin && (
                    <div className="filter-chip">
                      <span>Precio mín: ${Number(filtros.precioMin).toLocaleString('es-CO')}</span>
                      <button onClick={() => removeFilter('precioMin')} aria-label="Quitar filtro">×</button>
                    </div>
                  )}
                  {filtros.precioMax && (
                    <div className="filter-chip">
                      <span>Precio máx: ${Number(filtros.precioMax).toLocaleString('es-CO')}</span>
                      <button onClick={() => removeFilter('precioMax')} aria-label="Quitar filtro">×</button>
                    </div>
                  )}
                </>
              )}
              <button className="clear-all-filters" onClick={limpiarFiltros}>
                Limpiar todos
              </button>
            </div>
          </div>
        )}

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
                  value={tempPrecioMin}
                  onChange={(e) => setTempPrecioMin(e.target.value)}
                />
                <span>-</span>
                <input 
                  type="number" 
                  placeholder="Máximo"
                  value={tempPrecioMax}
                  onChange={(e) => setTempPrecioMax(e.target.value)}
                />
                <button className="btn-apply-price" onClick={aplicarFiltroPrecio} aria-label="Aplicar filtro de precio">
                  →
                </button>
              </div>
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
