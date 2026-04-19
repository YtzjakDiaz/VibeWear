// ============= CARRITO DE COMPRAS VIBEWEAR =============

let cart = JSON.parse(localStorage.getItem('vibewear-cart')) || [];

// ========== AGREGAR AL CARRITO ==========
function addToCart(prodId, prodName, prodPrice, prodImage, quantity = 1, size = '', color = '') {
  // Verificar si el producto ya está en el carrito
  const existingItem = cart.find(item => 
    item.id === prodId && item.size === size && item.color === color
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: prodId,
      name: prodName,
      price: prodPrice,
      image: prodImage,
      quantity: quantity,
      size: size,
      color: color,
      addedDate: new Date().toLocaleDateString('es-CO')
    });
  }

  saveCart();
  updateCartUI();
  
  // Usar showToast si está disponible, sino mostrar notificación simple
  if (typeof window.showToast === 'function') {
    window.showToast(`✓ ${prodName} agregado al carrito`, 'success', 6000);
  } else if (typeof showNotification === 'function') {
    showNotification(`${prodName} agregado al carrito ✓`, 'success', 6000);
  } else {
    alert(`✓ ${prodName} agregado al carrito`);
  }
  
  if (typeof window.bumpCart === 'function') {
    window.bumpCart();
  }
  
  return true;
}

// ========== ELIMINAR DEL CARRITO ==========
function removeFromCart(prodId, size = '', color = '') {
  cart = cart.filter(item => 
    !(item.id === prodId && item.size === size && item.color === color)
  );
  saveCart();
  updateCartUI();
  return true;
}

// ========== ACTUALIZAR CANTIDAD ==========
function updateCartQuantity(prodId, quantity, size = '', color = '') {
  const item = cart.find(item => 
    item.id === prodId && item.size === size && item.color === color
  );
  
  if (item) {
    if (quantity <= 0) {
      removeFromCart(prodId, size, color);
    } else {
      item.quantity = quantity;
      saveCart();
      updateCartUI();
    }
  }
}

// ========== VACIAR CARRITO ==========
function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
  
  if (typeof window.showToast === 'function') {
    window.showToast('Carrito vaciado', 'info', 5000);
  } else if (typeof showNotification === 'function') {
    showNotification('Carrito vaciado', 'info', 5000);
  }
}

// ========== CALCULAR TOTALES ==========
function getCartSubtotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartTax(subtotal) {
  return Math.round(subtotal * 0.19); // 19% IVA Colombia
}

function getCartTotal() {
  const subtotal = getCartSubtotal();
  const tax = getCartTax(subtotal);
  const shipping = getShippingCost(subtotal);
  return subtotal + tax + shipping;
}

function getShippingCost(subtotal) {
  if (subtotal >= 150000) return 0; // Envío gratis
  if (subtotal >= 100000) return 5000;
  if (subtotal >= 50000) return 8000;
  return 12000; // Envío mínimo
}

// ========== CONTAR ITEMS ==========
function getCartItemCount() {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// ========== OBTENER CARRITO ==========
function getCart() {
  return cart;
}

// ========== GUARDAR EN LOCALSTORAGE ==========
function saveCart() {
  localStorage.setItem('vibewear-cart', JSON.stringify(cart));
}

// ========== ACTUALIZAR UI DEL CARRITO ==========
function updateCartUI() {
  // Actualizar contador en navbar
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    cartCount.textContent = getCartItemCount();
  }

  // Actualizar contenido del modal
  updateCartModal();
}

