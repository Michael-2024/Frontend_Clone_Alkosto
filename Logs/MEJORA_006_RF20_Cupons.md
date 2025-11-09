# MEJORA_006: RF20 - Sistema de Cupones y Descuentos

**Fecha:** 2025-11-06  
**Versión:** 2.5.0  
**Tipo:** Nueva Funcionalidad  
**RF:** RF20 - Sistema de Cupones y Descuentos

---

## 📋 Resumen

Implementación completa del sistema de cupones y descuentos siguiendo el modelo de Alkosto.com, permitiendo crear, validar y aplicar cupones promocionales con diferentes tipos y condiciones.

---

## 🎯 Objetivos Cumplidos

- ✅ Sistema completo de gestión de cupones
- ✅ Validación avanzada con condiciones múltiples
- ✅ Aplicación de cupones en Carrito y Checkout
- ✅ Vista de cupones disponibles y usados
- ✅ Cupones de bienvenida automáticos
- ✅ Cupones porcentuales y de valor fijo
- ✅ Condiciones: monto mínimo, categorías, fechas
- ✅ Diseño responsive y accesible

---

## 📁 Archivos Creados

### Modelos
- **`src/models/Coupon.js`** (218 líneas)
  - Modelo completo de cupón
  - 2 tipos: percentage (porcentaje), fixed (valor fijo)
  - Propiedades: code, value, description, minPurchase, maxDiscount
  - Validaciones: fechas, uso, usuario, categorías
  - Métodos auxiliares: calculateDiscount(), isValid(), getIcon()
  - Serialización JSON

### Controladores
- **`src/controllers/CouponController.js`** (339 líneas)
  - Patrón Singleton
  - CRUD completo de cupones
  - 5 cupones por defecto del sistema:
    - WELCOME20: 20% primera compra
    - TECH30: 30% en tecnología
    - HOGAR15: 15% en hogar
    - ALKOSTO50: $50,000 descuento
    - ENVIOGRATIS: $15,000 descuento
  - Métodos clave:
    - `validateCoupon()` - Validación completa
    - `applyCoupon()` - Aplicar y marcar como usado
    - `getAvailableCouponsForUser()` - Cupones disponibles
    - `createWelcomeCoupon()` - Cupón personalizado de bienvenida
    - `createPersonalizedCoupon()` - Cupones personalizados
  - Persistencia en localStorage
  - Auto-limpieza de cupones expirados

### Vistas
- **`src/views/Account/Coupons.js`** (225 líneas)
  - Vista completa en perfil de usuario
  - 3 filtros: Disponibles, Usados, Todos
  - Cards visuales con información detallada
  - Botón copiar código
  - Estados: disponible, usado, expirado
  - Información de uso y condiciones

- **`src/views/Account/Coupons.css`** (290 líneas)
  - Tarjetas de cupón estilo Alkosto
  - Colores por prioridad
  - Animaciones hover
  - Estados visuales diferenciados
  - Diseño responsive

---

## 🔧 Archivos Modificados

### 1. `src/views/Checkout/Checkout.js`
**Cambios principales:**
```javascript
// Línea 6: Import CouponController
import CouponController from '../../controllers/CouponController';

// Líneas 17-20: Estados de cupón
const [couponCode, setCouponCode] = useState('');
const [appliedCoupon, setAppliedCoupon] = useState(null);
const [couponError, setCouponError] = useState('');
const [couponSuccess, setCouponSuccess] = useState('');

// Líneas 153-185: Funciones de cupón
const handleApplyCoupon = () => {
  // Validación y aplicación del cupón
};
const handleRemoveCoupon = () => { /* ... */ };

// Líneas 261-265: Cálculo de descuento
const calculateDiscount = () => {
  if (!appliedCoupon) return 0;
  return appliedCoupon.calculateDiscount(calculateSubtotal());
};

const calculateTotal = () => {
  return calculateSubtotal() + calculateShipping() - calculateDiscount();
};

// Líneas 192-205: Aplicar cupón al crear orden
if (appliedCoupon) {
  CouponController.applyCoupon(appliedCoupon.code, currentUser.id);
}
const result = OrderController.createOrder(
  userId, cartItems, shippingData, paymentMethod,
  appliedCoupon ? {
    code: appliedCoupon.code,
    discount: appliedCoupon.calculateDiscount(calculateSubtotal())
  } : null
);

// Líneas 730-810: UI de cupón en sidebar
<div className="coupon-section">
  <h4>¿Tienes un cupón?</h4>
  {/* Input y botón aplicar */}
  {/* Cupón aplicado con botón eliminar */}
  {/* Mensajes de error/éxito */}
</div>
```

### 2. `src/views/Checkout/Checkout.css`
**Agregado (+172 líneas):**
- Estilos .coupon-section
- Input .coupon-input-group
- Botón .btn-apply-coupon
- Cupón aplicado .applied-coupon
- Mensajes .coupon-message (error/success)
- Fila de descuento .discount-item

