// ============= SHARED FUNCTIONALITY FOR VIBEWEAR =============

// ========== WISHLIST / FAVORITOS ==========
let wishlist = JSON.parse(localStorage.getItem('vibewear-wishlist')) || [];

function addToWishlist(prodId, prodName) {
  if (!wishlist.includes(prodId)) {
    wishlist.push(prodId);
    localStorage.setItem('vibewear-wishlist', JSON.stringify(wishlist));
    showNotification(`${prodName} agregado a favoritos ❤️`);
    updateWishlistCount();
    return true;
  } else {
    removeFromWishlist(prodId);
    return false;
  }
}

function removeFromWishlist(prodId) {
  wishlist = wishlist.filter(id => id !== prodId);
  localStorage.setItem('vibewear-wishlist', JSON.stringify(wishlist));
  updateWishlistCount();
}

function updateWishlistCount() {
  const count = document.getElementById('wishlistCount');
  if (count) count.textContent = wishlist.length;
}

function isInWishlist(prodId) {
  return wishlist.includes(prodId);
}

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
  showNotification('Reseña publicada ✓');
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

function getOrders() {
  return orders;
}

// ========== NOTIFICACIONES PUSH MEJORADAS ==========
function showNotification(msg, type = 'success', duration = 3000) {
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
    z-index: 9999;
    animation: slideInUp 0.3s ease;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 10px;
  `;
  
  notif.innerHTML = `<span style="font-size: 16px;">${config.icon}</span><span>${msg}</span>`;
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.style.animation = 'slideOutDown 0.3s ease';
    setTimeout(() => notif.remove(), 300);
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
  setTimeout(() => notif.remove(), duration);
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
