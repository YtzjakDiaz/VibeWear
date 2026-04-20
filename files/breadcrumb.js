// ============= SISTEMA DE BREADCRUMBS =============
// Navegación clara con breadcrumbs dinámicos y reutilizables

class BreadcrumbNav {
  constructor() {
    this.breadcrumbs = [];
    this.separatorChar = '›';
  }

  /**
   * Crear breadcrumbs dinámicamente
   * @param {Array} items - Array de objetos {label, href, current}
   * @param {string} containerId - ID del contenedor
   * @param {string} className - Clase CSS opcional
   */
  render(items, containerId, className = 'breadcrumb-container') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`⚠ Breadcrumb: no encontrado contenedor #${containerId}`);
      return;
    }

    container.innerHTML = '';
    container.className = className;
    container.style.cssText = `
      padding: 15px 60px;
      background: var(--black-soft);
      border-bottom: 1px solid rgba(224, 162, 201, 0.1);
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      font-family: var(--font-sub);
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
    `;

    this.breadcrumbs = items;

    items.forEach((item, index) => {
      // Link
      if (item.href && !item.current) {
        const link = document.createElement('a');
        link.href = item.href;
        link.textContent = item.label;
        link.style.cssText = `
          color: var(--gray);
          text-decoration: none;
          transition: color 0.3s;
          cursor: pointer;
        `;

        link.addEventListener('mouseenter', () => {
          link.style.color = 'var(--pink)';
        });

        link.addEventListener('mouseleave', () => {
          link.style.color = 'var(--gray)';
        });

        container.appendChild(link);
      } else {
        // Span (página actual)
        const span = document.createElement('span');
        span.textContent = item.label;
        span.style.cssText = `
          color: ${item.current ? 'var(--white)' : 'var(--gray)'};
          font-weight: ${item.current ? '600' : '400'};
        `;

        container.appendChild(span);
      }

      // Separador (menos en el último)
      if (index < items.length - 1) {
        const separator = document.createElement('span');
        separator.textContent = this.separatorChar;
        separator.style.cssText = `
          color: var(--pink);
          margin: 0 8px;
        `;

        container.appendChild(separator);
      }
    });
  }

  /**
   * Breadcrumbs para producto
   */
  renderProductBreadcrumb(productName, productId, containerId = 'breadcrumb') {
    const items = [
      { label: 'Inicio', href: 'index.html' },
      { label: 'Catálogo', href: 'catalogo.html' },
      { label: productName, current: true }
    ];

    this.render(items, containerId);
  }

  /**
   * Breadcrumbs para catálogo
   */
  renderCatalogueBreadcrumb(category = null, containerId = 'breadcrumb') {
    const items = [
      { label: 'Inicio', href: 'index.html' },
      category
        ? { label: category, current: true }
        : { label: 'Catálogo', current: true }
    ];

    this.render(items, containerId);
  }

  /**
   * Breadcrumbs para checkout
   */
  renderCheckoutBreadcrumb(step = 1, containerId = 'breadcrumb') {
    const steps = [
      { label: 'Carrito', href: 'checkout.html', current: step === 1 },
      { label: 'Envío', href: 'checkout.html', current: step === 2 },
      { label: 'Pago', href: 'checkout.html', current: step === 3 }
    ];

    const items = [
      { label: 'Inicio', href: 'index.html' },
      ...steps
    ];

    this.render(items, containerId);
  }

  /**
   * Breadcrumbs para página de blog
   */
  renderBlogBreadcrumb(postTitle, category = null, containerId = 'breadcrumb') {
    const items = [
      { label: 'Inicio', href: 'index.html' },
      { label: 'Blog', href: 'blog.html' }
    ];

    if (category) {
      items.push({ label: category, href: `blog.html?cat=${category}` });
    }

    items.push({ label: postTitle, current: true });

    this.render(items, containerId);
  }

  /**
   * Breadcrumbs para perfil de usuario
   */
  renderProfileBreadcrumb(section = 'perfil', containerId = 'breadcrumb') {
    const items = [
      { label: 'Inicio', href: 'index.html' },
      { label: 'Mi Cuenta', href: 'account-profile.html', current: section === 'perfil' }
    ];

    if (section !== 'perfil') {
      items[1].current = false;
      items.push({
        label: this.formatSectionName(section),
        current: true
      });
    }

    this.render(items, containerId);
  }

  /**
   * Breadcrumbs personalizados
   */
  renderCustom(breadcrumbArray, containerId) {
    this.render(breadcrumbArray, containerId);
  }

  /**
   * Obtener ruta actual
   */
  getCurrentPath() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    return filename;
  }

  /**
   * Auto-generar breadcrumbs basado en ruta
   */
  auto(containerId = 'breadcrumb') {
    const path = this.getCurrentPath();

    const breadcrumbMap = {
      'index.html': () => this.render([{ label: 'Inicio', current: true }], containerId),
      'catalogo.html': () => this.renderCatalogueBreadcrumb(null, containerId),
      'producto.html': () => {
        const productName = document.getElementById('productTitle')?.textContent || 'Producto';
        this.renderProductBreadcrumb(productName, null, containerId);
      },
      'blog.html': () => this.renderBlogBreadcrumb('Blog', null, containerId),
      'contacto.html': () => this.render([
        { label: 'Inicio', href: 'index.html' },
        { label: 'Contacto', current: true }
      ], containerId),
      'checkout.html': () => this.renderCheckoutBreadcrumb(1, containerId),
      'account-profile.html': () => this.renderProfileBreadcrumb('perfil', containerId),
      'wishlist.html': () => this.render([
        { label: 'Inicio', href: 'index.html' },
        { label: 'Mis Favoritos', current: true }
      ], containerId),
      'login.html': () => this.render([
        { label: 'Inicio', href: 'index.html' },
        { label: 'Cuenta', current: true }
      ], containerId)
    };

    const renderer = breadcrumbMap[path];
    if (renderer) {
      renderer();
    }
  }

  /**
   * Formatear nombre de sección
   */
  formatSectionName(section) {
    const sectionMap = {
      'perfil': 'Mi Perfil',
      'pedidos': 'Mis Pedidos',
      'direcciones': 'Direcciones',
      'favoritos': 'Favoritos',
      'configuracion': 'Configuración',
      'notificaciones': 'Notificaciones'
    };

    return sectionMap[section] || section;
  }

  /**
   * Navegación con historial (browser back/forward)
   */
  enableHistory() {
    window.addEventListener('popstate', () => {
      this.auto();
    });
  }
}

// Instancia global
const breadcrumbNav = new BreadcrumbNav();

// Auto-inicializar si existe contenedor
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('breadcrumb')) {
    breadcrumbNav.auto();
    breadcrumbNav.enableHistory();
  }
});
