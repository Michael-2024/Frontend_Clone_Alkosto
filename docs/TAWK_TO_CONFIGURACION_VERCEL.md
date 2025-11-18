# Configuración de Tawk.to en Vercel

## 📋 Información de la Cuenta

- **URL del sitio:** https://frontend-clone-alkosto.vercel.app/
- **Cuenta Tawk.to:** deprogrammers.utp@outlook.com
- **Dashboard:** https://dashboard.tawk.to/
- **Property ID:** `691b5385169d6d195aa8e9ab`
- **Widget ID:** `1ja9bsh1l`

---

## ⚙️ Configurar Variables de Entorno en Vercel

### Paso 1: Acceder al Dashboard de Vercel

1. Ve a https://vercel.com/ e inicia sesión
2. Selecciona el proyecto **frontend-clone-alkosto**
3. Ve a la pestaña **Settings** (Configuración)

### Paso 2: Agregar Variables de Entorno

1. En el menú lateral izquierdo, haz clic en **Environment Variables**
2. Agrega las siguientes variables **una por una**:

#### Variable 1: REACT_APP_TAWK_PROPERTY_ID
```
Key: REACT_APP_TAWK_PROPERTY_ID
Value: 691b5385169d6d195aa8e9ab
Environment: Production, Preview, Development (seleccionar todas)
```

#### Variable 2: REACT_APP_TAWK_WIDGET_ID
```
Key: REACT_APP_TAWK_WIDGET_ID
Value: 1ja9bsh1l
Environment: Production, Preview, Development (seleccionar todas)
```

3. Haz clic en **Save** (Guardar) para cada variable

### Paso 3: Re-desplegar la Aplicación

Después de agregar las variables, es necesario volver a desplegar para que tomen efecto:

**Opción A: Desde la UI de Vercel**
1. Ve a la pestaña **Deployments**
2. Haz clic en los tres puntos `...` del último deployment
3. Selecciona **Redeploy**
4. Confirma el re-despliegue

**Opción B: Desde Git (Recomendado)**
```bash
git add .
git commit -m "feat: Configurar Tawk.to con IDs de producción"
git push origin alex_mesa2
```

Vercel detectará el cambio y desplegará automáticamente.

---

## 🔧 Configurar Dominio en Dashboard de Tawk.to

### Paso 1: Agregar Dominio Permitido

Para que el widget funcione correctamente en Vercel, debes agregar el dominio:

1. Ve a https://dashboard.tawk.to/
2. Inicia sesión con **deprogrammers.utp@outlook.com**
3. Ve a **Administration** → **Property Widget**
4. En la sección **"Allowed Domains"** o **"Widget Settings"**:
   - Agrega: `frontend-clone-alkosto.vercel.app`
   - Agrega también: `*.vercel.app` (para preview deployments)
   - **Opcional:** Agrega `localhost` para desarrollo local

5. Haz clic en **Save Changes**

### Paso 2: Configurar Información del Sitio

1. En el mismo dashboard, ve a **Administration** → **Property Settings**
2. Actualiza la información:
   ```
   Property Name: Alkosto Clone
   Website URL: https://frontend-clone-alkosto.vercel.app
   Description: Clon educativo de e-commerce Alkosto
   ```

---

## 🎨 Personalizar Apariencia del Widget

### Colores de Marca Alkosto

1. Ve a **Administration** → **Property Widget** → **Widget Appearance**
2. Configura los siguientes colores:

```
Chat Bubble Color: #00A859 (Verde Alkosto)
Chat Window Header: #004797 (Azul Alkosto)
Button Text Color: #FFFFFF (Blanco)
Widget Position: Bottom Right
Horizontal Offset: 20px
Vertical Offset: 20px
```

3. **Widget Size:**
   - Desktop: Normal (default)
   - Mobile: Full screen cuando se abre

4. **Bubble Icon:** Selecciona el ícono de chat que prefieras (recomendado: chat bubble simple)

---

## 📝 Configurar Mensajes Automáticos (Triggers)