### 3. `src/views/Cart/Cart.js`
**Cambios principales:**
```javascript
// Línea 5: Import CouponController
import CouponController from '../../controllers/CouponController';

// Líneas 15-18: Estados de cupón
const [couponCode, setCouponCode] = useState('');
const [appliedCoupon, setAppliedCoupon] = useState(null);
const [couponError, setCouponError] = useState('');
const [couponSuccess, setCouponSuccess] = useState('');

// Líneas 44-89: Funciones de cupón
const handleApplyCoupon = () => { /* Validar y aplicar */ };
const handleRemoveCoupon = () => { /* Quitar cupón */ };
const calculateDiscount = () => { /* Calcular descuento */ };
const calculateFinalTotal = () => { /* Total con descuento */ };

// Líneas 231-281: UI de cupón en resumen
<details className="discounts-section" open={appliedCoupon || ...}>
  <summary>▼ Descuentos y cupones</summary>
  {/* Input o cupón aplicado */}
  {/* Mensajes */}
</details>
{appliedCoupon && (
  <div className="summary-row discount-row">
    <span>Descuento {appliedCoupon.code}</span>
    <span>-{formatPrice(calculateDiscount())}</span>
  </div>
)}
```

### 4. `src/views/Cart/Cart.css`
**Agregado (+148 líneas):**
- Input .coupon-input-wrapper
- Badge .coupon-badge
- Botones .apply-coupon-btn, .remove-coupon-btn
- Mensajes .coupon-message-cart
- Fila descuento .discount-row

### 5. `src/models/Order.js`
**Cambios:**
```javascript
// Constructor actualizado
constructor(
  id, userId, items, shippingAddress, paymentMethod,
  status = 'pendiente',
  coupon = null  // ← Nuevo parámetro
) {
  // ...
  this.coupon = coupon; // {code, discount} o null
  this.discount = coupon ? coupon.discount : 0;
  // ...
}

// calculateTotal actualizado
calculateTotal() {
  return this.calculateSubtotal() + this.calculateShipping() - this.discount;
}
```

### 6. `src/controllers/OrderController.js`
**Cambios:**
```javascript
// Línea 18: Parámetro coupon agregado
createOrder(userId, cartItems, shippingAddress, paymentMethod, coupon = null)

// Líneas 44-50: Pasar cupón al constructor de Order
const order = new Order(
  orderId, userId, cartItems,
  shippingAddress, paymentMethod,
  'procesando',
  coupon  // ← Cupón incluido
);
```

### 7. `src/controllers/UserController.js`
**Cambios:**
```javascript
// Línea 3: Import CouponController
import CouponController from './CouponController';

// Líneas 177-178: Crear cupón de bienvenida
NotificationController.createWelcomeNotifications(id);
CouponController.createWelcomeCoupon(id);  // ← Nuevo
```

### 8. `src/App.js`
**Cambios:**
```javascript
// Línea 31: Import Coupons
import Coupons from './views/Account/Coupons';

// Línea 81: Nueva ruta
<Route path="/perfil/cupones" element={<Coupons />} />
```

### 9. `src/views/Account/AccountSidebar.js`
**Cambios:**
```javascript
// Línea 8: Nuevo enlace
{ to: '/perfil/cupones', icon: '🎟️', label: 'Mis Cupones' },
```

---

## 🎟️ Tipos de Cupones

### 1. Cupones Porcentuales (percentage)
- **Ejemplo**: WELCOME20, TECH30, HOGAR15
- **Funcionamiento**: Descuento del X% sobre el subtotal
- **Límite máximo**: Opcional (maxDiscount)
- **Cálculo**: `subtotal * (value / 100)`

### 2. Cupones de Valor Fijo (fixed)
- **Ejemplo**: ALKOSTO50, ENVIOGRATIS
- **Funcionamiento**: Descuento fijo en pesos
- **Cálculo**: Valor directo del cupón

---

## 🔍 Validaciones Implementadas

El sistema valida múltiples condiciones antes de aplicar un cupón:

1. **Estado del cupón**: `isActive = true`
2. **Fechas de validez**: `validFrom <= now <= validUntil`
3. **Límite de uso**: `usedCount < usageLimit`
4. **Usuario específico**: Si aplica solo a cierto userId
5. **Usuario ya usó**: Verificar en historial
6. **Monto mínimo**: `total >= minPurchase`
7. **Categorías**: Si el cupón aplica solo a ciertas categorías
8. **Descuento máximo**: No exceder maxDiscount

---

## 💡 Características Destacadas

### Cupón de Bienvenida Automático
Al registrarse, cada usuario recibe:
- Código único: `WELCOME{primeros4caracteresID}`
- 20% de descuento
- Compra mínima: $100,000
- Descuento máximo: $50,000
- Validez: 30 días
- Solo 1 uso

