/**
 * navbar-auth.js
 * Maneja la autenticación en la navbar de todas las páginas
 * Importar en cada HTML: <script type="module" src="navbar-auth.js"></script>
 */

import { onAuthChange, logout, getCurrentUser } from './firebase-auth.js';

// Inicializar navbar cuando el DOM esté listo
function initNavbarAuth() {
  const accountBtn = document.querySelector('button[title="Mi cuenta"]');
  
  if (!accountBtn) {
    console.warn('No se encontró el botón de cuenta en la navbar');
    return;
  }

  // Escuchar cambios de autenticación
  onAuthChange((user) => {
    if (user) {
      // Usuario autenticado
      updateNavbarAuthenticated(accountBtn, user);
    } else {
      // Usuario NO autenticado
      updateNavbarNotAuthenticated(accountBtn);
    }
  });

  // También verificar usuario actual al cargar
  const currentUser = getCurrentUser();
  if (currentUser) {
    updateNavbarAuthenticated(accountBtn, currentUser);
  }
}

function updateNavbarAuthenticated(btn, user) {
  // Crear dropdown con opciones
  const displayName = user.displayName || user.email.split('@')[0];
  const avatar = user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;
  
  // Reemplazar el botón con un dropdown
  btn.style.cssText = `
    background: transparent;
    border: 1px solid var(--pink);
    color: var(--pink);
    padding: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    border-radius: 50px;
    position: relative;
    overflow: visible;
  `;

  btn.innerHTML = `
    <img src="${avatar}" alt="${displayName}" style="width:32px;height:32px;border-radius:50%;border:1px solid var(--pink);object-fit:cover;" />
    <span style="font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:10px 12px 10px 0;">
      ${displayName}
    </span>
  `;

  // Remover evento anterior si existe
  btn.onclick = null;

  // Crear y administrar el dropdown
  let dropdownOpen = false;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownOpen = !dropdownOpen;
    toggleDropdown(dropdownOpen);
  });

  // Cerrar dropdown al hacer click en otra parte
  document.addEventListener('click', () => {
    if (dropdownOpen) {
      dropdownOpen = false;
      toggleDropdown(false);
    }
  });

  function toggleDropdown(open) {
    let dropdown = document.getElementById('authDropdown');
    
    if (open && !dropdown) {
      dropdown = document.createElement('div');
      dropdown.id = 'authDropdown';
      dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: rgba(10, 10, 10, 0.95);
        border: 1px solid rgba(224, 162, 201, 0.3);
        border-radius: 8px;
        min-width: 220px;
        z-index: 1000;
        margin-top: 10px;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        animation: slideDownAuth 0.3s ease;
      `;

      dropdown.innerHTML = `
        <div style="padding: 15px; border-bottom: 1px solid rgba(224, 162, 201, 0.1);">
          <p style="margin: 0; color: var(--gray); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Mi cuenta</p>
          <p style="margin: 8px 0 0; color: var(--white); font-weight: 600; font-size: 14px;">${displayName}</p>
          <p style="margin: 4px 0 0; color: var(--gray); font-size: 11px;">${user.email}</p>
        </div>
        <a href="#" onclick="event.preventDefault(); openUserProfile('${user.uid}')" style="display: block; padding: 12px 16px; color: var(--white); text-decoration: none; font-size: 12px; border-bottom: 1px solid rgba(224, 162, 201, 0.1); transition: background 0.2s;" onmouseover="this.style.background='rgba(224, 162, 201, 0.1)'" onmouseout="this.style.background='transparent'">
          👤 Mi Perfil
        </a>
        <a href="account-profile.html?tab=orders" style="display: block; padding: 12px 16px; color: var(--white); text-decoration: none; font-size: 12px; border-bottom: 1px solid rgba(224, 162, 201, 0.1); transition: background 0.2s;" onmouseover="this.style.background='rgba(224, 162, 201, 0.1)'" onmouseout="this.style.background='transparent'">
          📦 Mis Órdenes
        </a>
        <a href="account-profile.html?tab=security" style="display: block; padding: 12px 16px; color: var(--white); text-decoration: none; font-size: 12px; border-bottom: 1px solid rgba(224, 162, 201, 0.1); transition: background 0.2s;" onmouseover="this.style.background='rgba(224, 162, 201, 0.1)'" onmouseout="this.style.background='transparent'">
          🔐 Seguridad
        </a>
        <button onclick="window.logoutFromNavbar()" style="width: 100%; padding: 12px 16px; background: transparent; border: none; color: #ff6b9d; text-align: left; font-size: 12px; cursor: pointer; font-family: var(--font-body); transition: background 0.2s;" onmouseover="this.style.background='rgba(255, 107, 157, 0.1)'" onmouseout="this.style.background='transparent'">
          🚪 Cerrar Sesión
        </button>
      `;

      btn.parentNode.style.position = 'relative';
      btn.parentNode.appendChild(dropdown);

      // Agregar CSS de animación
      if (!document.getElementById('authDropdownStyles')) {
        const style = document.createElement('style');
        style.id = 'authDropdownStyles';
        style.textContent = `
          @keyframes slideDownAuth {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `;
        document.head.appendChild(style);
      }
    } else if (!open && dropdown) {
      dropdown.remove();
    }
  }

  // Función para logout desde el dropdown
  window.logoutFromNavbar = async function() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      try {
        await logout();
        window.location.reload();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };
}

function updateNavbarNotAuthenticated(btn) {
  // Restaurar botón original para login
  btn.style.cssText = `
    background: var(--pink);
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
  `;

  btn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    Mi cuenta
  `;

  // Evento para ir al login
  btn.onclick = function() {
    window.location.href = 'login.html';
  };

  // Agregar hover effect
  btn.onmouseover = function() {
    this.style.opacity = '0.85';
  };
  btn.onmouseout = function() {
    this.style.opacity = '1';
  };
}

// ============= FUNCIÓN PARA ABRIR PERFIL =============
window.openUserProfile = function(userId) {
  // Cargar user-profile.js si no está cargado
  if (!window.createProfilePanel) {
    const script = document.createElement('script');
    script.src = 'user-profile.js';
    script.onload = () => {
      if (window.createProfilePanel) {
        // Obtener usuario actual
        const user = getCurrentUser();
        if (user) {
          const panel = window.createProfilePanel(user);
          document.body.appendChild(panel);
        }
      }
    };
    document.head.appendChild(script);
  } else {
    // user-profile.js ya está cargado
    const user = getCurrentUser();
    if (user) {
      const panel = window.createProfilePanel(user);
      document.body.appendChild(panel);
    }
  }
};

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavbarAuth);
} else {
  initNavbarAuth();
}

export { initNavbarAuth };
