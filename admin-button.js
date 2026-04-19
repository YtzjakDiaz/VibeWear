// ADMIN BUTTON - Ya no agrega botón. La lógica está en navbar-auth.js

import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getFirestore, collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';

const firebaseConfig = {
  apiKey: "AIzaSyC_Pr0N4Eheg7j3fa77-wQHsHNY4J3rvsE",
  authDomain: "vibeweaer.firebaseapp.com",
  projectId: "vibeweaer",
  storageBucket: "vibeweaer.firebasestorage.app",
  messagingSenderId: "534063442486",
  appId: "1:534063442486:web:bd72285a4e2f8358b2c697",
  measurementId: "G-E66WR1DFBF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Simplemente verificar autenticación (el resto se maneja en navbar-auth.js)
onAuthStateChanged(auth, (user) => {
  if (!user) return;
  console.log('✓ Admin Button Module Loaded');
});
