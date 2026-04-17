# 🚀 Configuración Completa Firestore - Paso a Paso

## ✅ Ya Hiciste:
- ✅ Creaste colección `orders` en Firestore
- ✅ Empezaste a agregar el primer documento

---

# 📋 PASO 1: Terminar el Documento de Prueba

## En Firestore, en tu documento nuevo, agrega estos campos:

### Campo 1: `email` ✅ (Ya debería estar)
```
Tipo: string
Valor: test@example.com
```

### Campo 2: `total` (AGREGAR)
Haz clic en **"+ Agregar campo"**
```
Campo: total
Tipo: double
Valor: 0
```

### Campo 3: `status` (AGREGAR)
Haz clic en **"+ Agregar campo"**
```
Campo: status
Tipo: string
Valor: Pendiente
```

### Campo 4: `date` (AGREGAR)
Haz clic en **"+ Agregar campo"**
```
Campo: date
Tipo: string
Valor: 16/04/2026
```

### Campo 5: `id` (AGREGAR)
Haz clic en **"+ Agregar campo"**
```
Campo: id
Tipo: string
Valor: VW-TEST-1
```

### Campo 6: `name` (AGREGAR)
Haz clic en **"+ Agregar campo"**
```
Campo: name
Tipo: string
Valor: Test User
```

---

## 💾 Cuando termines de agregar todos:
Haz clic en **"Guardar"** (botón inferior derecho) ✅

---

# 🔐 PASO 2: Configurar Reglas de Seguridad

## En Firebase Console:

1. **Firestore Database** → pestaña **"Rules"**
2. **BORRA TODO** lo que hay (Ctrl+A, Delete)
3. **COPIA ESTO EXACTAMENTE:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Para RESEÑAS
    match /reviews/{document=**} {
      allow read, write: if true;
    }
    
    // Para CONTACTO
    match /contact/{document=**} {
      allow create: if true;
      allow read, write: if request.auth != null;
    }
    
    // Para ÓRDENES
    match /orders/{document=**} {
      allow create: if true;
      allow read: if resource.data.email == request.query.email;
      allow update: if request.auth != null;
      allow delete: if false;
    }
  }
}
```

4. Haz clic en **"Publish"** (botón azul arriba a la derecha) ✅

**Espera a que salga el mensaje: "Rules published successfully"**

---

# 🧪 PASO 3: Probar que Funciona

## Opción A: Crear una Orden Real (Recomendado)

1. Abre tu sitio: `http://localhost:3000` (o tu dominio)
2. **Agrega un producto al carrito** (cualquiera)
3. Ve al **carrito** (esquina superior derecha) 🛒
4. Haz clic en **"Proceder al Pago"** o **"Checkout"**
5. **Completa el formulario:**
   - Nombre: `Juan Pérez`
   - Email: `juan@example.com`
   - Teléfono: `3206045846`
   - Dirección: `Calle 123 #45-67`
   - Ciudad: `Barranquilla`
   - Código Postal: `080001`
6. Haz clic en **"Pagar Ahora"** 💳
7. Deberías ver un mensaje: **"¡Orden creada exitosamente!"** ✅

---

## Opción B: Usar el Panel de Test

1. Abre: `http://localhost:3000/admin-test-panel.html`
2. Ve a la sección **"📦 Órdenes en Firebase"**
3. Haz clic en **"➕ Crear orden de prueba"**
4. En el textbox deberías ver un mensaje con el ID creado ✅

---

# 📊 PASO 4: Verificar en Firebase Console

## En Firebase:

1. Ve a **Firestore Database**
2. Haz clic en colección **"orders"**
3. Deberías ver tu nuevo documento con los datos:

```
ID del documento: lrsk8Gib68NzqVpZoSNZ (generado automático)
├─ id: "VW-1713267890123"
├─ email: "juan@example.com"
├─ total: 97250
├─ status: "Pendiente de confirmación"
├─ name: "Juan Pérez"
├─ phone: "3206045846"
├─ address: "Calle 123 #45-67"
├─ city: "Barranquilla"
├─ zipCode: "080001"
├─ items: [...]
├─ date: "16/04/2026"
├─ tracking: "ABC12XYZ9"
└─ createdAt: "2026-04-16T10:30:00Z"
```

