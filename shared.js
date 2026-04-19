// ============= SHARED FUNCTIONALITY FOR VIBEWEAR =============

// ========== WISHLIST / FAVORITOS ==========
let wishlist = JSON.parse(localStorage.getItem('vibewear-wishlist')) || [];

function addToWishlist(prodId, prodName, prodPrice, prodImage) {
  // Verificar si el producto ya existe en el wishlist
  const exists = wishlist.find(item => item.id === prodId);
  
  if (!exists) {
    wishlist.push({
      id: prodId,
      name: prodName,
      price: prodPrice,
      image: prodImage
    });
    localStorage.setItem('vibewear-wishlist', JSON.stringify(wishlist));
    showNotification(`${prodName} agregado a favoritos ❤️`);
    updateWishlistCount();
    updateWishlistHearts();
    return true;
  } else {
    removeFromWishlist(prodId);
    return false;
  }
}

function removeFromWishlist(prodId) {
  wishlist = wishlist.filter(item => item.id !== prodId);
  localStorage.setItem('vibewear-wishlist', JSON.stringify(wishlist));
  updateWishlistCount();
  updateWishlistHearts();
}

function updateWishlistCount() {
  const count = document.getElementById('wishlistCount');
  if (count) count.textContent = wishlist.length;
}

function isInWishlist(prodId) {
  return wishlist.some(item => item.id === prodId);
}

function updateWishlistHearts() {
  // Actualiza todos los corazones del wishlist en la página
  document.querySelectorAll('[data-product-wishlist]').forEach(heart => {
    const prodId = heart.getAttribute('data-product-wishlist');
    const inWishlist = isInWishlist(prodId);
    heart.textContent = inWishlist ? '♥' : '♡';
    heart.style.color = inWishlist ? 'var(--pink)' : 'var(--white)';
  });
}

// Inicializar corazones cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => updateWishlistHearts(), 100);
});

// ========== SISTEMA DE RESEÑAS ==========
let reviews = JSON.parse(localStorage.getItem('vibewear-reviews')) || {};

function addReview(prodId, rating, comment, userName) {
  if (!reviews[prodId]) reviews[prodId] = [];
  reviews[prodId].push({
    rating,
    comment,
    userName: userName || 'Usuario',
    date: new Date().toLocaleDateString('es-CO'),
    verified: true
  });
  localStorage.setItem('vibewear-reviews', JSON.stringify(reviews));
  return true;
}

function getReviews(prodId) {
  return reviews[prodId] || [];
}

function getAverageRating(prodId) {
  const prodReviews = getReviews(prodId);
  if (prodReviews.length === 0) return 0;
  const sum = prodReviews.reduce((acc, r) => acc + r.rating, 0);
  return (sum / prodReviews.length).toFixed(1);
}

// ========== SISTEMA DE CUPONES ==========
const validCoupons = {
  'VIBEFIRST': { discount: 15, type: 'percentage' },
  'STREET20': { discount: 20, type: 'percentage' },
  'HIPHOP10': { discount: 10, type: 'percentage' },
  'WELCOME50': { discount: 50, type: 'fixed' },
  'SUMMER25': { discount: 25, type: 'percentage' },
  'VIBE2024': { discount: 30, type: 'percentage' }
};

function validateCoupon(code) {
  return validCoupons[code.toUpperCase()] || null;
}

function applyCoupon(code, cartTotal) {
  const coupon = validateCoupon(code);
  if (!coupon) return { success: false, message: 'Cupón inválido' };
  
  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = (cartTotal * coupon.discount) / 100;
  } else {
    discount = coupon.discount;
  }
  
  return {
    success: true,
    discount: Math.round(discount),
    message: `Cupón aplicado: -$${Math.round(discount)}`
  };
}

// ========== SISTEMA DE PUNTOS / LEALTAD ==========
let loyaltyPoints = parseInt(localStorage.getItem('vibewear-loyalty-points')) || 0;

function addLoyaltyPoints(amount) {
  loyaltyPoints += amount;
  localStorage.setItem('vibewear-loyalty-points', loyaltyPoints);
  return loyaltyPoints;
}

