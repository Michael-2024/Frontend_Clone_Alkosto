# MEJORA 011 – RF21: Generación y descarga de facturas

- Autor: Alexánder Mesa Gómez
- Fecha: 16/11/2025
- Estado: Implementado (Frontend)

## Objetivo
Hacer completamente funcional el RF21 permitiendo al usuario descargar en PDF las facturas de sus compras realizadas.

## Arquitectura y Alcance
- Se respeta el patrón MVC:
  - Modelos: `Order` ya existente, consumido por la vista
  - Controladores: `OrderController.getUserOrders()` para obtener pedidos
  - Servicio nuevo: `InvoiceService` genera el PDF desde la orden
  - Vista: `Account/Invoice.js` lista pedidos y permite descarga
- Generación de PDF en cliente con `jspdf` + `jspdf-autotable`.

## Cambios Realizados
- Nuevo: `src/services/InvoiceService.js`
  - `generate(order, user)`: Renderiza encabezado, datos del comprador, tabla de items y totales. Guarda archivo `Factura_ALK_{tracking}.pdf`.
- Actualizado: `src/views/Account/Invoice.js`
  - Lista pedidos del usuario y agrega botón "Descargar factura (PDF)".
  - Muestra resumen de cantidad de pedidos y total acumulado.
  - Mantiene redirección a login si no hay sesión.
- `package.json`: Se agregan dependencias `jspdf` y `jspdf-autotable`.

## Resultado
- Usuarios autenticados ven sus pedidos y pueden descargar la factura en PDF para cada orden.
- Los PDF incluyen información de empresa, datos del comprador, productos, subtotales, envío, descuentos y total.

## Consideraciones
- Cálculo de IVA no se discrimina (total final según orden); puede extenderse si backend provee base + impuesto.
- Cuando exista endpoint oficial de facturación en backend, `InvoiceService` podrá delegar la descarga al servicio.
