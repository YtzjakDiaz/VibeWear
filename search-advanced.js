// ============= BÚSQUEDA AVANZADA Y FILTRADO =============
// Sistema inteligente de búsqueda en tiempo real con filtros dinámicos

class AdvancedSearch {
  constructor() {
    this.searchResults = [];
    this.filters = {
      priceMin: 0,
      priceMax: 200000,
      category: 'all',
      inStock: false,
      tags: [],
      sortBy: 'relevancia'
    };
    this.recentSearches = JSON.parse(localStorage.getItem('vibewear-recent-searches')) || [];
    this.maxRecentSearches = 5;
  }

  // Búsqueda principal
  search(query, productsData) {
    if (!query.trim()) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    const results = [];

    Object.values(productsData).forEach(product => {
      let score = 0;

      // Coincidencia exacta en nombre (máxima puntuación)
      if (product.name.toLowerCase() === lowerQuery) {
        score = 100;
      }
      // Nombre contiene la búsqueda
      else if (product.name.toLowerCase().includes(lowerQuery)) {
        score = 80;
      }
      // Coincidencia en artista/artista
      else if (product.artist && product.artist.toLowerCase().includes(lowerQuery)) {
        score = 70;
      }
      // Coincidencia en descripción
      else if (product.description.toLowerCase().includes(lowerQuery)) {
        score = 50;
      }
      // Coincidencia en tags
      else if (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
        score = 40;
      }
      // Coincidencia en categoría
      else if (product.category.toLowerCase().includes(lowerQuery)) {
        score = 30;
      }

      if (score > 0) {
        results.push({ ...product, searchScore: score });
      }
    });

    // Ordenar por puntuación
    results.sort((a, b) => b.searchScore - a.searchScore);

    // Guardar búsqueda reciente
    this.addRecentSearch(query);

    return results;
  }

  // Aplicar múltiples filtros
  applyFilters(products, filters = this.filters) {
    let filtered = products;

    // Filtro de precio
    filtered = filtered.filter(p =>
      p.price >= filters.priceMin && p.price <= filters.priceMax
    );

    // Filtro de categoría
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    // Filtro de stock
    if (filters.inStock) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    // Filtro de tags (AND - debe tener todos los tags)
    if (filters.tags.length > 0) {
      filtered = filtered.filter(p =>
        filters.tags.every(tag =>
          p.tags && p.tags.includes(tag)
        )
      );
    }

    return filtered;
  }

  // Ordenamiento
  sortResults(results, sortBy = 'relevancia') {
    const sorted = [...results];

    switch (sortBy) {
      case 'precio-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'precio-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'nombre-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name, 'es'));
      case 'nombre-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name, 'es'));
      case 'nuevo':
        return sorted.filter(p => p.badge === 'New').concat(sorted.filter(p => p.badge !== 'New'));
      case 'stock-alto':
        return sorted.sort((a, b) => (b.stock || 0) - (a.stock || 0));
      case 'relevancia':
      default:
        return sorted.sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0));
    }
  }

  // Búsqueda + Filtros + Ordenamiento
  executeSearch(query, productsData, filters = this.filters, sortBy = 'relevancia') {
    let results = query.trim() ? this.search(query, productsData) : Object.values(productsData);
    results = this.applyFilters(results, filters);
    results = this.sortResults(results, sortBy);
    this.searchResults = results;
    return results;
  }

  // Sugerencias mientras escribes
  getSuggestions(query, productsData, limit = 8) {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const suggestions = new Set();

    Object.values(productsData).forEach(product => {
      if (suggestions.size >= limit) return;

      if (product.name.toLowerCase().includes(lowerQuery)) {
        suggestions.add(product.name);
      } else if (product.artist && product.artist.toLowerCase().includes(lowerQuery)) {
        suggestions.add(product.artist);
      } else if (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
        product.tags.forEach(tag => {
          if (tag.toLowerCase().includes(lowerQuery)) {
            suggestions.add(tag);
          }
        });
      }
    });

    return Array.from(suggestions).slice(0, limit);
  }

  // Búsquedas recientes
  addRecentSearch(query) {
    const trimmedQuery = query.trim();
    this.recentSearches = this.recentSearches.filter(s => s !== trimmedQuery);
    this.recentSearches.unshift(trimmedQuery);
    this.recentSearches = this.recentSearches.slice(0, this.maxRecentSearches);
    localStorage.setItem('vibewear-recent-searches', JSON.stringify(this.recentSearches));
  }

  getRecentSearches() {
    return this.recentSearches;
  }

  clearRecentSearches() {
    this.recentSearches = [];
    localStorage.removeItem('vibewear-recent-searches');
  }

  // Extraer todos los tags únicos
  getAllTags(productsData) {
    const tagsSet = new Set();
    Object.values(productsData).forEach(product => {
      if (product.tags) {
        product.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet).sort();
  }

  // Extraer categorías únicas
  getAllCategories(productsData) {
    const categoriesSet = new Set();
    Object.values(productsData).forEach(product => {
      categoriesSet.add(product.category);
    });
    return Array.from(categoriesSet).sort();
  }

  // Estadísticas de búsqueda
  getSearchStats(productsData) {
    return {
      totalProducts: Object.keys(productsData).length,
      totalCategories: this.getAllCategories(productsData).length,
      totalTags: this.getAllTags(productsData).length,
      inStockCount: Object.values(productsData).filter(p => p.stock > 0).length,
      avgPrice: Math.round(
        Object.values(productsData).reduce((sum, p) => sum + p.price, 0) /
        Object.keys(productsData).length
      )
    };
  }
}

// Instancia global
const advancedSearch = new AdvancedSearch();
