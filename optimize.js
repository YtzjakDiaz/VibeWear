// ===== OPTIMIZACIÓN DE RENDIMIENTO PARA VIBEWEAR =====

/**
 * LAZY LOADING - Carga imágenes solo cuando son visibles
 * Reduce el tiempo inicial de carga significativamente
 */
document.addEventListener('DOMContentLoaded', function() {
  // Intersección Observer para lazy loading
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Cargar imagen de verdad
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          // Cargar background image
          if (img.dataset.bgSrc) {
            img.style.backgroundImage = `url('${img.dataset.bgSrc}')`;
            img.removeAttribute('data-bgSrc');
          }
          
          img.classList.add('lazyloaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px' // Cargar 50px antes de que sean visibles
    });

    // Observar todas las imágenes con lazy loading
    document.querySelectorAll('img[data-src], img.lazy').forEach(img => {
      imageObserver.observe(img);
    });
  }
});

/**
 * SRCSET RESPONSIVO
 * Servir diferentes tamaños según el dispositivo
 */
function setSrcSet(img, basePath) {
  if (!img.srcset && basePath) {
    img.srcset = `
      ${basePath}?w=400&q=80 400w,
      ${basePath}?w=600&q=80 600w,
      ${basePath}?w=1000&q=80 1000w
    `;
    img.sizes = `
      (max-width: 600px) 90vw,
      (max-width: 1000px) 50vw,
      33vw
    `;
  }
}

/**
 * COMPRESIÓN DE IMÁGENES EN PRODUCTO
 * Detecta formato moderno soportado
 */
function getOptimalImageFormat(url) {
  const canvas = document.createElement('canvas');
  
  // WebP support check
  if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
    return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }
  
  return url;
}

/**
 * PRECARGA DE RECURSOS CRÍTICOS
 * Mejora el performance de navegación
 */
function preloadCriticalResources() {
  // Precargar fonts
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'font';
  link.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Anton&family=Oswald:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
  
  // Precargar imágenes críticas (hero, logo)
  const criticalImages = [
    'images/logo.png',
    'images/VIBEWEAR-1.png'
  ];
  
  criticalImages.forEach(img => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = img;
    document.head.appendChild(link);
  });
}

/**
 * CACHE DE APLICACIÓN
 * Guardar recursos en localStorage para reutilización rápida
 */
class ResourceCache {
  constructor() {
    this.cacheKey = 'vibewear-cache';
    this.maxSize = 5 * 1024 * 1024; // 5MB
  }

  set(key, value, type = 'data') {
    try {
      const cache = JSON.parse(localStorage.getItem(this.cacheKey) || '{}');
      cache[key] = {
        value: value,
        type: type,
        timestamp: Date.now()
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cache));
    } catch (e) {
      console.warn('Cache storage full or error:', e);
    }
  }

  get(key, maxAge = 86400000) { // 24 horas por defecto
    try {
      const cache = JSON.parse(localStorage.getItem(this.cacheKey) || '{}');
      if (cache[key]) {
        const item = cache[key];
        const age = Date.now() - item.timestamp;
        
        if (age < maxAge) {
          return item.value;
        } else {
          delete cache[key];
          localStorage.setItem(this.cacheKey, JSON.stringify(cache));
        }
      }
    } catch (e) {
      console.warn('Cache retrieval error:', e);
    }
    return null;
  }

  clear() {
    try {
      localStorage.removeItem(this.cacheKey);
    } catch (e) {
      console.warn('Cache clear error:', e);
    }
  }
}

const resourceCache = new ResourceCache();

/**
 * OPTIMIZACIÓN DE CSS
 * Inyectar CSS crítico para first paint más rápido
 */
function optimizeCSSLoading() {
  // Critical CSS inline para hero/header
  const criticalCSS = `
    :root {
      --pink: #e0a2c9;
      --black: #1a1a1a;
      --white: #f5f5f5;
    }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; }
    .navbar { position: fixed; top: 0; z-index: 100; }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.insertBefore(style, document.head.firstChild);
  
  // Cargar CSS no crítico de forma asincrónica
  const nonCritical = document.querySelector('link[rel="stylesheet"][href="styles.css"]');
  if (nonCritical) {
    nonCritical.media = 'print';
    nonCritical.onload = function() {
      this.media = 'all';
    };
  }
}

/**
 * COMPRESIÓN DE PRODUCTOS
 * Reducir datos de productos enviados
 */
function compressProductData(products) {
  return products.map(p => ({
    id: p.id,
    n: p.nombre,
    p: p.precio,
    i: p.imagen,
    r: p.stars,
    c: p.categoria
  }));
}

/**
 * DECOMPRESIÓN DE PRODUCTOS
 */
function decompressProductData(compressed) {
  return compressed.map(p => ({
    id: p.id,
    nombre: p.n,
    precio: p.p,
    imagen: p.i,
    stars: p.r,
    categoria: p.c
  }));
}

/**
 * MONITOREO DE PERFORMANCE
 */
function monitorPerformance() {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;

    const metrics = {
      pageLoadTime: pageLoadTime,
      connectTime: connectTime,
      renderTime: renderTime,
      timestamp: new Date().toISOString()
    };

    // Guardar métricas (solo en desarrollo)
    if (window.location.hostname === 'localhost') {
      console.log('⚡ Performance Metrics:', {
        'Tiempo de Carga Total': pageLoadTime + 'ms',
        'Tiempo de Conexión': connectTime + 'ms',
        'Tiempo de Renderizado': renderTime + 'ms'
      });
    }

    return metrics;
  });
}

/**
 * DEBOUNCING PARA EVENTOS
 * Reduce llamadas innecesarias en scroll/resize
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * THROTTLING PARA EVENTOS
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * INICIALIZAR OPTIMIZACIONES
 */
document.addEventListener('DOMContentLoaded', () => {
  preloadCriticalResources();
  optimizeCSSLoading();
  monitorPerformance();
  
  // Optimizar eventos scroll/resize
  window.addEventListener('scroll', throttle(() => {
    // Acciones en scroll (lazy load, animations, etc)
  }, 100));

  window.addEventListener('resize', debounce(() => {
    // Acciones en resize
  }, 250));
});

// Exportar para uso global
window.vibewearOptimization = {
  ResourceCache,
  resourceCache,
  setSrcSet,
  getOptimalImageFormat,
  compressProductData,
  decompressProductData,
  preloadCriticalResources,
  debounce,
  throttle
};

console.log('✓ Optimizaciones de VibeWear cargadas');
