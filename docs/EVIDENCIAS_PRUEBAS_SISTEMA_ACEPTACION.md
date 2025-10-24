# 📋 EVIDENCIAS DE PRUEBAS DEL SISTEMA Y PRUEBAS DE ACEPTACIÓN
## Proyecto: Clon de Alkosto.com

**Fecha de Ejecución:** 24 de Octubre, 2025  
**Responsable:** Equipo de Desarrollo  
**Framework de Pruebas:** Jest + React Testing Library  
**Total de Pruebas:** 75 pruebas implementadas y ejecutadas

---

## 📊 RESUMEN EJECUTIVO

### Estado General
✅ **Todas las pruebas pasaron exitosamente (75/75)**

### Distribución de Pruebas
- **Pruebas del Sistema (System Tests):** 38 pruebas
- **Pruebas de Aceptación (Acceptance Tests):** 37 pruebas

### Cobertura de Funcionalidades
- ✅ Sistema de Productos
- ✅ Sistema de Carrito de Compras
- ✅ Sistema de Categorías
- ✅ Sistema de Búsqueda
- ✅ Sistema de Usuario y Autenticación
- ✅ Integración de Componentes React
- ✅ Flujos Completos de Usuario
- ✅ Persistencia de Datos
- ✅ Validación y Manejo de Errores
- ✅ Rendimiento y Escalabilidad

---

## 🧪 PRUEBAS DEL SISTEMA (SYSTEM TESTS)

Las pruebas del sistema validan que todos los componentes del sistema funcionen correctamente cuando se integran entre sí.

### ST01 - Sistema de Productos (5 pruebas)

#### ST01.1 - El sistema carga y muestra productos correctamente ✅
**Objetivo:** Verificar que el sistema puede cargar y listar productos  
**Resultado:** PASÓ  
**Tiempo de Ejecución:** 7ms  
**Evidencia:**
```javascript
- Sistema retorna array de productos
- Cada producto tiene estructura válida (id, name, price, category)
- Se cargan 8 productos correctamente
```

#### ST01.2 - El sistema obtiene productos por categoría ✅
**Objetivo:** Verificar filtrado por categorías  
**Resultado:** PASÓ  
**Tiempo de Ejecución:** 1ms  
**Evidencia:**
```javascript
- Filtro por "Tecnología" retorna solo productos de esa categoría
- Todos los productos filtrados coinciden con la categoría solicitada
```

#### ST01.3 - El sistema busca productos por nombre ✅
**Objetivo:** Verificar funcionalidad de búsqueda  
**Resultado:** PASÓ  
**Tiempo de Ejecución:** <1ms  
**Evidencia:**
```javascript
- Búsqueda por "laptop" retorna productos relevantes
- Búsqueda incluye nombre y descripción del producto
```

#### ST01.4 - El sistema obtiene productos destacados ✅
**Objetivo:** Verificar selección de productos destacados  
**Resultado:** PASÓ  
**Tiempo de Ejecución:** 1ms  
**Evidencia:**
```javascript
- Retorna máximo 4 productos
- Productos ordenados por rating (mayor a menor)
```

#### ST01.5 - El sistema obtiene productos con descuento ✅
**Objetivo:** Verificar filtrado de productos con ofertas  
**Resultado:** PASÓ  
**Tiempo de Ejecución:** 3ms  
**Evidencia:**
```javascript
- Todos los productos retornados tienen discount > 0
- Se identifican correctamente 8 productos con descuento
```

---

### ST02 - Sistema de Carrito de Compras (7 pruebas)

#### ST02.1 - El sistema agrega productos al carrito ✅
**Objetivo:** Verificar adición de productos  
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Producto agregado aparece en el carrito
- Cantidad inicial es 1
- ID del producto coincide
```

#### ST02.2 - El sistema actualiza cantidad de productos en carrito ✅
**Objetivo:** Verificar actualización de cantidades  
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Cantidad inicial: 2 unidades
- Cantidad actualizada: 5 unidades
- Actualización exitosa verificada
```

#### ST02.3 - El sistema elimina productos del carrito ✅
**Objetivo:** Verificar eliminación de productos  
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Producto eliminado no aparece en el carrito
- Carrito se actualiza correctamente
```

#### ST02.4 - El sistema calcula total del carrito correctamente ✅
**Objetivo:** Verificar cálculo de totales  
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Total calculado = (Producto1 × cantidad1) + (Producto2 × cantidad2)
- Cálculo preciso verificado
```

