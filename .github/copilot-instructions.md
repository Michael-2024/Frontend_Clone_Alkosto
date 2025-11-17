# Copilot Instructions - Alkosto Clone Frontend

## Project Overview

This is an educational e-commerce clone of Alkosto.com built with React 18 following **MVC architecture**. The project uses a hybrid approach: localStorage for offline functionality with backend API integration for authenticated users.

**Full Stack Architecture:**
- **Frontend**: React 18 SPA with MVC pattern (this repo)
- **Backend**: Django 5.2.7 + Django REST Framework 3.15.2 ([Backend Repo](https://github.com/Michael-2024/Backend_Clone_Alkosto))
- **Database**: MySQL 5.7+ (backend)
- **Authentication**: Token-based (Django REST Framework Token Auth)
- **Deployment**: Frontend on Vercel ([frontend-clone-alkosto.vercel.app](https://frontend-clone-alkosto.vercel.app/))

## Architecture Patterns

### MVC Structure (Critical)

**Models** (`src/models/`) - Plain JS classes representing data entities
- `Product.js`, `Cart.js`, `User.js`, `Order.js`, etc.
- Models contain business logic (e.g., `getDiscountPercentage()`, `getFormattedPrice()`)
- NO direct API calls - models are pure data structures

**Controllers** (`src/controllers/`) - Business logic and API orchestration
- Singleton pattern used (e.g., `const productController = new ProductController()`)
- Controllers adapt backend responses to Model instances
- Example pattern in `ProductController.js`:
  ```javascript
  async list(params = {}) {
    const data = await apiService.get('/productos/...');
    return data.map(p => this.toProductModel(p)); // ✅ Always return Model instances
  }
  ```

**Views** (`src/views/`) - Full page components (Home, ProductDetail, Cart, Account, etc.)

**Components** (`src/components/`) - Reusable UI pieces (Header, ProductCard, CartDrawer, etc.)

### Hybrid Data Strategy

**Authenticated Users**: Backend API via `ApiService.js` (Django backend at `http://127.0.0.1:8000/api`)
- Token stored in localStorage as `auth_token` (Django REST Framework Token)
- Check authentication: `UserController.isLoggedIn() && apiService.getToken()`
- Backend endpoints require `Authorization: Token {token}` header
- Session cookies handled automatically with `credentials: 'include'`

**Guest Users**: localStorage with keys prefixed `alkosto_*`
- `alkosto_cart` - Shopping cart items
- `alkosto_user` - Current user session
- `alkosto_users` - All registered users (dev only)
- `alkosto_favorites_{userId}` - User-specific favorites

**Migration Pattern**: When user logs in, migrate localStorage data to backend:
```javascript
await CartController.migrateToBackend(); // Called after login/register
```

**Backend Integration Points:**
- **Auth**: `/api/auth/registro/`, `/api/auth/login/`, `/api/auth/perfil/`
- **Products**: `/api/productos/`, `/api/destacados/`, `/api/ofertas/`, `/api/buscar/`
- **Cart**: `/api/carrito/obtener/`, `/api/carrito/agregar/`, `/api/carrito/{id_item}/`
- **Favorites**: `/api/favoritos/`, `/api/favoritos/toggle/`
- **Reviews**: `/api/resenas/crear/`, `/api/resenas/producto/{id}/`

## Key Development Workflows

### Running the Application

```bash
npm start          # Dev server on http://localhost:3000
npm test           # Jest unit tests
npm run build      # Production build
npx cypress open   # E2E tests (Cypress)
```

### Environment Variables

Configure in `.env` file:
```bash
REACT_APP_API_URL=http://127.0.0.1:8000/api  # Backend URL (default)
# For production:
# REACT_APP_API_URL=https://your-backend.com/api
```

### Backend Setup (Django)

**Prerequisites**: Python 3.8+, MySQL 5.7+

```bash
# Clone backend repo
git clone https://github.com/Michael-2024/Backend_Clone_Alkosto.git
cd Backend_Clone_Alkosto

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Configure database in alkosto_backend/settings.py
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver  # http://localhost:8000
```

**Backend Tech Stack:**
- Django 5.2.7
- Django REST Framework 3.15.2
- MySQL (mysqlclient 2.2.4)
- JWT Authentication (djangorestframework-simplejwt)
- CORS enabled (django-cors-headers 4.4.0)

### Testing Strategy

- **Unit tests**: `src/__tests__/*.test.js` using Jest + React Testing Library
- **E2E tests**: `cypress/e2e/*.spec.js` for user flows (RF01_Register_E2E.cy.js)
- **Integration tests**: Focus on Controller ↔ Model interactions (see `RF01_Integration.test.js`)
- Run tests for any Controller/Model changes

### Adding New Features

1. **Model First**: Define data structure in `src/models/`
2. **Controller**: Add business logic in `src/controllers/` with backend integration
3. **View/Component**: Build UI consuming Controller methods
4. **Tests**: Add unit tests in `__tests__/` following existing patterns

## Critical Conventions

### Routing

**Auth flows use custom layouts** (no Header/Footer):
- `/register`, `/login/options`, `/verify` → Direct component render
- All other routes → Wrapped in standard layout with Header + Navigation + Footer

**Pattern in App.js**:
```jsx
<Route path="/register" element={<Register />} />  {/* No layout */}
<Route path="*" element={
  <div className="app">
    <Header /><Navigation /><main><Routes>...</Routes></main><Footer />
  </div>
} />
```

### Color Palette (Brand-Specific)

```css
--alkosto-green: #00A859      /* Primary CTAs, success */
--alkosto-green-dark: #008a47 /* Hover states */
--alkosto-orange: #FF6B35     /* "Ir a pagar", destructive actions */
--alkosto-blue: #004797       /* Links, prices */
--alkosto-red: #eb5b25        /* Discounts, urgency */
--gray-background: #f8f8f8
```

### State Management

- **No Redux/Context**: Use local `useState` and controller singletons
- **Cart updates**: Always call `CartController.getCart()` after mutations
- **Auth state**: Listen to UserController changes:
  ```javascript
  useEffect(() => {
    const unsubscribe = UserController.addAuthListener((isLoggedIn) => {
      setIsLoggedIn(isLoggedIn);
    });
    return unsubscribe;
  }, []);
  ```

## Component Patterns

### ProductCard Usage

```jsx
<ProductCard
  product={productModelInstance}  // Must be Product model instance
  onAddToCart={(product) => {
    CartController.addToCart(product, 1);
    // Show CartDrawer or toast
  }}
/>
```

### CartDrawer Integration

When adding to cart, show drawer with related products:
```jsx
const [showCartDrawer, setShowCartDrawer] = useState(false);
const handleAddToCart = (product) => {
  CartController.addToCart(product, 1);
  setAddedProduct(product);
  setShowCartDrawer(true);  // Triggers slide-in drawer
};
```

### Password Validation

Use `PasswordStrength` component with `userUtils.validatePassword()`:
- 8+ chars, uppercase, lowercase, number, special char (matches backend requirements)
- Rejects 40+ common passwords (`password123`, `alkosto`, `colombia`, etc.)
- Real-time feedback with strength bar (0-100%, 3 levels: weak/medium/strong)
- **Backend validates same rules** - frontend validation is UX enhancement only

## API Integration Patterns

### ApiService Methods

```javascript
// Pass true for requiresAuth on protected endpoints
await apiService.get('/carrito/obtener/', true);  // ✅ Pass true for auth
await apiService.post('/auth/registro/', data);   // Sets token automatically
```

### Key Backend Endpoints

**Authentication:**
```javascript
// Register: POST /api/auth/registro/
{ nombre, apellido, email, telefono, password, password_confirm }
// Returns: { token, user, message }

// Login: POST /api/auth/login/
{ email, password }
// Returns: { token, user, message }

// Profile: GET /api/auth/perfil/ (requires auth)
// Returns: { id_usuario, nombre, apellido, email, telefono, rol }
```

**Products:**
```javascript
// List: GET /api/productos/?search=laptop&categoria=5&orden=precio_asc
// Detail: GET /api/productos/{id}/
// Featured: GET /api/destacados/
// Offers: GET /api/ofertas/
// Search: GET /api/buscar/?q=iphone&categoria=5&precio_min=1000000
// By Category: GET /api/categoria/{slug}/
```

**Cart (requires auth):**
```javascript
// Get: GET /api/carrito/obtener/
// Add: POST /api/carrito/agregar/ { id_producto, cantidad }
// Update: PATCH /api/carrito/{id_item}/ { cantidad }
// Remove: DELETE /api/carrito/{id_item}/
// Clear: DELETE /api/carrito/vaciar/
```

**Favorites (requires auth):**
```javascript
// Toggle: POST /api/favoritos/toggle/ { id_producto }
// List: GET /api/favoritos/obtener/
// Check: GET /api/favoritos/verificar/{producto_id}/
```

### Error Handling

```javascript
try {
  const result = await apiService.addToCart(productId, quantity);
  await CartController.syncWithBackend();
} catch (error) {
  console.error('Backend error:', error);
  // Fallback to localStorage
  CartController.addToCart(product, quantity);
  CartController.saveCartToStorage();
}
```

**Backend Error Responses:**
```javascript
// 400 Bad Request: { error: "Mensaje descriptivo" }
// 401 Unauthorized: { detail: "Authentication credentials were not provided" }
// 404 Not Found: { error: "Producto no encontrado" }
// 500 Server Error: { error: "Error interno del servidor" }
```

## File Naming & Organization

- **Views**: PascalCase folders with `ViewName.js` + `ViewName.css` (e.g., `ProductDetail/ProductDetail.js`)
- **Components**: PascalCase folders (e.g., `CartDrawer/CartDrawer.js`)
- **Controllers**: PascalCase files (e.g., `CartController.js`)
- **Models**: PascalCase files (e.g., `Product.js`)
- **Utils**: camelCase (e.g., `userUtils.js`)

## Documentation

- **Feature logs**: `Logs/MEJORA_00X_*.md` for major features (004-008 implemented)
- **Evidence**: `docs/RF##_*.md` for requirement fulfillment (RF01-RF22)
- **Tests**: Unit tests in `src/__tests__/`, E2E in `cypress/e2e/`
- **Backend tests**: `core/tests/test_*.py` (authentication, products, cart, favorites)

## Accessibility

- Use `<SkipLink />` at top of app (already in App.js)
- Label all form inputs: `<label htmlFor="id">...</label>`
- ARIA attributes for dynamic content (e.g., `aria-label` on icon buttons)
- Keyboard navigation: Test Tab, Enter, Esc on all interactive elements

## Common Pitfalls

❌ **Don't** call API directly from Views - use Controllers  
❌ **Don't** mutate Model instances - create new instances  
❌ **Don't** store sensitive data in localStorage in production  
❌ **Don't** forget to migrate localStorage → backend on login  
❌ **Don't** forget to pass `requiresAuth=true` for protected endpoints
❌ **Don't** rely on frontend validation alone - backend also validates
❌ **Don't** expose `REACT_APP_API_URL` with sensitive data in production

✅ **Do** use Controllers for all data operations  
✅ **Do** validate passwords with `userUtils.validatePassword()`  
✅ **Do** check `UserController.isLoggedIn()` before auth operations  
✅ **Do** add tests for new Controllers/Models  
✅ **Do** handle 401 errors by redirecting to login
✅ **Do** use `await CartController.migrateToBackend()` after login/register
✅ **Do** clear token on logout: `apiService.setToken(null)`

## Quick Reference

**Start dev server**: `npm start`  
**Backend API**: `http://127.0.0.1:8000/api` (local) - Configure via `REACT_APP_API_URL`
**Backend Admin**: `http://127.0.0.1:8000/admin/` (Django admin panel)
**Main views**: Home, ProductDetail, Cart, Checkout, Account, Register, Login  
**Key controllers**: ProductController, CartController, UserController, OrderController  
**Test command**: `npm test` (Jest) / `npx cypress open` (E2E)
**Backend tests**: `python manage.py test core` (from backend repo)
**Deployment**: Frontend auto-deploys to Vercel on push to master

## Backend Repository Structure

```
Backend_Clone_Alkosto/
├── alkosto_backend/          # Django project config
│   ├── settings.py          # DB, CORS, authentication config
│   └── urls.py              # Main URL routing
├── core/                     # Main Django app (monolithic)
│   ├── models.py            # Usuario, Producto, Carrito, Favorito, Resena
│   ├── views.py             # All API endpoints (ViewSets + function views)
│   ├── serializers.py       # DRF serializers
│   ├── urls.py              # API routes
│   └── tests/               # Unit tests (pytest/Django TestCase)
│       ├── test_authentication.py
│       ├── test_productos.py
│       ├── test_carrito.py
│       └── test_favoritos.py
├── requirements.txt         # Python dependencies
└── manage.py                # Django management script
```

## Cross-Repo Collaboration

**Frontend (this repo)** → **Backend repo** communication:
1. Frontend calls `apiService.get('/productos/')` 
2. Backend `ProductoViewSet` returns serialized data
3. Frontend `ProductController.toProductModel()` converts to Model instances
4. Views render Product models

**Model Mapping:**
- Backend `Usuario` → Frontend `User` model
- Backend `Producto` → Frontend `Product` model (adapter in ProductController)
- Backend `Carrito`/`CarritoItem` → Frontend `Cart` model
- Backend `Favorito` → Frontend favorites (managed by UserController)

**Token Flow:**
1. User registers/logs in → Backend returns token
2. Frontend stores in localStorage as `auth_token`
3. Frontend includes in headers: `Authorization: Token {token}`
4. Backend validates token on protected endpoints
5. On logout: Frontend calls `/api/auth/logout/` → Backend deletes token

## Performance & Best Practices

- **Lazy Loading**: Products load on-demand (pagination in backend)
- **Cart Sync**: Debounced updates to prevent excessive API calls
- **Image Optimization**: Backend serves optimized images (Pillow)
- **CORS**: Configured in backend settings for localhost:3000
- **Security**: HTTPS in production, CSRF tokens disabled for Token auth
- **Error Boundaries**: Implement in production for React error handling