### Trigger 1: Bienvenida General

1. Ve a **Dashboard** → **Shortcuts** → **Triggers**
2. Haz clic en **+ Add Trigger**
3. Configura:

```
Nombre: Bienvenida General
Condición: Visitor has been on page for 10 seconds
Mensaje: ¡Hola! 👋 Bienvenido a Alkosto. ¿En qué puedo ayudarte hoy?
Páginas: Todas las páginas
Activo: Sí
```

### Trigger 2: Ayuda en Carrito

```
Nombre: Ayuda en Carrito
Condición: URL contains "/carrito"
Mensaje: Veo que estás revisando tu carrito 🛒. ¿Tienes alguna pregunta sobre envíos o métodos de pago?
Páginas: Solo /carrito
Activo: Sí
```

### Trigger 3: Soporte en Checkout

```
Nombre: Soporte en Checkout
Condición: URL contains "/checkout"
Mensaje: ¿Necesitas ayuda para completar tu compra? Estoy aquí para asistirte con cualquier duda 😊
Páginas: Solo /checkout
Activo: Sí
```

### Trigger 4: Abandono de Sesión

```
Nombre: Abandono de Sesión
Condición: Visitor inactive for 60 seconds
Mensaje: ¿Sigues ahí? Si necesitas ayuda, no dudes en preguntarme 🙂
Páginas: Todas las páginas
Activo: Sí
```

---

## ⚡ Configurar Respuestas Rápidas (Shortcuts)

1. Ve a **Dashboard** → **Shortcuts** → **Shortcuts**
2. Crea los siguientes shortcuts:

### Shortcuts de Envío
```
#envios
→ Nuestros envíos llegan en 2-5 días hábiles. ¿A qué ciudad necesitas enviar tu pedido?

#tiempos
→ Los tiempos de entrega son:
• Bogotá: 1-2 días hábiles
• Ciudades principales: 2-3 días hábiles
• Resto del país: 3-5 días hábiles

#recoger
→ ¡Claro! Puedes recoger tu pedido gratis en cualquiera de nuestras tiendas. Te enviaremos un correo cuando esté listo (generalmente en 24 horas).
```

### Shortcuts de Pago
```
#pago
→ Aceptamos los siguientes métodos de pago:
• Tarjetas de crédito (Visa, MasterCard, AmEx)
• Tarjetas débito
• PSE
• Daviplata
• Nequi
• Efectivo (contraentrega)

#cuotas
→ Puedes pagar en cuotas sin intereses con tarjetas de crédito de bancos aliados. Las opciones aparecen en el checkout.
```

### Shortcuts de Devoluciones
```
#devolucion
→ Tienes 30 días calendario para cambios o devoluciones. Requisitos:
• Producto en empaque original
• Factura de compra
• Producto sin usar (aplica para algunas categorías)

#garantia
→ Todos nuestros productos tienen garantía del fabricante. Los tiempos varían según la categoría:
• Tecnología: 12 meses
• Electrodomésticos: 12-24 meses
• Otros: Según especificaciones del producto
```

### Shortcuts de Cuenta
```
#registro
→ Para crear tu cuenta, haz clic en el ícono de usuario (arriba a la derecha) y selecciona "Registrarse". Solo necesitas tu correo y crear una contraseña.

#resetpass
→ Para recuperar tu contraseña:
1. Ve a Login
2. Haz clic en "¿Olvidaste tu contraseña?"
3. Ingresa tu correo
4. Revisa tu bandeja de entrada
```

---

## 👥 Configurar Agentes y Horarios

### Paso 1: Configurar tu Perfil de Agente

1. Ve a **Administration** → **Agents**
2. Haz clic en tu perfil (deprogrammers.utp@outlook.com)
3. Configura:

```
Display Name: Soporte Alkosto
Avatar: Subir logo de Alkosto o foto profesional
Title: Agente de Soporte
Department: Servicio al Cliente
```

### Paso 2: Configurar Horarios de Atención

