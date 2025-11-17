# MEJORA 010 – Cierre de sesión con redirección segura

- Autor: Alexánder Mesa Gómez
- Fecha: 16/11/2025
- Estado: Corregido

## Problema
Al cerrar sesión, la aplicación permanecía en la misma vista y dejaba abiertos elementos de UI (menú de cuenta/overlay de búsqueda), lo que podía dar la impresión de sesión activa o exponer información de la vista anterior.

## Causa Raíz
El handler de logout en `Header` llamaba `UserController.logout()` pero no realizaba navegación ni cerraba overlays/menús:
- No `navigate('/')` tras el logout
- Estados UI (`showAccountMenu`, `showSearchOverlay`, `showLocationMenu`) podían quedar activos

## Solución Implementada
- Archivo: `src/components/Header/Header.js`
- Cambio en `handleLogout`:
  - `await UserController.logout()`
  - Cierre explícito de menús/overlays
  - Redirección inmediata a `'/'

```js
const handleLogout = async (e) => {
  e.preventDefault();
  try {
    await UserController.logout();
  } finally {
    setIsLoggedIn(false);
    setUserName('');
    setShowAccountMenu(false);
    setShowSearchOverlay(false);
    setShowLocationMenu(false);
    navigate('/');
  }
};
```

## Efecto
- Se garantiza retorno a la página principal y UI limpia tras logout.
- Se evita dejar contenido sensible de la vista anterior.
- Mantiene patrón actual (redirección manejada por la vista y no por el controlador).

## Recomendaciones Futuras
- Añadir guardas de ruta para secciones `/perfil/*` cuando `!UserController.isLoggedIn()`
- Listener global a `addAuthListener` para redirigir a `/` si se detecta logout en otras vistas.
