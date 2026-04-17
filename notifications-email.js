// ============= EMAIL NOTIFICATIONS MODULE =============
// Sistema de notificaciones por email para órdenes

/**
 * Enviar email de confirmación de orden
 * @param {Object} orderData - Datos de la orden
 * @returns {Promise<boolean>} - Si se envió exitosamente
 */
export async function sendOrderConfirmationEmail(orderData) {
  try {
    const emailContent = {
      to: orderData.email,
      subject: `Confirmación de Orden #${orderData.id} - VibeWear`,
      template: 'order-confirmation',
      data: {
        customerName: orderData.name,
        orderId: orderData.id,
        trackingCode: orderData.tracking,
        items: orderData.items,
        total: orderData.total,
        date: new Date(orderData.timestamp).toLocaleDateString('es-CO'),
        estimatedDelivery: getEstimatedDeliveryDate()
      }
    };

    // En desarrollo, simulamos el envío
    console.log('📧 Email de confirmación (simulado):', emailContent);
    
    // Guardar en localStorage para propósitos de demostración
    const emailLog = JSON.parse(localStorage.getItem('vibewear-email-log')) || [];
    emailLog.push({
      ...emailContent,
      sentAt: new Date().toISOString(),
      status: 'sent'
    });
    localStorage.setItem('vibewear-email-log', JSON.stringify(emailLog));

    // En producción, aquí irían las llamadas a APIs como:
    // - Mailgun: https://api.mailgun.net/v3/your-domain/messages
    // - SendGrid: https://api.sendgrid.com/v3/mail/send
    // - Firebase Cloud Functions para manejar emails

    return true;
  } catch (error) {
    console.error('✗ Error preparando email de confirmación:', error);
    return false;
  }
}

/**
 * Enviar email de cambio de estado de envío
 * @param {string} email - Email del cliente
 * @param {string} orderId - ID de la orden
 * @param {string} status - Nuevo estado
 * @param {string} trackingCode - Código de rastreo
 */
export async function sendShippingStatusEmail(email, orderId, status, trackingCode) {
  try {
    const statusMessages = {
      'en-transito': '¡Tu orden está en camino! 📦',
      'entregado': '¡Tu orden ha sido entregada! 🎉',
      'cancelado': 'Tu orden ha sido cancelada',
      'devuelto': 'Tu devolución ha sido procesada'
    };

    const emailContent = {
      to: email,
      subject: `Actualización de tu Orden #${orderId} - VibeWear`,
      template: 'shipping-status',
      data: {
        orderId: orderId,
        status: status,
        statusMessage: statusMessages[status] || 'Actualización de estado',
        trackingCode: trackingCode,
        trackingUrl: `https://vibewear.com/track/${trackingCode}`
      }
    };

    console.log('📧 Email de estado de envío (simulado):', emailContent);

    const emailLog = JSON.parse(localStorage.getItem('vibewear-email-log')) || [];
    emailLog.push({
      ...emailContent,
      sentAt: new Date().toISOString(),
      status: 'sent'
    });
    localStorage.setItem('vibewear-email-log', JSON.stringify(emailLog));

    return true;
  } catch (error) {
    console.error('✗ Error preparando email de estado:', error);
    return false;
  }
}

/**
 * Enviar notificación de pago recibido
 * @param {Object} paymentData - Datos del pago
 */
export async function sendPaymentReceivedEmail(paymentData) {
  try {
    const emailContent = {
      to: paymentData.email,
      subject: `Pago Recibido - Orden #${paymentData.orderId}`,
      template: 'payment-received',
      data: {
        customerName: paymentData.name,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        paymentMethod: paymentData.method || 'Mercado Pago',
        date: new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      }
    };

    console.log('📧 Email de pago recibido (simulado):', emailContent);

    const emailLog = JSON.parse(localStorage.getItem('vibewear-email-log')) || [];
    emailLog.push({
      ...emailContent,
      sentAt: new Date().toISOString(),
      status: 'sent'
    });
    localStorage.setItem('vibewear-email-log', JSON.stringify(emailLog));

    return true;
  } catch (error) {
    console.error('✗ Error preparando email de pago:', error);
    return false;
  }
}

/**
 * Enviar email de solicitud de reseña
 * @param {string} email - Email del cliente
 * @param {string} orderId - ID de la orden
 * @param {string} productName - Nombre del producto
 */
export async function sendReviewRequestEmail(email, orderId, productName) {
  try {
    const emailContent = {
      to: email,
      subject: `¿Qué te pareció tu ${productName}? - VibeWear`,
      template: 'review-request',
      data: {
        orderId: orderId,
        productName: productName,
        reviewUrl: `https://vibewear.com/review/${orderId}`
      }
    };

    console.log('📧 Email de solicitud de reseña (simulado):', emailContent);

    return true;
  } catch (error) {
    console.error('✗ Error preparando email de reseña:', error);
    return false;
  }
}

/**
 * Validar formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - Es un email válido
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validar teléfono
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} - Es un teléfono válido
 */
export function validatePhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  const digitsOnly = phone.replace(/\D/g, '');
  return phoneRegex.test(phone) && digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

/**
 * Validar código postal
 * @param {string} zipCode - Código postal a validar
 * @returns {boolean} - Es un código postal válido
 */
export function validateZipCode(zipCode) {
  return zipCode.trim().length >= 3 && zipCode.trim().length <= 10;
}

/**
 * Calcular fecha estimada de entrega
 * @returns {string} - Fecha estimada formateada
 */
function getEstimatedDeliveryDate() {
  const delivery = new Date();
  // Agregar 3-5 días hábiles (estimado)
  delivery.setDate(delivery.getDate() + 5);
  
  // Si cae en fin de semana, mover al lunes
  while (delivery.getDay() === 0 || delivery.getDay() === 6) {
    delivery.setDate(delivery.getDate() + 1);
  }
  
  return delivery.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Obtener log de emails enviados (para debugging)
 * @returns {Array} - Array de emails enviados
 */
export function getEmailLog() {
  return JSON.parse(localStorage.getItem('vibewear-email-log')) || [];
}

/**
 * Limpiar log de emails (para desarrollo)
 */
export function clearEmailLog() {
  localStorage.removeItem('vibewear-email-log');
  console.log('Email log limpiado');
}

console.log('✓ Email Notifications Module cargado');