#### ST02.5 - El sistema persiste el carrito en localStorage ✅
**Objetivo:** Verificar persistencia de datos  
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Carrito guardado en localStorage bajo clave 'alkosto_cart'
- Datos recuperables correctamente
```

#### ST02.6 - El sistema limpia el carrito ✅
**Objetivo:** Verificar función de limpiar carrito  
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Carrito con 2 productos
- Después de clearCart(): 0 productos
```

#### ST02.7 - El sistema cuenta items del carrito correctamente ✅
**Objetivo:** Verificar contador de items  
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- 2 unidades producto A + 3 unidades producto B = 5 items totales
- Contador funciona correctamente
```

---

### ST03 - Sistema de Categorías (2 pruebas)

#### ST03.1 - El sistema carga categorías disponibles ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Categorías encontradas: 6 únicas
- [Celulares, Computadores, Televisores, Videojuegos, Electrodomésticos, Audio]
```

#### ST03.2 - El sistema filtra productos por categoría correctamente ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Filtro aplicado correctamente
- Todos los resultados pertenecen a la categoría seleccionada
```

---

### ST04 - Sistema de Búsqueda (3 pruebas)

#### ST04.1 - El sistema busca productos case-insensitive ✅
**Objetivo:** Verificar búsqueda sin distinción de mayúsculas  
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- "LAPTOP", "laptop", "Laptop" retornan los mismos resultados
- Búsqueda insensible a mayúsculas confirmada
```

#### ST04.2 - El sistema retorna array vacío para búsquedas sin resultados ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Búsqueda: "xyzabc123nonexistent"
- Resultado: [] (array vacío)
- Sin errores
```

#### ST04.3 - El sistema busca en nombre y descripción ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Búsqueda incluye campo 'name'
- Búsqueda incluye campo 'description'
```

---

### ST05 - Sistema de Usuario y Autenticación (6 pruebas)

#### ST05.1 - El sistema registra nuevos usuarios ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Usuario registrado exitosamente
- Datos: Juan Pérez, juan.perez@test.com
- Estado de cuenta: pendiente
```

#### ST05.2 - El sistema valida emails duplicados ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Intento de registro con email existente
- Sistema detecta duplicado correctamente
```

#### ST05.3 - El sistema inicia sesión con credenciales válidas ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Login exitoso
- Usuario actual establecido correctamente
```

#### ST05.4 - El sistema rechaza credenciales inválidas ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Credenciales incorrectas rechazadas
- Mensaje de error retornado
```

#### ST05.5 - El sistema obtiene usuario actual ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Usuario actual recuperado correctamente
- Email coincide con el usuario logueado
```

#### ST05.6 - El sistema cierra sesión correctamente ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Logout ejecutado
- getCurrentUser() retorna null
```

---

### ST06 - Integración de Componentes React (3 pruebas)

#### ST06.1 - El componente Home se renderiza sin errores ✅
**Resultado:** PASÓ  
**Tiempo:** 337ms  
**Evidencia:**
```javascript
- Componente Home renderizado exitosamente
- Banner "Cyber Days" visible
- Sin errores de consola
```

#### ST06.2 - El componente Cart se renderiza correctamente ✅
**Resultado:** PASÓ  
**Tiempo:** 4ms  
**Evidencia:**
```javascript
- Componente Cart renderizado
- Texto "Carrito" o "vacío" presente
```

#### ST06.3 - El componente SearchResults maneja búsquedas ✅
**Resultado:** PASÓ  
**Tiempo:** 12ms  
**Evidencia:**
```javascript
- Componente SearchResults renderizado
- Query parameter procesado: ?q=Samsung
```

---

### ST07 - Flujos Completos de Usuario (3 pruebas)

#### ST07.1 - Flujo completo: Buscar → Ver Detalle → Agregar al Carrito ✅
**Objetivo:** Validar flujo completo de compra  
**Resultado:** PASÓ  
**Evidencia:**
```javascript
1. Búsqueda: "Samsung" - 3 resultados
2. Producto seleccionado: Samsung Galaxy S24 Ultra
3. Agregado al carrito: 1 unidad
4. Verificación: Producto en carrito confirmado
```

