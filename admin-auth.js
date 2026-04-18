import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getFirestore, collection, getDocs, query, where, doc, getDoc, setDoc, deleteDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// Firebase config
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

// Email del propietario
const OWNER_EMAIL = 'ytzjakdawid1210@gmail.com';

// Variables globales
let currentAdmin = null;
let isAdmin = false;

// Verificar autenticación al cargar
onAuthStateChanged(auth, async (user) => {
  const loginContainer = document.getElementById('loginContainer');
  const adminDashboard = document.querySelector('.admin-container');

  if (user) {
    console.log('👤 Usuario logueado:', user.email);
    
    // Si es el propietario, permitir acceso directo
    if (user.email === OWNER_EMAIL) {
      console.log('✅ ES EL PROPIETARIO - Permitiendo acceso');
      
      currentAdmin = user;
      isAdmin = true;
      
      // Mostrar dashboard
      if (adminDashboard) adminDashboard.style.display = 'flex';
      if (loginContainer) loginContainer.style.display = 'none';
      
      // Actualizar email en navbar
      const emailSpan = document.getElementById('adminUserEmail');
      if (emailSpan) emailSpan.textContent = user.email;
      
      // Cargar datos del dashboard
      console.log('📊 Cargando datos...');
      loadDashboardData();
      loadProducts();
      loadOrders();
      loadAdmins();
      loadAnalytics();
      
      console.log('✓ Dashboard cargado');
      return;
    }
    
    // Para otros emails, verificar Firestore
    console.log('🔐 Verificando permisos para:', user.email);
    try {
      const adminStatus = await checkIfAdmin(user.email);
      console.log('✅ ¿Es admin?', adminStatus);
      
      if (adminStatus) {
        currentAdmin = user;
        isAdmin = true;
        
        if (adminDashboard) adminDashboard.style.display = 'flex';
        if (loginContainer) loginContainer.style.display = 'none';
        
        const emailSpan = document.getElementById('adminUserEmail');
        if (emailSpan) emailSpan.textContent = user.email;
        
        loadDashboardData();
        loadProducts();
        loadOrders();
        loadAdmins();
        loadAnalytics();
        
        console.log('✓ Admin autenticado');
      } else {
        console.log('❌ No es admin');
        await signOut(auth);
        showError('No tienes permisos de administrador');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      showError('Error: ' + error.message);
    }
  } else {
    console.log('🔓 No hay usuario, mostrando login');
    if (adminDashboard) adminDashboard.style.display = 'none';
    showLoginForm();
  }
});

// Verificar si el email es admin
async function checkIfAdmin(email) {
  try {
    console.log('🔍 Verificando admin para:', email);
    
    // Comprobar si es el propietario
    if (email === OWNER_EMAIL) {
      console.log('✓ Es el propietario');
      console.log('💾 Asegurando documento en Firestore...');
      
      try {
        await ensureAdminExists(email);
        console.log('✅ Admin asegurado en Firestore');
      } catch (error) {
        console.error('⚠️ Error asegurando admin:', error);
        // De todas formas dejar pasar
      }
      
      return true;
    }
    
    console.log('🔎 Buscando en Firestore...');
    
    // Buscar en Firestore
    const adminsRef = collection(db, 'vibewear_admins');
    const q = query(adminsRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    const isAdmin = !querySnapshot.empty;
    console.log('📊 ¿Encontrado en Firestore?', isAdmin);
    
    return isAdmin;
  } catch (error) {
    console.error('❌ Error verificando admin:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Si es propietario, dejar pasar aunque haya error
    if (email === OWNER_EMAIL) {
      console.warn('⚠️ Error en Firestore pero es el propietario, permitiendo acceso');
      return true;
    }
    
    return false;
  }
}

// Asegurar que el email está en Firestore
async function ensureAdminExists(email) {
  try {
    console.log('💾 Asegurando que admin existe en Firestore:', email);
    
    const adminsRef = collection(db, 'vibewear_admins');
    const q = query(adminsRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('📝 Admin NO existe, creando...');
      
      // Agregar nuevo admin
      const adminDoc = {
        email: email,
        rol: 'owner',
        agreagadoEn: new Date().toISOString(),
        activo: true
      };
      
      console.log('📋 Documento a crear:', adminDoc);
      
      await setDoc(doc(db, 'vibewear_admins', email), adminDoc);
      console.log('✅ Admin agregado a Firestore correctamente');
    } else {
      console.log('✓ Admin YA existe en Firestore');
    }
  } catch (error) {
    console.error('❌ Error en ensureAdminExists:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
}

// Mostrar formulario de login
function showLoginForm() {
  const html = `
    <div id="loginContainer" style="position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(135deg, var(--black) 0%, var(--black-soft) 100%);display:flex;align-items:center;justify-content:center;z-index:9999;">
      <div style="background:var(--black-soft);border:2px solid var(--pink);border-radius:12px;padding:40px;width:90%;max-width:400px;box-shadow:0 20px 60px rgba(224,162,201,0.2);">
        <div style="text-align:center;margin-bottom:30px;">
          <h1 class="nav-logo-text" style="margin:0;font-size:28px;">VIBE<span>WEAR</span></h1>
          <p style="color:var(--gray);margin:10px 0 0;font-size:14px;letter-spacing:1px;text-transform:uppercase;font-weight:600;">Panel de Administración</p>
        </div>

        <form id="adminLoginForm" style="display:flex;flex-direction:column;gap:15px;" onsubmit="handleAdminLogin(event)">
          <div>
            <label style="display:block;font-size:12px;color:var(--pink);margin-bottom:8px;letter-spacing:1px;text-transform:uppercase;font-weight:600;">Email</label>
            <input type="email" id="loginEmail" placeholder="tu@email.com" required style="width:100%;padding:12px;background:var(--black);border:1px solid rgba(224,162,201,0.3);border-radius:6px;color:var(--white);font-family:var(--font-body);">
          </div>

          <div>
            <label style="display:block;font-size:12px;color:var(--pink);margin-bottom:8px;letter-spacing:1px;text-transform:uppercase;font-weight:600;">Contraseña</label>
            <input type="password" id="loginPassword" placeholder="••••••••" required style="width:100%;padding:12px;background:var(--black);border:1px solid rgba(224,162,201,0.3);border-radius:6px;color:var(--white);font-family:var(--font-body);">
          </div>

          <button type="submit" style="padding:12px;background:var(--pink);color:var(--black);border:none;border-radius:6px;font-weight:bold;cursor:pointer;text-transform:uppercase;letter-spacing:1px;font-size:13px;transition:all 0.3s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
            Iniciar Sesión
          </button>

          <p id="loginMessage" style="text-align:center;color:var(--gray);font-size:12px;margin-top:10px;"></p>
        </form>

        <p style="text-align:center;color:var(--gray);font-size:12px;margin-top:20px;">
          Solo admins autorizados pueden acceder
        </p>
      </div>
    </div>
  `;

  if (!document.getElementById('loginContainer')) {
    document.body.insertAdjacentHTML('afterbegin', html);
  }
}

// Manejar login de admin
async function handleAdminLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const messageDiv = document.getElementById('loginMessage');
  
  console.log('🔐 Intentando login...');
  console.log('Email:', email);
  console.log('Contraseña: [' + password.length + ' caracteres]');
  
  try {
    messageDiv.textContent = 'Verificando...';
    messageDiv.style.color = 'var(--gray)';
    
    console.log('📧 Autenticando con Firebase...');
    
    // Intentar login con Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Autenticación exitosa:', userCredential.user.email);
    
    // Firebase manejará el onAuthStateChanged automáticamente
    messageDiv.textContent = '✓ Autenticando...';
    messageDiv.style.color = 'var(--pink)';
    
  } catch (error) {
    console.error('❌ Error de login:', error);
    console.error('Código:', error.code);
    console.error('Mensaje:', error.message);
    
    messageDiv.style.color = '#ff6b9d';
    
    if (error.code === 'auth/user-not-found') {
      messageDiv.textContent = '❌ Usuario no encontrado';
    } else if (error.code === 'auth/wrong-password') {
      messageDiv.textContent = '❌ Contraseña incorrecta';
    } else if (error.code === 'auth/invalid-email') {
      messageDiv.textContent = '❌ Email inválido';
    } else {
      messageDiv.textContent = '❌ Error: ' + error.message;
    }
  }
}

// Logout
window.logoutAdmin = async function() {
  try {
    await signOut(auth);
    currentAdmin = null;
    isAdmin = false;
    console.log('✓ Admin deslogueado');
  } catch (error) {
    console.error('Error en logout:', error);
  }
};

// Cambiar tabs
window.switchTab = function(tabName) {
  // Ocultar todos los tabs
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Mostrar tab seleccionado
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
  
  // Actualizar menu
  document.querySelectorAll('.admin-menu-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
};

// Mostrar error
function showError(message) {
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#ff6b9d;color:white;padding:15px 20px;border-radius:6px;z-index:10000;font-weight:bold;';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Funciones placeholder (se implementarán en archivos separados)
async function loadDashboardData() {
  try {
    // Contar órdenes
    const ordersRef = collection(db, 'vibewear_orders');
    const ordersSnapshot = await getDocs(ordersRef);
    const totalOrders = ordersSnapshot.size;
    document.getElementById('totalOrders').textContent = totalOrders;
    
    console.log('✓ Dashboard cargado');
  } catch (error) {
    console.error('Error cargando dashboard:', error);
  }
}

async function loadProducts() {
  console.log('Cargando productos...');
  // Se implementará en admin-products.js
}

async function loadOrders() {
  console.log('Cargando órdenes...');
  // Se implementará en admin-orders.js
}

async function loadAdmins() {
  try {
    const adminsRef = collection(db, 'vibewear_admins');
    const adminsSnapshot = await getDocs(adminsRef);
    const adminsList = document.getElementById('adminsList');
    
    if (adminsSnapshot.empty) {
      adminsList.innerHTML = '<p style="color:var(--gray);">No hay admins</p>';
      return;
    }
    
    let html = '';
    adminsSnapshot.forEach(doc => {
      const admin = doc.data();
      html += `
        <div style="background:rgba(224,162,201,0.05);border:1px solid rgba(224,162,201,0.2);border-radius:6px;padding:12px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <p style="margin:0;font-weight:bold;color:var(--white);">${admin.email}</p>
            <p style="margin:5px 0 0;font-size:12px;color:var(--gray);">Rol: ${admin.rol || 'admin'}</p>
          </div>
          ${admin.email !== OWNER_EMAIL ? `<button class="btn-danger" onclick="removeAdmin('${admin.email}')">Eliminar</button>` : '<span style="color:var(--pink);font-weight:bold;">Propietario</span>'}
        </div>
      `;
    });
    
    adminsList.innerHTML = html;
    document.getElementById('totalAdmins').textContent = adminsSnapshot.size;
    
  } catch (error) {
    console.error('Error cargando admins:', error);
  }
}

async function loadAnalytics() {
  console.log('Cargando analytics...');
  // Se implementará en admin-analytics.js
}

// Agregar admin
window.addAdmin = async function() {
  const emailInput = document.getElementById('newAdminEmail');
  const email = emailInput.value.trim();
  
  if (!email) {
    showError('Ingresa un email válido');
    return;
  }
  
  if (email === OWNER_EMAIL) {
    showError('Este es el propietario');
    return;
  }
  
  try {
    const adminDoc = {
      email: email,
      rol: 'admin',
      agreagadoEn: new Date(),
      activo: true,
      agreagadoPor: currentAdmin.email
    };
    
    await setDoc(doc(db, 'vibewear_admins', email), adminDoc);
    
    emailInput.value = '';
    showError('✓ Admin agregado exitosamente');
    loadAdmins();
    
  } catch (error) {
    console.error('Error agregando admin:', error);
    showError('Error al agregar admin');
  }
};

// Remover admin
window.removeAdmin = async function(email) {
  if (!confirm(`¿Eliminar admin ${email}?`)) return;
  
  try {
    await deleteDoc(doc(db, 'vibewear_admins', email));
    showError('✓ Admin eliminado');
    loadAdmins();
  } catch (error) {
    console.error('Error eliminando admin:', error);
    showError('Error al eliminar admin');
  }
};

// Exportar para uso global
window.db = db;
window.auth = auth;
window.checkIfAdmin = checkIfAdmin;

console.log('✓ Admin Auth Module Loaded');
