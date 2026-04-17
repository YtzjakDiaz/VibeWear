// ============= SISTEMA INTEGRADO DE AUTENTICACIÓN Y PERFIL =============
// Gestiona login, registro, perfil y sesión de forma unificada

class AuthSystem {
  constructor() {
    this.currentUser = this.loadCurrentUser();
    this.isLoggedIn = !!this.currentUser;
    this.init();
  }

  /**
   * Inicializar sistema
   */
  init() {
    this.setupAuthUI();
    this.restoreSession();
    this.bindAuthEvents();
  }

  /**
   * Cargar usuario actual del localStorage
   */
  loadCurrentUser() {
    const userId = localStorage.getItem('vibewear-current-user-id');
    if (!userId) return null;

    const userProfile = JSON.parse(localStorage.getItem(`vibewear-profile-${userId}`));
    return userProfile || null;
  }

  /**
   * Guardar usuario en localStorage (después de Firebase)
   */
  saveUser(user) {
    this.currentUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
      createdAt: user.metadata?.creationTime || new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    localStorage.setItem('vibewear-current-user-id', user.uid);
    localStorage.setItem(`vibewear-profile-${user.uid}`, JSON.stringify(this.currentUser));

    this.isLoggedIn = true;
    this.updateAuthUI();
    return this.currentUser;
  }

  /**
   * Logout
   */
  logout() {
    localStorage.removeItem('vibewear-current-user-id');
    this.currentUser = null;
    this.isLoggedIn = false;
    this.updateAuthUI();
    window.location.href = 'index.html';
  }

  /**
   * Restaurar sesión
   */
  restoreSession() {
    if (this.isLoggedIn && this.currentUser) {
      console.log(`✓ Sesión restaurada: ${this.currentUser.displayName}`);
    }
  }

  /**
   * Configurar UI de autenticación en navbar
   */
  setupAuthUI() {
    // Buscar botón "Mi cuenta" en el navbar
    const accountBtn = document.querySelector('button:has(svg[stroke-width="2"]):has-text("Mi cuenta")');
    const accountBtnAll = Array.from(document.querySelectorAll('button')).find(b =>
      b.textContent.includes('Mi cuenta')
    );

    if (!accountBtnAll) {
      console.warn('⚠ No se encontró botón "Mi cuenta" en navbar');
      return;
    }

    // Agregar dropdown menu
    accountBtnAll.style.position = 'relative';

    const dropdown = document.createElement('div');
    dropdown.className = 'auth-dropdown';
    dropdown.style.cssText = `
      position: absolute;
      top: 100%;
      right: 0;
      background: var(--black-soft);
      border: 1px solid rgba(224,162,201,0.2);
      border-radius: 8px;
      min-width: 200px;
      margin-top: 10px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s;
      z-index: 1000;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    `;

    accountBtnAll.addEventListener('mouseenter', () => {
      this.updateAuthDropdown(dropdown);
      dropdown.style.opacity = '1';
      dropdown.style.visibility = 'visible';
      dropdown.style.transform = 'translateY(0)';
    });

    accountBtnAll.addEventListener('mouseleave', () => {
      dropdown.style.opacity = '0';
      dropdown.style.visibility = 'hidden';
      dropdown.style.transform = 'translateY(-10px)';
    });

    accountBtnAll.parentElement.appendChild(dropdown);
  }

