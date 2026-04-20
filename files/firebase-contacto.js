// ============= GESTIÓN DE MENSAJES DE CONTACTO CON FIREBASE =============
import { db } from "./firebase-config.js";
import { collection, addDoc, query, orderBy, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// Guardar mensaje de contacto en Firestore
async function saveContactMessage(nombre, email, asunto, mensaje) {
  try {
    await addDoc(collection(db, "mensajes_contacto"), {
      nombre: nombre,
      email: email,
      asunto: asunto,
      mensaje: mensaje,
      fecha: new Date(),
      leido: false
    });
    console.log('Mensaje guardado en Firebase');
    return true;
  } catch (error) {
    console.error('Error al guardar mensaje:', error);
    return false;
  }
}

// Obtener todos los mensajes (para panel de administrador)
async function getContactMessages() {
  try {
    const q = query(
      collection(db, "mensajes_contacto"),
      orderBy("fecha", "desc")
    );
    
    const snapshot = await getDocs(q);
    const mensajes = [];
    
    snapshot.forEach(doc => {
      mensajes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return mensajes;
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    return [];
  }
}

// Marcar mensaje como leído
async function markMessageAsRead(messageId) {
  try {
    await updateDoc(doc(db, "mensajes_contacto", messageId), {
      leido: true
    });
  } catch (error) {
    console.error('Error al actualizar mensaje:', error);
  }
}

export { saveContactMessage, getContactMessages, markMessageAsRead };
