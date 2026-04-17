/**
 * UTILIDADES ADICIONALES DE OPTIMIZACIÓN
 * Para uso en desarrollo y producción
 */

/**
 * MINIFICADOR SIMPLE DE CSS
 * Elimina espacios, comentarios, etc.
 */
function minifyCSS(css) {
  return css
    // Eliminar comentarios
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Eliminar espacios al inicio/final
    .replace(/\s+/g, ' ')
    // Eliminar espacios alrededor de caracteres especiales
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    // Cambiar colores a formato corto cuando sea posible
    .replace(/#([a-f0-9])\1([a-f0-9])\2([a-f0-9])\3\b/g, '#$1$2$3')
    .trim();
}

/**
 * MINIFICADOR SIMPLE DE JAVASCRIPT
 * (No minifica variables - ver usar herramienta profesional)
 */
function minifyJS(js) {
  return js
    // Eliminar comentarios de línea
    .replace(/\/\/.*$/gm, '')
    // Eliminar comentarios de bloque
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Eliminar espacios múltiples
    .replace(/\s+/g, ' ')
    // Eliminar espacios alrededor de operadores
    .replace(/\s*([=+\-*/%!<>{}();:,.])\s*/g, '$1')
    .trim();
}

/**
 * EXPORTAR PARA USAR EN HERRAMIENTAS DE BUILD
 */
function downloadMinified(css, filename = 'styles.min.css') {
  const minified = minifyCSS(css);
  const blob = new Blob([minified], { type: 'text/css' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log(`✓ ${filename} descargado`);
  console.log(`Reducción: ${((1 - minified.length / css.length) * 100).toFixed(1)}%`);
}

/**
 * ANALIZADOR DE RENDIMIENTO EN TIEMPO REAL
 */
class PerformanceAnalyzer {
  constructor() {
    this.metrics = {};
  }

  start(label) {
    this.metrics[label] = {
      start: performance.now(),
      memory: performance.memory?.usedJSHeapSize || 0
    };
  }

  end(label) {
    if (!this.metrics[label]) {
      console.warn(`Métrica ${label} no iniciada`);
      return;
    }

    const metric = this.metrics[label];
    const duration = performance.now() - metric.start;
    const memoryUsed = (performance.memory?.usedJSHeapSize || 0) - metric.memory;

    console.log(`
      📊 ${label}
      ⏱️  Tiempo: ${duration.toFixed(2)}ms
      💾 Memoria: ${(memoryUsed / 1024 / 1024).toFixed(2)}MB
    `);

    return { duration, memoryUsed };
  }

  report() {
    console.log('=== REPORTE DE PERFORMANCE ===');
    for (const [label, data] of Object.entries(this.metrics)) {
      if (data.start) {
        this.end(label);
      }
    }
  }
}

/**
 * MONITOR DE RECURSOS
 * Detecta qué se carga lentamente
 */
class ResourceMonitor {
  constructor(threshold = 1000) { // ms
    this.threshold = threshold;
    this.slowResources = [];
    this.observe();
  }

  observe() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > this.threshold) {
          this.slowResources.push({
            name: entry.name,
            duration: entry.duration,
            size: entry.transferSize,
            type: entry.initiatorType
          });

          console.warn(`🐌 RECURSO LENTO: ${entry.name} (${entry.duration.toFixed(0)}ms)`);
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  getReport() {
    return this.slowResources.sort((a, b) => b.duration - a.duration);
  }
}

/**
 * DETECTAR MEMORY LEAKS
 */
function detectMemoryLeaks() {
  const initialMemory = performance.memory?.usedJSHeapSize;
  
  const check = () => {
    const currentMemory = performance.memory?.usedJSHeapSize;
    const increase = currentMemory - initialMemory;
    
    if (increase > 50 * 1024 * 1024) { // 50MB
      console.warn(`⚠️ Posible memory leak: +${(increase / 1024 / 1024).toFixed(1)}MB`);
      return true;
    }
    return false;
  };

  // Check cada 5 segundos
  setInterval(check, 5000);
}

/**
 * VERIFICAR TAMAÑO DE BUNDLE
 */
function checkBundleSize() {
  const scripts = Array.from(document.querySelectorAll('script'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

  let totalSize = 0;

  console.log('📦 TAMAÑO DE RECURSOS:');
  console.log('JavaScript:');
  scripts.forEach(s => {
    const size = s.textContent.length;
    totalSize += size;
    if (size > 50000) {
      console.warn(`  ⚠️  ${s.src || 'inline'}: ${(size / 1024).toFixed(1)}KB`);
    }
  });

  console.log('CSS:');
  styles.forEach(s => {
    if (s.href) {
      console.log(`  ${s.href}: [Revisar en Network]`);
    }
  });

  console.log(`Total: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
}

/**
 * COMPARADOR DE RENDIMIENTO ANTES/DESPUÉS
 */
class PerformanceComparator {
  constructor() {
    this.baseline = null;
  }

  setBaseline() {
    this.baseline = {
      loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
      memory: performance.memory?.usedJSHeapSize,
      timestamp: new Date()
    };
    console.log('✓ Baseline establecido', this.baseline);
  }

  compare() {
    if (!this.baseline) {
      console.warn('No hay baseline - usa setBaseline() primero');
      return;
    }

    const current = {
      loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
      memory: performance.memory?.usedJSHeapSize,
      timestamp: new Date()
    };

    const improvement = {
      loadTime: ((1 - current.loadTime / this.baseline.loadTime) * 100).toFixed(1),
      memory: ((1 - current.memory / this.baseline.memory) * 100).toFixed(1)
    };

    console.log(`
      📊 COMPARACIÓN DE RENDIMIENTO
      ⏱️  Tiempo de carga: ${improvement.loadTime > 0 ? '✓' : '✗'} ${improvement.loadTime}%
      💾 Memoria: ${improvement.memory > 0 ? '✓' : '✗'} ${improvement.memory}%
    `);

    return improvement;
  }
}

/**
 * INICIALIZACIÓN
 */
const analyzer = new PerformanceAnalyzer();
const monitor = new ResourceMonitor(1000);
const comparator = new PerformanceComparator();

// Exportar globalmente
window.vibewearOptimizationTools = {
  minifyCSS,
  minifyJS,
  downloadMinified,
  PerformanceAnalyzer,
  ResourceMonitor,
  PerformanceComparator,
  detectMemoryLeaks,
  checkBundleSize,
  analyzer,
  monitor,
  comparator
};

// Inicializar en desarrollo
if (window.location.hostname === 'localhost') {
  console.log('🔧 Herramientas de optimización disponibles');
  console.log('Uso: window.vibewearOptimizationTools');
  
  // Auto-check bundle size
  window.addEventListener('load', () => {
    setTimeout(checkBundleSize, 500);
  });
}

console.log('✓ Utilidades de optimización cargadas');
