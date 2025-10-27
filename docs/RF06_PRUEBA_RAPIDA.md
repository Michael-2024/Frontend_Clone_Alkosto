# 🧪 Guía Rápida de Prueba - RF06 Buscar Producto

## ⚡ Inicio Rápido

### 1. Iniciar el servidor
```bash
npm start
```

### 2. Acceder a la aplicación
```
http://localhost:3000
```

---

## 🔍 Pruebas de Búsqueda

### Caso 1: Búsqueda Simple Exitosa

**Pasos**:
1. En el Header, localizar la barra de búsqueda
2. Escribir: `samsung`
3. Presionar **Enter** o clic en icono de búsqueda
4. Se redirige a `/search?q=samsung`

**Resultado Esperado**:
✅ Muestra 3 productos:
- Samsung Galaxy S24 Ultra
- Smart TV Samsung 55"
- Nevera Samsung Side by Side

✅ Contador: "3 productos encontrados"
✅ Grid responsive con ProductCard

---

### Caso 2: Búsqueda por Categoría

**Pasos**:
1. Buscar: `celulares`
2. Ver resultados

**Resultado Esperado**:
✅ Muestra 2 productos:
- iPhone 15 Pro Max
- Samsung Galaxy S24 Ultra

---

### Caso 3: Sin Resultados

**Pasos**:
1. Buscar: `nintendo`
2. Ver página de resultados

**Resultado Esperado**:
✅ Muestra mensaje: "No se encontraron productos"
✅ Muestra icono 🔍
✅ Lista de sugerencias:
   • Verifica la ortografía
   • Usa palabras más generales
   • Usa menos palabras clave
   • Prueba con sinónimos
✅ Botón "Volver al inicio"

---

### Caso 4: Búsqueda por Descripción

**Pasos**:
1. Buscar: `chip M3`
2. Ver resultados

**Resultado Esperado**:
✅ Muestra: MacBook Pro 14" M3
✅ Búsqueda en descripción funciona

---

## 🔧 Pruebas de Filtros

### Filtro 1: Ordenar por Precio

**Pasos**:
1. Buscar: `samsung`
2. En sidebar, seleccionar "Ordenar por": **Precio: Menor a Mayor**
3. Clic en **Aplicar Filtros**

**Resultado Esperado**:
✅ Productos ordenados:
1. Nevera Samsung ($3,299,000)
2. TV Samsung ($2,499,000)
3. Galaxy S24 ($4,899,000)

---

### Filtro 2: Por Categoría

**Pasos**:
1. Buscar: `samsung`
2. En sidebar, seleccionar "Categoría": **Celulares**
3. Clic en **Aplicar Filtros**

**Resultado Esperado**:
✅ Solo muestra: Samsung Galaxy S24 Ultra
✅ Contador: "1 producto encontrado"

---

### Filtro 3: Rango de Precio

**Pasos**:
1. Buscar: `samsung`
2. Ingresar Precio Mínimo: `2000000`
3. Ingresar Precio Máximo: `3000000`
4. Clic en **Aplicar Filtros**

**Resultado Esperado**:
✅ Solo muestra: Smart TV Samsung ($2,499,000)

---

### Filtro 4: Limpiar Filtros

**Pasos**:
1. Aplicar cualquier filtro
2. Clic en **Limpiar**

**Resultado Esperado**:
✅ Todos los filtros se resetean
✅ Vuelve a mostrar todos los resultados originales

---

## 📱 Pruebas Responsive

### Desktop (1024px+)
**Resultado Esperado**:
✅ Sidebar de filtros fijo (sticky) a la izquierda
✅ Grid de productos con 4 columnas
✅ Filtros siempre visibles

### Tablet (768-1024px)
**Resultado Esperado**:
✅ Sidebar más estrecho (200px)
✅ Grid de productos con 3 columnas
✅ Filtros funcionales

### Mobile (<768px)
**Resultado Esperado**:
✅ Sidebar arriba (no sticky)
✅ Grid de productos con 2 columnas
✅ Layout apilado verticalmente

---

## 🎯 Casos de Prueba Completos

