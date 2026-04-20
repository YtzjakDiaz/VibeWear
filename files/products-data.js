// ============= DATOS ESTRUCTURADOS DE PRODUCTOS VIBEWEAR =============
// Estructura: cada producto tiene tags para identificar su categoría
// Esto permite recomendaciones personalizadas inteligentes

const productsData = {
  'prod-1': {
    id: 'prod-1',
    name: 'Eladio Carrión Oversized',
    price: 75000,
    category: 'camisetas',
    image: 'images/Productos/Producto 1/Eladio-Back.jpg',
    description: 'Camiseta oversized con diseño de Eladio Carrión',
    type: 'cantante',
    artist: 'Eladio Carrión',
    genre: 'reggaeton',
    tags: ['cantante', 'reggaeton', 'urbano'],
    relatedGenres: ['trap', 'hiphop', 'urbano'],
    badge: '🔥 Hot',
    stock: 12
  },
  'prod-2': {
    id: 'prod-2',
    name: 'Pokémon Gengar Hoodie',
    price: 111000,
    originalPrice: 126900,
    category: 'hoodies',
    image: 'images/Productos/Producto 2/hoodie.jpg',
    description: 'Hoodie con diseño de Gengar de Pokémon',
    type: 'anime',
    franchise: 'Pokémon',
    genre: 'anime',
    tags: ['pokemon', 'anime', 'gengar', 'personaje'],
    relatedGenres: ['anime', 'videojuego'],
    badge: '−20%',
    stock: 1
  },
  'prod-3': {
    id: 'prod-3',
    name: 'Álvarito Díaz Oversized',
    price: 70000,
    category: 'camisetas',
    image: 'images/Productos/Producto 3/Álvarito.jpg',
    description: 'Camiseta oversized con diseño de Álvarito Díaz',
    type: 'cantante',
    artist: 'Álvarito Díaz',
    genre: 'reggaeton',
    tags: ['cantante', 'reggaeton', 'urbano'],
    relatedGenres: ['trap', 'urbano'],
    badge: 'New',
    stock: 8
  },
  'prod-4': {
    id: 'prod-4',
    name: 'Snoopy Slim',
    price: 60000,
    category: 'camisetas',
    image: 'images/Productos/Producto 4/Snoopy-3.jpg',
    description: 'Camiseta slim con diseño de Snoopy',
    type: 'personaje',
    franchise: 'Peanuts',
    genre: 'caricatura',
    tags: ['snoopy', 'personaje', 'caricatura', 'retro'],
    relatedGenres: ['caricatura', 'retro'],
    badge: 'New',
    stock: 15
  },
  'prod-5': {
    id: 'prod-5',
    name: 'Sayonara Oversized',
    price: 70000,
    category: 'camisetas',
    image: 'images/Productos/Producto 5/Alvarito.jpg',
    description: 'Camiseta oversized con diseño urbano Sayonara',
    type: 'diseño',
    artist: '',
    genre: 'urbano',
    tags: ['urbano', 'diseño', 'streetwear'],
    relatedGenres: ['urbano', 'streetwear'],
    badge: '',
    stock: 10
  },
  'prod-6': {
    id: 'prod-6',
    name: 'BadBunny Albums',
    price: 65000,
    category: 'camisetas',
    image: 'images/Productos/Producto 6/BadBunny.jpg',
    description: 'Camiseta con diseño de Bad Bunny',
    type: 'cantante',
    artist: 'Bad Bunny',
    genre: 'reggaeton',
    tags: ['cantante', 'reggaeton', 'urbano', 'trap'],
    relatedGenres: ['trap', 'urbano', 'hiphop'],
    badge: '🔥 Hot',
    stock: 18
  },
  'prod-7': {
    id: 'prod-7',
    name: 'Blessd Oversized',
    price: 75000,
    category: 'camisetas',
    image: 'images/Productos/Producto 7/Blessd.jpg',
    description: 'Camiseta oversized con diseño de Blessd',
    type: 'cantante', // [LLENAR]: cantante, album, anime, serie, personaje, etc
    artist: 'Blessd', // [LLENAR]: Nombre del artista/personaje
    genre: 'reggaeton', // [LLENAR]: reggaeton, trap, hiphop, pop, anime, etc
    tags: ['cantante', 'reggaeton', 'urbano', 'trap'], // [LLENAR]: tags relacionados
    relatedGenres: ['trap', 'urbano', 'hiphop'], // [LLENAR]: géneros similares
    badge: 'New',
    stock: 14
  },
  'prod-8': {
    id: 'prod-8',
    name: 'Gustavo Cerati Oversized',
    price: 75000,
    category: 'camisetas',
    image: 'images/Productos/Producto 8/Gustavo-Cerati-1.jpg',
    description: 'Camiseta oversized con diseño de Gustavo Cerati',
    type: 'cantante', // [LLENAR]: cantante, album, anime, serie, personaje, etc
    artist: 'Gustavo Cerati', // [LLENAR]: Nombre del artista/personaje
    genre: 'rock', // [LLENAR]: reggaeton, trap, hiphop, pop, rock, etc
    tags: ['cantante', 'rock', 'soda stereo'], // [LLENAR]: tags relacionados
    relatedGenres: ['rock', 'alternativo'], // [LLENAR]: géneros similares
    badge: '',
    stock: 9
  },
  'prod-9': {
    id: 'prod-9',
    name: 'Kanye West Oversized',
    price: 75000,
    category: 'camisetas',
    image: 'images/Productos/Producto 9/KanyeWest-1.jpg',
    description: 'Camiseta oversized con diseño de Kanye West',
    type: 'cantante', // [LLENAR]: cantante, album, anime, serie, personaje, etc
    artist: 'Kanye West', // [LLENAR]: Nombre del artista/personaje
    genre: 'hiphop', // [LLENAR]: reggaeton, trap, hiphop, pop, rock, etc
    tags: ['cantante', 'hiphop', 'rap', 'urbano'], // [LLENAR]: tags relacionados
    relatedGenres: ['rap', 'trap', 'urbano'], // [LLENAR]: géneros similares
    badge: 'New',
    stock: 11
  },
  'prod-10': {
    id: 'prod-10',
    name: 'Sabrina Carpenter',
    price: 75000,
    category: 'camisetas',
    image: 'images/Productos/Producto 10/Sabrina-Carpenter-1.jpg',
    description: 'Camiseta con diseño de Sabrina Carpenter',
    type: 'cantante', // [LLENAR]: cantante, album, anime, serie, personaje, etc
    artist: 'Sabrina Carpenter', // [LLENAR]: Nombre del artista/personaje
    genre: 'pop', // [LLENAR]: reggaeton, trap, hiphop, pop, rock, etc
    tags: ['cantante', 'pop', 'pop-rock'], // [LLENAR]: tags relacionados
    relatedGenres: ['pop', 'pop-rock'], // [LLENAR]: géneros similares
    badge: '🔥 Hot',
    stock: 7
  },
  'prod-11': {
    id: 'prod-11',
    name: 'Snoopy Slim',
    price: 60000,
    category: 'camisetas',
    image: 'images/Productos/Producto 11/Snoopy.jpg',
    description: 'Camiseta slim con diseño de Snoopy',
    type: 'personaje', // [LLENAR]: cantante, album, anime, serie, personaje, etc
    franchise: 'Peanuts', // [LLENAR]: Nombre de la franquicia
    genre: 'caricatura', // [LLENAR]: anime, manga, caricatura, etc
    tags: ['snoopy', 'personaje', 'caricatura', 'retro'], // [LLENAR]: tags relacionados
    relatedGenres: ['caricatura', 'retro'], // [LLENAR]: géneros similares
    badge: '',
    stock: 6
  },
  'prod-12': {
    id: 'prod-12',
    name: 'Yan Block Oversized',
    price: 75000,
    category: 'camisetas',
    image: 'images/Productos/Producto 12/Yan-Block.jpg',
    description: 'Camiseta oversized con diseño de Yan Block',
    type: 'cantante', // [LLENAR]: cantante, album, anime, serie, personaje, etc
    artist: 'Yan Block', // [LLENAR]: Nombre del artista/personaje
    genre: 'reggaeton', // [LLENAR]: reggaeton, trap, hiphop, pop, rock, etc
    tags: ['cantante', 'reggaeton', 'urbano'], // [LLENAR]: tags relacionados
    relatedGenres: ['trap', 'urbano'], // [LLENAR]: géneros similares
    badge: 'New',
    stock: 13
  },
  'prod-13': {
    id: 'prod-13',
    name: 'Trueno Oversized',
    price: 75000,
    category: 'camisetas',
    image: 'images/Productos/Producto 13/Trueno-1.jpg',
    description: 'Camiseta oversized con diseño de Trueno',
    type: 'cantante', // [LLENAR]: cantante, album, anime, serie, personaje, etc
    artist: 'Trueno', // [LLENAR]: Nombre del artista/personaje
    genre: 'trap', // [LLENAR]: reggaeton, trap, hiphop, pop, rock, etc
    tags: ['cantante', 'trap', 'urbano', 'rap'], // [LLENAR]: tags relacionados
    relatedGenres: ['hiphop', 'urbano', 'rap'], // [LLENAR]: géneros similares
    badge: 'New',
    stock: 16
  },
  'prod-14': {
    id: 'prod-14',
    name: 'Tyler The Creator Oversized',
    price: 70000,
    category: 'camisetas',
    image: 'images/Productos/Producto 14/Tyler-The-Creator.jpg',
    description: 'Camiseta oversized con diseño de Tyler, The Creator',
    type: 'cantante', // [LLENAR]: cantante, album, anime, serie, personaje, etc
    artist: 'Tyler, The Creator', // [LLENAR]: Nombre del artista/personaje
    genre: 'hiphop', // [LLENAR]: reggaeton, trap, hiphop, pop, rock, etc
    tags: ['cantante', 'hiphop', 'rap', 'urbano'], // [LLENAR]: tags relacionados
    relatedGenres: ['rap', 'trap', 'urbano'], // [LLENAR]: géneros similares
    badge: '',
    stock: 5
  },
  'prod-15': {
    id: 'prod-15',
    name: 'Stitch Slim',
    price: 65000,
    category: 'camisetas',
    image: 'images/Productos/Producto 15/Stitch.jpg',
    description: 'Camiseta slim con diseño de Stitch',
    type: 'personaje', // [LLENAR]: cantante, album, anime, serie, personaje, etc
    franchise: 'Lilo & Stitch', // [LLENAR]: Nombre de la franquicia
    genre: 'caricatura', // [LLENAR]: anime, manga, caricatura, etc
    tags: ['stitch', 'personaje', 'caricatura', 'disney'], // [LLENAR]: tags relacionados
    relatedGenres: ['caricatura', 'disney', 'retro'], // [LLENAR]: géneros similares
    badge: 'New'
  },
  'prod-16': {
    id: 'prod-16',
    name: 'The Weeknd Oversized',
    price: 75000,
    category: 'camisetas',
    image: 'images/Productos/Producto 16/The-Weeknd--1.jpg',
    description: 'Camiseta oversized con diseño de The Weeknd',
    type: 'cantante', // [LLENAR]: cantante, album, anime, serie, personaje, etc
    artist: 'The Weeknd', // [LLENAR]: Nombre del artista/personaje
    genre: 'pop', // [LLENAR]: reggaeton, trap, hiphop, pop, rock, etc
    tags: ['cantante', 'pop', 'r&b', 'urbano'], // [LLENAR]: tags relacionados
    relatedGenres: ['r&b', 'pop', 'trap'], // [LLENAR]: géneros similares
    badge: '🔥 Hot'
  },
  'prod-17': {
    id: 'prod-17',
    name: 'Snoopy Slim',
    price: 65000,
    category: 'camisetas',
    image: 'images/Productos/Producto 17/Snoopy-2.jpg',
    description: 'Camiseta slim con diseño de Snoopy',
    type: 'personaje', // [LLENAR]: cantante, album, anime, serie, personaje, etc
    franchise: 'Peanuts', // [LLENAR]: Nombre de la franquicia
    genre: 'caricatura', // [LLENAR]: anime, manga, caricatura, etc
    tags: ['snoopy', 'personaje', 'caricatura', 'retro'], // [LLENAR]: tags relacionados
    relatedGenres: ['caricatura', 'retro'], // [LLENAR]: géneros similares
    badge: ''
  },
  'prod-18': {
    id: 'prod-18',
    name: 'Navidad Slim',
    price: 65000,
    category: 'camisetas',
    image: 'images/Productos/Producto 18/NAVIDAD1.jpg',
    description: 'Camiseta slim con diseño navideño',
    type: 'diseño', // [LLENAR]: cantante, album, anime, serie, personaje, etc
    theme: 'navidad', // [LLENAR]: navidad, verano, invierno, etc
    genre: 'festivo', // [LLENAR]: festivo, urbano, etc
    tags: ['navidad', 'diseño', 'festivo', 'retro'], // [LLENAR]: tags relacionados
    relatedGenres: ['festivo', 'retro'], // [LLENAR]: géneros similares
    badge: 'New'
  },
  'prod-19': {
    id: 'prod-19',
    name: 'Black Clover Oversized',
    price: 75000,
    category: 'camisetas',
    image: 'images/Productos/Producto 19/Black-Clover-2.jpg',
    description: 'Camiseta oversized con diseño de Black Clover',
    type: 'anime', // [LLENAR]: cantante, album, anime, serie, personaje, etc
    franchise: 'Black Clover', // [LLENAR]: Nombre de la franquicia
    genre: 'anime', // [LLENAR]: anime, manga, videojuego, etc
    tags: ['anime', 'black-clover', 'shonen'], // [LLENAR]: tags relacionados
    relatedGenres: ['anime', 'manga', 'shonen'], // [LLENAR]: géneros similares
    badge: '🔥 Hot'
  },
  'prod-20': {
    id: 'prod-20',
    name: 'Dexter Morgan',
    price: 75000,
    category: 'camisetas',
    image: 'images/Productos/Producto 20/Dexter-Morgan-1.jpg',
    description: 'Camiseta con diseño de Dexter Morgan',
    type: 'personaje', // [LLENAR]: cantante, album, anime, serie, personaje, etc
    franchise: 'Dexter', // [LLENAR]: Nombre de la franquicia
    genre: 'serie', // [LLENAR]: anime, manga, serie, película, etc
    tags: ['dexter', 'personaje', 'serie', 'thriller'], // [LLENAR]: tags relacionados
    relatedGenres: ['serie', 'thriller', 'drama'], // [LLENAR]: géneros similares
    badge: ''
  },
  'prod-21': {
    id: 'prod-21',
    name: 'Dragon Ball Slim',
    price: 65000,
    category: 'camisetas',
    image: 'images/Productos/Producto 21/VillanosDB.jpg',
    description: 'Camiseta slim con diseño de Dragon Ball',
    type: 'anime', // [LLENAR]: cantante, album, anime, serie, personaje, etc
    franchise: 'Dragon Ball', // [LLENAR]: Nombre de la franquicia
    genre: 'anime', // [LLENAR]: anime, manga, videojuego, etc
    tags: ['anime', 'dragon-ball', 'shonen'], // [LLENAR]: tags relacionados
    relatedGenres: ['anime', 'manga', 'shonen'], // [LLENAR]: géneros similares
    badge: 'New'
  },
  'prod-22': {
    id: 'prod-22',
    name: 'Naruto Slim',
    price: 65000,
    category: 'camisetas',
    image: 'images/Productos/Producto 22/Naruto.jpg',
    description: 'Camiseta slim con diseño de Naruto',
    type: 'anime', // [LLENAR]: cantante, album, anime, serie, personaje, etc
    franchise: 'Naruto', // [LLENAR]: Nombre de la franquicia
    genre: 'anime', // [LLENAR]: anime, manga, videojuego, etc
    tags: ['anime', 'naruto', 'shonen'], // [LLENAR]: tags relacionados
    relatedGenres: ['anime', 'manga', 'shonen'], // [LLENAR]: géneros similares
    badge: ''
  },
  'prod-23': {
    id: 'prod-23',
    name: 'Urban Lemon Oversized',
    price: 70000,
    category: 'camisetas',
    image: 'images/Productos/Producto 23/Lemon.jpg',
    description: 'Camiseta oversized con diseño urbano Lemon',
    type: 'diseño', // [LLENAR]: cantante, album, anime, serie, personaje, etc
    theme: 'urbano', // [LLENAR]: urbano, retro, minimalista, etc
    genre: 'urbano', // [LLENAR]: urbano, streetwear, etc
    tags: ['urbano', 'diseño', 'streetwear', 'moderno'], // [LLENAR]: tags relacionados
    relatedGenres: ['urbano', 'streetwear', 'moderno'], // [LLENAR]: géneros similares
    badge: ''
  },
  'prod-24': {
    id: 'prod-24',
    name: 'High as Fu**',
    price: 70000,
    category: 'camisetas',
    image: 'images/Productos/Producto 24/High.jpg',
    description: 'Camiseta oversized con diseño urbano High',
    type: 'diseño', // [LLENAR]: cantante, album, anime, serie, personaje, etc
    theme: 'urbano', // [LLENAR]: urbano, retro, minimalista, etc
    genre: 'urbano', // [LLENAR]: urbano, streetwear, etc
    tags: ['urbano', 'diseño', 'streetwear', 'urbano'], // [LLENAR]: tags relacionados
    relatedGenres: ['urbano', 'streetwear'], // [LLENAR]: géneros similares
    badge: 'New'
  }
};