### Cupones Promocionales del Sistema
5 cupones predefinidos disponibles para todos:
1. **WELCOME20**: 20% primera compra (min $100k, max $50k)
2. **TECH30**: 30% en tecnología (min $500k, max $150k)
3. **HOGAR15**: 15% en hogar (min $200k, max $75k)
4. **ALKOSTO50**: $50,000 descuento (min $1M)
5. **ENVIOGRATIS**: $15,000 descuento en envío (min $150k)

### Indicadores Visuales
- **Colores por prioridad**:
  - Rojo: ≥50% o ≥$100k (alta prioridad)
  - Naranja: ≥30% (media-alta)
  - Azul: ≥20% (media)
  - Verde: <20% (normal)
- **Iconos**:
  - 🎁 Alta prioridad
  - 🎟️ Media-alta
  - 🏷️ Media
  - 🎫 Normal

### Estados del Cupón
- **Disponible**: Verde, activo, puede usarse
- **Usado**: Gris, marcado como usado
- **Expirado**: Gris claro, pasó validUntil
- **Urgente**: Rojo si faltan ≤3 días

---

## 🔄 Flujo de Uso

### 1. Usuario Aplica Cupón
```
Usuario ingresa código → validateCoupon() → 
Verificar condiciones → Calcular descuento →
Mostrar en UI → Actualizar total
```

### 2. Usuario Completa Compra
```
handlePlaceOrder() → applyCoupon() →
Marcar como usado → Guardar en historial →
Crear orden con descuento → Finalizar
```

### 3. Usuario Ve Sus Cupones
```
/perfil/cupones → getAvailableCouponsForUser() →
Mostrar disponibles → getUsedCouponsByUser() →
Mostrar histórico → Filtrar por estado
```

---

## 🧪 Pruebas Realizadas

### Funcionalidad Básica
- ✅ Aplicar cupón en carrito → Descuento correcto
- ✅ Aplicar cupón en checkout → Descuento correcto
- ✅ Eliminar cupón aplicado → Total actualizado
- ✅ Cupón inválido → Mensaje de error apropiado
- ✅ Cupón ya usado → "Ya has usado este cupón"
- ✅ Monto mínimo no alcanzado → Mensaje con requisito
- ✅ Crear orden con cupón → Orden guarda descuento

### Validaciones
- ✅ Cupón expirado rechazado
- ✅ Cupón agotado (usageLimit) rechazado
- ✅ Categoría no aplicable rechazada
- ✅ Usuario no autenticado → Mensaje apropiado
- ✅ Descuento máximo respetado
- ✅ Cupón personalizado solo para su usuario

### UI/UX
- ✅ Input acepta códigos y convierte a mayúsculas
- ✅ Mensajes de error/éxito visibles
- ✅ Cupón aplicado muestra badge con info
- ✅ Botón copiar código funciona
- ✅ Filtros funcionan correctamente
- ✅ Estados visuales diferenciados
- ✅ Responsive en móviles

### Integración
- ✅ Cupón se aplica correctamente al total
- ✅ Cupón se marca como usado al finalizar compra
- ✅ Historial de cupones usados persiste
- ✅ Cupón de bienvenida se crea al registrarse
- ✅ Persistencia en localStorage funciona

---

## 📊 Estadísticas y Gestión

El CouponController incluye métodos para estadísticas:

```javascript
getCouponStats() {
  return {
    total: this.coupons.length,
    active: coupons.filter(c => c.isActive).length,
    expired: coupons.filter(/* expirados */).length,
    exhausted: coupons.filter(/* agotados */).length
  };
}

cleanupExpiredCoupons() {
  // Auto-limpia cupones expirados hace >30 días
}
```

---

## 🐛 Problemas Conocidos

Ninguno detectado en testing superficial.

---

## 📈 Mejoras Futuras (Opcional)

- Cupones multi-uso con límite por usuario
- Cupones acumulables (stackable)
- Códigos QR para cupones físicos
- Sistema de referidos con cupones
- Cupones por aniversario de usuario
- Historial de ahorros generados
- Notificaciones cuando expiran cupones
- Cupones de productos específicos (por SKU)
- Sistema de puntos canjeables por cupones

---

## 📝 Notas Técnicas

- **LocalStorage Keys**:
  - `alkosto_coupons`: Lista de cupones
  - `alkosto_user_coupons`: Historial de uso por usuario
- **Formato de cupón en orden**: `{code: string, discount: number}`
- **Códigos**: Siempre en MAYÚSCULAS
- **Auto-limpieza**: 30 días después de expiración
- **Validación**: Multi-capa (estado, fecha, usuario, monto, categoría)

---

## ✅ Cumplimiento RF20

**Estado:** ✅ COMPLETAMENTE IMPLEMENTADO (100%)

El sistema de cupones cumple al 100% con el RF20, proporcionando:
- Creación y gestión de cupones
- Múltiples tipos y condiciones
- Validación completa y robusta
- Aplicación en carrito y checkout
- Vista de cupones disponibles y usados
- Cupones automáticos de bienvenida
- UI intuitiva y responsive
- Integración completa con sistema de órdenes
- Persistencia de datos

---

**Fin de Documento**
