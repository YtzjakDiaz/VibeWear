// ============= FIREBASE ORDERS MODULE =============
// Este módulo maneja el guardado y recuperación de órdenes en Firestore

import { db } from './firebase-config.js';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js';

const ORDERS_COLLECTION = 'orders';

/**
 * Guardar una nueva orden en Firestore
 * @param {Object} orderData - Datos de la orden
 * @returns {Promise<string>} - ID de la orden creada
 */
export async function saveOrderToFirestore(orderData) {
  try {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...orderData,
      createdAt: serverTimestamp(),
      status: 'Pendiente de confirmación',
      paymentStatus: 'pending'
    });
    console.log('✓ Orden guardada en Firestore:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('✗ Error guardando orden en Firestore:', error);
    throw error;
  }
}

/**
 * Obtener órdenes de un cliente por email
 * @param {string} email - Email del cliente
 * @returns {Promise<Array>} - Array de órdenes
 */
export async function getOrdersByEmail(email) {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), where('email', '==', email));
    const snapshot = await getDocs(q);
    const orders = [];
    snapshot.forEach(doc => {
      orders.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date()
      });
    });
    return orders;
  } catch (error) {
    console.error('✗ Error obteniendo órdenes:', error);
    return [];
  }
}

/**
 * Obtener una orden específica por ID
 * @param {string} orderId - ID de la orden
 * @returns {Promise<Object|null>} - Datos de la orden
 */
export async function getOrderById(orderId) {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), where('orderId', '==', orderId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('Orden no encontrada');
      return null;
    }
    
    let orderData = null;
    snapshot.forEach(doc => {
      orderData = {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date()
      };
    });
    return orderData;
  } catch (error) {
    console.error('✗ Error obteniendo orden:', error);
    return null;
  }
}

/**
 * Actualizar estado de una orden
 * @param {string} firestoreDocId - ID del documento en Firestore (no orderId)
 * @param {Object} updateData - Datos a actualizar
 */
export async function updateOrderStatus(firestoreDocId, updateData) {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, firestoreDocId);
    await updateDoc(orderRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    console.log('✓ Orden actualizada');
  } catch (error) {
    console.error('✗ Error actualizando orden:', error);
    throw error;
  }
}

/**
 * Eliminar una orden (solo para desarrollo/testing)
 * @param {string} firestoreDocId - ID del documento en Firestore
 */
export async function deleteOrder(firestoreDocId) {
  try {
    // Nota: En producción, no deberías permitir eliminar órdenes
    // En su lugar, marcarlas como canceladas
    console.warn('Función de eliminación deshabilitada en producción');
  } catch (error) {
    console.error('✗ Error:', error);
  }
}

/**
 * Obtener todas las órdenes (solo admin)
 * @returns {Promise<Array>} - Todas las órdenes
 */
export async function getAllOrders() {
  try {
    const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));
    const orders = [];
    snapshot.forEach(doc => {
      orders.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date()
      });
    });
    return orders.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('✗ Error obteniendo órdenes:', error);
    return [];
  }
}

console.log('✓ Firebase Orders Module cargado');
