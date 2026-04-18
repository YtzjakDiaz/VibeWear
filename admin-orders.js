// ADMIN ORDERS MODULE

async function loadOrders() {
  try {
    const ordenesContainer = document.getElementById('ordenesContainer');
    const recentOrdersDiv = document.getElementById('recentOrders');
    
    // Obtener órdenes de Firestore
    const ordersRef = window.db ? collection(window.db, 'vibewear_orders') : null;
    
    if (!ordersRef) {
      ordenesContainer.innerHTML = '<p style="color:var(--gray);text-align:center;padding:40px;">Sin datos disponibles</p>';
      recentOrdersDiv.innerHTML = '<p style="color:var(--gray);">No hay órdenes aún</p>';
      return;
    }
    
    const querySnapshot = await getDocs(ordersRef);
    
    if (querySnapshot.empty) {
      ordenesContainer.innerHTML = `
        <div style="background:rgba(224,162,201,0.05);border:1px solid rgba(224,162,201,0.2);border-radius:12px;padding:40px;text-align:center;">
          <p style="font-size:16px;color:var(--gray);">No hay órdenes registradas aún</p>
        </div>
      `;
      recentOrdersDiv.innerHTML = '<p style="color:var(--gray);">No hay órdenes</p>';
      return;
    }
    
    let orders = [];
    querySnapshot.forEach(doc => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Ordenar por fecha descendente
    orders.sort((a, b) => {
      const dateA = a.fecha?.toDate?.() || new Date(a.fecha) || new Date();
      const dateB = b.fecha?.toDate?.() || new Date(b.fecha) || new Date();
      return dateB - dateA;
    });
    
    // HTML para órdenes principales
    let html = '';
    orders.forEach(order => {
      const fecha = order.fecha?.toDate?.() || new Date(order.fecha);
      const fechaFormato = fecha.toLocaleDateString('es-CO');
      
      html += `
        <div style="background:rgba(224,162,201,0.05);border:1px solid rgba(224,162,201,0.2);border-radius:12px;padding:20px;margin-bottom:15px;">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px;">
            <div>
              <p style="margin:0;font-weight:bold;color:var(--pink);font-size:14px;">Orden #${order.id.substring(0, 8)}</p>
              <p style="margin:5px 0 0;font-size:12px;color:var(--gray);">${fechaFormato}</p>
            </div>
            <span style="background:var(--pink);color:var(--black);padding:6px 12px;border-radius:20px;font-size:11px;font-weight:bold;text-transform:uppercase;">$${(order.total || 0).toLocaleString('es-CO')}</span>
          </div>
          <p style="margin:8px 0;font-size:13px;color:var(--white);">Cliente: <strong>${order.cliente || 'No especificado'}</strong></p>
          <p style="margin:0;font-size:12px;color:var(--gray);">Items: ${order.items?.length || 0}</p>
        </div>
      `;
    });
    
    ordenesContainer.innerHTML = html;
    
    // Mostrar últimas 3 órdenes en dashboard
    let recentHtml = '';
    orders.slice(0, 3).forEach(order => {
      const fecha = order.fecha?.toDate?.() || new Date(order.fecha);
      const fechaFormato = fecha.toLocaleDateString('es-CO');
      
      recentHtml += `
        <div style="background:rgba(224,162,201,0.05);border:1px solid rgba(224,162,201,0.2);border-radius:8px;padding:12px;margin-bottom:10px;display:flex;justify-content:space-between;">
          <div>
            <p style="margin:0;font-weight:bold;font-size:13px;">Orden #${order.id.substring(0, 8)}</p>
            <p style="margin:4px 0 0;font-size:11px;color:var(--gray);">${order.cliente || 'Cliente'}</p>
          </div>
          <span style="color:var(--pink);font-weight:bold;">$${(order.total || 0).toLocaleString('es-CO')}</span>
        </div>
      `;
    });
    
    if (recentHtml) {
      recentOrdersDiv.innerHTML = recentHtml;
    }
    
  } catch (error) {
    console.error('Error cargando órdenes:', error);
    document.getElementById('ordenesContainer').innerHTML = '<p style="color:var(--gray);text-align:center;padding:40px;">Error al cargar órdenes</p>';
  }
}

console.log('✓ Admin Orders Module Loaded');