1. Ve a **Administration** → **Business Hours**
2. Configura los horarios (ejemplo):

```
Lunes a Viernes: 8:00 AM - 8:00 PM (GMT-5)
Sábados: 9:00 AM - 6:00 PM (GMT-5)
Domingos: 10:00 AM - 4:00 PM (GMT-5)
Zona Horaria: America/Bogota (GMT-5)
```

3. **Mensaje fuera de horario:**
```
Gracias por contactarnos. Nuestro horario de atención es:
🕐 Lunes a Viernes: 8:00 AM - 8:00 PM
🕐 Sábados: 9:00 AM - 6:00 PM
🕐 Domingos: 10:00 AM - 4:00 PM

Deja tu mensaje y te responderemos lo antes posible 😊
```

---

## 📱 Instalar App Móvil de Tawk.to

Para responder chats desde tu móvil:

### Android
1. Ve a Google Play Store
2. Busca **"Tawk.to"**
3. Descarga e instala la app
4. Inicia sesión con **deprogrammers.utp@outlook.com**

### iOS
1. Ve a App Store
2. Busca **"Tawk.to"**
3. Descarga e instala la app
4. Inicia sesión con **deprogrammers.utp@outlook.com**

**Beneficios:**
- ✅ Notificaciones push en tiempo real
- ✅ Responde chats desde cualquier lugar
- ✅ Acceso al historial completo
- ✅ Estado online/offline sincronizado

---

## ✅ Verificar Instalación

### Paso 1: Verificar en Desarrollo Local

```bash
# En tu terminal local
npm start
```

1. Abre http://localhost:3000
2. **Espera 3-5 segundos** (el widget carga asíncronamente)
3. Deberías ver el botón flotante de Tawk.to en la esquina inferior derecha
4. Haz clic y envía un mensaje de prueba
5. Verifica que aparezca en el Dashboard de Tawk.to

### Paso 2: Verificar en Producción (Vercel)

1. Espera a que termine el deployment en Vercel (~2 minutos)
2. Ve a https://frontend-clone-alkosto.vercel.app/
3. Abre DevTools (F12) → Console
4. Busca el mensaje: `✅ LiveChat: Tawk.to cargado exitosamente`
5. Verifica que el widget aparezca en la esquina inferior derecha
6. **Prueba desde otro navegador/incógnito:** Envía un mensaje como "Visitante"
7. Responde desde el Dashboard de Tawk.to
8. Verifica que la respuesta llegue al sitio web

### Paso 3: Verificar Botón en Footer

1. Navega a cualquier página del sitio
2. Haz scroll hasta el footer
3. En la sección **"Servicio al Cliente"** verifica:
   - ✅ "Chat en Vivo" está visible
   - ✅ Tiene ícono 💬
   - ✅ Muestra punto verde (🟢) si estás online en Tawk.to
4. Haz clic en "Chat en Vivo"
5. El widget debe abrirse automáticamente

### Paso 4: Verificar Identificación de Usuarios

1. Regístrate o inicia sesión en el sitio
2. Abre el chat de Tawk.to
3. En el Dashboard de Tawk.to, ve a **Dashboard** → **Visitors**
4. Busca el visitante activo (tú)
5. Deberías ver:
   - ✅ Nombre completo del usuario
   - ✅ Email del usuario
   - ✅ User ID
   - ✅ Etiqueta "authenticated"

---

## 🔍 Troubleshooting

### Problema: Widget no aparece en Vercel

**Soluciones:**
1. Verifica que las variables de entorno estén configuradas en Vercel:
   - Settings → Environment Variables
   - Deben existir `REACT_APP_TAWK_PROPERTY_ID` y `REACT_APP_TAWK_WIDGET_ID`
2. Re-despliega la aplicación (Deployments → Redeploy)
3. Limpia caché del navegador (Ctrl+Shift+Delete)
4. Verifica en Dashboard de Tawk.to que el dominio `frontend-clone-alkosto.vercel.app` esté en "Allowed Domains"