function getLoyaltyPoints() {
  return loyaltyPoints;
}

function redeemPoints(points) {
  if (loyaltyPoints >= points) {
    loyaltyPoints -= points;
    localStorage.setItem('vibewear-loyalty-points', loyaltyPoints);
    return true;
  }
  return false;
}

// ========== NEWSLETTER ==========
let subscribers = JSON.parse(localStorage.getItem('vibewear-subscribers')) || [];

function subscribeNewsletter(email) {
  if (!subscribers.includes(email)) {
    subscribers.push(email);
    localStorage.setItem('vibewear-subscribers', JSON.stringify(subscribers));
    showNotification('¡Bienvenido a nuestra comunidad! 📬');
    return true;
  }
  return false;
}

// ========== ÓRDENES / PEDIDOS ==========
let orders = JSON.parse(localStorage.getItem('vibewear-orders')) || [];

function createOrder(cartItems, total, couponDiscount = 0) {
  const order = {
    id: 'VW-' + Date.now(),
    date: new Date().toLocaleDateString('es-CO'),
    items: cartItems,
    total: total - couponDiscount,
    status: 'Confirmado',
    tracking: Math.random().toString(36).substr(2, 9).toUpperCase(),
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO')
  };
  
  orders.push(order);
  localStorage.setItem('vibewear-orders', JSON.stringify(orders));
  
  // Añadir puntos de lealtad
  addLoyaltyPoints(Math.floor(total * 0.05)); // 5% de puntos
  
  return order;
}

// ========== SISTEMA DE STOCK DINÁMICO ==========
let stockInventory = JSON.parse(localStorage.getItem('vibewear-stock')) || {};

/**
 * Obtener stock actual de un producto
 */
function getProductStock(productId, productsData) {
  // Si hay stock personalizado, usarlo; si no, usar el de products-data
  if (stockInventory[productId] !== undefined) {
    return stockInventory[productId];
  }
  
  if (productsData && productsData[productId]) {
    return productsData[productId].stock || 0;
  }
  
  return 0;
}

/**
 * Verificar si hay stock disponible
 */
function hasStock(productId, quantity = 1, productsData = null) {
  const stock = getProductStock(productId, productsData);
  return stock >= quantity;
}

/**
 * Obtener estado del stock (En Stock / Bajo Stock / Agotado)
 */
function getStockStatus(productId, productsData) {
  const stock = getProductStock(productId, productsData);
  
  if (stock === 0) return 'AGOTADO';
  if (stock <= 3) return 'BAJO_STOCK';
  return 'EN_STOCK';
}

/**
 * Obtener badge/etiqueta del stock
 */
function getStockBadge(productId, productsData) {
  const status = getStockStatus(productId, productsData);
  const stock = getProductStock(productId, productsData);
  
  if (status === 'AGOTADO') {
    return '<span style="background: rgba(255, 107, 157, 0.2); color: #ff6b9d; padding: 4px 10px; border-radius: 50px; font-size: 10px; letter-spacing: 1px; font-weight: 600;">❌ AGOTADO</span>';
  }
  
  if (status === 'BAJO_STOCK') {
    return `<span style="background: rgba(255, 193, 7, 0.2); color: #ffc107; padding: 4px 10px; border-radius: 50px; font-size: 10px; letter-spacing: 1px; font-weight: 600;">⚠️ ${stock} DISPONIBLE${stock > 1 ? 'S' : ''}</span>`;
  }
  
  return '<span style="background: rgba(76, 175, 80, 0.2); color: #4caf50; padding: 4px 10px; border-radius: 50px; font-size: 10px; letter-spacing: 1px; font-weight: 600;">✔ EN STOCK</span>';
}

/**
 * Actualizar stock después de una compra
 */
function updateStockAfterPurchase(productId, quantity) {
  const currentStock = getProductStock(productId);
  const newStock = Math.max(0, currentStock - quantity);
  stockInventory[productId] = newStock;
  localStorage.setItem('vibewear-stock', JSON.stringify(stockInventory));
  return newStock;
}

