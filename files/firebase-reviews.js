// ============= GESTIÓN DE RESEÑAS CON FIREBASE =============
import { db } from "./firebase-config.js";
import { collection, addDoc, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// Guardar una reseña en Firestore
async function saveReviewToFirebase(prodId, rating, comment, userName) {
  try {
    await addDoc(collection(db, "resenas"), {
      productoId: prodId,
      calificacion: rating,
      comentario: comment,
      usuario: userName || 'Usuario Anónimo',
      fecha: new Date(),
      verificado: true
    });
    console.log('Reseña guardada en Firebase');
    return true;
  } catch (error) {
    console.error('Error al guardar reseña:', error);
    return false;
  }
}

// Obtener reseñas de un producto desde Firebase
async function getProductReviews(prodId) {
  try {
    const q = query(
      collection(db, "resenas"),
      where("productoId", "==", prodId)
    );
    
    const snapshot = await getDocs(q);
    const reviews = [];
    
    snapshot.forEach(doc => {
      reviews.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Ordenar por fecha en el cliente en lugar del servidor
    reviews.sort((a, b) => {
      const dateA = a.fecha && a.fecha.toDate ? a.fecha.toDate() : new Date(a.fecha);
      const dateB = b.fecha && b.fecha.toDate ? b.fecha.toDate() : new Date(b.fecha);
      return dateB - dateA; // Descendente
    });
    
    return reviews;
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    return [];
  }
}

// Mostrar reseñas en el DOM
async function displayReviews(prodId, containerSelector) {
  const reviews = await getProductReviews(prodId);
  const container = document.querySelector(containerSelector);
  
  if (!container) return;
  
  if (reviews.length === 0) {
    container.innerHTML = '<p style="color: #999;">No hay reseñas aún</p>';
    return;
  }
  
  container.innerHTML = reviews.map(review => `
    <div style="border-bottom: 1px solid #eee; padding: 15px 0; margin: 10px 0;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <strong>${review.usuario}</strong>
        <span style="color: #ffc107;">${'★'.repeat(review.calificacion)}${'☆'.repeat(5-review.calificacion)}</span>
      </div>
      <p style="margin: 8px 0; color: #666;">${review.comentario}</p>
      <small style="color: #999;">${review.fecha.toDate ? review.fecha.toDate().toLocaleDateString('es-CO') : 'Fecha'}</small>
    </div>
  `).join('');
}

export { saveReviewToFirebase, getProductReviews, displayReviews };
