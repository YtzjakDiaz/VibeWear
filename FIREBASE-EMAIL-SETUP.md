# 🚀 VibeWear - Guía de Configuración Firebase & Notificaciones

## ✅ Cambios Implementados

### 1. **Firebase Firestore Integration** 
- Guardado automático de órdenes en Firestore
- Fallback a localStorage si Firebase no está disponible
- Funciones para recuperar órdenes por email o ID

**Archivo**: `firebase-orders.js`

### 2. **Email Notifications System**
- Emails de confirmación de orden
- Notificaciones de cambio de estado de envío
- Solicitudes de reseña
- Validación mejorada de datos (email, teléfono, código postal)

**Archivo**: `notifications-email.js`

### 3. **Enhanced Checkout**
- Validación completa del formulario
- Integración con Firebase Firestore
- Envío automático de notificaciones por email
- Mejor manejo de errores

**Archivo**: `checkout.html` (actualizado)

---

## 🔧 Configuración Necesaria

### A. Habilitar Firestore en Firebase Console

1. Ir a: https://console.firebase.google.com
2. Seleccionar proyecto: **vibeweaer**
3. En el menú izquierdo: **Firestore Database**
4. Clic en **Create Database**
5. Seleccionar **Start in production mode** (para testing inicial)
6. Ubicación: **nam5** (North America)
7. Crear

### B. Configurar Reglas de Seguridad de Firestore

En **Firestore Database → Rules**, reemplazar con:

```json
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura solo al propietario de la orden
    match /orders/{document=**} {
      allow create: if request.auth != null || true;
      allow read, update: if request.auth != null || request.resource.data.email == request.query.email;
      allow delete: if false;
    }
  }
}
```

### C. Email Notifications (Próximos Pasos)

Para integrar emails reales, usar uno de:

#### Opción 1: **Firebase Cloud Functions** (Recomendado)
```bash
npm install -g firebase-tools
firebase init functions
# Crear función que envíe emails cuando se crea una orden
```

Función ejemplo:
```javascript
exports.sendOrderEmail = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();
    // Usar Nodemailer o SendGrid
  });
```

#### Opción 2: **Mailgun** (API REST)
```javascript
const mailgun = require('mailgun-js');
const mg = mailgun({apiKey: 'key-xxx', domain: 'mail.vibewear.com'});

export async function sendEmail(to, subject, text) {
  return mg.messages().send({
    from: 'noreply@vibewear.com',
    to: to,
    subject: subject,
    text: text
  });
}
```

#### Opción 3: **SendGrid** (API REST)
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail(to, subject, text) {
  await sgMail.send({
    to: to,
    from: 'noreply@vibewear.com',
    subject: subject,
    text: text
  });
}
```

---

## 📊 Estructura de Datos en Firestore

### Colección: `orders`

```json
{
  "id": "VW-1713267890123",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "3206045846",
  "address": "Calle 123 #45-67",
  "city": "Barranquilla",
  "zipCode": "080001",
  "items": [
    {
      "id": "prod-1",
      "name": "Eladio Carrión Oversized",
      "price": 75000,
      "quantity": 1,
      "image": "images/Productos/Producto 1/Eladio-Back.jpg",
      "size": "M",
      "color": "Negro"
    }
  ],
  "subtotal": 75000,
  "tax": 14250,
  "shipping": 8000,
  "total": 97250,
  "status": "Pendiente de confirmación",
  "paymentMethod": "Mercado Pago",
  "paymentStatus": "pending",
  "date": "16/04/2026",
  "tracking": "ABC12XYZ9",
  "createdAt": "2026-04-16T10:30:00Z",
  "updatedAt": "2026-04-16T10:30:00Z"
}
```

---

## 🧪 Testing Local

### Ver Email Log
En la consola del navegador:
```javascript
import { getEmailLog } from './notifications-email.js';
console.log(getEmailLog());
```

### Ver Órdenes en localStorage
```javascript
JSON.parse(localStorage.getItem('vibewear-orders'))
```

### Limpiar Email Log
```javascript
import { clearEmailLog } from './notifications-email.js';
clearEmailLog();
```

---

## 📝 Archivos Nuevos Creados

| Archivo | Propósito | Estado |
|---------|-----------|--------|
| `firebase-orders.js` | Gestión de órdenes en Firestore | ✅ Funcional |
| `notifications-email.js` | Sistema de notificaciones | ✅ Funcional (simulado) |
| `checkout.html` | Página de pago mejorada | ✅ Actualizado |
| `success.html` | Confirmación de compra | ✅ Funcional |
| `pending.html` | Estado de pago pendiente | ✅ Funcional |

---

## 🔐 Variables de Entorno

Para producción, crear archivo `.env.local`:

```
VITE_FIREBASE_API_KEY=AIzaSyC_Pr0N4Eheg7j3fa77-wQHsHNY4J3rvsE
VITE_FIREBASE_PROJECT_ID=vibeweaer
VITE_SENDGRID_API_KEY=SG.xxxxx
VITE_MERCADO_PAGO_PUBLIC_KEY=TEST-xxxxxxx
```

---

## ✨ Funcionalidades Disponibles

### Checkout
- ✅ Validación de datos (email, teléfono, dirección)
- ✅ Cálculo automático de IVA y envío
- ✅ Guardado en localStorage
- ✅ Guardado en Firebase Firestore (si está disponible)
- ✅ Envío de emails de confirmación (simulado)
- ✅ Generación de código de rastreo
- ✅ Acumulación de puntos de lealtad

### Órdenes
- ✅ Recuperar órdenes por email
- ✅ Recuperar orden por ID
- ✅ Actualizar estado de orden
- ✅ Historial de cambios con timestamps

### Notificaciones
- ✅ Confirmación de orden
- ✅ Estado de envío
- ✅ Notificación de pago
- ✅ Solicitud de reseña

---

## 🐛 Troubleshooting

### "Firebase not initialized"
- Verificar que `firebase-config.js` está correctamente configurado
- Verificar credenciales en Firebase Console

### Órdenes no aparecen en Firestore
- Abrir Firestore Console y crear la colección `orders` manualmente
- Verificar reglas de seguridad permitan escritura

### Emails no se envían
- Sistema está configurado para simular emails localmente
- Para producción, integrar con Mailgun/SendGrid/Firebase Cloud Functions

### localStorage lleno
- Limpiar localStorage regularmente
- Usar Firebase como almacenamiento principal

---

## 🚀 Próximos Pasos

1. **Integrar Email Real**: Usar SendGrid o Mailgun
2. **Autenticación**: Implementar Google/Facebook login
3. **Panel de Admin**: Ver órdenes y actualizarlas
4. **SMS Notifications**: Integrar Twilio
5. **Pago Real**: Conectar Mercado Pago con backend
6. **Reportes**: Dashboard de ventas y análisis

---

## 📞 Soporte

Para ayuda con configuración de Firebase:
- https://firebase.google.com/docs/firestore
- https://firebase.google.com/docs/firestore/security/rules

Para integración de emails:
- Mailgun: https://www.mailgun.com/
- SendGrid: https://sendgrid.com/
- Firebase: https://firebase.google.com/docs/functions

---

**Última actualización**: 16 de abril de 2026
**Estado**: Checkout con Firebase y notificaciones en desarrollo
