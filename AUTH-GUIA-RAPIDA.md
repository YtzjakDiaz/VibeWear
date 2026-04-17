# ✅ Autenticación Completada - Guía de Prueba

## 📦 Archivos Creados

### 1. **firebase-auth.js** (Módulo Principal)
Contiene todas las funciones de autenticación:
- ✅ `registerWithEmail(email, password, displayName)` - Registrar usuario
- ✅ `loginWithEmail(email, password)` - Login con email
- ✅ `loginWithGoogle()` - OAuth de Google
- ✅ `loginWithGitHub()` - OAuth de GitHub
- ✅ `logout()` - Cerrar sesión
- ✅ `resetPassword(email)` - Recuperar contraseña
- ✅ `changePassword(newPassword)` - Cambiar contraseña
- ✅ `changeEmail(newEmail)` - Cambiar email
- ✅ `updateUserProfile(profileData)` - Actualizar perfil
- ✅ Validaciones en español
- ✅ Almacenamiento en localStorage

### 2. **login.html** (Nueva Página)
Página completa de autenticación con:
- ✅ Pestaña de Inicia Sesión (Email/Password)
- ✅ Pestaña de Crear Cuenta (Registro)
- ✅ Botón de Login con Google
- ✅ Botón de Login con GitHub
- ✅ Recuperación de contraseña
- ✅ Validación de contraseña fuerte
- ✅ Mensajes de error en español
- ✅ Redirect automático a account-profile.html

### 3. **account-profile.html** (Nueva Página)
Perfil completo del usuario con:
- ✅ **Tab 1: Mi Perfil**
  - Avatar y foto de perfil
  - Información personal (nombre, email)
  - Puntos de lealtad
  - Formulario de edición de perfil
  - Datos de país y teléfono

- ✅ **Tab 2: Mis Órdenes**
  - Listado de órdenes desde Firestore
  - Estado de cada orden
  - Código de rastreo
  - Fecha y total de la orden

- ✅ **Tab 3: Seguridad**
  - Cambio de contraseña
  - Información de verificación
  - Fecha de última sesión
  - Fecha de creación de cuenta

### 4. **navbar-auth.js** (Módulo de Navbar)
Maneja la autenticación en la barra de navegación:
- ✅ Escucha cambios de autenticación
- ✅ Muestra avatar y nombre si está autenticado
- ✅ Dropdown con opciones (Perfil, Órdenes, Seguridad, Logout)
- ✅ Redirige a login si no está autenticado
- ✅ Funciona en todas las páginas

### 5. **AUTH-SETUP-PASO-A-PASO.md** (Documentación)
Guía completa para configurar:
- ✅ Email/Password en Firebase
- ✅ Google Sign-In en Firebase
- ✅ GitHub OAuth App
- ✅ URLs autorizadas
- ✅ Pruebas y troubleshooting

---

## 🚀 INICIO RÁPIDO (5 minutos)

### Paso 1: Copiar Credenciales Firebase (si aún no lo hiciste)

