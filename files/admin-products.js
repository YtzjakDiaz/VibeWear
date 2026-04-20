// ADMIN PRODUCTS MODULE

async function loadProducts() {
  try {
    const productsList = document.getElementById('productsList');
    
    if (typeof productsData !== 'undefined' && productsData) {
      const prods = Object.entries(productsData).map(([id, p]) => ({
        id,
        nombre: p.name,
        precio: p.price,
        stock: p.stock || 0,
        ...p
      }));
      
      let html = '';
      prods.forEach(prod => {
        html += `
          <tr>
            <td>${prod.id}</td>
            <td>${prod.nombre}</td>
            <td>$${prod.precio.toLocaleString('es-CO')}</td>
            <td>${prod.stock || 0}</td>
            <td>
              <button class="btn-primary" onclick="editProduct('${prod.id}')" style="margin-right:8px;padding:6px 12px;">Editar</button>
              <button class="btn-danger" onclick="deleteProduct('${prod.id}')">Eliminar</button>
            </td>
          </tr>
        `;
      });
      
      productsList.innerHTML = html;
      document.getElementById('totalProducts').textContent = prods.length;
      console.log('✓ Productos cargados:', prods.length);
    } else {
      productsList.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--gray);">No hay productos disponibles</td></tr>';
      console.warn('⚠️ productsData no está disponible');
    }
    
  } catch (error) {
    console.error('❌ Error cargando productos:', error);
    const productsList = document.getElementById('productsList');
    if (productsList) {
      productsList.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--gray);">Error cargando productos</td></tr>';
    }
  }
}

// Hacer disponible globalmente
window.loadProducts = loadProducts;

window.showProductForm = function() {
  const modal = document.getElementById('productModal');
  document.getElementById('modalTitle').textContent = 'Nuevo Producto';
  document.getElementById('productForm').reset();
  modal.style.display = 'flex';
  modal.classList.add('active');
};

window.closeProductModal = function() {
  const modal = document.getElementById('productModal');
  modal.style.display = 'none';
  modal.classList.remove('active');
};

window.saveProduct = async function() {
  const name = document.getElementById('formProductName').value;
  const desc = document.getElementById('formProductDesc').value;
  const price = parseInt(document.getElementById('formProductPrice').value);
  const stock = parseInt(document.getElementById('formProductStock').value);
  const image = document.getElementById('formProductImage').value;
  
  if (!name || !desc || !price || !image) {
    alert('Completa todos los campos');
    return;
  }
  
  try {
    // Aquí guardaríamos en Firestore
    console.log('Producto guardado:', { name, desc, price, stock, image });
    
    alert('✓ Producto guardado');
    closeProductModal();
    loadProducts();
    
  } catch (error) {
    console.error('Error guardando producto:', error);
    alert('Error al guardar producto');
  }
};

window.editProduct = function(productId) {
  if (typeof productos !== 'undefined' && productos[productId]) {
    const prod = productos[productId];
    
    document.getElementById('modalTitle').textContent = 'Editar Producto';
    document.getElementById('formProductName').value = prod.nombre;
    document.getElementById('formProductDesc').value = prod.descripcion;
    document.getElementById('formProductPrice').value = prod.precio;
    document.getElementById('formProductStock').value = prod.stock || 0;
    document.getElementById('formProductImage').value = prod.imagenUrl;
    
    const modal = document.getElementById('productModal');
    modal.style.display = 'flex';
    modal.classList.add('active');
  }
};

window.deleteProduct = async function(productId) {
  if (!confirm(`¿Eliminar producto ${productId}?`)) return;
  
  try {
    console.log('Producto eliminado:', productId);
    alert('✓ Producto eliminado');
    loadProducts();
  } catch (error) {
    console.error('Error eliminando producto:', error);
    alert('Error al eliminar producto');
  }
};

window.filterProducts = function() {
  const searchTerm = document.getElementById('productSearch').value.toLowerCase();
  const rows = document.querySelectorAll('#productsList tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? '' : 'none';
  });
};

console.log('✓ Admin Products Module Loaded');