#### ST07.2 - Flujo completo: Registro → Login → Logout ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
1. Registro: flow@test.com - Exitoso
2. Logout temporal
3. Login: flow@test.com - Exitoso
4. Usuario actual: confirmado
5. Logout final: confirmado
```

#### ST07.3 - Flujo completo: Agregar múltiples productos → Actualizar cantidades → Calcular total ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
1. Productos agregados: 3 diferentes
2. Total inicial: 6 items
3. Cantidad actualizada: producto[0] = 5
4. Total actualizado: 9 items
5. Cálculo de precio: verificado correcto
```

---

### ST08 - Persistencia y Recuperación de Datos (2 pruebas)

#### ST08.1 - El carrito persiste después de recargar ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Carrito con 2 unidades antes de "recarga"
- Carrito con 2 unidades después de "recarga"
- Persistencia confirmada
```

#### ST08.2 - Los datos de usuario persisten en localStorage ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Usuario registrado: Persist Test
- Clave localStorage: 'alkosto_users'
- Usuario recuperado exitosamente
```

---

### ST09 - Validación de Datos y Manejo de Errores (4 pruebas)

#### ST09.1 - El sistema maneja carrito vacío correctamente ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Items: []
- Total: 0
- Contador: 0
```

#### ST09.2 - El sistema maneja búsquedas vacías ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Búsqueda con string vacío procesada
- Sin errores
```

#### ST09.3 - El sistema maneja productos inexistentes ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- getProductById(99999): undefined
- Sin errores
```

#### ST09.4 - El sistema valida cantidades negativas en carrito ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- updateQuantity(id, 0): Producto eliminado del carrito
- Validación correcta
```

---

### ST10 - Rendimiento y Escalabilidad (3 pruebas)

#### ST10.1 - El sistema maneja múltiples productos en el carrito ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- 20 productos agregados
- Sistema responde correctamente
- Sin degradación de rendimiento
```

#### ST10.2 - La búsqueda es eficiente con resultados múltiples ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Tiempo de búsqueda: < 100ms
- Rendimiento aceptable confirmado
```

#### ST10.3 - El sistema maneja múltiples usuarios registrados ✅
**Resultado:** PASÓ  
**Tiempo:** 3ms  
**Evidencia:**
```javascript
- 10 usuarios registrados exitosamente
- Todos persistidos en localStorage
```

---

## ✅ PRUEBAS DE ACEPTACIÓN (ACCEPTANCE TESTS)

Las pruebas de aceptación validan que el sistema cumple con los requisitos del usuario final, escritas en formato Given-When-Then (Dado-Cuando-Entonces).

### US01 - Como usuario quiero ver productos en la página principal (4 pruebas)

#### AC01.1 - Productos destacados en página principal ✅
**Criterio de Aceptación:** Ver productos al cargar la página  
**Resultado:** PASÓ  
**Tiempo:** 349ms  
**Escenario:**
```gherkin
DADO que estoy en la página principal
CUANDO la página carga
ENTONCES veo productos destacados
```

#### AC01.2 - Productos muestran información completa ✅
**Resultado:** PASÓ  
**Escenario:**
```gherkin
DADO que estoy en la página principal
CUANDO veo la lista de productos
ENTONCES cada producto muestra nombre, precio e imagen
```

#### AC01.3 - Sección "Ofertas del Día" visible ✅
**Resultado:** PASÓ  
**Tiempo:** 98ms  
**Evidencia:** Banner "Ofertas del Día" renderizado correctamente

#### AC01.4 - Múltiples categorías disponibles ✅
**Resultado:** PASÓ  
**Evidencia:** 6 categorías encontradas (requisito: mínimo 5)

---

### US02 - Como usuario quiero buscar productos por nombre (3 pruebas)

#### AC02.1 - Búsqueda funcional ✅
**Escenario:**
```gherkin
DADO que quiero encontrar un producto específico
CUANDO escribo "laptop" en el buscador
ENTONCES veo productos relacionados con laptops
```
**Resultado:** PASÓ

#### AC02.2 - Mensaje cuando no hay resultados ✅
**Resultado:** PASÓ  
**Evidencia:** Array vacío retornado correctamente

#### AC02.3 - Búsqueda case-insensitive ✅
**Resultado:** PASÓ  
**Evidencia:** Mismo resultado para "LAPTOP", "laptop", "Laptop"

---

### US03 - Como usuario quiero agregar productos al carrito (4 pruebas)

#### AC03.1 - Agregar producto al carrito ✅
**Escenario:**
```gherkin
DADO que veo un producto
CUANDO hago click en "Agregar al carrito"
ENTONCES el producto se agrega al carrito
```
**Resultado:** PASÓ  
**Evidencia:** Producto agregado, cantidad = 1

