// ============= GESTOR DE IMÁGENES DE PERFIL CON FIREBASE STORAGE =============

import { storage } from './firebase-config.js';
import { db } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-storage.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// Subir imagen de perfil a Firebase Storage
async function uploadProfileImage(file, userId) {
  try {
    if (!file) throw new Error('No file provided');
    
    // Validar tipo y tamaño
    if (!file.type.startsWith('image/')) {
      throw new Error('Solo se permiten imágenes');
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      throw new Error('La imagen debe ser menor a 5MB');
    }

    // Comprimir imagen
    const compressedBlob = await compressImage(file);
    
    // Crear referencia en Storage
    const fileName = `profile-${userId}-${Date.now()}.jpg`;
    const storageRef = ref(storage, `avatars/${userId}/${fileName}`);
    
    // Subir archivo
    await uploadBytes(storageRef, compressedBlob);
    
    // Obtener URL descargable
    const downloadURL = await getDownloadURL(storageRef);
    
    // Guardar referencia de Storage en Firestore (no tiene límite de caracteres)
    await savePhotoURLToFirestore(userId, downloadURL, `avatars/${userId}/${fileName}`);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
}

// Guardar URL en Firestore para evitar límite de caracteres en Auth
async function savePhotoURLToFirestore(userId, downloadURL, storagePath) {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      photoURL: downloadURL,
      photoPath: storagePath,
      photoUpdatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Warning saving to Firestore:', error);
    // No fallar si Firestore no funciona, continuamos con la URL
  }
}

// Obtener URL de foto desde Firestore o usar avatar por defecto
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

// Comprimir imagen
async function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = function(event) {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Dimensiones máximas
        const maxWidth = 400;
        const maxHeight = 400;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a blob
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      };
    };
  });
}

// Eliminar imagen anterior
async function deleteProfileImage(userId, imagePath) {
  try {
    if (!imagePath) return;
    
    // Si es una URL de download, extraer la ruta
    if (imagePath.includes('firebasestorage')) {
      const pathSegments = imagePath.split('/');
      const filePath = `avatars/${userId}/${pathSegments[pathSegments.length - 1].split('?')[0]}`;
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
    }
  } catch (error) {
    console.warn('Error deleting previous image:', error);
  }
}

// Obtener imagen de perfil
function getProfileImageURL(user) {
  if (user.photoURL && user.photoURL.includes('firebasestorage')) {
    // Es una URL de Firebase Storage - devolver tal cual
    return user.photoURL;
  } else if (user.photoURL) {
    // Generar avatar por defecto
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;
  }
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;
}

// Exportar funciones
window.uploadProfileImage = uploadProfileImage;
window.deleteProfileImage = deleteProfileImage;
window.getProfileImageURL = getProfileImageURL;

// Exportar para módulos ES6
export { uploadProfileImage, deleteProfileImage, getProfileImageURL };
