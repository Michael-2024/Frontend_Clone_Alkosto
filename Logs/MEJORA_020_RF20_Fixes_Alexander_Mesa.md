# MEJORA 020 — RF20 y UX Fixes

- Autor: Alexánder Mesa Gómez
- Fecha: 2025-11-17
- Alcance: Correcciones de UX (carrito), sección de Cupones en Mi cuenta, robustez de LiveChat (Tawk.to) y mejoras de persistencia/visualización de cupones.

## Cambios Realizados

- LiveChat (Tawk.to):
  - Se desactiva por defecto en entornos locales y solo carga cuando `REACT_APP_ENABLE_LIVECHAT=true` y existen IDs válidos.
  - Se añadieron cargas diferidas (`defer`) y validaciones defensivas para evitar el error `t.$_Tawk.i18next is not a function`.
  - Archivo: `src/components/LiveChat/LiveChat.js`.

- Mi Cuenta — Cupones:
  - Se agregó la opción "Cupones" en el sidebar y el mosaico principal de "Mi cuenta".
  - Archivos: `src/views/Account/AccountSidebar.js`, `src/views/Account/Account.js`.

- Carrito — Método de envío:
  - La selección entre "Envío gratis" y "Recoger en tienda gratis" ahora es controlada por estado y resalta correctamente la opción elegida.
  - Archivo: `src/views/Cart/Cart.js`.

- Pedidos — Persistencia de cupón:
  - Se incluye `coupon` y `discount` en la serialización del pedido y se restauran al cargar desde `localStorage`.
  - Archivos: `src/models/Order.js`, `src/controllers/OrderController.js`.

- Cupones — UX de estado:
  - Se muestra la razón específica cuando un cupón está inválido (expirado, agotado, inactivo, etc.).
  - Archivo: `src/views/Account/Coupons.js`.

## Cómo habilitar LiveChat (opcional)

1. Crear/editar `.env` en la raíz del proyecto:

```
REACT_APP_ENABLE_LIVECHAT=true
REACT_APP_TAWK_PROPERTY_ID=<tu_property_id>
REACT_APP_TAWK_WIDGET_ID=<tu_widget_id>
```

2. Reiniciar el servidor de desarrollo.

Nota: En `localhost` el chat se mantiene desactivado por diseño para evitar errores en dev.

## Validación Rápida

- Sidebar y dashboard muestran "Cupones" y navegan a `/perfil/cupones`.
- En el carrito, al seleccionar "Recoger en tienda gratis" se aplica la clase `selected` a esa opción.
- Al aplicar un cupón y completar un pedido, el código y el descuento quedan guardados en el pedido.
- LiveChat no genera errores en dev; para producción, habilitar con variables de entorno.

## Observaciones

- Si existían sesiones previas con el widget de chat, limpiar caché del navegador tras aplicar los cambios.
- El cálculo de costos de envío en carrito se mantiene informativo; la selección no altera totales (alineado al alcance actual).
- 2025-11-18: Corregido crash en `Mis Cupones` por referencia a `isExpired` indefinida. Ahora el botón de copiado solo aparece cuando el cupón está disponible y válido, manteniendo los estados descritos en MEJORA_006.
