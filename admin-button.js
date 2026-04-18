// ADMIN BUTTON - Agregar botón de admin a la navbar si el usuario es admin

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
const OWNER_EMAIL = 'ytzjakdawid1210@gmail.com';

onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  
  // Verificar si es admin
  try {
    let isAdmin = false;
    
    // Comprobar si es el propietario
    if (user.email === OWNER_EMAIL) {
      isAdmin = true;
    } else {
      // Buscar en Firestore
      const adminsRef = collection(db, 'vibewear_admins');
      const q = query(adminsRef, where('email', '==', user.email));
      const querySnapshot = await getDocs(q);
      isAdmin = !querySnapshot.empty;
    }
    
    if (isAdmin) {
      // Agregar botón de admin
      const navRight = document.querySelector('[style*="display:flex"][style*="gap:15px"][style*="align-items:center"]');
      if (navRight && !document.getElementById('adminNavBtn')) {
        const adminBtn = document.createElement('a');
        adminBtn.id = 'adminNavBtn';
        adminBtn.href = 'admin.html';
        adminBtn.style.cssText = `
          background: linear-gradient(135deg, var(--pink) 0%, #ff85b3 100%);
          border: none;
          color: var(--black);
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-family: var(--font-sub);
          font-size: 12px;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-weight: 600;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        `;
        adminBtn.onmouseover = function() {
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 8px 16px rgba(224,162,201,0.3)';
        };
        adminBtn.onmouseout = function() {
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = 'none';
        };
        adminBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path></svg>
          Admin
        `;
        
        // Insertar antes del botón de "Mi cuenta"
        const miCuentaBtn = document.querySelector('button[title="Mi cuenta"]');
        if (miCuentaBtn) {
          miCuentaBtn.parentElement.insertBefore(adminBtn, miCuentaBtn);
        } else {
          navRight.appendChild(adminBtn);
        }
      }
    }
  } catch (error) {
    console.error('Error verificando admin:', error);
  }
});

console.log('✓ Admin Button Module Loaded');