✅ **Si ves esto, ¡FUNCIONÓ!**

---

# 🎯 PASO 5: Verificar con el Panel de Test

1. Abre: `http://localhost:3000/admin-test-panel.html`
2. Ve a **"📦 Órdenes en Firebase"**
3. Haz clic en **"📥 Cargar órdenes de Firebase"**
4. En el textbox deberías ver:

```
✅ 1 órdenes encontradas:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Orden #1
ID: VW-1713267890123
Email: juan@example.com
Total: $97.250
Status: Pendiente de confirmación
Fecha: 4/16/2026, 10:30:00 AM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

✅ **Si ves esto, ¡TODO FUNCIONA!**

---

# ✅ CHECKLIST FINAL

- [ ] Agregué todos los campos al documento de prueba
- [ ] Guardé el documento en Firestore
- [ ] Actualicé las reglas de seguridad
- [ ] Publiqué las reglas
- [ ] Creé una orden desde el sitio O usé el panel de test
- [ ] La orden aparece en Firebase Console
- [ ] El panel de test muestra la orden

---

# 🐛 Si algo no funciona...

## Problema 1: "Firestore permission denied"
```
❌ Error: Permission denied (missing or insufficient permissions)

✅ Solución:
1. Ve a Firestore → Rules
2. Verifica que tengas la regla:
   match /orders/{document=**} {
     allow create: if true;
3. Haz clic en "Publish"
```

## Problema 2: "No hay órdenes en Firebase"
```
❌ Las órdenes solo aparecen en localStorage, no en Firestore

✅ Solución:
1. Abre F12 (consola del navegador)
2. Ve a pestaña "Console"
3. Busca mensajes rojos
4. Si dice "Firebase not initialized", verifica firebase-config.js
5. Si dice "auth/invalid-api-key", las credenciales están mal
```

## Problema 3: "Las reglas de seguridad no se publican"
```
❌ Error: Rules are invalid

✅ Solución:
1. Borra todo y copia las reglas nuevamente
2. Verifica que NO haya caracteres raros
3. Que empiece con: rules_version = '2';
4. Que termine con: }
```

## Problema 4: "La orden no se guarda"
```
❌ La orden se crea localmente pero no aparece en Firestore

✅ Solución:
1. Verifica que checkout.html tenga este script:
   <script src="firebase-orders.js"></script>
   <script src="notifications-email.js"></script>
2. Verifica que firebase-config.js está en el mismo carpeta
3. En consola (F12), escribe:
   import { saveOrderToFirestore } from './firebase-orders.js';
   Si da error, el módulo no está cargando
```

---

# 🚀 PRÓXIMOS PASOS (Opcionales)

## 1. Ver Órdenes en el Admin Panel
```
Abre: http://localhost:3000/admin-test-panel.html

Secciones:
✅ 📦 Órdenes en Firebase
✅ 💾 Órdenes en localStorage
✅ 📧 Notificaciones por Email
✅ 📊 Estadísticas
✅ 🛒 Información del Carrito
```

## 2. Agregar Emails Reales (Después)
Para enviar emails cuando se crea una orden:
- Option 1: Firebase Cloud Functions
- Option 2: Mailgun API
- Option 3: SendGrid API

## 3. SMS con Twilio (Después)
Para notificaciones por WhatsApp/SMS cuando se envía la orden

## 4. Mercado Pago Real (Después)
Para procesar pagos reales en lugar de simulados

---

# 📞 ¿Necesitas Ayuda?

Si en cualquier paso no te funciona:

1. **Abre la consola del navegador** (F12 → Console)
2. **Copia el error completo que aparece**
3. **Dime exactamente en qué paso estás**

Ejemplo de error:
```
Error: Cannot find module './firebase-orders.js'
```

---

**Última actualización:** 16 de abril de 2026  
**Tiempo estimado:** 10-15 minutos ⏱️  
**Dificultad:** ⭐ Muy Fácil
