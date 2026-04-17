# 🔥 Firebase Setup - Instrucciones Finales para VibeWear

## ✅ Lo que ya hemos hecho:

1. ✓ Creado `firebase-config.js` con tu configuración
2. ✓ Creado `firebase-reviews.js` para gestionar reseñas
3. ✓ Creado `firebase-contacto.js` para mensajes de contacto
4. ✓ Integrado Firebase en `contacto.html`
5. ✓ Integrado Firebase en `producto.html`
6. ✓ Publicado las reglas de Firestore en tu consola

---

## 📝 Próximos pasos:

### Paso 1: Verifica que los archivos estén en la carpeta correcta
```
c:\Users\Ytzjak Diaz\3D Objects\files\
├── firebase-config.js ✓
├── firebase-reviews.js ✓
├── firebase-contacto.js ✓
├── contacto.html (actualizado) ✓
├── producto.html (actualizado) ✓
└── ... otros archivos
```

### Paso 2: Abre la consola de Firebase
- Ve a [https://console.firebase.google.com](https://console.firebase.google.com)
- Selecciona tu proyecto "vibeweaer"
- Verifica que Firestore Database esté creada y en estado "Listo"

### Paso 3: Crea las colecciones en Firestore
**Manual (recomendado para empezar):**

1. Click en **"Firestore Database"**
2. Click en **"+ Crear colección"**
3. **Primera colección: "resenas"**
   - Crea un documento ejemplo:
     ```json
     {
       "productoId": "prod-1",
       "calificacion": 5,
       "comentario": "¡Excelente producto!",
       "usuario": "Juan",
       "fecha": 2026-04-16T00:00:00Z,
       "verificado": true
     }
     ```

4. **Segunda colección: "mensajes_contacto"**
   - Crea un documento ejemplo:
     ```json
     {
       "nombre": "Carlos",
       "email": "carlos@email.com",
       "asunto": "pedido",
       "mensaje": "¿Dónde está mi pedido?",
       "fecha": 2026-04-16T00:00:00Z,
       "leido": false
     }
     ```

### Paso 4: Prueba tu integración

**Para contacto.html:**
1. Abre `contacto.html` en tu navegador
2. Completa el formulario y envía un mensaje
3. Ve a Firebase Console → Firestore → Colección "mensajes_contacto"
4. ¡Deberías ver tu mensaje allí! ✓

**Para producto.html:**
1. Abre `producto.html` en tu navegador
2. Ve a la sección de reseñas
3. Escribe una reseña (calificación + comentario)
4. Ve a Firebase Console → Firestore → Colección "resenas"
5. ¡Deberías ver tu reseña allí! ✓

---

## 🔐 Reglas de Seguridad

Las reglas que publicaste permiten lectura y escritura libres (modo desarrollo).

**Antes de subir a producción, cambia las reglas a algo como:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reseñas: permite lectura pública, escritura con validación
    match /resenas/{document=**} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.productoId != null;
    }
    
    // Mensajes de contacto: permite escritura pública, lectura solo admin
    match /mensajes_contacto/{document=**} {
      allow create: if request.resource.data.email != null;
      allow read: if request.auth.uid == "[TU_ADMIN_UID]";
    }
  }
}
```

---

## 📦 Archivos que deben incluir Firebase (si aún no lo hicieron)

Si tienes más páginas que usen estas funcionalidades, agrégalas a:
- `index.html` - si tiene sección de reseñas
- `catalogo.html` - si tiene reseñas de productos
- `wishlist.html` - si quieres guardar favoritos en Firebase
- `blog.html` - si tiene comentarios
- `account.html` - si tiene panel de usuario

**Formato para incluir en el `<head>`:**
```html
<script type="module">
  import { saveContactMessage } from "./firebase-contacto.js";
  import { saveReviewToFirebase, getProductReviews } from "./firebase-reviews.js";
  window.saveContactMessage = saveContactMessage;
  window.saveReviewToFirebase = saveReviewToFirebase;
  window.getProductReviews = getProductReviews;
</script>
```

---

## 🐛 Solución de Problemas

**Problema: "Cannot find module"**
- Verifica que los archivos `.js` estén en la carpeta raíz junto a los HTML

**Problema: No aparecen los datos en Firebase**
- Abre la consola del navegador (F12)
- Busca mensajes de error rojo
- Verifica que Firebase esté inicializado correctamente

**Problema: CORS error**
- Los navegadores modernos bloquean scripts módulos en `file://`
- **Solución:** Usa un servidor local:
  ```bash
  # Opción 1: Python
  python -m http.server 8000
  
  # Opción 2: Node.js (si tienes npx)
  npx http-server
  
  # Luego abre: http://localhost:8000
  ```

---

## 🚀 Siguiente Paso: GitHub

Cuando todo funcione localmente:

1. **Crea un `.gitignore`:**
```
node_modules/
.DS_Store
.env
firebase-config.js (opcional - si quieres proteger credenciales)
```

2. **Sube a GitHub:**
```bash
git init
git add .
git commit -m "Initial commit - VibeWear con Firebase"
git branch -M main
git remote add origin https://github.com/tu-usuario/vibewear.git
git push -u origin main
```

⚠️ **IMPORTANTE:** Si subes `firebase-config.js` con tus credenciales a GitHub público, cualquiera puede usarlas. Considera usar variables de entorno o un archivo `.env`.

---

¿Necesitas ayuda con algo específico? Pregúntame. 🎉
