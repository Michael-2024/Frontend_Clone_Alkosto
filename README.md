# Alkosto Clone - E-commerce Platform

Clon educativo de la página web de Alkosto.com construido con React (frontend) y Node.js/Express (backend) siguiendo el patrón de diseño MVC.

## 🎯 Características

### Frontend (React + MVC)
- ✅ Arquitectura MVC (Model-View-Controller)
- ✅ Página principal con productos destacados
- ✅ Catálogo de productos con tarjetas
- ✅ Página de detalle de producto
- ✅ Carrito de compras funcional
- ✅ Sistema de navegación por categorías
- ✅ Diseño responsive
- ✅ Colores corporativos de Alkosto


## 📁 Estructura del Proyecto

```
frontend_alkos/
├── src/
│   ├── models/              # Modelos de datos (MVC)
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Category.js
│   │   └── User.js
│   ├── controllers/         # Controladores (MVC)
│   │   ├── ProductController.js
│   │   ├── CartController.js
│   │   └── CategoryController.js
│   ├── views/              # Vistas/Páginas (MVC)
│   │   ├── Home/
│   │   ├── ProductDetail/
│   │   └── Cart/
│   ├── components/         # Componentes reutilizables
│   │   ├── Header/
│   │   ├── Navigation/
│   │   ├── ProductCard/
│   │   ├── ProductGrid/
│   │   ├── Banner/
│   │   └── Footer/
│   ├── App.js
│   └── index.js
├── backend/
│   ├── config/             # Configuraciones
│   ├── models/             # Modelos de MongoDB
│   ├── routes/             # Rutas de la API
│   ├── server.js           # Servidor Express
│   └── package.json
├── public/
└── package.json
```

## 🚀 Instalación y Uso

### Frontend

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar el servidor de desarrollo:
```bash
npm start
```

El frontend estará disponible en `http://localhost:3000`

### Rutas relevantes

- `/perfil/mi-cuenta` Vista de "Mi cuenta" del usuario (dashboard con accesos rápidos)
- `/perfil` Favoritos del usuario

## 🎨 Patrón de Diseño MVC

### Models (Modelos)
Contienen la estructura de los datos y la lógica de negocio básica:
- `Product.js` - Modelo de producto con métodos para formatear precio y calcular descuentos
- `Cart.js` - Modelo del carrito con lógica para agregar/eliminar productos
- `Category.js` - Modelo de categorías
- `User.js` - Modelo de usuario

### Views (Vistas)
Componentes de página que representan las diferentes vistas de la aplicación:
- `Home` - Página principal con productos destacados y ofertas
- `ProductDetail` - Vista detallada de un producto individual
- `Cart` - Vista del carrito de compras

### Controllers (Controladores)
Manejan la lógica de negocio y la comunicación entre modelos y vistas:
- `ProductController.js` - Gestiona productos, búsquedas y filtros
- `CartController.js` - Gestiona el carrito de compras y localStorage
- `CategoryController.js` - Gestiona las categorías y subcategorías

## 🎯 Funcionalidades Implementadas

### Frontend
- [x] Sistema de navegación con categorías
- [x] Barra de búsqueda (interfaz lista)
- [x] Grid de productos responsivo
- [x] Tarjetas de producto con descuentos
- [x] Página de detalle de producto
- [x] Carrito de compras funcional
- [x] Persistencia del carrito en localStorage
- [x] Cálculo de subtotales y envío
- [x] Diseño responsive mobile-first

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18
- React Router DOM 6
- CSS3 (sin frameworks adicionales)
- LocalStorage para persistencia

## 🎨 Colores Corporativos

- Verde principal: `#00A859`
- Verde oscuro: `#008a47`
- Rojo ofertas: `#FF4444`
- Gris texto: `#333`
- Fondo: `#f8f8f8`

## 📱 Responsive Design

La aplicación está optimizada para:
- 📱 Móviles (< 480px)
- 📱 Tablets (< 768px)
- 💻 Laptops (< 1024px)
- 🖥️ Desktop (> 1024px)

## 🔜 Próximos Pasos

### Frontend
1. ⏳ Conectar con API de Django
2. ⏳ Implementar autenticación de usuarios
3. ⏳ Mejorar manejo de estado (Context API/Redux)
4. ⏳ Agregar tests unitarios

## 📝 Notas

Este es un proyecto educativo con fines de aprendizaje. No es el sitio oficial de Alkosto y no tiene ninguna afiliación comercial.

## 🤝 Contribuciones

Este es un proyecto educativo. Siéntete libre de hacer fork y experimentar.

## 📄 Licencia

MIT - Proyecto Educativo