/**
 * Restaurar stock (para cancelaciones)
 */
function restoreStock(productId, quantity) {
  const currentStock = getProductStock(productId);
  const newStock = currentStock + quantity;
  stockInventory[productId] = newStock;
  localStorage.setItem('vibewear-stock', JSON.stringify(stockInventory));
  return newStock;
}

/**
 * Validar cantidad a comprar basada en stock
 */
function validatePurchaseQuantity(productId, requestedQty, productsData) {
  const availableStock = getProductStock(productId, productsData);
  
  if (availableStock === 0) {
    return { valid: false, message: '❌ Producto agotado', maxQty: 0 };
  }
  
  if (requestedQty > availableStock) {
    return {
      valid: false,
      message: `⚠️ Solo hay ${availableStock} unidade${availableStock > 1 ? 's' : ''} disponible${availableStock > 1 ? 's' : ''}`,
      maxQty: availableStock
    };
  }
  
  return { valid: true, message: '✔ Cantidad válida', maxQty: availableStock };
}

/**
 * Habilitar/Deshabilitar botón de compra según stock
 */
function updateBuyButtonState(buttonId, productId, productsData) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  
  const status = getStockStatus(productId, productsData);
  
  if (status === 'AGOTADO') {
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.style.cursor = 'not-allowed';
    btn.textContent = '❌ AGOTADO';
  } else {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      Agregar al Carrito
    `;
  }
}

/**
 * Notificación cuando el stock es bajo
 */
function showStockWarning(productId, productsData) {
  const stock = getProductStock(productId, productsData);
  
  if (stock > 0 && stock <= 3) {
    showNotification(`⚠️ Solo ${stock} disponible${stock > 1 ? 's' : ''}. ¡Apúrate!`);
  }
}

function getOrders() {
  return orders;
}

// ========== NOTIFICACIONES PUSH MEJORADAS ==========
function showNotification(msg, type = 'success', duration = 4000) {
  const notif = document.createElement('div');
  
  const typeConfig = {
    success: { bg: 'rgba(74, 222, 128, 0.15)', border: '#4ade80', color: '#4ade80', icon: '✓' },
    error: { bg: 'rgba(255, 107, 157, 0.15)', border: '#ff6b9d', color: '#ff6b9d', icon: '✕' },
    info: { bg: 'rgba(224, 162, 201, 0.15)', border: '#e0a2c9', color: '#e0a2c9', icon: 'ℹ' }
  };
  
  const config = typeConfig[type] || typeConfig.success;
  
  notif.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${config.bg};
    border: 1.5px solid ${config.border};
    color: ${config.color};
    padding: 16px 24px;
    border-radius: 8px;
    z-index: 99999;
    animation: slideInUp 0.3s ease;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 90vw;
  `;
  
  notif.innerHTML = `<span style="font-size: 16px;">${config.icon}</span><span>${msg}</span>`;
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.style.animation = 'slideOutDown 0.6s ease';
    setTimeout(() => notif.remove(), 600);
  }, duration);
}

