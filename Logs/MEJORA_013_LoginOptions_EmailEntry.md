# MEJORA 013 – LoginOptions acepta flujo sin correo (desde Carrito)

- Autor: Alexánder Mesa Gómez
- Fecha: 16/11/2025
- Estado: Corregido/Mejorado

## Problema
Desde `Carrito` al pulsar "Ir a pagar" sin sesión, se navegaba a `/login/options`, pero esta vista redirigía a `/` si no recibía `email` (o `pendingEmail`), ocasionando que el usuario terminara en la página principal.

## Causa Raíz
`LoginOptions.js` tenía un `useEffect` que, si `email` no estaba definido, hacía `navigate('/')`.

## Solución Implementada
- Archivo: `src/views/Login/LoginOptions.js`
  - Se elimina el redirect forzado cuando no hay email.
  - Se añade una pantalla inicial dentro de la misma vista para **ingresar el correo electrónico** (form sencillo con validación).
  - Al continuar, navega a `/login/options?email=...` manteniendo la UI existente de métodos (Whatsapp/SMS/Correo/Contraseña).
  - El botón “Modificar” ahora activa el modo de edición en la misma pantalla (no navega a `/`).

## Resultado
- El flujo `Carrito → Ir a pagar (sin login) → Login (correo) → Opciones de login` funciona correctamente.
- Tras autenticarse, gracias a `intendedCheckout`, el usuario llega a `/checkout`.