// ========== ACTUALIZAR MODAL DEL CARRITO ==========
function updateCartModal() {
  const cartModal = document.getElementById('cartModal');
  if (!cartModal) return;

  const cartItems = document.getElementById('cartItems');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartSummary = document.getElementById('cartSummary');
  
  // Actualizar contador dentro del modal
  const cartItemCount = document.getElementById('cartItemCount');
  if (cartItemCount) {
    cartItemCount.textContent = getCartItemCount();
  }

  if (cart.length === 0) {
    cartItems.innerHTML = '';
    cartEmpty.style.display = 'flex';
    cartSummary.style.display = 'none';
  } else {
    cartEmpty.style.display = 'none';
    cartSummary.style.display = 'block';

    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-item" style="display:flex;gap:16px;padding:16px;border-bottom:1px solid rgba(224,162,201,0.1);align-items:flex-start;">
        <img src="${item.image}" alt="${item.name}" style="width:80px;height:100px;object-fit:cover;border-radius:6px;background:var(--black-soft);" onerror="this.src='https://via.placeholder.com/80x100?text=Producto'" />
        
        <div style="flex:1;">
          <h4 style="font-family:var(--font-sub);font-size:13px;color:var(--white);margin-bottom:4px;text-transform:uppercase;">${item.name}</h4>
          <p style="font-size:12px;color:var(--gray);margin-bottom:8px;">${item.size ? 'Talla: ' + item.size : ''}${item.size && item.color ? ' | ' : ''}${item.color ? 'Color: ' + item.color : ''}</p>
          <p style="font-family:var(--font-display);font-size:18px;color:var(--pink);">${formatPrice(item.price)}</p>
        </div>

        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:12px;">
          <button onclick="removeFromCart('${item.id}', '${item.size}', '${item.color}')" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:var(--gray);width:24px;height:24px;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.3s;font-size:14px;" onmouseover="this.style.background='rgba(224,162,201,0.3)';this.style.color='var(--pink)'" onmouseout="this.style.background='rgba(255,255,255,0.1)';this.style.color='var(--gray)'">✕</button>
          
          <div style="display:flex;gap:8px;border:1px solid rgba(255,255,255,0.1);border-radius:4px;overflow:hidden;background:rgba(255,255,255,0.05);">
            <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1}, '${item.size}', '${item.color}')" style="width:28px;height:28px;border:none;background:transparent;color:var(--white);cursor:pointer;font-size:14px;transition:background 0.3s;" onmouseover="this.style.background='rgba(224,162,201,0.2)'" onmouseout="this.style.background='transparent'">−</button>
            <span style="width:32px;display:flex;align-items:center;justify-content:center;color:var(--white);font-family:var(--font-sub);font-size:12px;font-weight:600;">${item.quantity}</span>
            <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1}, '${item.size}', '${item.color}')" style="width:28px;height:28px;border:none;background:transparent;color:var(--white);cursor:pointer;font-size:14px;transition:background 0.3s;" onmouseover="this.style.background='rgba(224,162,201,0.2)'" onmouseout="this.style.background='transparent'">+</button>
          </div>
        </div>
      </div>
    `).join('');

    // Actualizar resumen
    const subtotal = getCartSubtotal();
    const tax = getCartTax(subtotal);
    const shipping = getShippingCost(subtotal);
    const total = getCartTotal();

    const summaryHTML = `
      <div style="padding:16px;border-top:1px solid rgba(224,162,201,0.2);font-family:var(--font-body);font-size:13px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;color:var(--gray);">
          <span>Subtotal:</span>
          <span>${formatPrice(subtotal)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;color:var(--gray);">
          <span>IVA (19%):</span>
          <span>${formatPrice(tax)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:16px;color:var(--gray);">
          <span>Envío:</span>
          <span>${shipping === 0 ? '¡Gratis!' : formatPrice(shipping)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid rgba(224,162,201,0.2);margin-bottom:16px;font-family:var(--font-display);font-size:20px;color:var(--pink);">
          <span>Total:</span>
          <span>${formatPrice(total)}</span>
        </div>
        <button onclick="goToCheckout()" style="width:100%;background:var(--pink);color:var(--black);border:none;padding:12px;border-radius:6px;font-family:var(--font-sub);font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all 0.3s;margin-bottom:8px;" onmouseover="this.style.background='var(--pink-light)'" onmouseout="this.style.background='var(--pink)'">Proceder al Checkout</button>
        <button onclick="clearCart()" style="width:100%;background:transparent;color:var(--white);border:1px solid rgba(255,255,255,0.2);padding:12px;border-radius:6px;font-family:var(--font-sub);font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all 0.3s;" onmouseover="this.style.borderColor='var(--pink)';this.style.color='var(--pink)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.2)';this.style.color='var(--white)'">Vaciar Carrito</button>
      </div>
    `;

    cartSummary.innerHTML = summaryHTML;
  }
}

// ========== TOGGLE CARRITO ==========
function toggleCart() {
  const cartModal = document.getElementById('cartModal');
  if (!cartModal) {
    console.error('Cart modal no encontrado');
    return;
  }
  
  const isOpen = cartModal.style.display === 'flex';
  cartModal.style.display = isOpen ? 'none' : 'flex';
}

// ========== IR A CHECKOUT ==========
function goToCheckout() {
  if (cart.length === 0) {
    showNotification('Tu carrito está vacío');
    return;
  }
  window.location.href = 'checkout.html';
}

// ========== CREAR CARRITO MODAL EN DOM ==========
function createCartModal() {
  if (document.getElementById('cartModal')) return; // Ya existe

  const modal = document.createElement('div');
  modal.id = 'cartModal';
  modal.style.cssText = `
    position:fixed;
    top:0;
    right:0;
    width:100%;
    max-width:420px;
    height:100vh;
    background:var(--black-soft);
    border-left:1px solid rgba(224,162,201,0.2);
    z-index:2000;
    display:none;
    flex-direction:column;
    animation:slideInRight 0.3s ease;
    box-shadow:-4px 0 20px rgba(0,0,0,0.3);
    @media (max-width: 640px) {
      max-width:100%;
    }
  `;

  modal.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:20px;border-bottom:1px solid rgba(224,162,201,0.2);gap:12px;">
      <h2 style="font-family:var(--font-display);font-size:28px;color:var(--white);margin:0;">CARRITO</h2>
      <span id="cartItemCount" style="font-family:var(--font-sub);font-size:13px;background:var(--pink);color:var(--black);padding:6px 12px;border-radius:50px;font-weight:600;min-width:30px;text-align:center;">0</span>
      <button onclick="toggleCart()" style="margin-left:auto;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:var(--white);width:36px;height:36px;border-radius:6px;cursor:pointer;font-size:18px;transition:all 0.3s;display:flex;align-items:center;justify-content:center;" onmouseover="this.style.background='rgba(224,162,201,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">✕</button>
    </div>

    <div id="cartItems" style="flex:1;overflow-y:auto;"></div>

    <div id="cartEmpty" style="display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;gap:16px;text-align:center;padding:40px 20px;">
      <div style="font-size:48px;opacity:0.5;">🛒</div>
      <p style="color:var(--gray);font-size:14px;margin:0;">Tu carrito está vacío</p>
      <button onclick="toggleCart();window.location.href='catalogo.html'" style="background:var(--pink);color:var(--black);border:none;padding:12px 24px;border-radius:6px;font-family:var(--font-sub);font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all 0.3s;">Ir a Comprar</button>
    </div>

    <div id="cartSummary"></div>
  `;

  document.body.appendChild(modal);

  // Cerrar carrito al hacer click fuera (COMENTADO - CIERRE MANUAL)
  /*document.addEventListener('click', (e) => {
    if (!modal.contains(e.target) && e.target.id !== 'cartCount' && !e.target.closest('.nav-cart')) {
      const isOpen = modal.style.display === 'flex';
      if (isOpen && e.target.id !== 'hamburger' && !e.target.closest('.nav-hamburger')) {
        modal.style.display = 'none';
      }
    }
  });*/

  updateCartModal();
}

// ========== ANIMAR MODAL ==========
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  /* Scrollbar color rosa */
  #cartItems::-webkit-scrollbar {
    width: 8px;
  }

  #cartItems::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }

  #cartItems::-webkit-scrollbar-thumb {
    background: var(--pink);
    border-radius: 10px;
    transition: background 0.3s;
  }

  #cartItems::-webkit-scrollbar-thumb:hover {
    background: var(--pink-light);
  }

  /* Firefox */
  #cartItems {
    scrollbar-color: var(--pink) rgba(255, 255, 255, 0.05);
    scrollbar-width: thin;
  }

  @media (max-width: 640px) {
    #cartModal {
      max-width: 100% !important;
    }
  }
`;
document.head.appendChild(style);

// ========== INICIALIZAR CARRITO ==========
document.addEventListener('DOMContentLoaded', () => {
  createCartModal();
  updateCartUI();
});

// Crear modal incluso si el DOM ya está cargado
if (document.readyState !== 'loading') {
  createCartModal();
  updateCartUI();
}
