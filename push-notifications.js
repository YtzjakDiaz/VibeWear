// Push Notifications Manager
// Maneja suscripciones y envío de notificaciones push del navegador

class PushNotificationManager {
  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    this.isSubscribed = false;
    this.subscription = null;
  }

  // Registrar Service Worker
  async registerServiceWorker() {
    if (!this.isSupported) {
      console.warn('⚠️ Push Notifications no soportado en este navegador');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.register('sw.js', {
        scope: '/'
      });
      console.log('✓ Service Worker registrado:', registration);
      return registration;
    } catch (error) {
      console.error('❌ Error registrando Service Worker:', error);
      return false;
    }
  }

  // Solicitar permiso al usuario
  async requestPermission() {
    if (!this.isSupported) return false;

    if (Notification.permission === 'granted') {
      console.log('✓ Permiso de notificaciones ya otorgado');
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Suscribirse a notificaciones push
  async subscribe() {
    if (!this.isSupported) {
      console.warn('Push notifications no soportado');
      return false;
    }

    try {
      // Solicitar permiso primero
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.warn('Permiso denegado');
        return false;
      }

      // Registrar service worker
      const registration = await this.registerServiceWorker();
      if (!registration) {
        console.error('No se pudo registrar Service Worker');
        return false;
      }

      // Obtener suscripción existente
      this.subscription = await registration.pushManager.getSubscription();
      if (this.subscription) {
        console.log('✓ Ya estás suscrito');
        this.isSubscribed = true;
        if (typeof showNotification === 'function') {
          showNotification('✓ Notificaciones ya activadas', 'success');
        }
        return true;
      }

      // Crear nueva suscripción
      try {
        this.subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(
            'BPp3dWvvg3LXbE80W5TZCbLDJ7qK_XcJ0qUPOH5Pt7RjxBzDnmvRhV3z-EjPf5q_7pDlFXlVGj2wNB8oL_nJLAs'
          )
        });

        console.log('✓ Suscripción creada:', this.subscription);
        
        // Guardar en localStorage
        localStorage.setItem('pushSubscription', JSON.stringify({
          endpoint: this.subscription.endpoint,
          date: new Date().toISOString()
        }));

        this.isSubscribed = true;
        if (typeof showNotification === 'function') {
          showNotification('✓ Notificaciones activadas', 'success');
        }
        return true;
      } catch (subError) {
        console.error('Error creando suscripción:', subError);
        if (typeof showNotification === 'function') {
          showNotification('❌ Permiso de notificaciones denegado', 'error');
        }
        return false;
      }
    } catch (error) {
      console.error('❌ Error general en subscribe:', error);
      if (typeof showNotification === 'function') {
        showNotification('Error al activar notificaciones', 'error');
      }
      return false;
    }
  }

  // Desuscribirse de notificaciones push
  async unsubscribe() {
    try {
      if (this.subscription) {
        await this.subscription.unsubscribe();
        console.log('✓ Desuscrito de push notifications');
      }

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
      }

      localStorage.removeItem('pushSubscription');
      this.isSubscribed = false;
      showNotification('✓ Notificaciones desactivadas', 'success');
      return true;
    } catch (error) {
      console.error('❌ Error desuscribiendo:', error);
      return false;
    }
  }

  // Verificar si está suscrito
  async checkSubscription() {
    if (!this.isSupported) return false;

    try {
      const registration = await navigator.serviceWorker.ready;
      this.subscription = await registration.pushManager.getSubscription();
      this.isSubscribed = !!this.subscription;
      return this.isSubscribed;
    } catch (error) {
      console.error('Error verificando suscripción:', error);
      return false;
    }
  }

  // Mostrar notificación local (Demo)
  showLocalNotification(title, options = {}) {
    if (!this.isSupported || !this.isSubscribed) return;

    const defaultOptions = {
      icon: 'images/logo.png',
      badge: 'images/logo.png',
      body: 'Nueva notificación de VibeWear',
      tag: 'vibewear-notification',
      requireInteraction: false,
      ...options
    };

    if ('serviceWorkerContainer' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, defaultOptions);
      });
    }
  }

  // Convertir clave base64 a Uint8Array
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }
}

// Instancia global
const pushManager = new PushNotificationManager();

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Comprobar si ya está suscrito
      const isSubscribed = await pushManager.checkSubscription();
      console.log('Estado de suscripción:', isSubscribed ? 'Activo' : 'Inactivo');

      // Actualizar UI si existe
      const pushToggle = document.getElementById('pushNotificationsToggle');
      if (pushToggle) {
        pushToggle.checked = isSubscribed;
        // El evento onchange ya está en HTML
      }
    } catch (error) {
      console.error('Error inicializando push notifications:', error);
    }
  } else {
    console.warn('Service Workers no soportado en este navegador');
  }
});

// Funciones de demostración para enviar notificaciones
async function sendNewProductNotification(product) {
  pushManager.showLocalNotification('🆕 Nuevo Producto', {
    body: `${product.name} acaba de llegar a VibeWear`,
    tag: 'new-product',
    data: {
      url: `producto.html#${product.id}`,
      productId: product.id
    }
  });
}

async function sendOrderStatusNotification(status, orderId) {
  const messages = {
    confirmed: '✓ Tu pedido fue confirmado',
    shipped: '📦 Tu pedido ha sido enviado',
    delivered: '🎉 Tu pedido fue entregado',
    delayed: '⏱️ Tu pedido se ha retrasado'
  };

  pushManager.showLocalNotification('Actualización de Pedido', {
    body: messages[status] || 'Actualización en tu pedido',
    tag: `order-${orderId}`,
    data: { orderId }
  });
}

async function sendSaleNotification(discount, code) {
  pushManager.showLocalNotification('🔥 ¡Venta Especial!', {
    body: `${discount}% de descuento con código: ${code}`,
    tag: 'sale-notification',
    requireInteraction: true
  });
}

async function sendWishlistNotification(product) {
  pushManager.showLocalNotification('💫 Producto en tu Wishlist', {
    body: `${product.name} ahora tiene descuento`,
    tag: `wishlist-${product.id}`,
    data: {
      url: `producto.html#${product.id}`,
      productId: product.id
    }
  });
}
