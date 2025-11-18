// src/views/Category/Category.js
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import productController from '../../controllers/ProductController';
import Product from '../../models/Product';
import CartController from '../../controllers/CartController';
import ProductCard from '../../components/ProductCard/ProductCard';
import CartDrawer from '../../components/CartDrawer/CartDrawer';
import './Category.css';

const KNOWN_BRANDS = [
  'Samsung','LG','Mabe','Electrolux','Challenger','Kalley','Whirlpool','Haceb',
  'Apple','Xiaomi','Motorola','Honor','Huawei','Nokia','Sony','TCL','Hisense',
  'Acer','Asus','HP','Lenovo','Dell','MSI','XPG','Alienware'
];

const titleCase = (s) => (s || '').replace(/-/g, ' ').replace(/\s+/g, ' ').trim().replace(/^(.)|\s+(.)/g, c => c.toUpperCase());

const detectBrand = (name) => {
  if (!name) return null;
  const found = KNOWN_BRANDS.find(b => name.toLowerCase().includes(b.toLowerCase()));
  return found || null;
};

const Category = () => {
  const { categoria } = useParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // Drawer state
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Filters
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [tempPriceMin, setTempPriceMin] = useState(''); // Valores temporales para inputs
  const [tempPriceMax, setTempPriceMax] = useState('');
  const [sort, setSort] = useState('relevancia');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await productController.porCategoria(categoria, {});
        let list = Array.isArray(data) ? data : [];
        if (!list.length) {
          const fallback = getFallbackProducts(categoria);
          list = fallback;
        }
        setProducts(list);
      } catch (e) {
        console.warn('Fallo cargando categoría, usando fallback local:', e);
        setProducts(getFallbackProducts(categoria));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [categoria]);

  const brandsFromProducts = useMemo(() => {
    const setB = new Set();
    products.forEach(p => {
      const b = detectBrand(p.name);
      if (b) setB.add(b);
    });
    return Array.from(setB).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (selectedBrands.length) {
      list = list.filter(p => selectedBrands.includes(detectBrand(p.name)));
    }
    if (priceMin !== '') {
      const min = parseFloat(priceMin) || 0;
      list = list.filter(p => Number(p.price) >= min);
    }
    if (priceMax !== '') {
      const max = parseFloat(priceMax) || Number.MAX_SAFE_INTEGER;
      list = list.filter(p => Number(p.price) <= max);
    }
    switch (sort) {
      case 'precio-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'precio-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break; // relevancia: mantener orden original
    }
    return list;
  }, [products, selectedBrands, priceMin, priceMax, sort]);

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  const aplicarFiltroPrecio = () => {
    setPriceMin(tempPriceMin);
    setPriceMax(tempPriceMax);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceMin('');
    setPriceMax('');
    setTempPriceMin('');
    setTempPriceMax('');
    setSort('relevancia');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeFilter = (type, value) => {
    if (type === 'brand') {
      setSelectedBrands(prev => prev.filter(b => b !== value));
    } else if (type === 'priceMin') {
      setPriceMin('');
      setTempPriceMin('');
    } else if (type === 'priceMax') {
      setPriceMax('');
      setTempPriceMax('');
    } else if (type === 'sort') {
      setSort('relevancia');
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedBrands.length) count += selectedBrands.length;
    if (priceMin !== '') count++;
    if (priceMax !== '') count++;
    if (sort !== 'relevancia') count++;
    return count;
  };

  const handleAddToCart = async (product) => {
    try {
      await CartController.addToCart(product, 1);
      const cart = await CartController.getCart();
      setAddedProduct(product);
      setCartItems(cart.items);
      setCartTotal(cart.getTotal());
      setShowCartDrawer(true);
    } catch (e) {
      console.error('Error al agregar al carrito:', e);
    }
  };

  return (
    <div className="category-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span className="separator">›</span>
          <span>{titleCase(categoria)}</span>
        </div>

        <div className="category-header">
          <h1>{titleCase(categoria)}</h1>
          {!loading && (
            <p className="results-count">{filtered.length} productos</p>
          )}
        </div>

        {/* Chips de filtros aplicados */}
        {getActiveFiltersCount() > 0 && (
          <div className="applied-filters">
            <span className="filters-label">Filtros aplicados ({getActiveFiltersCount()}):</span>
            <div className="filter-chips">
              {selectedBrands.map(brand => (
                <div key={brand} className="filter-chip">
                  <span>Marca: {brand}</span>
                  <button onClick={() => removeFilter('brand', brand)} aria-label="Quitar filtro">×</button>
                </div>
              ))}
              {priceMin !== '' && priceMax !== '' ? (
                <div className="filter-chip">
                  <span>Precio: ${Number(priceMin).toLocaleString('es-CO')} - ${Number(priceMax).toLocaleString('es-CO')}</span>
                  <button onClick={() => { removeFilter('priceMin'); removeFilter('priceMax'); }} aria-label="Quitar filtro">×</button>
                </div>
              ) : (
                <>
                  {priceMin !== '' && (
                    <div className="filter-chip">
                      <span>Precio mín: ${Number(priceMin).toLocaleString('es-CO')}</span>
                      <button onClick={() => removeFilter('priceMin')} aria-label="Quitar filtro">×</button>
                    </div>
                  )}
                  {priceMax !== '' && (
                    <div className="filter-chip">
                      <span>Precio máx: ${Number(priceMax).toLocaleString('es-CO')}</span>
                      <button onClick={() => removeFilter('priceMax')} aria-label="Quitar filtro">×</button>
                    </div>
                  )}
                </>
              )}
              {sort !== 'relevancia' && (
                <div className="filter-chip">
                  <span>Orden: {
                    sort === 'precio-asc' ? 'Precio menor' :
                    sort === 'precio-desc' ? 'Precio mayor' :
                    sort === 'rating' ? 'Mejor valorados' : sort
                  }</span>
                  <button onClick={() => removeFilter('sort')} aria-label="Quitar filtro">×</button>
                </div>
              )}
              <button className="clear-all-filters" onClick={clearFilters}>
                Limpiar todos
              </button>
            </div>
          </div>
        )}

        <div className="category-content">
          <aside className="filters">
            <div className="filter-group">
              <h3>Ordenar por</h3>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="relevancia">Relevancia</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor Valorados</option>
              </select>
            </div>

            {brandsFromProducts.length > 0 && (
              <div className="filter-group">
                <h3>Marca</h3>
                <div className="brands">
                  {brandsFromProducts.map((b) => (
                    <label key={b} className="brand-item">
                      <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => handleBrandToggle(b)} />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="filter-group">
              <h3>Precio</h3>
              <div className="price-range">
                <input type="number" placeholder="Mínimo" value={tempPriceMin} onChange={(e) => setTempPriceMin(e.target.value)} />
                <span>-</span>
                <input type="number" placeholder="Máximo" value={tempPriceMax} onChange={(e) => setTempPriceMax(e.target.value)} />
                <button className="btn-apply-price" onClick={aplicarFiltroPrecio} aria-label="Aplicar filtro de precio">
                  →
                </button>
              </div>
            </div>
          </aside>

          <main className="results">
            {loading ? (
              <div className="loading-state"><div className="spinner" /> Cargando…</div>
            ) : filtered.length === 0 ? (
              <div className="no-results">
                <h3>Sin resultados</h3>
                <p>Intenta ajustar los filtros o revisa más tarde.</p>
              </div>
            ) : (
              <div className="products-grid">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <CartDrawer
        isOpen={showCartDrawer}
        onClose={() => setShowCartDrawer(false)}
        addedProduct={addedProduct}
        cartItems={cartItems}
        cartTotal={cartTotal}
      />
    </div>
  );
};

export default Category;

// --- Fallback dataset para demo/educativo ---
function getFallbackProducts(slug){
  const s = (slug || '').toLowerCase();
  const items = [];
  const idBase = Math.floor(Math.random()*100000);
  if (s.includes('lavadora') || s.includes('lavado') || s === 'lavadoras' || s === 'lavadoras-y-secadoras'){
    items.push(
      new Product(idBase+1,'Lavadora Samsung 17Kg Carga Superior',1699050,2450000,30,'https://images.unsplash.com/photo-1597175848600-82ca914c5a7a?w=800','Lavadoras',4.6,15,'Eficiencia energética y múltiples programas'),
      new Product(idBase+2,'Lavadora LG 19Kg Carga Superior',1859050,2599000,28,'https://images.unsplash.com/photo-1595433707802-6b2626ef1b4a?w=800','Lavadoras',4.8,12,'Motor Inverter y Smart Diagnosis'),
      new Product(idBase+3,'Lavasecadora Whirlpool 20Kg Gris',2399050,3299000,27,'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800','Lavadoras',4.5,8,'Lavado y secado en un solo equipo')
    );
  } else if (s.includes('secadora') || s === 'secadoras'){
    items.push(
      new Product(idBase+4,'Secadora Samsung 20Kg Bomba de Calor',2699050,3599000,25,'https://images.unsplash.com/photo-1581579188871-45ea61f2e7b9?w=800','Secadoras',4.7,10,'Cuidado avanzado de prendas'),
      new Product(idBase+5,'Secadora LG 18Kg Doble Inverter',2399050,3199000,25,'https://images.unsplash.com/photo-1597175850400-2cc09ca4e8d0?w=800','Secadoras',4.6,9,'Eficiencia y bajo ruido'),
      new Product(idBase+6,'Secadora Electrolux 16Kg',1899050,2499000,24,'https://images.unsplash.com/photo-1545153996-7a8b80d29031?w=800','Secadoras',4.4,7,'Programas para diferentes telas')
    );
  } else if (s.includes('celular') || s === 'celulares'){
    items.push(
      new Product(idBase+7,'Samsung Galaxy S24 256GB',3999050,4599000,13,'https://images.unsplash.com/photo-1510554310709-f54cee6b6c25?w=800','Celulares',4.9,20,'Pantalla AMOLED 120Hz'),
      new Product(idBase+8,'iPhone 15 128GB',4999050,5499000,9,'https://images.unsplash.com/photo-1591337676887-a217a6970a8e?w=800','Celulares',4.8,15,'Chip A16 y cámara avanzada'),
      new Product(idBase+9,'Xiaomi Redmi Note 13 Pro',1499050,1799000,17,'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800','Celulares',4.7,25,'Rendimiento y batería de larga duración')
    );
  } else if (s.includes('televisor') || s === 'televisores' || s.includes('tv')){
    items.push(
      new Product(idBase+10,'TV Samsung 55" 4K QLED',2399050,2999000,20,'https://images.unsplash.com/photo-1583225272837-757a36e79f34?w=800','Televisores',4.8,11,'Colores vivos y HDR'),
      new Product(idBase+11,'TV LG 65" OLED C3',5999050,6999000,14,'https://images.unsplash.com/photo-1593359677879-01272ae2d1e8?w=800','Televisores',4.9,6,'Negros perfectos y Dolby Vision'),
      new Product(idBase+12,'TV TCL 50" 4K',1599050,1999000,20,'https://images.unsplash.com/photo-1593359677721-78319f78146a?w=800','Televisores',4.6,18,'Google TV integrado')
    );
  }
  return items;
}
