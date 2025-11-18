# MEJORA 012 – Redirección a Login desde Carrito y post-login a Checkout

- Autor: Alexánder Mesa Gómez
- Fecha: 16/11/2025
- Estado: Corregido/Mejorado

## Problema
Al intentar pagar sin estar logueado, la navegación podía terminar en la página principal en lugar de llevar al flujo de inicio de sesión que se observa en el sitio original.

## Causa Raíz
- Tras el login, las vistas `LoginPassword` y `LoginCode` navegaban incondicionalmente a `/`, ignorando la intención de compra.

## Solución Implementada
- `src/views/Cart/Cart.js` (existente): Si no hay sesión, ya redirigía a `/login/options`; se conserva y además se guarda `localStorage.intendedCheckout = 'true'`.
- `src/views/Login/LoginPassword.js` y `src/views/Login/LoginCode.js`:
  - Tras login exitoso: si existe `intendedCheckout`, se elimina y se navega a `/checkout`; de lo contrario, a `/`.

## Resultado
- Al pulsar "Ir a pagar" sin sesión, se abre la pantalla de login (correo) como en el flujo esperado.
- Tras autenticarse, el usuario llega directamente a `/checkout` para completar la compra.

## Recomendaciones Futuras
- Añadir un parámetro `returnTo=/checkout` en query para flujos más explícitos y evitar depender de localStorage.
