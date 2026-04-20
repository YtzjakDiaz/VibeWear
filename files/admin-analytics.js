// ADMIN ANALYTICS MODULE

async function loadAnalytics() {
  try {
    // Obtener órdenes de Firestore
    if (!window.db || !window.collection || !window.getDocs) {
      console.warn('Firestore aún no está listo para analytics');
      loadAnalyticsUI({});
      return;
    }
    
    const ordersRef = window.collection(window.db, 'vibewear_orders');
    const querySnapshot = await window.getDocs(ordersRef);
    
    let analytics = {
      topProducts: {},
      totalRevenue: 0,
      totalOrders: 0,
      monthlyRevenue: 0,
      avgTicket: 0
    };
    
    querySnapshot.forEach(doc => {
      const order = doc.data();
      analytics.totalOrders++;
      analytics.totalRevenue += order.total || 0;
      
      // Contar productos
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (!analytics.topProducts[item.name]) {
            analytics.topProducts[item.name] = 0;
          }
          analytics.topProducts[item.name] += item.qty || 1;
        });
      }
      
      // Contar ingresos del mes
      const orderDate = order.fecha?.toDate?.() || new Date(order.fecha);
      const today = new Date();
      if (orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear()) {
        analytics.monthlyRevenue += order.total || 0;
      }
    });
    
    analytics.avgTicket = analytics.totalOrders > 0 ? analytics.totalRevenue / analytics.totalOrders : 0;
    
    loadAnalyticsUI(analytics);
    
  } catch (error) {
    console.error('Error cargando analytics:', error);
    loadAnalyticsUI({});
  }
}

function loadAnalyticsUI(analytics) {
  // Top Product
  let topProductName = '-';
  let topProductCount = 0;
  
  if (analytics.topProducts && Object.keys(analytics.topProducts).length > 0) {
    Object.entries(analytics.topProducts).forEach(([name, count]) => {
      if (count > topProductCount) {
        topProductName = name;
        topProductCount = count;
      }
    });
  }
  
  const topProductDiv = document.getElementById('topProduct');
  if (topProductDiv) {
    topProductDiv.textContent = topProductName + ` (${topProductCount} vendidos)`;
  }
  
  // Monthly Revenue
  const monthlyRevenueDiv = document.getElementById('monthlyRevenue');
  if (monthlyRevenueDiv) {
    monthlyRevenueDiv.textContent = '$' + (analytics.monthlyRevenue || 0).toLocaleString('es-CO');
  }
  
  // Average Ticket
  const avgTicketDiv = document.getElementById('avgTicket');
  if (avgTicketDiv) {
    avgTicketDiv.textContent = '$' + Math.round(analytics.avgTicket || 0).toLocaleString('es-CO');
  }
  
  // Top 5 Products
  const topProductsDiv = document.getElementById('topProducts');
  if (topProductsDiv) {
    if (analytics.topProducts && Object.keys(analytics.topProducts).length > 0) {
      const topList = Object.entries(analytics.topProducts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      
      let html = '<ol style="margin:0;padding-left:20px;">';
      topList.forEach(([name, count]) => {
        const percentage = ((count / Object.values(analytics.topProducts).reduce((a, b) => a + b, 0)) * 100).toFixed(1);
        html += `
          <li style="margin-bottom:12px;">
            <p style="margin:0;font-weight:600;color:var(--white);">${name}</p>
            <div style="display:flex;align-items:center;gap:10px;margin-top:4px;">
              <div style="flex:1;height:6px;background:rgba(224,162,201,0.2);border-radius:3px;overflow:hidden;">
                <div style="height:100%;width:${percentage}%;background:var(--pink);"></div>
              </div>
              <span style="font-size:12px;color:var(--pink);font-weight:bold;min-width:40px;">${count}</span>
            </div>
          </li>
        `;
      });
      html += '</ol>';
      topProductsDiv.innerHTML = html;
    } else {
      topProductsDiv.innerHTML = '<p style="color:var(--gray);">No hay datos de ventas</p>';
    }
  }
  
  // Update dashboard totals
  const totalRevenueDiv = document.getElementById('totalRevenue');
  if (totalRevenueDiv) {
    totalRevenueDiv.textContent = '$' + (analytics.totalRevenue || 0).toLocaleString('es-CO');
  }
  
  const totalOrdersDiv = document.getElementById('totalOrders');
  if (totalOrdersDiv) {
    totalOrdersDiv.textContent = (analytics.totalOrders || 0);
  }
}

// Hacer disponible globalmente
window.loadAnalytics = loadAnalytics;

console.log('✓ Admin Analytics Module Loaded');