// Agregar animaciones globales
if (!document.querySelector('style[data-notifications]')) {
  const style = document.createElement('style');
  style.setAttribute('data-notifications', 'true');
  style.textContent = `
    @keyframes slideInUp {
      from { transform: translateY(100px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideOutDown {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(100px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// ========== UTILIDADES ==========
function formatPrice(price) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);
}

function renderStars(rating) {
  let stars = '';
  for (let i = 0; i < 5; i++) {
    stars += i < rating ? '★' : '☆';
  }
  return stars;
}

// ========== GOOGLE SIGN-IN ==========
function loginWithGoogle() {
  // Placeholder para Google Sign-In
  // En producción, integrar con Google OAuth 2.0
  showNotification('Redirigiendo a Google Sign-In...');
  setTimeout(() => window.location.href = 'account.html', 1500);
}

// ========== INICIALIZAR BOTONES DE FAVORITOS ==========
function initWishlistButtons() {
  document.querySelectorAll('.product-wishlist').forEach(btn => {
    const btnContent = btn.innerHTML.trim();
    if (btnContent === '♡' || btnContent.includes('❤')) {
      btn.innerHTML = '<svg class="wishlist-heart-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
      btn.style.border = 'none';
      btn.style.background = 'rgba(255,255,255,0.08)';
      btn.style.cursor = 'pointer';
    }
  });
  updateWishlistButtons();
}

function updateWishlistButtons() {
  document.querySelectorAll('.product-wishlist').forEach(btn => {
    const prodId = btn.getAttribute('data-prod-id');
    if (prodId && isInWishlist(prodId)) {
      const svg = btn.querySelector('.wishlist-heart-svg');
      if (svg) svg.classList.add('filled');
    } else {
      const svg = btn.querySelector('.wishlist-heart-svg');
      if (svg) svg.classList.remove('filled');
    }
  });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWishlistButtons);
} else {
  setTimeout(initWishlistButtons, 100);
}

// ========== MODAL PARA SELECCIONAR TALLA Y COLOR ==========
let pendingProduct = null;

function showSizeColorModal(prodId, prodName, prodPrice, prodImage) {
  // Obtener datos del producto
  const productData = {
    'prod-1': { colores: [{color: '#ffffff', nombre: 'Blanco'}] },
    'prod-2': { colores: [{color: '#1a1a1a', nombre: 'Negro'}] },
    'prod-3': { colores: [{color: '#1a1a1a', nombre: 'Negro'}] },
    'prod-4': { colores: [{color: '#ffffff', nombre: 'Blanco'}] }
  };

  const colors = productData[prodId]?.colores || [{color: '#ffffff', nombre: 'Blanco'}, {color: '#1a1a1a', nombre: 'Negro'}];
  
  pendingProduct = { prodId, prodName, prodPrice, prodImage, colors };
  
  let modal = document.getElementById('sizeColorModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'sizeColorModal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 50000;
    `;
    document.body.appendChild(modal);
  }

  // Generar colores HTML dinámicamente
  const colorsHTML = colors.map((c, i) => `
    <button class="color-selector" onclick="selectColorModal(this, '${c.nombre}')" 
      style="width: 40px; height: 40px; background: ${c.color}${c.color === '#f5f5f5' || c.color === '#ffffff' ? ';border:2px solid rgba(224,162,201,0.5)' : ';border: 2px solid rgba(224, 162, 201, 0.3)'}; border-radius: 50%; cursor: pointer; transition: all 0.3s; ${i === 0 ? 'border-width: 3px; border-color: var(--pink) !important;' : ''}"></button>
  `).join('');

  modal.innerHTML = `
    <div style="background: var(--black-soft); border: 1.5px solid rgba(224, 162, 201, 0.3); border-radius: 12px; padding: 30px; max-width: 400px; width: 90%; animation: slideInUp 0.3s ease;">
      <h3 style="font-family: var(--font-display); font-size: 20px; color: var(--white); margin: 0 0 20px 0; text-transform: uppercase;">Selecciona una opción</h3>
      
      <div style="margin-bottom: 24px;">
        <label style="display: block; color: var(--pink); font-family: var(--font-sub); font-size: 12px; font-weight: 600; letter-spacing: 1px; margin-bottom: 10px;">TALLA</label>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
          <button class="size-selector" onclick="selectSizeModal(this, 'XS')" style="padding: 10px; background: rgba(224, 162, 201, 0.1); border: 1.5px solid rgba(224, 162, 201, 0.3); color: var(--white); border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s; font-family: var(--font-sub);">XS</button>
          <button class="size-selector" onclick="selectSizeModal(this, 'S')" style="padding: 10px; background: rgba(224, 162, 201, 0.1); border: 1.5px solid rgba(224, 162, 201, 0.3); color: var(--white); border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s; font-family: var(--font-sub);">S</button>
          <button class="size-selector" onclick="selectSizeModal(this, 'M')" style="padding: 10px; background: var(--pink); border: 1.5px solid var(--pink); color: var(--black); border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s; font-family: var(--font-sub);">M</button>
          <button class="size-selector" onclick="selectSizeModal(this, 'L')" style="padding: 10px; background: rgba(224, 162, 201, 0.1); border: 1.5px solid rgba(224, 162, 201, 0.3); color: var(--white); border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s; font-family: var(--font-sub);">L</button>
          <button class="size-selector" onclick="selectSizeModal(this, 'XL')" style="padding: 10px; background: rgba(224, 162, 201, 0.1); border: 1.5px solid rgba(224, 162, 201, 0.3); color: var(--white); border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s; font-family: var(--font-sub);">XL</button>
          <button class="size-selector" onclick="selectSizeModal(this, 'XXL')" style="padding: 10px; background: rgba(224, 162, 201, 0.1); border: 1.5px solid rgba(224, 162, 201, 0.3); color: var(--white); border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s; font-family: var(--font-sub);">XXL</button>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <label style="display: block; color: var(--pink); font-family: var(--font-sub); font-size: 12px; font-weight: 600; letter-spacing: 1px; margin-bottom: 10px;">COLOR</label>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          ${colorsHTML}
        </div>
      </div>

      <div style="display: flex; gap: 12px;">
        <button onclick="closeSizeColorModal()" style="flex: 1; padding: 12px; background: rgba(224, 162, 201, 0.1); border: 1.5px solid rgba(224, 162, 201, 0.3); color: var(--white); border-radius: 6px; cursor: pointer; font-weight: 600; font-family: var(--font-sub); text-transform: uppercase; font-size: 12px; letter-spacing: 1px; transition: all 0.3s;" onmouseover="this.style.background='rgba(224, 162, 201, 0.15)'" onmouseout="this.style.background='rgba(224, 162, 201, 0.1)'">Cancelar</button>
        <button onclick="confirmSizeColorModal()" style="flex: 1; padding: 12px; background: var(--pink); border: 1.5px solid var(--pink); color: var(--black); border-radius: 6px; cursor: pointer; font-weight: 600; font-family: var(--font-sub); text-transform: uppercase; font-size: 12px; letter-spacing: 1px; transition: all 0.3s;" onmouseover="this.style.background='var(--pink-light)'" onmouseout="this.style.background='var(--pink)'">Agregar</button>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  pendingProduct.selectedSize = 'M';
  pendingProduct.selectedColor = colors[0].nombre;
}

function selectSizeModal(btn, size) {
  document.querySelectorAll('.size-selector').forEach(b => {
    if (b === btn) {
      b.style.background = 'var(--pink)';
      b.style.borderColor = 'var(--pink)';
      b.style.color = 'var(--black)';
    } else {
      b.style.background = 'rgba(224, 162, 201, 0.1)';
      b.style.borderColor = 'rgba(224, 162, 201, 0.3)';
      b.style.color = 'var(--white)';
    }
  });
  pendingProduct.selectedSize = size;
}

function selectColorModal(btn, color) {
  document.querySelectorAll('.color-selector').forEach(b => {
    b.style.borderWidth = '2px';
    b.style.borderColor = 'rgba(224, 162, 201, 0.3)';
  });
  btn.style.borderWidth = '3px';
  btn.style.borderColor = 'var(--pink)';
  pendingProduct.selectedColor = color;
}

function closeSizeColorModal() {
  const modal = document.getElementById('sizeColorModal');
  if (modal) modal.style.display = 'none';
  pendingProduct = null;
}

function confirmSizeColorModal() {
  if (!pendingProduct) return;
  if (!pendingProduct.selectedSize) {
    showNotification('Por favor selecciona una talla', 'info');
    return;
  }
  if (!pendingProduct.selectedColor) {
    showNotification('Por favor selecciona un color', 'info');
    return;
  }

  window.addToCart(
    pendingProduct.prodId,
    pendingProduct.prodName,
    pendingProduct.prodPrice,
    pendingProduct.prodImage,
    1,
    pendingProduct.selectedSize,
    pendingProduct.selectedColor
  );

  closeSizeColorModal();
}