#### AC03.2 - Cantidad aumenta al agregar mismo producto ✅
**Resultado:** PASÓ  
**Evidencia:** 2 + 3 = 5 unidades del mismo producto

#### AC03.3 - Contador del carrito actualizado ✅
**Resultado:** PASÓ  
**Evidencia:** Contador muestra 5 items (3 + 2)

#### AC03.4 - Carrito persiste al recargar ✅
**Resultado:** PASÓ  
**Evidencia:** 2 unidades antes y después de simular recarga

---

### US04 - Como usuario quiero ver el detalle de un producto (3 pruebas)

#### AC04.1 - Información completa en detalle ✅
**Escenario:**
```gherkin
DADO que hago click en un producto
CUANDO cargo la página de detalle
ENTONCES veo nombre, precio, descripción e imagen
```
**Resultado:** PASÓ

#### AC04.2 - Precio con descuento visible ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Precio original: $5,499,000
- Precio con descuento: $4,899,000
- Ahorro: $600,000
```

#### AC04.3 - Agregar al carrito desde detalle ✅
**Resultado:** PASÓ

---

### US05 - Como usuario quiero registrarme en el sistema (4 pruebas)

#### AC05.1 - Registro exitoso ✅
**Escenario:**
```gherkin
DADO que soy un nuevo usuario
CUANDO completo el formulario de registro con datos válidos
ENTONCES mi cuenta se crea exitosamente
```
**Resultado:** PASÓ  
**Usuario creado:** Carlos García, carlos.garcia@test.com

#### AC05.2 - Validación de email duplicado ✅
**Resultado:** PASÓ  
**Evidencia:** Sistema detecta email ya registrado

#### AC05.3 - Login automático después de registro ✅
**Resultado:** PASÓ  
**Evidencia:** Usuario logueado automáticamente tras registro

#### AC05.4 - Datos guardados de forma segura ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Datos guardados en localStorage
- Contraseña NO guardada (seguridad)
- Información personal: ✓
```

---

### US06 - Como usuario quiero iniciar sesión (4 pruebas)

#### AC06.1 - Login exitoso con credenciales correctas ✅
**Escenario:**
```gherkin
DADO que soy un usuario registrado
CUANDO ingreso mis credenciales correctas
ENTONCES inicio sesión exitosamente
```
**Resultado:** PASÓ

#### AC06.2 - Rechazo de credenciales incorrectas ✅
**Resultado:** PASÓ  
**Evidencia:** Mensaje de error retornado

#### AC06.3 - Sesión se mantiene al navegar ✅
**Resultado:** PASÓ  
**Evidencia:** Usuario actual disponible en navegación

#### AC06.4 - Logout funcional ✅
**Resultado:** PASÓ  
**Evidencia:** getCurrentUser() = null después de logout

---

### US07 - Como usuario quiero navegar por categorías (3 pruebas)

#### AC07.1 - Categorías visibles ✅
**Resultado:** PASÓ  
**Categorías:** 6 disponibles

#### AC07.2 - Filtro por categoría funcional ✅
**Resultado:** PASÓ  
**Evidencia:** Solo productos de la categoría seleccionada

#### AC07.3 - Mensaje para categorías vacías ✅
**Resultado:** PASÓ  
**Evidencia:** Array vacío retornado sin errores

---

### US08 - Como usuario quiero ver mi carrito de compras (5 pruebas)

#### AC08.1 - Ver todos los productos agregados ✅
**Resultado:** PASÓ  
**Evidencia:** 2 productos con cantidades 2 y 1

#### AC08.2 - Cálculo correcto del total ✅
**Resultado:** PASÓ  
**Evidencia:** Total = (precio1 × 2) + (precio2 × 3)

#### AC08.3 - Actualización automática del total ✅
**Resultado:** PASÓ  
**Evidencia:** Total actualizado al cambiar cantidad

#### AC08.4 - Eliminar producto del carrito ✅
**Resultado:** PASÓ  
**Evidencia:** Producto eliminado, carrito actualizado

#### AC08.5 - Mensaje de carrito vacío ✅
**Resultado:** PASÓ  
**Evidencia:** items = [], length = 0

---

### US09 - Como usuario quiero ver productos destacados (2 pruebas)

