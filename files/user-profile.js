// ============= SISTEMA DE PERFIL DE USUARIO =============

// Guardar datos de usuario en localStorage
function saveUserProfile(user) {
  const profile = {
    id: user.uid,
    email: user.email,
    displayName: user.displayName || user.email.split('@')[0],
    photoURL: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
    createdAt: new Date().toISOString(),
    purchaseHistory: JSON.parse(localStorage.getItem(`purchases-${user.uid}`)) || [],
    addresses: JSON.parse(localStorage.getItem(`addresses-${user.uid}`)) || [],
    preferences: JSON.parse(localStorage.getItem(`preferences-${user.uid}`)) || {}
  };
  
  localStorage.setItem(`profile-${user.uid}`, JSON.stringify(profile));
  localStorage.setItem('currentUser', user.uid);
  return profile;
}

// Obtener perfil de usuario
function getUserProfile(userId) {
  const profile = JSON.parse(localStorage.getItem(`profile-${userId}`));
  return profile || null;
}

// Agregar compra al historial
function addPurchase(userId, orderData) {
  let purchases = JSON.parse(localStorage.getItem(`purchases-${userId}`)) || [];
  
  const order = {
    id: 'ORD-' + Date.now(),
    date: new Date().toISOString(),
    items: orderData.items,
    total: orderData.total,
    status: 'pendiente',
    trackingNumber: null
  };
  
  purchases.push(order);
  localStorage.setItem(`purchases-${userId}`, JSON.stringify(purchases));
  
  // Actualizar perfil
  const profile = getUserProfile(userId);
  if (profile) {
    profile.purchaseHistory = purchases;
    saveUserProfile(profile);
  }
  
  return order;
}

// Guardar dirección
function saveAddress(userId, address) {
  let addresses = JSON.parse(localStorage.getItem(`addresses-${userId}`)) || [];
  
  const newAddress = {
    id: 'ADDR-' + Date.now(),
    name: address.name,
    street: address.street,
    city: address.city,
    state: address.state,
    zipCode: address.zipCode,
    country: address.country,
    phone: address.phone,
    isDefault: address.isDefault || addresses.length === 0
  };
  
  // Si es default, desmarca los otros
  if (newAddress.isDefault) {
    addresses = addresses.map(a => ({ ...a, isDefault: false }));
  }
  
  addresses.push(newAddress);
  localStorage.setItem(`addresses-${userId}`, JSON.stringify(addresses));
  
  return newAddress;
}

// Obtener direcciones
function getUserAddresses(userId) {
  return JSON.parse(localStorage.getItem(`addresses-${userId}`)) || [];
}

// Guardar preferencias
function saveUserPreferences(userId, preferences) {
  localStorage.setItem(`preferences-${userId}`, JSON.stringify(preferences));
}

// Obtener preferencias
function getUserPreferences(userId) {
  return JSON.parse(localStorage.getItem(`preferences-${userId}`)) || {};
}

// Crear panel de perfil HTML
function createProfilePanel(user) {
  const profile = getUserProfile(user.uid);
  const addresses = getUserAddresses(user.uid);
  const purchases = JSON.parse(localStorage.getItem(`purchases-${user.uid}`)) || [];
  
  const panel = document.createElement('div');
  panel.id = 'userProfilePanel';
  panel.className = 'user-profile-panel';
  panel.innerHTML = `
    <div class="profile-container">
      <!-- Header del perfil -->
      <div class="profile-header">
        <img src="${profile.photoURL}" alt="${profile.displayName}" class="profile-avatar" />
        <div class="profile-info">
          <h2>${profile.displayName}</h2>
          <p>${profile.email}</p>
          <p style="font-size:11px;color:var(--gray)">Miembro desde ${new Date(profile.createdAt).toLocaleDateString('es-CO')}</p>
        </div>
        <button class="profile-close" onclick="closeProfilePanel()">✕</button>
      </div>

      <!-- Tabs -->
      <div class="profile-tabs">
        <button class="profile-tab active" data-tab="compras" onclick="switchProfileTab('compras', this)">Compras (${purchases.length})</button>
        <button class="profile-tab" data-tab="direcciones" onclick="switchProfileTab('direcciones', this)">Direcciones (${addresses.length})</button>
        <button class="profile-tab" data-tab="preferencias" onclick="switchProfileTab('preferencias', this)">Preferencias</button>
        <button class="profile-tab" data-tab="salir" onclick="logoutUser()">Cerrar sesión</button>
      </div>

      <!-- Tab Content -->
      <div class="profile-content">
        <!-- Compras -->
        <div id="tab-compras" class="profile-tab-content active">
          ${purchases.length > 0 ? `
            <div class="purchases-list">
              ${purchases.map(order => `
                <div class="purchase-item">
                  <div class="purchase-header">
                    <span class="purchase-id">${order.id}</span>
                    <span class="purchase-date">${new Date(order.date).toLocaleDateString('es-CO')}</span>
                    <span class="purchase-status status-${order.status}">${order.status}</span>
                  </div>
                  <div class="purchase-items">
                    ${order.items.map(item => `<p>${item.name} x${item.quantity}</p>`).join('')}
                  </div>
                  <div class="purchase-total">Total: $${order.total.toLocaleString('es-CO')}</div>
                </div>
              `).join('')}
            </div>
          ` : `
            <p style="text-align:center;color:var(--gray)">No hay compras aún</p>
          `}
        </div>

        <!-- Direcciones -->
        <div id="tab-direcciones" class="profile-tab-content">
          ${addresses.length > 0 ? `
            <div class="addresses-list">
              ${addresses.map(addr => `
                <div class="address-item">
                  <p><strong>${addr.name}</strong></p>
                  <p>${addr.street}, ${addr.city}</p>
                  <p>${addr.state} ${addr.zipCode}</p>
                  <p>${addr.phone}</p>
                  ${addr.isDefault ? '<span class="default-badge">Principal</span>' : ''}
                </div>
              `).join('')}
            </div>
          ` : `
            <p style="text-align:center;color:var(--gray)">No hay direcciones guardadas</p>
          `}
          <button class="btn-add-address" onclick="showAddAddressForm()">+ Agregar dirección</button>
        </div>

        <!-- Preferencias -->
        <div id="tab-preferencias" class="profile-tab-content">
          <div class="preferences-section">
            <label>
              <input type="checkbox" id="pref-notifications" />
              Recibir notificaciones por email
            </label>
            <label>
              <input type="checkbox" id="pref-newsletter" />
              Suscribirse al newsletter
            </label>
            <label>
              <input type="checkbox" id="pref-marketing" />
              Recibir ofertas especiales
            </label>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return panel;
}

// Funciones de utilidad
function switchProfileTab(tabName, btn) {
  // Actualizar botones
  document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  
  // Actualizar contenido
  document.querySelectorAll('.profile-tab-content').forEach(c => c.classList.remove('active'));
  const tabContent = document.getElementById(`tab-${tabName}`);
  if (tabContent) {
    tabContent.classList.add('active');
  }
}

function closeProfilePanel() {
  const panel = document.getElementById('userProfilePanel');
  if (panel) {
    panel.remove();
  }
}

function logoutUser() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.removeItem('currentUser');
    location.reload();
  }
}

// Exportar funciones
window.getUserProfile = getUserProfile;
window.addPurchase = addPurchase;
window.saveAddress = saveAddress;
window.getUserAddresses = getUserAddresses;
window.saveUserPreferences = saveUserPreferences;
window.switchProfileTab = switchProfileTab;
window.closeProfilePanel = closeProfilePanel;
window.logoutUser = logoutUser;
