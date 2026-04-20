// ============= CONFIGURACIÓN DE FIREBASE =============
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-storage.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC_Pr0N4Eheg7j3fa77-wQHsHNY4J3rvsE",
  authDomain: "vibeweaer.firebaseapp.com",
  projectId: "vibeweaer",
  storageBucket: "vibeweaer.firebasestorage.app",
  messagingSenderId: "534063442486",
  appId: "1:534063442486:web:bd72285a4e2f8358b2c697",
  measurementId: "G-E66WR1DFBF"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener referencias a los servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

console.log('✓ Firebase inicializado correctamente');