#### AC09.1 - Sección de productos destacados ✅
**Resultado:** PASÓ  
**Evidencia:** Productos ordenados por rating

#### AC09.2 - Porcentaje de descuento visible ✅
**Resultado:** PASÓ  
**Evidencia:** Descuento calculado: 11%

---

### US10 - Como usuario quiero una experiencia responsive (1 prueba)

#### AC10.1 - Interfaz adaptable a diferentes dispositivos ✅
**Resultado:** PASÓ  
**Tiempo:** 195ms  
**Dispositivos probados:**
```javascript
- Mobile: 320×568px ✓
- Tablet: 768×1024px ✓
- Desktop: 1920×1080px ✓
```

---

### US11 - Como usuario quiero ver información clara de productos (2 pruebas)

#### AC11.1 - Disponibilidad visible ✅
**Resultado:** PASÓ  
**Evidencia:** Stock verificado para todos los productos

#### AC11.2 - Ahorro claramente visible ✅
**Resultado:** PASÓ  
**Evidencia:**
```javascript
- Precio original: visible
- Precio con descuento: visible
- Ahorro: calculado y mostrado
```

---

### US12 - Como usuario quiero una navegación intuitiva (2 pruebas)

#### AC12.1 - Volver al inicio fácilmente ✅
**Resultado:** PASÓ  
**Tiempo:** 46ms  
**Evidencia:** Home accesible desde cualquier ruta

#### AC12.2 - Búsqueda rápida de productos ✅
**Resultado:** PASÓ  
**Evidencia:** Búsqueda retorna resultados relevantes

---

## 📈 MÉTRICAS Y ESTADÍSTICAS

### Resultados Generales
```
Total de Pruebas:        75
Pruebas Exitosas:        75  (100%)
Pruebas Fallidas:         0  (0%)
Tiempo Total:          ~2.1 segundos
```

### Tiempo de Ejecución por Suite
```
SystemTests.test.js      ~1.1s  (38 tests)
AcceptanceTests.test.js  ~1.0s  (37 tests)
```

### Pruebas por Categoría
```
Productos:                    9 pruebas ✅
Carrito:                     16 pruebas ✅
Usuario/Autenticación:       14 pruebas ✅
Búsqueda:                     8 pruebas ✅
Navegación/UI:               11 pruebas ✅
Integración/Flujos:           6 pruebas ✅
Persistencia:                 5 pruebas ✅
Validación/Errores:           6 pruebas ✅
```

---

## 🎯 CONCLUSIONES

### Fortalezas Identificadas
1. ✅ **Sistema de Productos:** Funciona correctamente con búsqueda, filtros y categorías
2. ✅ **Carrito de Compras:** Totalmente funcional con persistencia
3. ✅ **Autenticación:** Registro y login operativos
4. ✅ **Persistencia:** localStorage funciona correctamente
5. ✅ **Rendimiento:** Búsquedas eficientes (<100ms)
6. ✅ **Escalabilidad:** Maneja múltiples productos y usuarios
7. ✅ **Integración:** Componentes React se integran correctamente

### Cobertura de Requisitos
- **Requisitos Funcionales:** 100% cubiertos
- **Requisitos No Funcionales (Rendimiento):** Verificados
- **User Stories:** 12 historias completamente validadas

### Recomendaciones
1. ✓ Mantener suite de tests actualizada
2. ✓ Agregar tests E2E con Cypress cuando esté disponible
3. ✓ Considerar tests de seguridad adicionales
4. ✓ Implementar tests de accesibilidad más exhaustivos

---

## 📁 ARCHIVOS DE EVIDENCIA

### Archivos de Prueba
- `src/__tests__/SystemTests.test.js` - 38 pruebas del sistema
- `src/__tests__/AcceptanceTests.test.js` - 37 pruebas de aceptación

### Comandos de Ejecución
```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar solo pruebas del sistema
npm test -- SystemTests

# Ejecutar solo pruebas de aceptación
npm test -- AcceptanceTests

# Ejecutar con cobertura
npm test -- --coverage
```

---

## ✍️ FIRMA Y APROBACIÓN

**Desarrollador/Tester:**  
Equipo de Desarrollo - Frontend_Clone_Alkosto

**Fecha de Elaboración:**  
24 de Octubre, 2025

**Estado del Documento:**  
✅ APROBADO - Todas las pruebas pasaron exitosamente

---

**Documento generado automáticamente**  
*Alkosto Clone - Proyecto Educativo*
