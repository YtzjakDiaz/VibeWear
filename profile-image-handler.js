// ============= GESTOR DE IMÁGENES DE PERFIL CON FIREBASE STORAGE =============

import { storage } from './firebase-config.js';
import { db } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-storage.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// Subir imagen de perfil a Firebase Storage
async function uploadProfileImage(file, userId) {
  try {
    console.log('📸 [uploadProfileImage] Iniciando con archivo:', file?.name, 'Usuario:', userId);
    
    if (!file) throw new Error('No file provided');
    if (!userId) throw new Error('No userId provided');
    
    // Validar tipo y tamaño
    if (!file.type.startsWith('image/')) {
      throw new Error('Solo se permiten imágenes: ' + file.type);
    }
    
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('La imagen debe ser menor a 5MB');
    }

    // Comprimir imagen a base64
    console.log('🔄 Comprimiendo imagen...');
    const base64Data = await compressImageToBase64(file);
    console.log('✓ Imagen comprimida a base64');
    
    // Guardar directamente en Firestore como base64 (evita CORS completamente)
    console.log('💾 Guardando imagen en Firestore...');
    await savePhotoToFirestore(userId, base64Data);
    console.log('✓ Imagen guardada en Firestore');
    
    return base64Data; // Devolver el base64 directamente
  } catch (error) {
    console.error('❌ [uploadProfileImage] Error:', error);
    throw error;
  }
}

// Guardar foto en base64 en Firestore
async function savePhotoToFirestore(userId, base64Data) {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      photoURL: base64Data,
      photoUpdatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('❌ Error guardando foto en Firestore:', error);
    throw error;
  }
}

// Obtener foto desde Firestore
async function getPhotoURLFromFirestore(userId) {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists() && userDoc.data().photoURL) {
      return userDoc.data().photoURL;
    }
  } catch (error) {
    console.warn('Error fetching photoURL from Firestore:', error);
  }
  return null;
}

// Comprimir imagen a base64
async function compressImageToBase64(file) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onerror = () => {
        reject(new Error('Error leyendo archivo'));
      };
      
      reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        
        img.onerror = () => {
          reject(new Error('Error cargando imagen'));
        };
        
        img.onload = function() {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('No se pudo obtener contexto 2D del canvas'));
            return;
          }
          
          // Redimensionar a máximo 400x400
          let width = img.width;
          let height = img.height;
          const maxSize = 400;
          
          if (width > height) {
            if (width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convertir a base64
          const base64 = canvas.toDataURL('image/jpeg', 0.8);
          resolve(base64);
        };
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
}

// Eliminar imagen anterior
async function deleteProfileImage(userId, imagePath) {
  try {
    // Las imágenes base64 se guardan en Firestore, simplemente se reemplazan
    console.log('🗑️ Eliminando imagen anterior de Firestore...');
  } catch (error) {
    console.warn('Warning deleting image:', error);
  }
}

// Obtener imagen de perfil
function getProfileImageURL(user) {
  if (user.photoURL && user.photoURL.startsWith('data:image')) {
    // Es una imagen en base64 - devolver tal cual
    return user.photoURL;
  } else if (user.photoURL) {
    // URL de Firebase o avatar por defecto
    return user.photoURL;
  }
  // Avatar generado por defecto
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;
}

// Exportar funciones ES6
export { uploadProfileImage, deleteProfileImage, getProfileImageURL, getPhotoURLFromFirestore, compressImageToBase64 };
