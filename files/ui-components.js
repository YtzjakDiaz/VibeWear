// ============= UI COMPONENTS - FUNCIONES GLOBALES =============

// ===== TOAST NOTIFICATIONS =====
window.showToast = function(message, type = 'info', duration = 4000) {
  const container = document.querySelector('.toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ⓘ'
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || '•'}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close">×</button>
  `;
  
  // Agregar al TOP del contenedor (para stack hacia arriba)
  container.insertBefore(toast, container.firstChild);
  
  // Trigger animación de entrada
  toast.offsetHeight; // Force reflow
  toast.classList.add('visible');
  
  console.log('📬 Toast mostrado:', message);
  
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.onclick = () => {
    console.log('❌ Toast cerrado manualmente');
    removeToast(toast);
  };
  
  if (duration > 0) {
    setTimeout(() => {
      console.log('⏱️ Toast cierre después de', duration, 'ms');
      removeToast(toast);
    }, duration);
  }
  
  return toast;
};

function createToastContainer() {
  let container = document.querySelector('.toast-container');
  
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    console.log('✓ Contenedor de toasts creado');
  }
  
  return container;
}

function removeToast(toast) {
  if (!toast) return;
  console.log('🗑️ Removiendo toast...');
  toast.classList.add('removing');
  setTimeout(() => {
    if (toast && toast.parentNode) {
      toast.remove();
      console.log('✓ Toast removido del DOM');
    }
  }, 600);
}

// ===== MODALS =====
window.showModal = function(title, content, buttons = []) {
  // Crear overlay
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  // Crear contenido del modal
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  // Header
  const header = document.createElement('div');
  header.className = 'modal-header';
  header.innerHTML = `
    <h2>${title}</h2>
    <button class="modal-close">×</button>
  `;
  
  // Body
  const body = document.createElement('div');
  body.className = 'modal-body';
  body.innerHTML = content;
  
  // Footer con botones
  const footer = document.createElement('div');
  footer.className = 'modal-footer';
  buttons.forEach(btn => {
    const button = document.createElement('button');
    button.textContent = btn.text;
    button.className = btn.class || 'btn-primary';
    button.onclick = () => {
      if (btn.onClick) btn.onClick();
      closeModal(overlay);
    };
    footer.appendChild(button);
  });
  
  // Armar modal
  modalContent.appendChild(header);
  modalContent.appendChild(body);
  if (buttons.length > 0) modalContent.appendChild(footer);
  overlay.appendChild(modalContent);
  
  // Cerrar al hacer click en X o fuera del modal
  header.querySelector('.modal-close').onclick = () => closeModal(overlay);
  overlay.onclick = (e) => {
    if (e.target === overlay) closeModal(overlay);
  };
  
  document.body.appendChild(overlay);
  return overlay;
};

function closeModal(overlay) {
  overlay.classList.add('closing');
  setTimeout(() => overlay.remove(), 300);
}

window.closeModal = closeModal;

// ===== LOADERS =====
window.showLoader = function(message = 'Cargando...') {
  const loader = document.createElement('div');
  loader.className = 'modal-overlay';
  loader.id = 'global-loader';
  
  const content = document.createElement('div');
  content.style.textAlign = 'center';
  content.innerHTML = `
    <div class="spinner" style="margin: 0 auto 20px;"></div>
    <p style="color: var(--gray); font-size: 14px;">${message}</p>
  `;
  
  loader.appendChild(content);
  loader.onclick = (e) => e.preventDefault();
  
  document.body.appendChild(loader);
  return loader;
};

window.hideLoader = function() {
  const loader = document.getElementById('global-loader');
  if (loader) {
    loader.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => loader.remove(), 300);
  }
};

// ===== SKELETON LOADING =====
window.createSkeletonProduct = function() {
  return `
    <div style="background: var(--black-soft); border-radius: 12px; overflow: hidden; padding: 15px;">
      <div class="skeleton" style="width: 100%; height: 200px; margin-bottom: 15px;"></div>
      <div class="skeleton skeleton-title" style="width: 80%;"></div>
      <div class="skeleton skeleton-line" style="width: 100%;"></div>
      <div class="skeleton skeleton-line" style="width: 70%;"></div>
      <div style="display: flex; gap: 10px; margin-top: 15px;">
        <div class="skeleton" style="flex: 1; height: 40px;"></div>
        <div class="skeleton" style="width: 40px; height: 40px;"></div>
      </div>
    </div>
  `;
};

window.showSkeletonGrid = function(containerId, count = 6) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">';
  for (let i = 0; i < count; i++) {
    html += window.createSkeletonProduct();
  }
  html += '</div>';
  
  container.innerHTML = html;
};

// ===== ANIMACIONES DE CARRITO =====
window.animateAddToCart = function(productElement) {
  // Crear elemento volador
  const clone = productElement.cloneNode(true);
  clone.style.position = 'fixed';
  clone.style.pointerEvents = 'none';
  clone.style.zIndex = '10000';
  
  const rect = productElement.getBoundingClientRect();
  clone.style.top = rect.top + 'px';
  clone.style.left = rect.left + 'px';
  clone.style.width = rect.width + 'px';
  clone.style.height = rect.height + 'px';
  
  document.body.appendChild(clone);
  
  // Animar hacia el carrito
  const cartBtn = document.querySelector('[data-cart]');
  if (cartBtn) {
    const cartRect = cartBtn.getBoundingClientRect();
    clone.style.animation = 'none';
    
    setTimeout(() => {
      clone.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      clone.style.top = cartRect.top + 'px';
      clone.style.left = cartRect.left + 'px';
      clone.style.width = '50px';
      clone.style.height = '50px';
      clone.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
      clone.remove();
      bumpCart();
    }, 800);
  }
};

window.bumpCart = function() {
  const cartBtn = document.querySelector('[data-cart]');
  if (cartBtn) {
    cartBtn.classList.add('cart-bump');
    setTimeout(() => cartBtn.classList.remove('cart-bump'), 400);
  }
};

// ===== ACORDEONES =====
window.initAccordions = function() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.onclick = function() {
      const body = this.nextElementSibling;
      const isOpen = body.classList.contains('open');
      
      // Cerrar otros acordeones en el mismo contenedor
      this.parentElement.querySelectorAll('.accordion-body.open').forEach(el => {
        if (el !== body) {
          el.classList.remove('open');
          el.previousElementSibling.classList.remove('active');
        }
      });
      
      // Toggle actual
      if (isOpen) {
        body.classList.remove('open');
        this.classList.remove('active');
      } else {
        body.classList.add('open');
        this.classList.add('active');
      }
    };
  });
};

// ===== EFECTOS DE HOVER =====
window.enableHoverEffects = function() {
  // Scale en productos
  document.querySelectorAll('[data-hover="scale"]').forEach(el => {
    el.classList.add('hover-scale');
  });
  
  // Lift en cards
  document.querySelectorAll('[data-hover="lift"]').forEach(el => {
    el.classList.add('hover-lift');
  });
  
  // Glow en botones especiales
  document.querySelectorAll('[data-hover="glow"]').forEach(el => {
    el.classList.add('hover-glow');
  });
};

// ===== SCROLL ANIMATIONS =====
window.enableScrollAnimations = function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
};

// ===== PAGE TRANSITION =====
window.pageTransition = function(element) {
  element.classList.add('page-transition');
};

// ===== HEART PULSE (WISHLIST) =====
window.animateHeart = function(element) {
  element.classList.add('heart-pulse');
  setTimeout(() => element.classList.remove('heart-pulse'), 600);
};

// ===== INICIALIZAR TODO =====
window.initUIComponents = function() {
  if (!document.querySelector('.toast-container')) {
    createToastContainer();
  }
  window.enableHoverEffects();
  window.initAccordions();
  window.enableScrollAnimations();
};

// Ejecutar al cargar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initUIComponents);
} else {
  window.initUIComponents();
}

console.log('✓ UI Components Module Loaded');