// ============= FUNCIÓN DE BÚSQUEDA Y RECOMENDACIONES =============

/**
 * Obtiene recomendaciones personalizadas basadas en el producto actual
 * @param {string} productId - ID del producto actual
 * @param {number} limit - Cantidad de recomendaciones (default: 4)
 * @returns {Array} Array de productos recomendados
 */
function getPersonalizedRecommendations(productId, limit = 4) {
  const currentProduct = productsData[productId];
  if (!currentProduct) return [];

  // Puntuación para cada producto
  const scores = {};

  // Buscar productos similares
  Object.entries(productsData).forEach(([id, product]) => {
    if (id === productId) return; // No recomendar el mismo producto

    let score = 0;

    // Si ambos son del mismo artista/franquicia
    if (currentProduct.artist && product.artist && currentProduct.artist === product.artist) {
      score += 100;
    }
    if (currentProduct.franchise && product.franchise && currentProduct.franchise === product.franchise) {
      score += 100;
    }

    // Si comparten el mismo género
    if (currentProduct.genre === product.genre) {
      score += 50;
    }

    // Si comparten tags
    if (currentProduct.tags && product.tags) {
      const commonTags = currentProduct.tags.filter(tag => product.tags.includes(tag));
      score += commonTags.length * 30;
    }

    // Si el género está en relatedGenres del producto actual
    if (currentProduct.relatedGenres && product.genre) {
      if (currentProduct.relatedGenres.includes(product.genre)) {
        score += 40;
      }
    }

    // Si ambos son del mismo tipo
    if (currentProduct.type === product.type) {
      score += 20;
    }

    if (score > 0) {
      scores[id] = score;
    }
  });

  // Ordenar por puntuación y retornar
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => productsData[id]);
}