### Problema: Widget aparece pero no funciona

**Soluciones:**
1. Verifica en Tawk.to Dashboard que tu estado esté en **"Online"** (esquina superior derecha)
2. Revisa DevTools → Console para ver errores de JavaScript
3. Verifica que el Property ID y Widget ID sean correctos
4. Intenta desde navegador incógnito para descartar problemas de caché

### Problema: Usuario no se identifica automáticamente

**Soluciones:**
1. Verifica que el usuario esté realmente logueado (revisar UserController)
2. Abre DevTools → Console y busca:
   ```
   Usuario identificado en Tawk.to: [nombre]
   ```
3. Si no aparece, puede ser un problema de timing (Tawk.to se cargó después del login)
4. Refrescar la página debería resolver el problema

### Problema: Indicador de estado siempre offline

**Soluciones:**
1. Asegúrate de estar online en el Dashboard de Tawk.to
2. El estado puede tardar 30-60 segundos en actualizarse (es normal)
3. Verifica que no tengas bloqueadores de anuncios activos (pueden bloquear Tawk.to)

---

## 📊 Monitorear Métricas

### Dashboard Principal de Tawk.to

1. Ve a **Dashboard** → **Overview**
2. Métricas importantes:

```
📈 Total de chats (hoy/semana/mes)
⏱️ Tiempo promedio de respuesta
⭐ Satisfacción del cliente (CSAT)
👥 Visitantes activos
💬 Chats activos
📊 Tasa de conversión desde chat
```

### Reportes Avanzados

1. Ve a **Dashboard** → **Reports**
2. Reportes disponibles:
   - **Chat Volume:** Número de chats por período
   - **Agent Performance:** Desempeño de cada agente
   - **Customer Satisfaction:** Encuestas post-chat
   - **Response Time:** Tiempo de primera respuesta y resolución
   - **Popular Pages:** Páginas donde más se inicia el chat
   - **Triggers Performance:** Efectividad de mensajes automáticos

---

## 🎯 Próximos Pasos

### Inmediatos (Hoy)
- [ ] Configurar variables en Vercel
- [ ] Re-desplegar aplicación
- [ ] Agregar dominio en Tawk.to
- [ ] Probar widget en producción
- [ ] Instalar app móvil

### Esta Semana
- [ ] Configurar triggers de bienvenida
- [ ] Crear respuestas rápidas (shortcuts)
- [ ] Personalizar colores del widget
- [ ] Configurar horarios de atención
- [ ] Probar flujo completo con usuarios reales

### Este Mes
- [ ] Analizar métricas de uso
- [ ] Optimizar triggers según comportamiento
- [ ] Capacitar equipo de soporte (si aplica)
- [ ] Configurar integraciones adicionales (email, CRM)

---

## 📚 Recursos Adicionales

- **Documentación oficial:** https://help.tawk.to/
- **API Documentation:** https://developer.tawk.to/
- **Guía de implementación:** `Logs/MEJORA_016_RF23_LiveChat.md`
- **Resumen ejecutivo:** `docs/RF23_CHAT_EN_VIVO_RESUMEN.md`

---

## ✅ Checklist Final

- [ ] Variables de entorno configuradas en Vercel
- [ ] Aplicación re-desplegada
- [ ] Dominio agregado en Tawk.to Dashboard
- [ ] Widget visible y funcional en https://frontend-clone-alkosto.vercel.app/
- [ ] Botón "Chat en Vivo" visible en footer
- [ ] Identificación de usuarios autenticados funciona
- [ ] Triggers configurados
- [ ] Respuestas rápidas creadas
- [ ] Colores personalizados con marca Alkosto
- [ ] Horarios de atención configurados
- [ ] App móvil instalada
- [ ] Prueba completa realizada

---

**¡Listo! Tu chat en vivo está configurado y funcionando correctamente.** 🎉

Si tienes algún problema durante la configuración, consulta la sección de Troubleshooting o revisa la documentación completa en `Logs/MEJORA_016_RF23_LiveChat.md`.
