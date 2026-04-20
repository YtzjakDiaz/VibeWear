/**
 * FUNCIONES DE PRUEBA PARA NOTIFICACIONES PUSH
 * Ejecutar en la Console (F12) para testear
 */

/**
 * TEST 1: Verificar soporte de notificaciones
 */
function testNotificationSupport() {
  console.log('=== VERIFICANDO SOPORTE ===');
  
  const checks = {
    'Service Workers': 'serviceWorker' in navigator,
    'Notifications API': 'Notification' in window,
    'Push Manager': 'PushManager' in window,
    'HTTPS/Localhost': window.location.protocol === 'https:' || window.location.hostname === 'localhost'
  };
  
  for (const [feature, supported] of Object.entries(checks)) {
    console.log(`${supported ? '✅' : '❌'} ${feature}: ${supported}`);
  }
  
  return Object.values(checks).every(v => v);
}

/**
 * TEST 2: Verificar permisos actuales
 */
function testNotificationPermission() {
  console.log('=== PERMISOS DE NOTIFICACIÓN ===');
  console.log('Estado:', Notification.permission);
  
  const status = {
    'granted': '✅ Permitidas - Puedes activar push',
    'denied': '❌ Denegadas - Debes permitir en configuración',
    'default': '⚠️ Pendiente - Se solicitará permiso'
  };
  
  console.log(status[Notification.permission] || 'Estado desconocido');
  
  return Notification.permission;
}

/**
 * TEST 3: Verificar Service Worker
 */
async function testServiceWorker() {
  console.log('=== VERIFICANDO SERVICE WORKER ===');
  
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    console.log(`✓ Registraciones: ${registrations.length}`);
    
    registrations.forEach((reg, i) => {
      console.log(`  ${i + 1}. Scope: ${reg.scope}`);
      console.log(`     Active: ${reg.active ? '✅' : '❌'}`);
      console.log(`     Installing: ${reg.installing ? '⏳' : '❌'}`);
    });
    
    return registrations.length > 0;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * TEST 4: Verificar suscripción a push
 */
async function testPushSubscription() {
  console.log('=== VERIFICANDO SUSCRIPCIÓN PUSH ===');
  
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      console.log('✅ Ya estás suscrito');
      console.log('Endpoint:', subscription.endpoint.substring(0, 50) + '...');
      return true;
    } else {
      console.log('⚠️ No hay suscripción activa');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * TEST 5: Solicitar permiso manualmente
 */
async function testRequestPermission() {
  console.log('=== SOLICITANDO PERMISO ===');
  
  if (Notification.permission === 'granted') {
    console.log('✅ Ya tienes permiso');
    return true;
  }
  
  if (Notification.permission === 'denied') {
    console.error('❌ Notificaciones denegadas. Debes permitirlas en la configuración del navegador.');
    console.log('Pasos:');
    console.log('1. Chrome: ⋮ > Configuración > Privacidad > Configuración de sitios > Notificaciones');
    console.log('2. Firefox: Preferencias > Privacidad > Permisos > Notificaciones > Permitir');
    return false;
  }
  
  try {
    const permission = await Notification.requestPermission();
    console.log('Resultado:', permission);
    return permission === 'granted';
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * TEST 6: Enviar notificación de prueba
 */
async function testLocalNotification() {
  console.log('=== ENVIANDO NOTIFICACIÓN LOCAL ===');
  
  try {
    if (Notification.permission !== 'granted') {
      console.warn('⚠️ Permiso no otorgado');
      return false;
    }
    
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification('🔔 Notificación de Prueba', {
      body: 'Si ves esto, todo funciona correctamente',
      icon: 'images/logo.png',
      badge: 'images/VIBEWEAR-1.png',
      tag: 'test-notification'
    });
    
    console.log('✅ Notificación enviada');
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * TEST 7: Ejecutar prueba completa
 */
async function testNotificationsFull() {
  console.clear();
  console.log('🧪 PRUEBA COMPLETA DE NOTIFICACIONES PUSH\n');
  
  const results = {
    'Soporte': testNotificationSupport(),
    'Permiso': testNotificationPermission(),
    'Service Worker': await testServiceWorker(),
    'Suscripción': await testPushSubscription()
  };
  
  console.log('\n=== RESUMEN ===');
  for (const [test, result] of Object.entries(results)) {
    console.log(`${result ? '✅' : '⚠️'} ${test}`);
  }
  
  const allPassed = Object.values(results).every(r => r);
  if (allPassed) {
    console.log('\n✅ TODO FUNCIONA CORRECTAMENTE');
  } else {
    console.log('\n⚠️ ALGUNOS TESTS FALLARON - Ver arriba para detalles');
  }
}

/**
 * TEST 8: Solucionar problemas
 */
function troubleshootNotifications() {
  console.clear();
  console.log('🔧 GUÍA DE SOLUCIÓN DE PROBLEMAS\n');
  
  // Check 1: Soporte
  if (!('serviceWorker' in navigator)) {
    console.error('❌ Tu navegador no soporta Service Workers');
    console.log('Solución: Actualiza a Chrome 40+, Firefox 44+, o Edge 17+\n');
    return;
  }
  
  // Check 2: Protocolo
  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
    console.error('❌ Las notificaciones requieren HTTPS');
    console.log('Solución: Deploy en HTTPS o usa localhost para desarrollo\n');
    return;
  }
  
  // Check 3: Permiso
  if (Notification.permission === 'denied') {
    console.error('❌ Notificaciones denegadas por el usuario');
    console.log('Solución:');
    console.log('1. Chrome: ⋮ > Configuración > Privacidad > Sitios > Notificaciones');
    console.log('2. Firefox: Preferencias > Privacidad > Permisos > Notificaciones');
    console.log('3. Busca "vibewear" y cambia a "Permitir"');
    console.log('4. Recarga la página\n');
    return;
  }
  
  // Check 4: SW no registrado
  navigator.serviceWorker.getRegistrations().then(regs => {
    if (regs.length === 0) {
      console.error('❌ Service Worker no está registrado');
      console.log('Solución: Ejecuta en la Console:');
      console.log('navigator.serviceWorker.register("sw.js")\n');
      return;
    }
    
    console.log('✅ Todo parece estar configurado correctamente');
    console.log('Intenta hacer click en el toggle de notificaciones nuevamente');
  });
}

/**
 * EXPORTAR FUNCIONES
 */
window.testNotifications = {
  support: testNotificationSupport,
  permission: testNotificationPermission,
  serviceWorker: testServiceWorker,
  subscription: testPushSubscription,
  requestPermission: testRequestPermission,
  localNotification: testLocalNotification,
  full: testNotificationsFull,
  troubleshoot: troubleshootNotifications
};

console.log('✓ Funciones de test cargadas');
console.log('Uso: window.testNotifications.full() para prueba completa');
console.log('     window.testNotifications.troubleshoot() para solucionar problemas');
