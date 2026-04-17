# 🚀 Guía Rápida - Configurar Firestore para Órdenes

## Paso 1️⃣: Ir a Firebase Console

1. Abre: **https://console.firebase.google.com**
2. Selecciona tu proyecto: **vibeweaer**
3. En el menú izquierdo, busca **"Firestore Database"**

![Step 1](https://imgur.com/abcdef.png)

---

## Paso 2️⃣: Crear Firestore Database

1. Haz clic en **"Create Database"**
2. Selecciona:
   - **Mode**: `Start in production mode`
   - **Region**: `nam5 (North America - USA)`
3. Clic en **"Create"** ✅

⏳ Espera 30 segundos a que se cree...

---

## Paso 3️⃣: Configurar Reglas de Seguridad

1. Una vez creado, ve a la pestaña **"Rules"**
2. **BORRA TODO** lo que hay por defecto
3. **COPIA ESTO** exactamente:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir crear órdenes desde el sitio web
    match /orders/{document=**} {
      allow create: if request.auth != null || true;
      allow read: if request.auth != null || resource.data.email == request.query.email;
      allow update: if request.auth != null;
      allow delete: if false;
    }
    
    // Permitir acceso a otras colecciones (reviews, contacto, etc)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. Haz clic en **"Publish"** ✅

---

## Paso 4️⃣: Verificar Configuración de tu Proyecto

Abre en tu editor: `firebase-config.js`

**Verifica que tenga estos datos:**

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC_Pr0N4Eheg7j3fa77-wQHsHNY4J3rvsE",
  authDomain: "vibeweaer.firebaseapp.com",
  projectId: "vibeweaer",
  storageBucket: "vibeweaer.firebasestorage.app",
  messagingSenderId: "534063442486",
  appId: "1:534063442486:web:bd72285a4e2f8358b2c697",
  measurementId: "G-E66WR1DFBF"
};
```

✅ Estos ya están correctos en tu proyecto

---

## Paso 5️⃣: Probar que Funciona

### Opción A: Desde el Sitio
1. Abre `http://localhost:3000` (o tu servidor local)
2. Agrega productos al carrito
3. Ve a **Checkout**
4. Completa el formulario y haz clic **"Pagar Ahora"**
5. Vuelve a Firebase Console → **Firestore** → Colección **"orders"**
6. ✅ Deberías ver tu orden guardada

### Opción B: Desde el Panel de Test
1. Abre `http://localhost:3000/admin-test-panel.html`
2. Haz clic en **"📥 Cargar órdenes de Firebase"**
3. ✅ Deberías ver cualquier orden guardada

---

## ⚠️ Posibles Errores y Soluciones

### Error: "Firebase not initialized"
```
❌ Problema: Firebase no está cargando
✅ Solución: 
  1. Abre la consola del navegador (F12)
  2. Ve a "Console"
  3. Escribe: console.log(firebase)
  4. Si da error, asegúrate que firebase-config.js está cargado en checkout.html
```

### Error: "Firestore not available"
```
❌ Problema: Firestore no está habilitado
✅ Solución:
  1. Ve a Firebase Console
  2. Haz clic en "Firestore Database"
  3. Si dice "Create Database", hazlo
  4. Espera a que se cree completamente
```

### Órdenes no aparecen en Firestore
```
❌ Problema: Las órdenes se guardan en localStorage pero no en Firestore
✅ Solución:
  1. Abre F12 → Console
  2. Busca mensajes de error rojo
  3. Verifica las reglas de seguridad (Paso 3)
  4. Prueba crear una orden nueva
```

### Reglas de Seguridad rechazadas
```
❌ Problema: Firestore dice que las reglas no son válidas
✅ Solución:
  1. Copia las reglas nuevamente (exactamente como están arriba)
  2. Verifica que no haya espacios/caracteres raros
  3. Haz clic en "Publish"
```

---

## 📊 Estructura de la Orden en Firestore

Cuando completes el checkout, tu orden se verá así:

```json
{
  "address": "Calle 123 #45-67",
  "city": "Barranquilla",
  "date": "16/04/2026",
  "email": "tu@email.com",
  "id": "VW-1713267890123",
  "items": [
    {
      "color": "Negro",
      "id": "prod-1",
      "image": "images/Productos/Producto 1/Eladio-Back.jpg",
      "name": "Eladio Carrion Oversized",
      "price": 75000,
      "quantity": 1,
      "size": "M"
    }
  ],
  "name": "Tu Nombre",
  "paymentMethod": "Mercado Pago",
  "paymentStatus": "pending",
  "phone": "3206045846",
  "shipping": 8000,
  "status": "Pendiente de confirmación",
  "subtotal": 75000,
  "tax": 14250,
  "total": 97250,
  "tracking": "ABC12XYZ9",
  "zipCode": "080001",
  "createdAt": "2026-04-16T10:30:00.000Z"
}
```

---

## 🎯 Próximos Pasos (Opcionales)

### 1. Emails Automáticos
Para enviar emails reales cuando se crea una orden:

**Opción 1: Firebase Cloud Functions** (Recomendado)
```bash
# Instalar herramientas
npm install -g firebase-tools

# Inicializar functions
firebase init functions

# En tu función:
exports.sendOrderEmail = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();
    // Aquí envías el email usando Nodemailer, SendGrid, etc
  });
```

**Opción 2: Mailgun API** (Más fácil)
```javascript
// En tu backend o Cloud Function:
import axios from 'axios';

const sendEmail = async (to, subject, text) => {
  await axios.post('https://api.mailgun.net/v3/mail.vibewear.com/messages', {
    from: 'noreply@vibewear.com',
    to: to,
    subject: subject,
    text: text
  }, {
    auth: {
      username: 'api',
      password: process.env.MAILGUN_API_KEY
    }
  });
};
```

### 2. SMS con Twilio
```javascript
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

client.messages.create({
  body: '¡Tu orden VW-123456 ha sido confirmada!',
  from: '+15551234567',
  to: '+573206045846'
});
```

### 3. Mercado Pago Real
Cambiar la key TEST por la production key en `checkout.html`

---

## ✅ Checklist de Configuración

- [ ] Cuento con Firebase project (vibeweaer)
- [ ] Creé Firestore Database en Firebase Console
- [ ] Configuré las reglas de seguridad
- [ ] Verifiqué que firebase-config.js tiene los datos correctos
- [ ] Probé crear una orden desde el sitio
- [ ] La orden aparece en Firestore Console
- [ ] El panel test (admin-test-panel.html) muestra las órdenes

---

## 💬 Línea de Ayuda Rápida

Si algo no funciona:

1. **Abre la consola del navegador** (F12)
2. **Ve a "Console"** y busca errores rojos
3. **Copia el error completo**
4. **Pégalo aquí para que pueda ayudarte**

Ejemplo de error que podría aparecer:
```
Uncaught Error: Firebase: Error (auth/invalid-api-key).
```

---

**Última actualización:** 16 de abril de 2026  
**Estado:** Listo para configurar ✅