  /**
   * Actualizar contenido del dropdown
   */
  updateAuthDropdown(dropdown) {
    dropdown.innerHTML = '';

    if (this.isLoggedIn && this.currentUser) {
      // Usuario autenticado
      const header = document.createElement('div');
      header.style.cssText = `
        padding: 15px 20px;
        border-bottom: 1px solid rgba(224,162,201,0.1);
        display: flex;
        align-items: center;
        gap: 12px;
      `;

      const avatar = document.createElement('img');
      avatar.src = this.currentUser.photoURL;
      avatar.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1.5px solid var(--pink);
        object-fit: cover;
      `;

      const info = document.createElement('div');
      info.style.cssText = `
        flex: 1;
        min-width: 0;
      `;

      const name = document.createElement('p');
      name.textContent = this.currentUser.displayName;
      name.style.cssText = `
        margin: 0;
        font-family: var(--font-sub);
        font-size: 12px;
        font-weight: 600;
        color: var(--white);
        text-transform: uppercase;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `;

      const email = document.createElement('p');
      email.textContent = this.currentUser.email;
      email.style.cssText = `
        margin: 4px 0 0;
        font-size: 10px;
        color: var(--gray);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `;

      info.appendChild(name);
      info.appendChild(email);
      header.appendChild(avatar);
      header.appendChild(info);
      dropdown.appendChild(header);

      // Opciones
      const options = [
        { label: '👤 Mi Perfil', href: 'account-profile.html', icon: '👤' },
        { label: '📦 Mis Pedidos', href: 'account-profile.html#orders', icon: '📦' },
        { label: '❤️ Favoritos', href: 'wishlist.html', icon: '❤️' },
        { label: '⚙️ Configuración', href: 'account-profile.html#security', icon: '⚙️' }
      ];

      const menu = document.createElement('div');
      menu.style.cssText = `
        padding: 8px 0;
      `;

      options.forEach((opt, index) => {
        const item = document.createElement('a');
        item.href = opt.href;
        item.style.cssText = `
          display: block;
          padding: 12px 20px;
          color: var(--white);
          text-decoration: none;
          font-family: var(--font-sub);
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: all 0.3s;
          border-left: 2px solid transparent;
          ${index > 0 ? 'border-top: 1px solid rgba(224,162,201,0.1);' : ''}
        `;

        item.addEventListener('mouseenter', () => {
          item.style.background = 'rgba(224,162,201,0.1)';
          item.style.borderLeftColor = 'var(--pink)';
          item.style.color = 'var(--pink)';
        });

        item.addEventListener('mouseleave', () => {
          item.style.background = 'transparent';
          item.style.borderLeftColor = 'transparent';
          item.style.color = 'var(--white)';
        });

        menu.appendChild(item);
      });

      dropdown.appendChild(menu);

      // Logout
      const logout = document.createElement('button');
      logout.textContent = '🚪 Cerrar Sesión';
      logout.style.cssText = `
        width: 100%;
        padding: 12px 20px;
        background: rgba(255,107,157,0.1);
        color: #ff6b9d;
        border: 1px solid rgba(255,107,157,0.3);
        border-top: 1px solid rgba(224,162,201,0.1);
        font-family: var(--font-sub);
        font-size: 11px;
        letter-spacing: 1px;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.3s;
      `;

      logout.addEventListener('click', () => this.logout());
      logout.addEventListener('mouseenter', () => {
        logout.style.background = 'rgba(255,107,157,0.2)';
      });
      logout.addEventListener('mouseleave', () => {
        logout.style.background = 'rgba(255,107,157,0.1)';
      });

      dropdown.appendChild(logout);
    } else {
      // No autenticado
      const loginBtn = document.createElement('a');
      loginBtn.href = 'login.html';
      loginBtn.textContent = '🔐 Iniciar Sesión';
      loginBtn.style.cssText = `
        display: block;
        padding: 12px 20px;
        color: var(--pink);
        text-decoration: none;
        font-family: var(--font-sub);
        font-size: 11px;
        letter-spacing: 1px;
        text-transform: uppercase;
        transition: all 0.3s;
      `;

      loginBtn.addEventListener('mouseenter', () => {
        loginBtn.style.background = 'rgba(224,162,201,0.1)';
      });

      loginBtn.addEventListener('mouseleave', () => {
        loginBtn.style.background = 'transparent';
      });

      const registerBtn = document.createElement('a');
      registerBtn.href = 'login.html#register';
      registerBtn.textContent = '✍️ Crear Cuenta';
      registerBtn.style.cssText = `
        display: block;
        padding: 12px 20px;
        color: var(--white);
        text-decoration: none;
        font-family: var(--font-sub);
        font-size: 11px;
        letter-spacing: 1px;
        text-transform: uppercase;
        border-top: 1px solid rgba(224,162,201,0.1);
        transition: all 0.3s;
      `;

      registerBtn.addEventListener('mouseenter', () => {
        registerBtn.style.background = 'rgba(224,162,201,0.1)';
      });

      registerBtn.addEventListener('mouseleave', () => {
        registerBtn.style.background = 'transparent';
      });

      dropdown.appendChild(loginBtn);
      dropdown.appendChild(registerBtn);
    }
  }

  /**
   * Actualizar UI según estado de autenticación
   */
  updateAuthUI() {
    const accountBtn = Array.from(document.querySelectorAll('button')).find(b =>
      b.textContent.includes('Mi cuenta')
    );

    if (accountBtn) {
      if (this.isLoggedIn && this.currentUser) {
        accountBtn.style.background = 'var(--pink)';
        accountBtn.style.color = 'var(--black)';
        accountBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          ${this.currentUser.displayName.split(' ')[0]}
        `;
      } else {
        accountBtn.style.background = 'var(--pink)';
        accountBtn.style.color = 'var(--black)';
        accountBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Mi cuenta
        `;
      }
    }
  }

  /**
   * Bind eventos de autenticación
   */
  bindAuthEvents() {
    // Escuchar cambios de auth (para multi-tab)
    window.addEventListener('storage', (e) => {
      if (e.key === 'vibewear-current-user-id') {
        this.currentUser = this.loadCurrentUser();
        this.isLoggedIn = !!this.currentUser;
        this.updateAuthUI();
      }
    });
  }

  /**
   * Verificar si está autenticado
   */
  checkAuth(redirectTo = 'login.html') {
    if (!this.isLoggedIn) {
      window.location.href = redirectTo;
      return false;
    }
    return true;
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Obtener ID del usuario
   */
  getUserId() {
    return this.currentUser?.uid || null;
  }

  /**
   * Verificar si hay sesión activa
   */
  hasSession() {
    return this.isLoggedIn && !!this.currentUser;
  }
}

// Instancia global
const authSystem = new AuthSystem();

// Inicializar cuando el DOM está listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    authSystem.init();
  });
} else {
  authSystem.init();
}