/**
 * Busca productos por término (nombre, artista, franquicia)
 * @param {string} searchTerm - Término a buscar
 * @returns {Array} Array de productos encontrados
 */
function searchProductsByTerm(searchTerm) {
  const term = searchTerm.toLowerCase();
  return Object.values(productsData).filter(product => {
    return (
      product.name.toLowerCase().includes(term) ||
      (product.artist && product.artist.toLowerCase().includes(term)) ||
      (product.franchise && product.franchise.toLowerCase().includes(term)) ||
      (product.tags && product.tags.some(tag => tag.includes(term)))
    );
  });
}

/**
 * Obtiene productos por género
 * @param {string} genre - Género a filtrar
 * @returns {Array} Array de productos del género
 */
function getProductsByGenre(genre) {
  return Object.values(productsData).filter(product => product.genre === genre);
}

/**
 * Obtiene todos los géneros disponibles
 * @returns {Array} Array de géneros únicos
 */
function getAllGenres() {
  const genres = new Set();
  Object.values(productsData).forEach(product => {
    if (product.genre) genres.add(product.genre);
  });
  return Array.from(genres);
}

/**
 * Obtiene todos los artistas disponibles
 * @returns {Array} Array de artistas únicos
 */
function getAllArtists() {
  const artists = new Set();
  Object.values(productsData).forEach(product => {
    if (product.artist) artists.add(product.artist);
  });
  return Array.from(artists);
}

