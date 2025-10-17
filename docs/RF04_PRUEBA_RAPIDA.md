# 🧪 Guía Rápida de Prueba - RF04 Verificación

## ⚡ Inicio Rápido

### 1. Iniciar el servidor de desarrollo
```bash
npm start
```

### 2. Probar el flujo completo

#### Paso 1: Registro
- Navegar a: `http://localhost:3000/register`
- Ingresar email: `prueba@test.com`
- Clic en "Continuar"

#### Paso 2: Completar datos
- Nombre: `Juan`
- Apellido: `Pérez`
- Teléfono: `3001234567` (debe empezar con 3)
- Aceptar términos
- Clic en "Continuar"

#### Paso 3: Crear contraseña
- Contraseña: `12345678` (mínimo 8 caracteres)
- Confirmar contraseña: `12345678`
- Clic en "Crear cuenta"

#### Paso 4: Verificación (AUTOMÁTICO)
**Se redirige automáticamente a `/verify`**

##### Opción A: Verificar por Correo ✉️
1. Clic en "Verificar por correo"
2. **Ver código en pantalla** (ej: `543210`)
3. Copiar e ingresar el código
4. Clic en "Verificar código"
5. ✅ Ver mensaje de éxito
6. **Redirige a login en 2 segundos**

##### Opción B: Verificar por SMS 📱
1. Clic en "Verificar por SMS"
2. **Ver código en pantalla** (ej: `789012`)
3. Ingresar el código
4. Clic en "Verificar código"
5. ✅ Ver mensaje de éxito
6. **Redirige a login en 2 segundos**

## 🔍 Verificar Estado

### Consola del Navegador
Abre DevTools (F12) y ejecuta:
```javascript
// Ver todos los usuarios
JSON.parse(localStorage.getItem('alkosto_users'))

// Ver códigos activos
JSON.parse(localStorage.getItem('alkosto_verification_codes'))
```

### Verificar Usuario Creado
```javascript
// Buscar usuario por email
const users = JSON.parse(localStorage.getItem('alkosto_users'));
const user = users.find(u => u.email === 'prueba@test.com');
console.log(user);

// Debe mostrar:
{
  id: "user_...",
  email: "prueba@test.com",
  firstName: "Juan",
  lastName: "Pérez",
  phone: "3001234567",
  emailVerified: true,  // o false si verificó por SMS
  phoneVerified: false, // o true si verificó por SMS
  estadoCuenta: "validado",
  ...
}
```

## 🧪 Casos de Prueba

### ✅ Caso 1: Verificación Exitosa
**Input**: Código correcto (el que aparece en pantalla)  
**Output**: Mensaje "¡Verificación exitosa!" → Redirige a login  
**Estado**: emailVerified o phoneVerified = true, estadoCuenta = "validado"

### ❌ Caso 2: Código Incorrecto
**Input**: `111111` (código inválido)  
**Output**: Error "Código de verificación incorrecto"  
**Estado**: Sin cambios

### 🔄 Caso 3: Reenvío de Código
1. Ingresar código erróneo
2. Clic en "Reenviar código"
3. **Nuevo código generado** (ver en pantalla)
4. Ingresar nuevo código
5. **Resultado**: Verificación exitosa

### ⏰ Caso 4: Código Expirado
1. No usar código por **10+ minutos**
2. Intentar verificar
3. **Resultado**: Error "El código de verificación ha expirado"
4. **Solución**: Clic en "Reenviar código"

### 🔀 Caso 5: Cambiar Método
1. Clic en "Verificar por correo"
2. Clic en "Cambiar método de verificación"
3. **Vuelve a pantalla de selección**
4. Elegir "Verificar por SMS"
5. Verificar con nuevo código

### ⏭️ Caso 6: Omitir Verificación
1. Clic en "Verificar más tarde"
2. **Redirige a login** con mensaje
3. Usuario puede iniciar sesión sin verificar
4. estadoCuenta = "pendiente"

## 🐛 Solución de Problemas

### No aparece la pantalla de verificación
**Causa**: Falta email o phone en state  
**Solución**: Completar registro completo desde `/register`

### El código no funciona
**Causa**: Código expirado (>10 min)  
**Solución**: Clic en "Reenviar código"

### No se guarda el estado verificado
**Causa**: Error en UserController  
**Solución**: Verificar en consola, revisar localStorage

### Redirige inmediatamente sin mostrar verificación
**Causa**: Ya verificado previamente  
**Solución**: Usar otro email o limpiar localStorage

## 🧹 Limpiar Datos de Prueba

### Opción 1: Desde Consola del Navegador
```javascript
// Limpiar todo
localStorage.clear();

// O limpiar selectivamente
localStorage.removeItem('alkosto_users');
localStorage.removeItem('alkosto_verification_codes');
```

### Opción 2: Desde Application Tab (DevTools)
1. F12 → Application tab
2. Storage → Local Storage
3. Clic derecho → Clear

## 📸 Screenshots Esperados

### Pantalla 1: Selección de Método
- ✉️ Botón "Verificar por correo"
- 📱 Botón "Verificar por SMS"
- Link "Verificar más tarde"

### Pantalla 2: Ingreso de Código
- Título: "Verificación de código"
- Destinatario mostrado (email o phone)
- **Código visible** (solo desarrollo)
- Input de 6 dígitos centrado
- Botón "Verificar código"
- Links: "Reenviar código" y "Cambiar método"

### Pantalla 3: Éxito
- ✓ Mensaje verde "¡Verificación exitosa!"
- Cuenta con segundos hasta redirigir

## 🎯 Objetivos de la Prueba

- [x] Usuario puede registrarse completamente
- [x] Redirige automáticamente a verificación
- [x] Puede elegir método (Email o SMS)
- [x] Código se genera y muestra (desarrollo)
- [x] Validación funciona correctamente
- [x] Maneja errores (código incorrecto, expirado)
- [x] Puede reenviar código
- [x] Puede cambiar de método
- [x] Puede omitir verificación
- [x] Estado se guarda correctamente
- [x] Redirige a login después de éxito

## ⚙️ Variables de Entorno (Futuro)

Para producción, configurar:
```env
REACT_APP_EMAIL_SERVICE=sendgrid
REACT_APP_EMAIL_API_KEY=xxx
REACT_APP_SMS_SERVICE=twilio
REACT_APP_SMS_API_KEY=xxx
REACT_APP_CODE_EXPIRATION=600000
```

---

**¿Necesitas ayuda?**  
Revisa la documentación completa en `/docs/RF04_VERIFICACION.md`