### ✅ Test 1: Búsqueda Vacía
**Input**: Campo vacío → Enter  
**Output**: No navega (validación en Header)

### ✅ Test 2: Búsqueda Case-Insensitive
**Input**: `SAMSUNG` / `samsung` / `SaMsUnG`  
**Output**: Mismos resultados (3 productos)

### ✅ Test 3: Búsqueda con Espacios
**Input**: `  samsung  ` (con espacios)  
**Output**: Trim automático, funciona correctamente

### ✅ Test 4: Búsqueda Parcial
**Input**: `sam`  
**Output**: Encuentra productos con "sam" en nombre/descripción

### ✅ Test 5: Múltiples Filtros
**Pasos**:
1. Buscar: `lg`
2. Categoría: `Electrodomésticos`
3. Ordenar: `rating`
4. Aplicar

**Output**: Lavadora LG ordenada por rating

### ✅ Test 6: Navegación desde Resultados
**Pasos**:
1. Buscar producto
2. Clic en cualquier ProductCard

**Output**: Navega a `/producto/:id`

### ✅ Test 7: Breadcrumb
**Pasos**:
1. En resultados de búsqueda
2. Clic en "Inicio" del breadcrumb

**Output**: Navega a página principal

### ✅ Test 8: Loading State
**Pasos**:
1. Realizar búsqueda
2. Observar durante 300ms

**Output**: Muestra spinner y "Buscando productos..."

---

## 🧩 Verificar en Consola

### Ver Resultados de Búsqueda
```javascript
// En DevTools Console
import SearchService from './services/SearchService';

// Buscar
const resultados = SearchService.buscarCoincidencias('samsung');
console.log(resultados);

// Ver cantidad
console.log(`Encontrados: ${resultados.length}`);

// Ver primer resultado
console.log(resultados[0]);
```

### Ver Sugerencias
```javascript
const sugerencias = SearchService.obtenerSugerencias('sam');
console.log(sugerencias); // Máximo 5
```

### Ver con Filtros
```javascript
const filtros = {
  categoria: 'Celulares',
  precioMin: 3000000,
  ordenar: 'precio-asc'
};

const resultados = SearchService.buscarConFiltros('samsung', filtros);
console.log(resultados);
```

---

## 📊 Tabla de Búsquedas de Prueba

| Término | Esperado | Categoría | Cantidad |
|---------|----------|-----------|----------|
| samsung | ✅ Encuentra | Múltiples | 3 |
| iphone | ✅ Encuentra | Celulares | 1 |
| lg | ✅ Encuentra | Electrodomésticos | 1 |
| macbook | ✅ Encuentra | Computadores | 1 |
| ps5 | ✅ Encuentra | Videojuegos | 1 |
| celulares | ✅ Encuentra | - | 2 |
| tv | ✅ Encuentra | Televisores | 1 |
| electrodomésticos | ✅ Encuentra | - | 2 |
| nintendo | ❌ No encuentra | - | 0 |
| xbox | ❌ No encuentra | - | 0 |

---

## 🎨 Verificar UI

### Header
- ✅ Barra de búsqueda visible
- ✅ Placeholder claro
- ✅ Icono de búsqueda
- ✅ Enter funciona
- ✅ Clic en icono funciona

### Página de Resultados
- ✅ Breadcrumb: Inicio › Resultados
- ✅ Título: "Resultados para: ..."
- ✅ Contador de resultados
- ✅ Sidebar con filtros
- ✅ Grid de productos
- ✅ ProductCard con hover effects

### Filtros
- ✅ Dropdown de ordenamiento
- ✅ Dropdown de categoría (si aplica)
- ✅ Inputs de precio
- ✅ Botones estilizados
- ✅ Botón "Aplicar" naranja
- ✅ Botón "Limpiar" blanco

### Sin Resultados
- ✅ Icono grande 🔍
- ✅ Mensaje claro
- ✅ Sugerencias en caja
- ✅ Botón "Volver al inicio"

---

## 🔄 Flujo End-to-End

### Flujo Completo de Búsqueda

1. **Inicio**
   - Usuario en página principal
   - Ve barra de búsqueda en Header

