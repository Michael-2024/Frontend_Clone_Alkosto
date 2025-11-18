# Requerimientos Funcionales

## Documento de Especificación de Requisitos Funcionales
**Proyecto:** Sistema de E-commerce - Plataforma de Tienda Online  
**Versión:** 1.0  
**Fecha:** Sin información  

---

## Tabla de Contenidos
1. [Listado General de Requerimientos](#listado-general)
2. [Requerimientos Detallados](#requerimientos-detallados)
3. [Análisis Comparativo](#análisis-comparativo)

---

## Listado General de Requerimientos {#listado-general}

### Autenticación y Gestión de Cuentas
| ID | Descripción |
|---|---|
| RF01 | Registrar Usuario |
| RF02 | Iniciar sesión |
| RF03 | Recuperar contraseña (Cliente) |
| RF04 | Verificar correo y teléfono |
| RF05 | Recordar cuenta |

### Búsqueda y Navegación de Productos
| ID | Descripción |
|---|---|
| RF06 | Buscar Producto |
| RF07 | Filtrar categorías |
| RF08 | Filtrar productos |

### Gestión del Carrito de Compras
| ID | Descripción |
|---|---|
| RF09 | Comprar producto |
| RF14 | Añadir al carrito |
| RF15 | Actualizar el carrito |
| RF16 | Eliminar objetos del carrito |
| RF17 | Ver el carrito |

### Gestión de Favoritos
| ID | Descripción |
|---|---|
| RF10 | Añadir a favoritos |
| RF11 | Quitar de favoritos |
| RF12 | Ver favoritos |
| RF13 | Gestionar favoritos |

### Procesamiento de Pagos y Pedidos
| ID | Descripción |
|---|---|
| RF18 | Métodos de pago |
| RF19 | Cancelar pedidos |
| RF20 | Aplicar cupones/promociones |
| RF21 | Generar facturas de compra |

### Gestión de Compras e Historial
| ID | Descripción |
|---|---|
| RF22 | Mostrar historial de compras |
| RF25 | Devoluciones / garantías |

### Soporte y Comunicación
| ID | Descripción |
|---|---|
| RF23 | Chatear en línea |
| RF24 | Enviar PQRS |

### Opiniones y Calificaciones
| ID | Descripción |
|---|---|
| RF26 | Opinar y calificar |

---

## Requerimientos Detallados {#requerimientos-detallados}

### RF01 – Registrar Usuario

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué tan fácil debe ser el registro en la página (rápido, con correo/redes o formulario completo)?

**Perspectivas de los stakeholders:**

**Clientes:**
- **Cliente A:** Prefiere un registro rápido con un clic usando Google o Facebook. Considera que los formularios largos son tediosos.
- **Cliente B:** No tiene problema en registrarse con un formulario, siempre y cuando no pidan datos innecesarios.
- **Cliente C:** Considera que el registro debe ser sencillo, porque un proceso lento podría desmotivarlo a continuar con la compra.

**Empleados:**
- **Empleado 1:** Sugiere pedir lo mínimo: nombre, correo, teléfono y contraseña.
- **Empleado 2:** Recomienda integrar registro con Google o Facebook para mayor rapidez.
- **Empleado 3:** Propone incluir también la opción de Apple ID y que el cliente pueda agregar dirección desde el inicio.

**Dueños:**
- **Dueño 1:** Quiere un registro simple para no perder clientes en el proceso.
- **Dueño 2:** Considera importante que se garantice la seguridad de los datos.
- **Dueño 3:** Prefiere flexibilidad: registro rápido con redes sociales y la opción de completar más datos después.

#### Conclusión del Análisis

El registro debe ser **rápido, seguro y flexible**. Se proponen las siguientes estrategias:

- Permitir registro tradicional (formulario con datos básicos)
- Ofrecer inicio rápido con Google, Facebook o Apple ID
- Solicitar solo información necesaria (nombre, correo, teléfono y contraseña)
- Permitir completar datos adicionales (dirección, preferencias) después de la creación de la cuenta
- Garantizar que todo el proceso cumpla con normas de seguridad y privacidad de datos

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Registrar Usuario |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | El cliente crea una cuenta en la plataforma ingresando datos personales y de contacto. |
| **Actores** | Cliente, Sistema |
| **Precondiciones** | El cliente debe tener acceso a internet. Los datos ingresados deben ser válidos. |

#### Flujo Normal

1. El cliente accede al formulario de registro
2. Ingresa datos personales (nombre, correo, teléfono, dirección)
3. Crea una contraseña
4. Acepta términos y condiciones
5. El sistema valida los datos
6. El sistema crea la cuenta
7. El sistema envía correo de confirmación

#### Flujos Alternativos

- **Correo duplicado:** Si el correo ya existe, el sistema muestra un mensaje de error
- **Datos inválidos:** Si los campos no son válidos, el sistema solicita corrección

#### Postcondiciones

- La cuenta queda registrada en el sistema
- El usuario recibe un correo de bienvenida

#### Diagrama de Caso de Uso

```
Visitante → RF01 → Sistema
           ↓
      Diligenciar Formulario
           ↓
      Crear Cuenta
           ↓
      Validar Datos
           ↓
      Enviar Confirmación → Correo Electrónico
           ↓
      SQL Database
```

---

### RF02 – Iniciar Sesión

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué nivel de seguridad te genera confianza al iniciar sesión en la plataforma?

**Perspectivas de los stakeholders:**

**Clientes:**
- **Cliente A:** Prefiere notificaciones en celular y correo por cada inicio de sesión.
- **Cliente B:** Confía en páginas con candado verde y que no pidan datos innecesarios.
- **Cliente C:** Considera clave la doble verificación (correo + SMS).

**Dueños:**
- **Dueño 1 y 2:** Coinciden en que la seguridad debe ser máxima, con autenticación en dos pasos para compras de alto valor.

#### Conclusión del Análisis

El inicio de sesión debe combinar **simplicidad y seguridad**: autenticación con correo y contraseña, con la opción de doble factor para casos sensibles.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Iniciar sesión |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | El usuario accede a su cuenta mediante correo y autenticación de dos pasos. |
| **Actores** | Cliente, Sistema |
| **Precondiciones** | El cliente debe estar registrado. |

#### Flujo Normal

1. El cliente ingresa correo y autenticación de dos pasos
2. El sistema valida credenciales
3. El sistema permite el acceso a la cuenta

#### Flujos Alternativos

- **Credenciales inválidas:** Si las credenciales son inválidas, se muestra un error
- **Cuenta bloqueada:** Si la cuenta está bloqueada, se notifica al cliente

#### Postcondiciones

- El usuario queda autenticado en la plataforma

#### Diagrama de Caso de Uso

```
Cliente → Ingresar datos → RF02 → Sistema
    ↓                         ↓
Mi cuenta                  Validar datos
Mi carrito              ↓ Acceso a cuenta
Seguir pedido
Descargar factura
```

---

### RF03 – Recuperar Contraseña

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué tan importante es poder recuperar la cuenta de manera rápida y segura?

**Perspectivas de los stakeholders:**

- **Cliente A:** Prefiere recibir un correo inmediato para restablecer.
- **Cliente B:** Valora la rapidez y que no pidan demasiados pasos.
- **Cliente C:** Prefiere autenticación mediante OTP o SMS.
- **Empleado 1:** Sugiere que el sistema sea simple y sin esperas largas.

#### Conclusión del Análisis

Debe existir un mecanismo de recuperación **ágil y seguro**, ya sea correo o SMS, garantizando que el cliente no pierda acceso a su cuenta por olvidos.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Recuperar contraseña |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Permite restablecer la contraseña en caso de olvido. |
| **Actores** | Cliente, Sistema |
| **Precondiciones** | El cliente debe estar registrado. |

#### Flujo Normal

1. El cliente accede a "Olvidé mi contraseña"
2. Ingresa correo registrado
3. El sistema envía enlace/código de recuperación
4. El cliente ingresa nueva contraseña
5. El sistema actualiza la clave

#### Flujos Alternativos

- **Correo no registrado:** Si el correo no está registrado, se notifica al cliente

#### Postcondiciones

- El cliente puede iniciar sesión con su nueva contraseña

#### Diagrama de Caso de Uso

```
Cliente → Recuperar Contraseña → RF03 → Sistema
    ↓                                ↓
Ingresar correo/teléfono       Generar token temporal
                               ↓ Enviar enlace o código OTP
                               ↓ Sistema de Notificaciones
                        Restablecer contraseña
```

---

### RF04 – Verificar Correo y Teléfono

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué tan importante es confirmar datos de contacto durante el registro?

**Perspectivas de los stakeholders:**

- **Cliente A y C:** Consideran clave recibir notificaciones de validación en correo o celular.
- **Cliente B:** Prefiere evitar datos innecesarios, pero acepta validación mínima.
- **Dueño 2 y 3:** Resaltan la seguridad de validar cuentas reales.

#### Conclusión del Análisis

El sistema debe realizar validaciones automáticas (enlace de verificación por correo y OTP opcional en teléfono) para garantizar confianza y comunicación efectiva.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Verificar correo y teléfono |
| **Autor** | Sistema |
| **Fecha** | Sin información |
| **Descripción** | Valida que los datos de contacto ingresados por el cliente sean correctos. |
| **Actores** | Cliente, Sistema, Proveedor de correo/SMS |
| **Precondiciones** | El cliente debe haber registrado sus datos. |

#### Flujo Normal

1. El sistema envía correo de verificación
2. El sistema envía SMS (opcional)
3. El cliente confirma mediante enlace o código
4. El sistema valida confirmación

#### Flujos Alternativos

- **Sin confirmación:** Si no confirma, la cuenta queda inactiva hasta validación
- **Código expirado:** Si el código expira, debe solicitarse otro

#### Postcondiciones

- El correo y teléfono quedan validados

#### Diagrama de Caso de Uso

```
Cliente → Verificar correo y teléfono → RF04 → Sistema
    ↓                                        ↓
Ingresar código OTP                   Enviar código OTP
                                      ↓ Notificación de validación
                                      ↓ Sistema de Notificaciones
                                 Confirmar verificación
```

---

### RF05 – Recordar Cuenta

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué tan útil resulta mantener la sesión activa en un dispositivo?

**Perspectivas de los stakeholders:**

- **Cliente A:** Considera que mejora la experiencia al no tener que iniciar sesión cada vez.
- **Cliente B:** Prefiere seguridad, pero acepta la opción si es configurable.
- **Cliente C:** Le parece práctico en el celular.

#### Conclusión del Análisis

Debe implementarse la opción de **"recordar cuenta"** con cookies seguras, permitiendo al usuario decidir si quiere mantener la sesión activa.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Recordar cuenta |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Permite mantener la sesión activa para accesos futuros más rápidos. |
| **Actores** | Cliente, Sistema |
| **Precondiciones** | El usuario debe haber iniciado sesión. |

#### Flujo Normal

1. El cliente marca "Recordar cuenta"
2. El sistema guarda cookies seguras
3. El cliente accede sin volver a autenticarse

#### Flujos Alternativos

- **Cookie eliminada:** Si se borra la cookie, deberá autenticarse nuevamente

#### Postcondiciones

- La sesión permanece activa hasta que el cliente cierre o borre cookies

#### Diagrama de Caso de Uso

```
Cliente → Seleccionar 'Recordar sesión' → RF05 → Sistema
    ↓                                          ↓
Recordar cuenta                        Almacenar cookies seguras
                                       ↓ Iniciar Sesión
                                       ↓ Administrador
```

---

### RF06 – Buscar Producto

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué importancia tiene contar con un buscador funcional en la tienda online?

**Perspectivas de los stakeholders:**

- **Cliente A:** Usa más el celular, por lo que el buscador debe ser rápido.
- **Cliente B:** Prefiere en PC, donde puede abrir varias pestañas.
- **Empleado 1:** Requiere buscador visible y eficiente.
- **Empleado 2:** Sugiere incluir autocompletado y resultados claros.

#### Conclusión del Análisis

El buscador debe ser **visible, ágil y preciso**, con sugerencias inteligentes y categorización para mejorar la experiencia de compra.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Buscar Producto |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | El cliente puede localizar productos mediante un buscador interno. |
| **Actores** | Cliente, Sistema |
| **Precondiciones** | Deben existir productos registrados en la base de datos. |

#### Flujo Normal

1. El cliente ingresa la palabra clave
2. El sistema busca coincidencias
3. El sistema muestra resultados relevantes

#### Flujos Alternativos

- **Sin resultados:** Si no hay resultados, se muestra el mensaje "No se encontraron productos"

#### Postcondiciones

- El cliente puede navegar entre los resultados mostrados

#### Diagrama de Caso de Uso

```
Cliente → Ingresa palabra clave → RF06 → Sistema
    ↓                                 ↓
Lo más buscado                   Buscar resultados
Última búsqueda              ↓ Mostrar resultados
                        Mensaje 'No se encontraron productos'

Palabras clave sugeridas:
- Lavadoras, Celulares, Televisores
- Tablet, Estufas, Cafeteras
- Licuadoras, Ventiladores, Computadores, Audífonos
```

---

### RF07 – Filtrar Categorías

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué categorías principales debe mostrar la plataforma?

**Perspectivas de los stakeholders:**

- **Clientes:** Coinciden en Tecnología, Electrodomésticos y Hogar.
- **Empleado 3:** Agrega Motos, Llantas y Alimentos.
- **Dueños:** Resaltan que debe haber "Ofertas del día" y secciones destacadas.

#### Conclusión del Análisis

El sistema debe permitir navegar categorías amplias (Tecnología, Hogar, Electrodomésticos, etc.) con posibilidad de agregar dinámicamente nuevas secciones.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Filtrar categorías |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Permite navegar los productos organizados en categorías específicas. |
| **Actores** | Cliente, Sistema |
| **Precondiciones** | Los productos deben estar asociados a categorías. |

#### Flujo Normal

1. El cliente selecciona una categoría
2. El sistema filtra productos asociados
3. Se muestran productos de esa categoría

#### Flujos Alternativos

- **Categoría vacía:** Si la categoría está vacía, se muestra mensaje

#### Postcondiciones

- El cliente visualiza productos filtrados por categoría

---

### RF08 – Filtrar Productos

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué filtros deben ser los más relevantes para encontrar productos?

**Perspectivas de los stakeholders:**

- **Cliente A:** Busca precio y reseñas.
- **Cliente B:** Prefiere ver especificaciones técnicas y opciones de color/talla.
- **Cliente C:** Valora descripciones técnicas claras.
- **Empleado 1:** Recomienda filtros por marca (Samsung, Apple).

#### Conclusión del Análisis

El sistema debe ofrecer filtros por **precio, marca, disponibilidad, especificaciones técnicas y valoración de usuarios**.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Filtrar productos |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Permite aplicar filtros como precio, marca o disponibilidad. |
| **Actores** | Cliente, Sistema |
| **Precondiciones** | Los productos deben tener atributos configurados (precio, marca, stock). |

#### Flujo Normal

1. El cliente selecciona filtros
2. El sistema aplica los filtros
3. El sistema muestra resultados filtrados

#### Flujos Alternativos

- **Sin coincidencias:** Si no hay coincidencias, mostrar "Sin resultados"

#### Postcondiciones

- El cliente obtiene un conjunto reducido de resultados

---

### RF09 – Comprar Producto

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué pasos consideran necesarios en una compra online?

**Perspectivas de los stakeholders:**

- **Cliente A y C:** Prefieren claridad en notificaciones y resumen de la compra.
- **Cliente B:** Da importancia a rapidez (checkout en pocos pasos).
- **Empleados:** Recomiendan máximo 4 pasos: carrito → dirección → pago → confirmación.
- **Dueños:** Resaltan la importancia de usar pasarelas seguras (PayU, MercadoPago).

#### Conclusión del Análisis

La compra debe realizarse en un flujo **rápido y seguro**, con notificaciones en cada etapa, barra de progreso y pasarela confiable.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Comprar producto |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Permite completar el proceso de compra en línea. |
| **Actores** | Cliente, Sistema, Pasarela de pago |
| **Precondiciones** | El cliente debe tener productos en el carrito. |

#### Flujo Normal

1. El cliente revisa el carrito
2. Ingresa datos de envío
3. Selecciona método de pago
4. El sistema procesa pagos
5. El sistema genera confirmación

#### Flujos Alternativos

- **Pago fallido:** Si el pago falla, se ofrece reintento
- **Stock agotado:** Si el stock se agotó, se notifica al cliente

#### Postcondiciones

- Se genera un pedido confirmado
- Se descuenta el stock

---

### RF10 – Añadir a Favoritos

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué utilidad tiene guardar productos en favoritos?

**Perspectivas de los stakeholders:**

- **Cliente A:** Facilita recordar productos que le interesan.
- **Cliente B:** Prefiere usarlo como lista de comparaciones.
- **Cliente C:** Le resulta útil para revisar luego desde otra sesión/dispositivo.

#### Conclusión del Análisis

El sistema debe permitir a los clientes guardar y acceder a productos favoritos de manera **persistente en su cuenta**.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Añadir a favoritos |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Permite guardar productos en una lista personal de favoritos. |
| **Actores** | Cliente, Sistema |
| **Precondiciones** | El cliente debe estar autenticado. |

#### Flujo Normal

1. El cliente selecciona "Añadir a favoritos"
2. El sistema guarda el producto en la lista del usuario
3. Confirmación visual

#### Flujos Alternativos

- **No autenticado:** Si el cliente no ha iniciado sesión, el sistema sugiere registrarse

#### Postcondiciones

- El producto queda guardado en favoritos

#### Diagrama de Caso de Uso

```
Cliente → Click en 'Añadir a favoritos' → RF10 → Sistema
    ↓                                         ↓
                                      Añadir a Favoritos
                                      ↓ Guardar producto en lista personal
```

---

### RF11 – Quitar de Favoritos

#### Análisis del Requerimiento

**Pregunta clave:** ¿Debe poder eliminarse fácilmente un producto de favoritos?

**Perspectivas de los stakeholders:**

- **Cliente A:** Quiere simplicidad: "con un clic".
- **Cliente B:** Valora que se confirme antes de borrar para no hacerlo por error.
- **Cliente C:** Considera clave que se actualice en todos los dispositivos.

#### Conclusión del Análisis

El sistema debe permitir eliminar productos de la lista de favoritos de forma **rápida y sincronizada**, con confirmación opcional.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Quitar de favoritos |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Elimina productos previamente agregados a favoritos. |
| **Actores** | Cliente, Sistema |
| **Precondiciones** | Debe existir un producto en favoritos. |

#### Flujo Normal

1. El cliente selecciona "Quitar de favoritos"
2. El sistema elimina el producto de la lista

#### Flujos Alternativos

- Sin información

#### Postcondiciones

- El producto ya no aparece en la lista de favoritos

---

### RF12 – Ver Favoritos

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué tan útil es ver todos los productos guardados en una lista centralizada?

**Perspectivas de los stakeholders:**

- **Cliente A:** Le gusta ver todos los productos sin tener que buscarlos de nuevo.
- **Cliente B:** Prefiere que se puedan ordenar (precio, más recientes).
- **Cliente C:** Valora que la lista sea accesible desde cualquier dispositivo.

#### Conclusión del Análisis

El sistema debe mostrar todos los favoritos del usuario en una lista ordenada y accesible con opciones de clasificación.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Ver favoritos |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Permite visualizar todos los productos agregados a favoritos. |
| **Actores** | Cliente, Sistema |
| **Precondiciones** | El cliente debe tener productos en favoritos. |

#### Flujo Normal

1. El cliente accede a la lista de favoritos
2. El sistema muestra todos los productos guardados

#### Flujos Alternativos

- **Lista vacía:** Si la lista está vacía, mostrar el mensaje "No tiene favoritos guardados"

#### Postcondiciones

- El cliente puede gestionar su lista

---

### RF13 – Gestionar Favoritos

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué funciones adicionales debería tener la lista de favoritos?

**Perspectivas de los stakeholders:**

- **Cliente A:** Quiere poder mover productos al carrito desde favoritos.
- **Cliente B:** Sugiere agrupar productos por categoría.
- **Empleado 1:** Recomienda la opción de eliminar varios a la vez.

#### Conclusión del Análisis

La lista de favoritos debe ser **dinámica y flexible**, permitiendo mover productos al carrito, organizarlos y gestionarlos en bloque.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Gestionar favoritos |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Permite mover productos entre carrito y favoritos, o eliminar lista completa. |
| **Actores** | Cliente, Sistema |
| **Precondiciones** | El cliente debe tener productos en favoritos. |

#### Flujo Normal

1. El cliente selecciona acción (mover al carrito o eliminar lista)
2. El sistema ejecuta la acción
3. Confirmación visual

#### Flujos Alternativos

- Sin información

#### Postcondiciones

- Los productos quedan gestionados según la acción

---

### RF14 – Añadir al Carrito

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué esperas al añadir un producto al carrito?

**Perspectivas de los stakeholders:**

- **Cliente A:** Confirmación inmediata.
- **Cliente B:** Ver el stock disponible al añadir.
- **Cliente C:** Prefiere ver una miniatura del carrito actualizada.

#### Conclusión del Análisis

El sistema debe permitir **añadir productos al carrito** con validación de stock, confirmación visual y actualización instantánea del total.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Añadir al carrito |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Añade productos al carrito para iniciar compra. |
| **Actores** | Cliente, Sistema |
| **Precondiciones** | El producto debe existir y tener stock. |

#### Flujo Normal

1. El cliente selecciona "Añadir al carrito"
2. El sistema valida el stock
3. El producto se añade al carrito
4. El sistema actualiza el carrito

#### Flujos Alternativos

- **Sin stock:** Si no hay stock, se muestra el mensaje "Producto no disponible"

#### Postcondiciones

- El carrito contiene el producto

#### Diagrama de Caso de Uso

```
Cliente → Añadir al carrito → RF14 → Sistema
    ↓                             ↓
                          Validar stock disponible
                          ↓ Actualizar carrito
                          ↓ Mensaje 'producto no disponible'
```

---

### RF15 – Actualizar el Carrito

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué acciones debería permitir el carrito una vez lleno?

**Perspectivas de los stakeholders:**

- **Cliente A:** Cambiar cantidades fácilmente.
- **Cliente B:** Prefiere ver cuánto aumenta/disminuye el costo en tiempo real.
- **Empleado 2:** Recomienda recalcular promociones y descuentos.

#### Conclusión del Análisis

El carrito debe permitir **modificar cantidades, recalcular precios, actualizar promociones** y mostrar el nuevo total en tiempo real.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Actualizar el carrito |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Permite modificar cantidades o características de productos en el carrito. |
| **Actores** | Cliente, Sistema |
| **Precondiciones** | El carrito debe contener productos. |

#### Flujo Normal

1. El cliente selecciona el producto
2. Modifica cantidad
3. El sistema actualiza subtotal y total

#### Flujos Alternativos

- **Stock insuficiente:** Si la cantidad supera el stock, se notifica

#### Postcondiciones

- El carrito se actualiza correctamente

---

### RF16 – Eliminar Productos del Carrito

#### Análisis del Requerimiento

**Pregunta clave:** ¿Cómo prefieres quitar un producto del carrito?

**Perspectivas de los stakeholders:**

- **Cliente A:** Opción rápida de "Eliminar".
- **Cliente B:** Confirma que debe pedirse validación antes de borrar.
- **Cliente C:** Sugiere poder eliminar varios artículos al mismo tiempo.

#### Conclusión del Análisis

Debe haber opción de eliminar uno o más productos con confirmación, mostrando el nuevo total al instante.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Eliminar productos del carrito |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Retira productos no deseados del carrito. |
| **Actores** | Cliente, Sistema |
| **Precondiciones** | El carrito debe contener productos. |

#### Flujo Normal

1. El cliente selecciona el producto a eliminar
2. El sistema retira el producto
3. El sistema recalcula totales

#### Flujos Alternativos

- Sin información

#### Postcondiciones

- El carrito se actualiza sin los productos eliminados

---

### RF17 – Ver el Carrito

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué debería mostrar el carrito antes de comprar?

**Perspectivas de los stakeholders:**

- **Cliente A:** Productos, cantidades y precios.
- **Cliente B:** Gastos de envío estimados.
- **Cliente C:** Tiempo estimado de entrega.
- **Empleados:** Recomiendan mostrar subtotal, descuentos y total.

#### Conclusión del Análisis

El carrito debe mostrar un **resumen detallado** de productos, costos, descuentos, envío y tiempo estimado.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Ver el carrito |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Permite visualizar el contenido del carrito y su costo total. |
| **Actores** | Cliente, Sistema |
| **Precondiciones** | El carrito debe contener productos. |

#### Flujo Normal

1. El cliente accede al carrito
2. El sistema muestra productos con detalle y precios

#### Flujos Alternativos

- **Carrito vacío:** Si está vacío, se muestra el mensaje "No hay productos en el carrito"

#### Postcondiciones

- El cliente visualiza los productos seleccionados

---

### RF18 – Métodos de Pago

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué medios de pago prefieren usar?

**Perspectivas de los stakeholders:**

- **Cliente A:** Tarjeta de crédito.
- **Cliente B:** Transferencia bancaria (PSE).
- **Cliente C:** Pago contra entrega.
- **Dueños:** Sugieren billeteras digitales (Nequi, Daviplata).

#### Conclusión del Análisis

El sistema debe integrar **múltiples métodos de pago** (tarjetas, transferencias, efectivo, billeteras digitales) y permitir al cliente escoger el más conveniente.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Métodos de pago |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Permite seleccionar entre opciones como tarjetas, transferencias o efectivo. |
| **Actores** | Cliente, Sistema, Pasarela de pago |
| **Precondiciones** | El cliente debe tener productos en el carrito. |

#### Flujo Normal

1. El cliente selecciona el método de pago
2. El sistema conecta con la pasarela
3. El pago se procesa

#### Flujos Alternativos

- **Pago rechazado:** Si el pago es rechazado, ofrecer métodos alternativos

#### Postcondiciones

- El pedido queda pagado y registrado

---

### RF19 – Cancelar Pedidos

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué tan necesario es cancelar un pedido después de realizarlo?

**Perspectivas de los stakeholders:**

- **Cliente A:** Considera útil siempre que no se haya enviado.
- **Cliente B:** Sugiere un límite de tiempo (ej. 24 horas).
- **Dueños:** Prefieren reglas claras para devoluciones y costos asociados.

#### Conclusión del Análisis

Debe existir opción de cancelar pedidos con **restricciones de tiempo y estado**, siguiendo las políticas de la tienda.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Cancelar pedidos |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Permite cancelar pedidos dentro de plazos establecidos. |
| **Actores** | Cliente, Sistema, Administrador |
| **Precondiciones** | El cliente debe tener pedidos activos. |

#### Flujo Normal

1. El cliente selecciona el pedido a cancelar
2. El sistema valida la política de cancelación
3. El pedido se cancela
4. Se genera notificación

#### Flujos Alternativos

- **Plazo vencido:** Si el plazo venció, no se permite cancelar

#### Postcondiciones

- El pedido cambia a estado "Cancelado"

---

### RF20 – Aplicar Cupones/Promociones

#### Análisis del Requerimiento

**Pregunta clave:** ¿Cómo debería funcionar la aplicación de cupones?

**Perspectivas de los stakeholders:**

- **Cliente A:** Espera que sea fácil de aplicar antes de pagar.
- **Cliente B:** Prefiere validación automática al ingresar código.
- **Cliente C:** Sugiere ver el descuento aplicado al instante.

#### Conclusión del Análisis

El sistema debe permitir aplicar cupones válidos en el checkout, con **validación en tiempo real** y visualización inmediata del descuento.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Aplicar cupones/promociones |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Permite ingresar códigos de descuento o promociones vigentes. |
| **Actores** | Cliente, Sistema |
| **Precondiciones** | El cliente debe tener un carrito con productos. |

#### Flujo Normal

1. El cliente ingresa código promocional
2. El sistema valida vigencia
3. El sistema aplica descuento
4. Se actualiza total

#### Flujos Alternativos

- **Código inválido:** Si el código no es válido, se notifica

#### Postcondiciones

- El carrito refleja el descuento aplicado

---

### RF21 – Generar Facturas de Compra

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué información debe incluir la factura electrónica?

**Perspectivas de los stakeholders:**

- **Cliente A:** Subtotal y descuentos aplicados.
- **Cliente B:** Impuestos y costo de envío.
- **Cliente C:** Número de pedido y fecha.
- **Dueños:** Exigen que sea válida legalmente (DIAN).

#### Conclusión del Análisis

La factura debe incluir **subtotal, impuestos, descuentos, envío, total, fecha y número de pedido**, y cumplir con normativa fiscal.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Generar facturas de compra |
| **Autor** | Sistema |
| **Fecha** | Sin información |
| **Descripción** | Emite facturas electrónicas por cada transacción. |
| **Actores** | Sistema, Cliente, Administrador |
| **Precondiciones** | Debe existir una compra confirmada. |

#### Flujo Normal

1. Tras un pago exitoso, el sistema genera factura
2. El documento incluye subtotal, descuentos, impuestos y envío
3. Se envía copia al correo del cliente

#### Flujos Alternativos

- Sin información

#### Postcondiciones

- El cliente recibe factura digital válida

---

### RF22 – Mostrar Historial de Compras

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué información esperas ver en tu historial de compras?

**Perspectivas de los stakeholders:**

- **Cliente A:** Fechas, productos comprados y precios.
- **Cliente B:** Estado actual (entregado, en camino, cancelado).
- **Cliente C:** Prefiere descargar la factura desde ahí.
- **Empleados:** Recomiendan incluir filtros (por fecha, producto o estado).

#### Conclusión del Análisis

El sistema debe permitir consultar el historial con **detalles de pedidos, estado, facturas descargables y filtros avanzados**.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Mostrar historial de compras |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Permite consultar el historial completo de compras. |
| **Actores** | Cliente, Sistema |
| **Precondiciones** | El cliente debe haber realizado compras. |

#### Flujo Normal

1. El cliente accede a "Historial de compras"
2. El sistema lista compras previas
3. El cliente puede ver detalles

#### Flujos Alternativos

- **Sin compras previas:** Si no existen compras, se muestra mensaje

#### Postcondiciones

- El cliente visualiza su historial

---

### RF23 – Chatear en Línea

#### Análisis del Requerimiento

**Pregunta clave:** ¿Cómo te gustaría recibir actualizaciones de tu pedido?

**Perspectivas de los stakeholders:**

- **Cliente A:** SMS y correo en cada etapa.
- **Cliente B:** Notificaciones push desde la página/app.
- **Cliente C:** Prefiere WhatsApp además de correo.
- **Dueños:** Sugieren automatización para no depender de personal.

#### Conclusión del Análisis

El sistema debe enviar **notificaciones automáticas en múltiples canales** (correo, SMS, WhatsApp, push) cada vez que cambie el estado del pedido.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Chatear en línea |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Permite interactuar en tiempo real con un bot o asesor humano. |
| **Actores** | Cliente, Sistema, Agente de soporte |
| **Precondiciones** | El cliente debe estar en la página web. |

#### Flujo Normal

1. El cliente abre el chat
2. Interactúa con bot o asesor humano
3. Se resuelve la consulta

#### Flujos Alternativos

- Sin información

#### Postcondiciones

- La consulta queda registrada y resuelta

---

### RF24 – Enviar PQRS

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué proceso de devolución sería ideal?

**Perspectivas de los stakeholders:**

- **Cliente A:** Simple, con pasos claros en la web.
- **Cliente B:** Seguimiento del estado de devolución.
- **Cliente C:** Prefiere que se genere una guía de envío automático.
- **Proveedores:** Necesitan que quede registrado para control logístico.

#### Conclusión del Análisis

El sistema debe incluir un **módulo de solicitud, seguimiento y confirmación de devoluciones**, con integración logística para guías automáticas.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Enviar PQRS |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Permite registrar peticiones, quejas, reclamos o sugerencias. |
| **Actores** | Cliente, Sistema, Administrador |
| **Precondiciones** | El cliente debe estar autenticado. |

#### Flujo Normal

1. El cliente llena el formulario PQRS
2. El sistema crea ticket con radicado
3. Se asigna a responsable
4. Se notifica al cliente

#### Flujos Alternativos

- Sin información

#### Postcondiciones

- El ticket queda registrado en el sistema

---

### RF25 – Devoluciones / Garantías

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué esperas de un sistema de reseñas?

**Perspectivas de los stakeholders:**

- **Cliente A:** Leer reseñas negativas primero.
- **Cliente B:** Ver solo reseñas recientes.
- **Cliente C:** Poder puntuar con estrellas y añadir comentarios.
- **Empleados:** Sugieren filtrar reseñas por "mejor calificadas" o "más recientes".

#### Conclusión del Análisis

El sistema debe permitir **publicar, filtrar y mostrar reseñas** con puntuación, dando prioridad a las más recientes y útiles.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Devoluciones / garantías |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Gestiona solicitudes de devolución o garantía de productos. |
| **Actores** | Cliente, Sistema, Administrador |
| **Precondiciones** | El cliente debe tener una compra registrada. |

#### Flujo Normal

1. El cliente solicita devolución/garantía
2. El sistema valida políticas y tiempo
3. El cliente adjunta evidencia
4. El administrador aprueba/rechaza

#### Flujos Alternativos

- **No cumple condiciones:** Si no cumple condiciones, se rechaza la solicitud

#### Postcondiciones

- La devolución/garantía se procesa o rechaza

---

### RF26 – Opinar y Calificar

#### Análisis del Requerimiento

**Pregunta clave:** ¿Qué funciones debe tener el panel para el administrador?

**Perspectivas de los stakeholders:**

- **Dueño 1:** Reportes automáticos de ventas e inventario.
- **Dueño 2:** Control de usuarios, productos y promociones.
- **Dueño 3:** Alertas de productos agotados o más vendidos.
- **Empleados:** Herramientas de gestión rápida (crear, editar, eliminar productos).

#### Conclusión del Análisis

El panel administrativo debe ser **completo y seguro**, con funciones de gestión de usuarios, productos, inventario, ventas, promociones y reportes automáticos con alertas.

#### Especificación Técnica

| Campo | Descripción |
|---|---|
| **Nombre** | Opinar y calificar |
| **Autor** | Cliente |
| **Fecha** | Sin información |
| **Descripción** | Permite dejar comentarios y calificaciones sobre productos. |
| **Actores** | Cliente, Sistema |
| **Precondiciones** | El cliente debe haber comprado el producto. |

#### Flujo Normal

1. El cliente accede a la sección de opiniones
2. Escribe comentario y asigna calificación
3. El sistema guarda la opinión
4. Se muestra en el producto

#### Flujos Alternativos

- **Cliente no comprador:** Si el cliente no ha comprado, no puede opinar

#### Postcondiciones

- El producto muestra opiniones y calificaciones

---

## Análisis Comparativo {#análisis-comparativo}

### Matriz de Prioridades por Stakeholder

| Requerimiento | Clientes | Empleados | Dueños | Prioridad |
|---|---|---|---|---|
| Registro rápido | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | CRÍTICA |
| Búsqueda y filtros | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | CRÍTICA |
| Carrito intuitivo | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | CRÍTICA |
| Múltiples pagos | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | CRÍTICA |
| Seguridad | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | CRÍTICA |
| Historial compras | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ALTA |
| Soporte/Chat | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ | MEDIA |
| Reseñas y opiniones | ⭐⭐ | ⭐ | ⭐⭐⭐ | MEDIA |

### Áreas Clave del Sistema

**1. Autenticación y Seguridad**
- Registro flexible con múltiples opciones (redes sociales, formulario)
- Validación de datos de contacto
- Autenticación de dos factores opcional
- Recuperación de contraseña segura

**2. Experiencia de Compra**
- Búsqueda avanzada con autocompletado
- Filtros dinámicos y categorizados
- Carrito con actualización en tiempo real
- Checkout simplificado (máximo 4 pasos)

**3. Métodos de Pago**
- Integración de múltiples pasarelas
- Soporte para tarjetas, transferencias, efectivo
- Billeteras digitales (Nequi, Daviplata)
- Procesamiento seguro

**4. Post-Compra**
- Facturación legal (DIAN)
- Historial detallado con filtros
- Seguimiento de pedidos
- Sistema de devoluciones integrado

**5. Gestión de Favoritos**
- Lista persistente por usuario
- Sincronización multi-dispositivo
- Opciones de gestión (mover al carrito, eliminar)

**6. Soporte al Cliente**
- Chat en línea con bot/asesor
- Sistema PQRS integrado
- Notificaciones en múltiples canales
- Reseñas y calificaciones de productos

---

## Conclusiones y Recomendaciones

### Hallazgos Principales

1. **Equilibrio entre usabilidad y seguridad:** Los stakeholders valoran tanto la velocidad como la seguridad. Se requiere un diseño que no comprometa ninguna de las dos.

2. **Flexibilidad en procesos:** Los usuarios tienen perfiles diversos; el sistema debe ofrecer múltiples opciones (registro, métodos de pago, interacción).

3. **Automatización:** Los dueños buscan reducir dependencia de personal mediante automatización (facturas, notificaciones, devoluciones).

4. **Integración multi-canal:** Las notificaciones y soporte deben funcionar en correo, SMS, WhatsApp y push.

5. **Gestión integral:** El sistema debe cubrir todo el ciclo de vida del cliente: registro → compra → post-compra → devolución.
