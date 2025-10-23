# 🔄 Diagrama de Flujo RF04 - Verificación

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUJO DE VERIFICACIÓN RF04                        │
└─────────────────────────────────────────────────────────────────────┘

    [Usuario]
       │
       ├──► Navega a /register
       │
       ├──► Ingresa email
       │
       ├──► Completa datos (nombre, apellido, teléfono)
       │
       ├──► Crea contraseña
       │
       v
┌─────────────────────────────────────────────┐
│  UserController.registerUser()               │
│  - Crea usuario en localStorage              │
│  - Estado: estadoCuenta = 'pendiente'        │
│  - emailVerified = false                     │
│  - phoneVerified = false                     │
└──────────────┬──────────────────────────────┘
               │
               │ navigate('/verify', { email, phone, fromRegister })
               v
┌─────────────────────────────────────────────────────────────────┐
│             /verify - Pantalla de Selección                      │
│                                                                  │
│  [Verificación de cuenta]                                       │
│                                                                  │
│  Usuario: prueba@test.com                                       │
│  Teléfono: 3001234567                                           │
│                                                                  │
│  ┌───────────────────────────────────────────────┐             │
│  │  ✉️ Verificar por correo                      │             │
│  │  Recibe un código en tu email                 │             │
│  └───────────────────────────────────────────────┘             │
│                                                                  │
│  ┌───────────────────────────────────────────────┐             │
│  │  📱 Verificar por SMS                         │             │
│  │  Recibe un código en tu teléfono              │             │
│  └───────────────────────────────────────────────┘             │
│                                                                  │
│  [Verificar más tarde]                                          │
└─────────┬───────────────────────────┬───────────────────────────┘
          │                           │
          │ Clic Email                │ Clic SMS
          v                           v
┌─────────────────────────┐  ┌─────────────────────────┐
│ VerificationService     │  │ VerificationService     │
│ .enviarCorreo           │  │ .enviarSMS              │
│ Verificacion()          │  │ ()                      │
│                         │  │                         │
│ - Genera código: 543210 │  │ - Genera código: 789012 │
│ - Guarda en localStorage│  │ - Guarda en localStorage│
│ - Expira en 10 min      │  │ - Expira en 10 min      │
└────────┬────────────────┘  └──────────┬──────────────┘
         │                              │
         └──────────┬───────────────────┘
                    │
                    v
┌─────────────────────────────────────────────────────────────────┐
│             /verify - Pantalla de Código                         │
│                                                                  │
│  [Verificación de código]                                       │
│                                                                  │
│  Ingresa el código de 6 dígitos que enviamos a:                │
│  prueba@test.com                                                │
│                                                                  │
│  🔧 Código de desarrollo: 543210                                │
│  (En producción, esto se enviaría por email/SMS)               │
│                                                                  │
│  ┌───────────────────────────────────┐                         │
│  │  Código: [5][4][3][2][1][0]      │                         │
│  └───────────────────────────────────┘                         │
│                                                                  │
│  [Verificar código]                                             │
│                                                                  │
│  [Reenviar código] [Cambiar método]                            │
└─────────┬───────────────────────────────────────────────────────┘
          │
          │ Usuario ingresa código
          v
┌─────────────────────────────────────────┐
│  VerificationService                     │
│  .validarConfirmacion()                  │
│                                          │
│  ¿Código correcto?                       │
└──────┬─────────────────┬────────────────┘
       │                 │
       │ SÍ              │ NO
       v                 v
┌──────────────────┐  ┌──────────────────────────┐
│ UserController   │  │ Error                     │
│ .verifyEmail()   │  │ "Código incorrecto"       │
│ o                │  │                           │
│ .verifyPhone()   │  │ [Reintentar]              │
│                  │  └───────────────────────────┘
│ Actualiza:       │
│ emailVerified    │
│ o phoneVerified  │
│ = true           │
│                  │
│ estadoCuenta     │
│ = 'validado'     │
└────────┬─────────┘
         │
         v
