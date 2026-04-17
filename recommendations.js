// ============= SISTEMA DE RECOMENDACIONES PERSONALIZADAS VIBEWEAR =============

/**
 * Renderiza las recomendaciones personalizadas en la página de producto
 * @param {string} currentProductId - ID del producto actual
 * @param {string} containerId - ID del contenedor donde mostrar recomendaciones
 */
function renderPersonalizedRecommendations(currentProductId, containerId = 'relatedProducts') {
  const container = document.getElementById(containerId);
  if (!container || !productsData) return;

  // Obtener recomendaciones
  const recommendations = getPersonalizedRecommendations(currentProductId, 4);

  if (recommendations.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--gray);">
        <p>No hay recomendaciones disponibles en este momento.</p>
      </div>
    `;
    return;
  }

  // Renderizar tarjetas de productos
  container.innerHTML = recommendations.map((product, index) => {
    const priceDisplay = product.originalPrice 
      ? `<div><span class="product-price-old">$${product.originalPrice.toLocaleString('es-CO')}</span><span class="product-price">$${product.price.toLocaleString('es-CO')}</span></div>`
      : `<span class="product-price">$${product.price.toLocaleString('es-CO')}</span>`;

    const badge = product.badge 
      ? `<span class="product-badge ${product.badge.includes('−') ? 'badge-sale' : product.badge.includes('New') ? 'badge-new' : 'badge-hot'}">${product.badge}</span>`
      : '';

    // Determinar qué información mostrar y crear etiqueta
    let categoryIcon = '';
    let categoryText = '';
    let categoryBadge = '';
    
    if (product.type === 'cantante') {
      categoryIcon = '🎤';
      categoryText = product.artist || 'Artista';
      categoryBadge = 'CANTANTE';
    } else if (product.type === 'anime') {
      categoryIcon = '🎌';
      categoryText = product.franchise || 'Anime';
      categoryBadge = 'ANIME';
    } else if (product.type === 'personaje') {
      categoryIcon = '👤';
      categoryText = product.franchise || 'Personaje';
      categoryBadge = 'PERSONAJE';
    } else if (product.type === 'diseño') {
      categoryIcon = '🎨';
      categoryText = product.theme || 'Diseño';
      categoryBadge = 'DISEÑO';
    }

    const reason = getRecommendationReason(currentProductId, product.id);
    const reasonHtml = reason ? `<div style="font-size: 11px; color: var(--gray); margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(224,162,201,0.2);">✓ ${reason}</div>` : '';

    return `
      <div class="product-card" data-cat="${product.category}" style="animation: fadeInUp 0.6s ease ${index * 0.1}s both;">
        <div class="product-card-img">
          ${badge}
          <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'" />
          <div class="product-overlay"><a href="producto.html#${product.id}" class="btn-card">Ver Producto</a></div>
        </div>
        <div class="product-info">
          <p class="product-category" style="color: var(--pink); font-weight: 600; font-size: 12px; margin-bottom: 8px;">
            <span style="background: rgba(224,162,201,0.2); padding: 3px 8px; border-radius: 3px; display: inline-block;">
              ${categoryIcon} ${categoryBadge}
            </span>
          </p>
          <h3 class="product-name">${product.name}</h3>
          <p style="font-size: 11px; color: var(--gray); margin: 6px 0;">${categoryText}</p>
          <div class="product-footer">
            ${priceDisplay}
            <div class="product-wishlist" onclick="toggleWishlistCard('${product.id}', '${product.name}')" style="cursor: pointer;">♡</div>
          </div>
          ${reasonHtml}
        </div>
      </div>
    `;
  }).join('');

  // Agregar animación
  if (!document.querySelector('style[data-recommendations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-recommendations', 'true');
    style.textContent = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Muestra información sobre por qué se recomienda este producto
 * @param {string} currentProductId - ID del producto actual
 * @param {string} recommendedProductId - ID del producto recomendado
 */
function getRecommendationReason(currentProductId, recommendedProductId) {
  const current = productsData[currentProductId];
  const recommended = productsData[recommendedProductId];

  if (!current || !recommended) return '';

  const reasons = [];

  // Verificar similitudes
  if (current.artist && recommended.artist && current.artist === recommended.artist) {
    reasons.push(`El mismo artista: ${current.artist}`);
  }

  if (current.franchise && recommended.franchise && current.franchise === recommended.franchise) {
    reasons.push(`Misma franquicia: ${current.franchise}`);
  }

  if (current.genre === recommended.genre) {
    reasons.push(`Género similar: ${current.genre}`);
  }

  if (current.tags && recommended.tags) {
    const commonTags = current.tags.filter(tag => recommended.tags.includes(tag));
    if (commonTags.length > 0) {
      reasons.push(`Intereses compartidos: ${commonTags.join(', ')}`);
    }
  }

  if (current.relatedGenres && recommended.genre && current.relatedGenres.includes(recommended.genre)) {
    reasons.push(`Género relacionado: ${recommended.genre}`);
  }

  return reasons.join(' • ');
}

/**
 * Muestra un tooltip con la razón de la recomendación
 */
function showRecommendationTooltip(event, reason) {
  if (!reason) return;

  const tooltip = document.createElement('div');
  tooltip.style.cssText = `
    position: absolute;
    background: rgba(0, 0, 0, 0.9);
    color: var(--pink);
    padding: 10px 15px;
    border-radius: 6px;
    font-size: 12px;
    z-index: 10000;
    max-width: 200px;
    pointer-events: none;
    font-family: var(--font-body);
    white-space: normal;
    animation: tooltipFade 0.3s ease;
  `;
  tooltip.textContent = reason;

  document.body.appendChild(tooltip);

  const rect = event.target.getBoundingClientRect();
  tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
  tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';

  setTimeout(() => tooltip.remove(), 3000);
}

/**
 * Busca productos y muestra resultados con información de tipo
 * @param {string} searchTerm - Término a buscar
 * @param {string} containerId - ID del contenedor para resultados
 */
function searchAndDisplayProducts(searchTerm, containerId = 'searchResults') {
  if (!searchTerm.trim()) return;

  saveSearchToHistory(searchTerm);
  const results = searchProductsByTerm(searchTerm);
  const container = document.getElementById(containerId);

  if (!container) return;

  if (results.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--gray);">
        <p>No se encontraron productos para "<strong>${searchTerm}</strong>"</p>
        <p style="font-size: 12px; margin-top: 10px;">Intenta buscar por artista, anime o género</p>
      </div>
    `;
    return;
  }

  container.innerHTML = results.map(product => {
    const badge = product.badge 
      ? `<span class="product-badge">${product.badge}</span>`
      : '';

    let categoryBadge = '';
    if (product.type === 'cantante') {
      categoryBadge = `<span style="display: inline-block; background: rgba(255, 107, 157, 0.2); color: var(--pink); padding: 4px 8px; border-radius: 4px; font-size: 10px; margin-right: 5px;">🎤 CANTANTE</span>`;
    } else if (product.type === 'anime') {
      categoryBadge = `<span style="display: inline-block; background: rgba(255, 107, 157, 0.2); color: var(--pink); padding: 4px 8px; border-radius: 4px; font-size: 10px; margin-right: 5px;">🎌 ANIME</span>`;
    } else if (product.type === 'personaje') {
      categoryBadge = `<span style="display: inline-block; background: rgba(255, 107, 157, 0.2); color: var(--pink); padding: 4px 8px; border-radius: 4px; font-size: 10px; margin-right: 5px;">👤 PERSONAJE</span>`;
    }

    return `
      <div class="product-card" data-cat="${product.category}">
        <div class="product-card-img">
          ${badge}
          <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'" />
          <div class="product-overlay"><a href="producto.html#${product.id}" class="btn-card">Ver Producto</a></div>
        </div>
        <div class="product-info">
          <div style="margin-bottom: 8px;">
            ${categoryBadge}
            <span class="product-category">${product.category.toUpperCase()}</span>
          </div>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-footer">
            <span class="product-price">$${product.price.toLocaleString('es-CO')}</span>
            <div class="product-wishlist" onclick="toggleWishlistCard('${product.id}', '${product.name}')" style="cursor: pointer;">♡</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Integra filtros por género
 */
function setupGenreFilters(containerId = 'genreFilters') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const genres = getAllGenres();
  container.innerHTML = genres.map(genre => `
    <button 
      class="filter-btn" 
      onclick="filterByGenre('${genre}')"
      style="padding: 8px 16px; margin: 5px; background: rgba(224,162,201,0.1); border: 1px solid rgba(224,162,201,0.3); border-radius: 50px; color: var(--pink); cursor: pointer; font-family: var(--font-body); font-size: 12px; transition: all 0.3s;"
    >
      ${genre.toUpperCase()}
    </button>
  `).join('');
}

/**
 * Filtra productos por género
 */
function filterByGenre(genre) {
  const container = document.getElementById('productsGrid');
  if (!container) return;

  const products = getProductsByGenre(genre);
  
  container.innerHTML = products.map(product => {
    const badge = product.badge 
      ? `<span class="product-badge">${product.badge}</span>`
      : '';

    return `
      <div class="product-card" data-cat="${product.category}">
        <div class="product-card-img">
          ${badge}
          <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'" />
          <div class="product-overlay"><a href="producto.html#${product.id}" class="btn-card">Ver Producto</a></div>
        </div>
        <div class="product-info">
          <p class="product-category">${genre.toUpperCase()}</p>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-footer">
            <span class="product-price">$${product.price.toLocaleString('es-CO')}</span>
            <div class="product-wishlist" onclick="toggleWishlistCard('${product.id}', '${product.name}')" style="cursor: pointer;">♡</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Helper para toggle de favoritos desde tarjetas
 */
function toggleWishlistCard(prodId, prodName) {
  const added = addToWishlist(prodId, prodName);
  event.target.textContent = added ? '❤️' : '♡';
  event.target.style.color = added ? 'var(--pink)' : 'inherit';
}

// ============= MÓDULO DE ANÁLISIS DE BÚSQUEDAS =============

/**
 * Analiza el término de búsqueda para detectar tipo
 */
function analyzeSearchTerm(searchTerm) {
  const term = searchTerm.toLowerCase();

  // Detectar tipos
  const analysis = {
    term: searchTerm,
    isSinger: false,
    isAnime: false,
    isGenre: false,
    type: 'generic',
    suggestions: []
  };

  // Buscar artistas
  const artists = getAllArtists();
  if (artists.some(artist => artist.toLowerCase().includes(term) || term.includes(artist.toLowerCase()))) {
    analysis.isSinger = true;
    analysis.type = 'singer';
    analysis.suggestions = searchProductsByTerm(searchTerm).filter(p => p.type === 'cantante');
  }

  // Buscar anime
  const tags = getAllTags();
  if (tags.some(tag => tag.includes(term)) && tags.some(tag => ['anime', 'manga', 'shonen'].includes(tag))) {
    analysis.isAnime = true;
    analysis.type = 'anime';
    analysis.suggestions = searchProductsByTerm(searchTerm).filter(p => p.type === 'anime');
  }

  // Buscar géneros
  const genres = getAllGenres();
  if (genres.some(genre => genre.toLowerCase().includes(term))) {
    analysis.isGenre = true;
    analysis.type = 'genre';
    analysis.suggestions = searchProductsByTerm(searchTerm);
  }

  return analysis;
}

/**
 * Crea una vista inteligente basada en el análisis
 */
function createSmartSearchView(searchTerm) {
  const analysis = analyzeSearchTerm(searchTerm);
  const container = document.getElementById('productsGrid');

  if (!container) return;

  let title = `Resultados para: "${searchTerm}"`;
  
  if (analysis.type === 'singer') {
    title = `🎤 Artistas relacionados con: ${searchTerm}`;
  } else if (analysis.type === 'anime') {
    title = `🎌 Anime y personajes: ${searchTerm}`;
  } else if (analysis.type === 'genre') {
    title = `🎵 ${searchTerm.toUpperCase()}`;
  }

  searchAndDisplayProducts(searchTerm, 'productsGrid');
}

// Exportar funciones para uso global
if (typeof window !== 'undefined') {
  window.renderPersonalizedRecommendations = renderPersonalizedRecommendations;
  window.getRecommendationReason = getRecommendationReason;
  window.searchAndDisplayProducts = searchAndDisplayProducts;
  window.setupGenreFilters = setupGenreFilters;
  window.filterByGenre = filterByGenre;
  window.toggleWishlistCard = toggleWishlistCard;
  window.analyzeSearchTerm = analyzeSearchTerm;
  window.createSmartSearchView = createSmartSearchView;
}
