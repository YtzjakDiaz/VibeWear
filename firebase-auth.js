// ============= FIREBASE AUTHENTICATION MODULE =============
// Sistema completo de autenticación con Firebase Auth

import { auth } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  updateEmail,
  updatePassword
} from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js';

/**
 * Crear nuevo usuario con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @param {string} displayName - Nombre a mostrar
 * @returns {Promise<User>}
 */
export async function registerWithEmail(email, password, displayName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Actualizar perfil con nombre
    await updateProfile(user, {
      displayName: displayName,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    });
    
    console.log('✓ Usuario registrado:', user.uid);
    return user;
  } catch (error) {
    console.error('✗ Error registrando usuario:', error.message);
    throw error;
  }
}

/**
 * Login con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @returns {Promise<User>}
 */
export async function loginWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✓ Usuario autenticado:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('✗ Error en login:', error.message);
    throw error;
  }
}

/**
 * Login con Google
 * @returns {Promise<User>}
 */
export async function loginWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    const result = await signInWithPopup(auth, provider);
    console.log('✓ Usuario autenticado con Google:', result.user.uid);
    return result.user;
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      console.log('ℹ Google popup fue cancelado o bloqueado');
      return null;
    }
    console.error('✗ Error en Google login:', error.message);
    throw error;
  }
}

/**
 * Login con GitHub
 * @returns {Promise<User>}
 */
export async function loginWithGitHub() {
  try {
    const provider = new GithubAuthProvider();
    provider.addScope('user:email');
    
    const result = await signInWithPopup(auth, provider);
    console.log('✓ Usuario autenticado con GitHub:', result.user.uid);
    return result.user;
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      console.log('ℹ GitHub popup fue cancelado o bloqueado');
      return null;
    }
    console.error('✗ Error en GitHub login:', error.message);
    throw error;
  }
}

/**
 * Cerrar sesión
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    await signOut(auth);
    console.log('✓ Sesión cerrada');
    localStorage.removeItem('vibewear-user');
  } catch (error) {
    console.error('✗ Error cerrando sesión:', error.message);
    throw error;
  }
}

/**
 * Enviar email para recuperar contraseña
 * @param {string} email - Email del usuario
 * @returns {Promise<void>}
 */
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('✓ Email de recuperación enviado a:', email);
    return true;
  } catch (error) {
    console.error('✗ Error enviando email:', error.message);
    throw error;
  }
}

/**
 * Actualizar email del usuario actual
 * @param {string} newEmail - Nuevo email
 * @returns {Promise<void>}
 */
export async function changeEmail(newEmail) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No hay usuario autenticado');
    
    await updateEmail(user, newEmail);
    console.log('✓ Email actualizado a:', newEmail);
  } catch (error) {
    console.error('✗ Error actualizando email:', error.message);
    throw error;
  }
}

/**
 * Actualizar contraseña del usuario actual
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise<void>}
 */
export async function changePassword(newPassword) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No hay usuario autenticado');
    
    await updatePassword(user, newPassword);
    console.log('✓ Contraseña actualizada');
  } catch (error) {
    console.error('✗ Error actualizando contraseña:', error.message);
    throw error;
  }
}

/**
 * Actualizar perfil del usuario actual
 * @param {Object} profileData - {displayName, photoURL}
 * @returns {Promise<void>}
 */
export async function updateUserProfile(profileData) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No hay usuario autenticado');
    
    // Si viene con photoURL largo, guardar en Firestore y usar URL corta en Auth
    let authData = { ...profileData };
    
    if (authData.photoURL && authData.photoURL.includes('firebasestorage')) {
      // Es una URL larga de Firebase Storage
      // Guardar URL completa en Firestore
      const { db } = await import('./firebase-config.js');
      const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js');
      
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        photoURL: authData.photoURL,
        photoUpdatedAt: new Date().toISOString()
      }, { merge: true });
      
      // Usar URL corta en Auth (dicebear o placeholder)
      authData.photoURL = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;
    }
    
    await updateProfile(user, authData);
    console.log('✓ Perfil actualizado');
  } catch (error) {
    console.error('✗ Error actualizando perfil:', error.message);
    throw error;
  }
}

/**
 * Obtener usuario actual
 * @returns {User|null}
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Escuchar cambios de autenticación
 * @param {Function} callback - Función que se ejecuta cuando cambia el estado
 * @returns {Function} - Función para dejar de escuchar
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      // Usuario autenticado
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Usuario',
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        createdAt: user.metadata.creationTime,
        lastSignIn: user.metadata.lastSignInTime
      };
      
      // Guardar en localStorage
      localStorage.setItem('vibewear-user', JSON.stringify(userData));
      callback(userData);
    } else {
      // Usuario no autenticado
      localStorage.removeItem('vibewear-user');
      callback(null);
    }
  });
}

/**
 * Obtener usuario guardado en localStorage
 * @returns {Object|null}
 */
export function getSavedUser() {
  const saved = localStorage.getItem('vibewear-user');
  return saved ? JSON.parse(saved) : null;
}

/**
 * Validar email
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validar contraseña
 * @param {string} password
 * @returns {Object} - {isValid, errors}
 */
export function validatePassword(password) {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Mínimo 6 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Incluye una mayúscula (A-Z)');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Incluye un número (0-9)');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Obtener mensaje de error en español
 * @param {Object} error - Error de Firebase
 * @returns {string}
 */
export function getErrorMessage(error) {
  const errorMessages = {
    'auth/email-already-in-use': 'Este email ya está registrado',
    'auth/invalid-email': 'Email inválido',
    'auth/weak-password': 'Contraseña muy débil',
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/user-disabled': 'Usuario deshabilitado',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
    'auth/popup-closed-by-user': 'El login fue cancelado',
    'auth/cancelled-popup-request': 'El popup fue bloqueado. Permite popups e intenta de nuevo',
    'auth/operation-not-allowed': 'Email/Password no está habilitado. Por favor intenta con Google o GitHub',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet'
  };
  
  return errorMessages[error.code] || error.message || 'Error desconocido';
}

console.log('✓ Firebase Auth Module cargado');
