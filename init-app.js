/**
 * INIT-APP.JS
 * Inicialización global de todos los módulos VibeWear
 * Ejecutar este script al final del body en cada HTML
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== 1. BREADCRUMB NAVIGATION =====
  try {
    if (typeof BreadcrumbNav !== 'undefined') {
      const breadcrumbNav = new BreadcrumbNav();
      breadcrumbNav.auto(); // Auto-detect and render breadcrumbs
      console.log('✅ Breadcrumb navigation initialized');
    }
  } catch (e) {
    console.warn('⚠️ Breadcrumb navigation error:', e.message);
  }

  // ===== 2. ADVANCED SEARCH =====
  try {
    if (typeof AdvancedSearch !== 'undefined') {
      // Already initialized globally in search-advanced.js
      console.log('✅ Advanced search initialized');
      
      // Setup search input if exists
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        // Enhance existing search functionality
        const originalHandler = searchInput.onkeyup;
        searchInput.onkeyup = function(e) {
          if (originalHandler) originalHandler.call(this, e);
          
          // Use advanced search for suggestions
          if (advancedSearch && this.value.trim()) {
            const suggestions = advancedSearch.getSuggestions(this.value, productsData);
            if (suggestions.length > 0) {
              console.log('🔍 Suggestions:', suggestions);
            }
          }
        };
      }
    }
  } catch (e) {
    console.warn('⚠️ Advanced search error:', e.message);
  }

  // ===== 4. AUTHENTICATION SYSTEM =====
  try {
    if (typeof AuthSystem !== 'undefined') {
      // Already initialized globally in auth-system.js
      console.log('✅ Authentication system initialized');
    }
  } catch (e) {
    console.warn('⚠️ Authentication system error:', e.message);
  }

  // ===== 5. STOCK MANAGEMENT =====
  try {
    if (typeof getProductStock !== 'undefined') {
      console.log('✅ Stock management initialized');
      
      // Update stock badges on product cards
      const productCards = document.querySelectorAll('[data-product-id]');
      productCards.forEach(card => {
        const productId = card.getAttribute('data-product-id');
        const stockBadge = card.querySelector('[data-stock-badge]');
        if (stockBadge && productsData) {
          const status = getStockStatus(productId, productsData);
          stockBadge.innerHTML = getStockBadge(productId, productsData);
        }
      });
    }
  } catch (e) {
    console.warn('⚠️ Stock management error:', e.message);
  }

  // ===== GLOBAL APP STATE =====
  window.appState = {
    isInitialized: true,
    features: {
      breadcrumbs: typeof BreadcrumbNav !== 'undefined',
      search: typeof AdvancedSearch !== 'undefined',
      gallery: typeof ImageGallery !== 'undefined',
      auth: typeof AuthSystem !== 'undefined',
      stock: typeof getProductStock !== 'undefined'
    }
  };

  console.log('🚀 VibeWear App initialized', window.appState);
  
});

/**
 * ERROR HANDLER
 * Catch and log any runtime errors
 */
window.addEventListener('error', function(event) {
  console.error('❌ Runtime error:', event.error);
});

/**
 * FEATURE DETECTION
 * Verify all modules loaded correctly
 */
function verifyFeatures() {
  const features = window.appState?.features || {};
  const status = Object.entries(features)
    .map(([name, loaded]) => `${loaded ? '✅' : '❌'} ${name}`)
    .join('\n');
  console.log('📊 Feature Status:\n' + status);
  return features;
}

// Make verifyFeatures globally available
window.verifyFeatures = verifyFeatures;

console.log('💡 Tip: Run verifyFeatures() in console to check all features');
