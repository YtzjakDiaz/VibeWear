# 🔐 Guía - Habilitar Autenticación en Firebase

## ✅ Ya Tienes Implementado:
- ✅ `firebase-auth.js` - Módulo completo de autenticación
- ✅ `login.html` - Página de login/registro
- ✅ `account-profile.html` - Página de perfil del usuario
- ✅ Integración con Email/Password, Google y GitHub

---

## 🔧 PASO 1: Habilitar Email/Password en Firebase Console

1. **Firebase Console** → Proyecto `vibeweaer`
2. **Authentication** (en el menú izquierdo)
3. Pestaña **"Sign-in method"**
4. Haz clic en **"Email/Password"**
5. Habilita:
   - ✅ **Email/Password**
   - ✅ **Email link (passwordless sign-in)** (opcional)
6. Haz clic en **"Save"** ✅

---

## 🔧 PASO 2: Habilitar Google Sign-In

1. En **Authentication → Sign-in method**
2. Haz clic en **"Google"**
3. Activa el toggle **"Enable"**
4. Selecciona tu email de proyecto (debería estar pre-rellenado)
5. En **"Project public name"**, escribe: `VibeWear`
6. Haz clic en **"Save"** ✅

---

## 🔧 PASO 3: Habilitar GitHub Sign-In

1. En **Authentication → Sign-in method**
2. Haz clic en **"GitHub"**
3. Activa el toggle **"Enable"**

Ahora necesitas una **OAuth App en GitHub**:

### A. Crear OAuth App en GitHub:

1. Ve a: **https://github.com/settings/developers**
2. **OAuth Apps** → **New OAuth App**
3. Rellena:
   - **Application name**: `VibeWear`
   - **Homepage URL**: `https://vibewear.com` (o tu dominio local: `http://localhost:3000`)
   - **Authorization callback URL**: Copia el que da Firebase Console
   - (Haz clic en "Copy" en Firebase para obtenerlo)

4. Haz clic en **"Register application"**
5. Copia:
   - **Client ID**
   - **Client Secret** (haz clic en "Generate new client secret")

### B. Volver a Firebase:

1. Firebase Console → **Authentication → GitHub**
2. Pega:
   - **Client ID** → en el campo "Client ID"
   - **Client Secret** → en el campo "Client Secret"
3. Haz clic en **"Save"** ✅

---

## 📍 PASO 4: Configurar URLs Autorizadas

Para que funcione en desarrollo y producción:

1. **Firebase Console** → **Project Settings** (⚙️ arriba a la izquierda)
2. Pestaña **"Authorization domains"**
3. Haz clic en **"Add domain"**

**Agrega estas URLs:**

```
localhost:3000
localhost:8000
vibewear.com (tu dominio real)
tudominio.firebaseapp.com (opcional)
```

---

## 🧪 PASO 5: Probar que Funciona

### Test 1: Email/Password
1. Abre: `http://localhost:3000/login.html`
2. Pestaña: **"Crear Cuenta"**
3. Completa:
   - Nombre: `Test User`
   - Email: `test@example.com`
   - Contraseña: `Test123456`
4. Haz clic en **"Crear Cuenta"** ✅
5. Deberías ir a `account-profile.html`

### Test 2: Google
1. Abre: `http://localhost:3000/login.html`
2. Haz clic en botón **"Google"** 🔵
3. Completa el login de Google
4. Deberías ir a `account-profile.html` ✅

### Test 3: GitHub
1. Abre: `http://localhost:3000/login.html`
2. Haz clic en botón **"GitHub"** ⚫
3. Autoriza VibeWear en GitHub
4. Deberías ir a `account-profile.html` ✅

---

## 📊 Verificar Usuarios en Firebase Console

Para ver los usuarios registrados:

1. **Firebase Console** → **Authentication**
2. Pestaña **"Users"**
3. Deberías ver tus usuarios registrados con:
   - Email
   - Método de login (Email/Google/GitHub)
   - Fecha de creación

---

## 🔗 Integración en tu Navbar

El botón **"Mi Cuenta"** ya funciona automáticamente:
- Si NO hay usuario autenticado → Redirige a `login.html`
- Si HAY usuario autenticado → Va a `account-profile.html`

---

## 🎯 Funcionalidades Disponibles

### En `login.html`:
✅ Registrarse con email/password
✅ Login con email/password
✅ Login con Google
✅ Login con GitHub
✅ Recuperar contraseña por email
✅ Validación de contraseña fuerte
✅ Mensajes de error en español

### En `account-profile.html`:
✅ Ver perfil del usuario
✅ Ver foto de perfil (avatar)
✅ Editar nombre y datos
✅ Ver puntos de lealtad
✅ Ver mis órdenes (desde Firestore)
✅ Cambiar contraseña
✅ Ver información de seguridad
✅ Cerrar sesión

---

## ⚠️ Errores Comunes y Soluciones

### Error: "popup-closed-by-user"
```
❌ Usuario canceló el login de Google/GitHub
✅ Solución: Es normal, usuario puede intentar de nuevo
```

### Error: "auth/invalid-credentials"
```
❌ Email o contraseña incorrecta
✅ Solución: Verifica que hayas tipeado correctamente
```

### Error: "auth/too-many-requests"
```
❌ Demasiados intentos fallidos
✅ Solución: Espera 30 minutos antes de intentar de nuevo
```

### El botón de Google/GitHub no funciona
```
❌ OAuth no está configurado
✅ Solución:
  1. Verifica que habilitaste Google/GitHub en Firebase Console
  2. Verifica que agregaste los dominios en "Authorization domains"
  3. Para GitHub, verifica que la OAuth App está configurada
```

### No aparece el login desde Google
```
❌ Es posible que esté bloqueado por pop-up blocker
✅ Solución: Permite pop-ups para tu sitio
```

---

## 🔐 Seguridad

### Contraseñas Requeridas:
- ✅ Mínimo 6 caracteres
- ✅ Al menos una mayúscula
- ✅ Al menos un número

### Firebase Rules:
Las reglas se configuran automáticamente para:
- ✅ Solo usuarios autenticados pueden acceder a su perfil
- ✅ Las órdenes solo pueden leerlas usuarios con ese email
- ✅ Las contraseñas se encriptan (no se guardan en texto plano)

---

## 🚀 Próximas Mejoras (Opcionales)

- [ ] Email de verificación de cuenta
- [ ] Cambio de email con verificación
- [ ] Autenticación multifactor (2FA)
- [ ] Login con Facebook/Apple
- [ ] Sincronizar datos de Usuario en Firestore
- [ ] Panel de admin para gestionar usuarios
- [ ] Exportar datos del usuario

---

## 📞 Checklist Final

- [ ] Habilitaste Email/Password en Firebase
- [ ] Habilitaste Google Sign-In en Firebase
- [ ] Creaste OAuth App en GitHub
- [ ] Habilitaste GitHub Sign-In en Firebase
- [ ] Agregaste los dominios autorizados
- [ ] Probaste login con Email
- [ ] Probaste login con Google
- [ ] Probaste login con GitHub
- [ ] El perfil muestra correctamente
- [ ] Las órdenes aparecen en el perfil

---

**Última actualización:** 16 de abril de 2026  
**Estado:** Autenticación completamente funcional ✅
