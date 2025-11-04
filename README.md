# CarwashFreaks Frontend

Proyecto frontend en React + Vite para visualizar y gestionar el flujo de datos del carwash.

## Autenticación centralizada

Se utiliza un custom hook `useAuth` en `src/hooks/useAuth.js` para manejar la autenticación de forma centralizada y reutilizable en todos los componentes relevantes. Este hook expone:
- `isAuthenticated`: booleano, indica si el usuario está logueado.
- `user`: objeto usuario actual (si existe).
- `refreshAuth()`: refresca el estado de autenticación tras login/logout.
- `logout()`: cierra sesión y limpia el estado.

### Uso
```js
import { useAuth } from '../hooks/useAuth';
const { isAuthenticated, user, refreshAuth, logout } = useAuth();
```

## Datos simulados y hardcodeados

- En `Dashboard.jsx` se simulan turnos con `mockAppointments` hasta conectar con el backend real.
- En `Header.jsx` la navegación y los enlaces están definidos como arrays hardcodeados.
- En `Footer.jsx` los enlaces y redes sociales están hardcodeados.

"# carwash-frontend" 