2. **Búsqueda**
   - Escribe "samsung"
   - Presiona Enter

3. **Navegación**
   - URL cambia a `/search?q=samsung`
   - Componente SearchResults carga

4. **Loading**
   - Muestra spinner durante 300ms

5. **Resultados**
   - Muestra 3 productos Samsung
   - Sidebar con filtros disponibles
   - Grid responsive

6. **Filtrado (opcional)**
   - Usuario selecciona "Celulares"
   - Clic en "Aplicar Filtros"
   - Se filtra a 1 producto

7. **Selección**
   - Usuario hace clic en Galaxy S24
   - Navega a `/producto/2`

---

## 🐛 Troubleshooting

### Problema: No aparecen resultados
**Diagnóstico**:
```javascript
// En Console
import ProductController from './controllers/ProductController';
const productos = ProductController.getAllProducts();
console.log(productos); // ¿Hay productos?
```

**Solución**: Verificar que ProductController tiene productos mock

---

### Problema: Filtros no funcionan
**Diagnóstico**: Verificar que se hace clic en "Aplicar Filtros"

**Solución**: Implementar auto-apply o aclarar que es necesario aplicar

---

### Problema: CSS no se ve bien
**Diagnóstico**: Verificar que SearchResults.css está importado

**Solución**: 
```javascript
// En SearchResults.js
import './SearchResults.css';
```

---

### Problema: Navegación no funciona
**Diagnóstico**: Verificar ruta en App.js

**Solución**:
```javascript
// En App.js
<Route path="/search" element={<SearchResults />} />
```

---

## ✅ Checklist de Validación

Antes de considerar RF06 completado, verificar:

- [ ] Búsqueda desde Header funciona
- [ ] Navega a `/search?q=...`
- [ ] Muestra resultados correctos
- [ ] Búsqueda case-insensitive
- [ ] Busca en nombre, categoría, descripción
- [ ] Filtro de ordenamiento funciona
- [ ] Filtro de categoría funciona
- [ ] Filtro de precio funciona
- [ ] Botón "Limpiar" resetea filtros
- [ ] Sin resultados muestra mensaje
- [ ] Loading state aparece
- [ ] Grid es responsive
- [ ] Sidebar funciona en desktop
- [ ] Layout apilado en mobile
- [ ] ProductCard clickeable
- [ ] Breadcrumb funciona
- [ ] Contador de resultados correcto

---

## 📸 Screenshots Esperados

### 1. Con Resultados
```
┌────────────────────────────────────────────┐
│ Inicio › Resultados                        │
│ Resultados para: "samsung"                 │
│ 3 productos encontrados                    │
├──────────┬─────────────────────────────────┤
│ FILTROS  │ [ProductCard] [ProductCard]     │
│          │ [ProductCard]                   │
│ Ordenar  │                                 │
│ ▼        │                                 │
│          │                                 │
│ Categ.   │                                 │
│ ▼        │                                 │
│          │                                 │
│ Precio   │                                 │
│ [    ] - │                                 │
│ [    ]   │                                 │
│          │                                 │
│ [Aplicar]│                                 │
│ [Limpiar]│                                 │
└──────────┴─────────────────────────────────┘
```

### 2. Sin Resultados
```
┌────────────────────────────────────────────┐
│               🔍                            │
│     No se encontraron productos            │
│                                             │
│     Sugerencias:                            │
│     • Verifica la ortografía               │
│     • Usa palabras más generales           │
│                                             │
│     [Volver al inicio]                     │
└────────────────────────────────────────────┘
```

---

## 🎓 Tips de Prueba

1. **Prueba extremos**: Búsquedas muy largas, vacías, con caracteres especiales
2. **Verifica performance**: ¿Es rápida la búsqueda?
3. **Testea responsive**: Redimensiona ventana
4. **Navega entre páginas**: ¿Se mantiene contexto?
5. **Usa DevTools**: Verifica console para logs

---

**¿Todo funciona?** ✅ ¡RF06 está listo!

**¿Algo falla?** 🐛 Revisa la documentación técnica en `RF06_BUSCAR_PRODUCTO.md`