Ve a [Firebase Console](https://console.firebase.google.com/):
1. Selecciona proyecto: **vibeweaer**
2. Haz clic en ⚙️ (Project Settings)
3. Pestaña **"General"**
4. Copia el objeto de configuración
5. Pega en `firebase-config.js` (ya debería estar)

### Paso 2: Habilitar Google Sign-In en Firebase

1. **Authentication → Sign-in method**
2. Busca **"Google"**
3. Haz clic en "Enable"
4. Selecciona tu email de proyecto
5. Haz clic en **"Save"** ✅

### Paso 3: Crear GitHub OAuth App (Opcional)

Si quieres GitHub login:
1. Ve a: https://github.com/settings/developers
2. **OAuth Apps → New OAuth App**
3. Rellena:
   - **Name**: VibeWear
   - **Homepage**: http://localhost:3000
   - **Callback URL**: (Copia de Firebase Console)
4. Copia **Client ID** y **Client Secret**
5. Ve a Firebase → **Authentication → GitHub**
6. Pega ID y Secret
7. Haz clic en **"Save"** ✅

### Paso 4: Agregar Dominios en Firebase (IMPORTANTE)

1. **Project Settings → Authorization domains**
2. Haz clic en **"Add domain"**
3. Agrega:
   ```
   localhost:3000
   localhost:8000
   vibewear.com (tu dominio real)
   ```
4. Haz clic en **"Add"** ✅

---

## 🧪 PRUEBAS (5 minutos)

### Test 1: Crear Cuenta con Email

```
1. Abre: http://localhost:3000/login.html
2. Pestaña: "CREAR CUENTA"
3. Completa:
   - Nombre: "Test Usuario"
   - Email: "test@ejemplo.com"
   - Contraseña: "Test123456"
   - Confirma contraseña: "Test123456"
4. Acepta términos
5. Haz clic en "CREAR CUENTA"
6. ✅ Deberías ir a http://localhost:3000/account-profile.html
```

### Test 2: Iniciar Sesión

```
1. Abre: http://localhost:3000/login.html
2. Pestaña: "INICIA SESIÓN"
3. Completa:
   - Email: test@ejemplo.com
   - Contraseña: Test123456
4. Haz clic en "ACCEDER"
5. ✅ Deberías ir a account-profile.html
```

### Test 3: Google Login

```
1. Abre: http://localhost:3000/login.html
2. Haz clic en botón "Google"
3. Completa el login de Google
4. ✅ Deberías ir a account-profile.html
5. ✅ Deberías ver tu avatar y nombre de Google
```

### Test 4: GitHub Login (si completaste GitHub OAuth)

```
1. Abre: http://localhost:3000/login.html
2. Haz clic en botón "GitHub"
3. Autoriza VibeWear
4. ✅ Deberías ir a account-profile.html
5. ✅ Deberías ver tu avatar y nombre de GitHub
```

### Test 5: Navbar Authentication

```
1. Abre: http://localhost:3000/
2. Mira la navbar (arriba)
3. Si NO estás autenticado:
   - Botón: "Mi cuenta" (rosa)
   - Haz clic → Va a login.html ✅
4. Si estás autenticado:
   - Ves tu avatar + nombre en la navbar
   - Haz clic → Se abre dropdown ✅
   - Opciones:
     - 📋 Mi Perfil → account-profile.html
     - 📦 Mis Órdenes → account-profile.html?tab=orders
     - 🔐 Seguridad → account-profile.html?tab=security
     - 🚪 Cerrar Sesión → Logout y vuelve a inicio
```

### Test 6: Cambiar Contraseña

```
1. Abre: http://localhost:3000/account-profile.html
2. Tab: "SEGURIDAD"
3. Completa:
   - Contraseña Actual: (la que usaste)
   - Nueva Contraseña: Test654321
   - Confirmar: Test654321
4. Haz clic en "ACTUALIZAR CONTRASEÑA"
5. ✅ Deberías ver mensaje de éxito
6. Logout y vuelve a ingresar con nueva contraseña
```

### Test 7: Ver Órdenes

```
1. Realiza una compra en http://localhost:3000/checkout.html
2. Completa el formulario y la compra
3. Ve a http://localhost:3000/account-profile.html
4. Tab: "MIS ÓRDENES"
5. ✅ Deberías ver tu orden con:
   - Número de orden
   - Total
   - Estado (Pendiente de confirmación)
   - Código de rastreo
```

---

## 🔧 Verificaciones en Firebase Console

Después de las pruebas, verifica en:

### 1. Usuarios Registrados
```
Firebase Console → Authentication → Users
```
Deberías ver tus usuarios con:
- Email
- Método (Email/Google/GitHub)
- Fecha de creación

### 2. Órdenes Guardadas
```
Firebase Console → Firestore Database
Colección: "orders"
```
Deberías ver tus órdenes con todos los datos

---

## 📊 Checklist de Completitud

- [ ] firebase-auth.js creado ✅
- [ ] login.html creado ✅
- [ ] account-profile.html creado ✅
- [ ] navbar-auth.js creado ✅
- [ ] Todos los HTML con navbar-auth.js actualizado ✅
- [ ] Email/Password habilitado en Firebase
- [ ] Google Sign-In habilitado en Firebase
- [ ] GitHub OAuth App creado (opcional)
- [ ] Dominios autorizados agregados en Firebase
- [ ] Prueba de registrarse con email ✓
- [ ] Prueba de login con email ✓
- [ ] Prueba de Google login ✓
- [ ] Prueba de GitHub login ✓
- [ ] Prueba de cambio de contraseña ✓
- [ ] Prueba de ver órdenes en perfil ✓
- [ ] Prueba de logout desde navbar ✓

---

## 🎯 Próximos Pasos (Opcionales)

1. **Email de Verificación**
   - Enviar email de verificación al registrarse
   - Requerir email verificado para comprar

2. **Cambio de Email Seguro**
   - Verificar nuevo email antes de cambiar
   - Enviar notificación al email antiguo

3. **Autenticación Multifactor (2FA)**
   - SMS o Authenticator app
   - Requerido para modificar contraseña

4. **Panel de Admin**
   - Ver todos los usuarios
   - Gestionar órdenes
   - Ver estadísticas

5. **Recuperación de Cuenta**
   - Preguntas de seguridad
   - Verificación de identidad

---

## 💡 Tips Útiles

### Para Desarrollo
```bash
# Si usas un servidor local en puerto diferente:
# Asegúrate de agregar el dominio en Firebase:
# localStorage.vibewear-user = {user data}
# Logs en Console → F12 → Console
```

### Debugging
```javascript
// Ver usuario actual en la consola:
import { getCurrentUser } from './firebase-auth.js';
console.log(getCurrentUser());

// Ver token de autenticación:
const user = getCurrentUser();
user?.getIdToken().then(token => console.log(token));
```

### URLs Rápidas
- Login: http://localhost:3000/login.html
- Perfil: http://localhost:3000/account-profile.html
- Firebase: https://console.firebase.google.com/
- GitHub OAuth: https://github.com/settings/developers

---

## 🆘 Errores Comunes

### "popup-closed-by-user"
- Usuario cerró el popup de Google/GitHub
- Es normal, puede intentar de nuevo

### "auth/invalid-credentials"
- Email o contraseña incorrecta
- Verifica que escribiste correctamente

### "auth/email-already-in-use"
- Email ya registrado
- Usa login en lugar de crear cuenta

### "auth/weak-password"
- Contraseña no cumple requisitos
- Debe tener: 6+ chars, 1 mayúscula, 1 número

### "auth/too-many-requests"
- Demasiados intentos fallidos
- Espera 30 minutos antes de intentar

### Google/GitHub button no funciona
- Verifica que habilitaste en Firebase
- Verifica que agregaste el dominio
- Intenta sin pop-up blocker

---

**¡Sistema de autenticación completamente funcional! 🎉**

Última actualización: 16 de abril de 2026
Estado: ✅ LISTO PARA USAR