┌──────────────────────────────────────────┐
│  ✓ ¡Verificación exitosa!                │
│                                           │
│  Redirigiendo a login en 2 segundos...   │
└──────────┬───────────────────────────────┘
           │
           │ navigate('/login')
           v
┌──────────────────────────────────────────┐
│  /login                                   │
│                                           │
│  Mensaje: "Cuenta verificada.            │
│           Ya puedes iniciar sesión."     │
└──────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════

                    FLUJOS ALTERNATIVOS

─────────────────────────────────────────────────────────────────

1. REENVIAR CÓDIGO
   
   [Reenviar código] ──► VerificationService genera nuevo código
                         ──► Vuelve a pantalla de ingreso
                         ──► Usuario ingresa nuevo código

─────────────────────────────────────────────────────────────────

2. CAMBIAR MÉTODO

   [Cambiar método] ──► Vuelve a pantalla de selección
                    ──► Usuario elige otro método
                    ──► Nuevo código generado

─────────────────────────────────────────────────────────────────

3. CÓDIGO EXPIRADO

   Ingresa código después de 10 min
   ──► Error: "El código ha expirado"
   ──► [Reenviar código]

─────────────────────────────────────────────────────────────────

4. OMITIR VERIFICACIÓN

   [Verificar más tarde] ──► navigate('/login')
                         ──► estadoCuenta = 'pendiente'
                         ──► Puede verificar después

═══════════════════════════════════════════════════════════════════

                    PERSISTENCIA DE DATOS

┌──────────────────────────────────────────────────────────────┐
│  localStorage                                                 │
│                                                               │
│  alkosto_users: [                                            │
│    {                                                          │
│      id: "user_1698765432",                                  │
│      email: "prueba@test.com",                               │
│      phone: "3001234567",                                    │
│      emailVerified: true,      ◄─── Actualizado             │
│      phoneVerified: false,                                   │
│      estadoCuenta: "validado"  ◄─── Actualizado             │
│    }                                                          │
│  ]                                                            │
│                                                               │
│  alkosto_verification_codes: {                               │
│    "prueba@test.com": {                                      │
│      code: "543210",                                         │
│      type: "email",                                          │
│      timestamp: 1698765432000,                               │
│      expires: 1698766032000    ◄─── +10 minutos             │
│    }                                                          │
│  }                                                            │
└──────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════
```

## 📊 Diagrama de Estados

```
┌─────────────────────────────────────────────────────────────────┐
│                    ESTADOS DE LA CUENTA                          │
└─────────────────────────────────────────────────────────────────┘

     [Registro]
         │
         v
   ┌───────────┐
   │ PENDIENTE │ ◄──── emailVerified: false
   │           │       phoneVerified: false
   │           │       estadoCuenta: 'pendiente'
   └─────┬─────┘
         │
         │ Verifica Email o SMS
         v
   ┌───────────┐
   │ VALIDADO  │ ◄──── emailVerified: true OR phoneVerified: true
   │           │       estadoCuenta: 'validado'
   │           │
   └───────────┘
         │
         │ Usuario puede usar todas las funciones
         v
   [Acceso Completo]
```

## 🔄 Ciclo de Vida del Código

```
   Generación
       │
       v
   [543210] ───► Guardado en localStorage
       │
       │         Timestamp: T
       │         Expira: T + 10 min
       v
   ¿Tiempo < Expiración?
       │
       ├─── SÍ ──► Código válido
       │              │
       │              v
       │          ¿Código correcto?
       │              │
       │              ├─── SÍ ──► Verificación exitosa
       │              │              │
       │              │              v
       │              │          Eliminar código
       │              │
       │              └─── NO ──► Error, reintentar
       │
       └─── NO ──► Código expirado
                      │
                      v
                  Eliminar código
                      │
                      v
                  Solicitar reenvío
```

---

**Leyenda**:
- `───►` Flujo normal
- `◄───` Actualización de estado
- `[Botón]` Acción del usuario
- `┌─────┐` Componente o estado
- `│     │` Contenido
- `└─────┘` Fin de componente