/**
 * Obtiene todos los tags disponibles
 * @returns {Array} Array de tags únicos
 */
function getAllTags() {
  const tags = new Set();
  Object.values(productsData).forEach(product => {
    if (product.tags) {
      product.tags.forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags);
}

// ============= GUARDAR HISTORIAL DE BÚSQUEDAS =============
let searchHistory = JSON.parse(localStorage.getItem('vibewear-search-history')) || [];

/**
 * Guarda un término de búsqueda en el historial
 * @param {string} searchTerm - Término a guardar
 */
function saveSearchToHistory(searchTerm) {
  if (!searchTerm.trim()) return;
  
  // Evitar duplicados recientes
  searchHistory = searchHistory.filter(item => item !== searchTerm);
  searchHistory.unshift(searchTerm);
  
  // Mantener solo los últimos 20
  searchHistory = searchHistory.slice(0, 20);
  
  localStorage.setItem('vibewear-search-history', JSON.stringify(searchHistory));
}

/**
 * Obtiene el historial de búsquedas
 * @returns {Array} Array de términos buscados
 */
function getSearchHistory() {
  return searchHistory;
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    productsData,
    getPersonalizedRecommendations,
    searchProductsByTerm,
    getProductsByGenre,
    getAllGenres,
    getAllArtists,
    getAllTags,
    saveSearchToHistory,
    getSearchHistory
  };
}
