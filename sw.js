// Service Worker para VibeWear
// Maneja notificaciones push y eventos offline

const CACHE_NAME = 'vibewear-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/shared.js',
  '/firebase-config.js',
  '/images/logo.png'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker instalado');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✓ Cache abierto');
        return cache.addAll(URLS_TO_CACHE).catch(err => {
          console.warn('⚠️ Algunos recursos no están en cache:', err);
        });
      })
  );
  self.skipWaiting();
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  console.log('✓ Service Worker activado');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Cache antiguo eliminado:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  // Solo GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Estrategia Cache First para assets
  if (event.request.url.includes('styles.css') || 
      event.request.url.includes('.js') ||
      event.request.url.includes('.png') ||
      event.request.url.includes('.ico')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((response) => {
            // No cachear requests fallidas
            if (!response || response.status !== 200) {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
        })
        .catch(() => {
          // Fallback para recursos en cache
          return caches.match('/index.html');
        })
    );
  }
});

// Manejar notificaciones push
self.addEventListener('push', (event) => {
  console.log('📨 Push recibido:', event);
  
  if (!event.data) {
    console.warn('⚠️ Push sin datos');
    return;
  }

  let notificationData = {};
  
  try {
    notificationData = event.data.json();
  } catch (e) {
    notificationData = {
      title: 'VibeWear',
      body: event.data.text()
    };
  }

  const options = {
    icon: 'images/logo.png',
    badge: 'images/logo.png',
    body: notificationData.body || 'Nueva notificación',
    tag: notificationData.tag || 'vibewear-notification',
    requireInteraction: notificationData.requireInteraction || false,
    data: notificationData.data || {}
  };

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title || 'VibeWear',
      options
    )
  );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('✓ Notificación clickeada:', event);
  event.notification.close();

  const data = event.notification.data;
  const urlToOpen = data.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Buscar si ya existe una ventana abierta
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Si no existe, abrir nueva ventana
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Manejar cerrar notificaciones
self.addEventListener('notificationclose', (event) => {
  console.log('✓ Notificación cerrada');
});

// Sincronización en background
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync:', event.tag);

  if (event.tag === 'sync-orders') {
    event.waitUntil(
      fetch('/api/sync-orders')
        .then(() => console.log('✓ Órdenes sincronizadas'))
        .catch((err) => console.error('❌ Error sincronizando:', err))
    );
  }
});

// Mantener el service worker vivo
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'NOTIFICATION') {
    self.registration.showNotification(
      event.data.title,
      event.data.options
    );
  }
});

console.log('✓ Service Worker listo');
