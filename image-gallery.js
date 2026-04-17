// ============= ZOOM Y GALERÍA DE IMÁGENES =============
// Sistema de zoom elegante con navegación de thumbnails y vista previa completa

class ImageGallery {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.images = [];
    this.currentIndex = 0;
    this.zoomLevel = 1;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.translateX = 0;
    this.translateY = 0;
  }

  // Inicializar galería
  init(imageUrls, mainImageId = 'mainImg', thumbsContainerId = 'thumbsContainer') {
    this.images = imageUrls || [];
    this.currentIndex = 0;

    this.mainImg = document.getElementById(mainImageId);
    this.thumbsContainer = document.getElementById(thumbsContainerId);

    if (!this.mainImg || !this.thumbsContainer || this.images.length === 0) {
      console.warn('⚠ Galería: falta configuración');
      return;
    }

    this.renderThumbnails();
    this.setupMainImageListeners();
    this.setMainImage(0);
  }

  // Renderizar thumbnails
  renderThumbnails() {
    this.thumbsContainer.innerHTML = '';

    this.images.forEach((img, index) => {
      const thumb = document.createElement('div');
      thumb.className = 'product-thumb';
      if (index === 0) thumb.classList.add('active');
      thumb.style.cssText = `
        position: relative;
        width: 80px;
        height: 80px;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
        border: 2px solid ${index === 0 ? 'var(--pink)' : 'rgba(224,162,201,0.2)'};
        transition: all 0.3s;
      `;

      const thumbImg = document.createElement('img');
      thumbImg.src = img;
      thumbImg.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s;
      `;

      thumb.appendChild(thumbImg);

      thumb.addEventListener('click', () => this.setMainImage(index));
      thumb.addEventListener('mouseenter', () => {
        thumbImg.style.transform = 'scale(1.1)';
      });
      thumb.addEventListener('mouseleave', () => {
        thumbImg.style.transform = 'scale(1)';
      });

      this.thumbsContainer.appendChild(thumb);
    });
  }

  // Establecer imagen principal
  setMainImage(index) {
    if (index < 0 || index >= this.images.length) return;

    this.currentIndex = index;
    this.zoomLevel = 1;
    this.translateX = 0;
    this.translateY = 0;

    this.mainImg.src = this.images[index];
    this.mainImg.style.transform = 'scale(1) translate(0, 0)';

    // Actualizar thumbnails
    const thumbs = this.thumbsContainer.querySelectorAll('.product-thumb');
    thumbs.forEach((thumb, i) => {
      if (i === index) {
        thumb.style.borderColor = 'var(--pink)';
        thumb.classList.add('active');
      } else {
        thumb.style.borderColor = 'rgba(224,162,201,0.2)';
        thumb.classList.remove('active');
      }
    });
  }

  // Configurar listeners de zoom
  setupMainImageListeners() {
    const container = this.mainImg.parentElement;

    // Wheel zoom
    container.addEventListener('wheel', (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();

      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      this.zoom(delta);
    });

    // Touch pinch zoom
    let lastDistance = 0;
    container.addEventListener('touchmove', (e) => {
      if (e.touches.length !== 2) return;

      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (lastDistance > 0) {
        const delta = (distance - lastDistance) / 1000;
        this.zoom(delta);
      }

      lastDistance = distance;
    }, false);

    container.addEventListener('touchend', () => {
      lastDistance = 0;
    });

    // Drag pan (cuando hay zoom)
    this.mainImg.addEventListener('mousedown', (e) => {
      if (this.zoomLevel <= 1) return;
      this.isDragging = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;

      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;

      this.translateX = Math.max(-100, Math.min(100, this.translateX + dx / 2));
      this.translateY = Math.max(-100, Math.min(100, this.translateY + dy / 2));

      this.updateTransform();

      this.startX = e.clientX;
      this.startY = e.clientY;
    });

    document.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Click para abrir modal fullscreen
    container.addEventListener('dblclick', () => this.openFullscreen());
  }

  // Zoom
  zoom(delta) {
    const newZoom = Math.max(1, Math.min(3, this.zoomLevel + delta));
    this.zoomLevel = newZoom;
    this.updateTransform();
  }

  // Actualizar transform
  updateTransform() {
    this.mainImg.style.transform = 
      `scale(${this.zoomLevel}) translate(${this.translateX}px, ${this.translateY}px)`;
  }

  // Abrir modal fullscreen
  openFullscreen() {
    const modal = document.createElement('div');
    modal.className = 'image-gallery-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 5000;
      animation: fadeIn 0.3s ease;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      position: relative;
      width: 90%;
      height: 90%;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const img = document.createElement('img');
    img.src = this.images[this.currentIndex];
    img.style.cssText = `
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      cursor: grab;
    `;

    // Controles
    const controls = document.createElement('div');
    controls.style.cssText = `
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 15px;
      z-index: 5001;
    `;

    const prevBtn = this.createControlButton('←', () => {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        img.src = this.images[this.currentIndex];
        this.updateModalNav();
      }
    });

    const counter = document.createElement('span');
    counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    counter.style.cssText = `
      color: var(--white);
      font-family: var(--font-sub);
      font-size: 12px;
      letter-spacing: 1px;
      min-width: 60px;
      text-align: center;
      display: flex;
      align-items: center;
    `;

    const nextBtn = this.createControlButton('→', () => {
      if (this.currentIndex < this.images.length - 1) {
        this.currentIndex++;
        img.src = this.images[this.currentIndex];
        this.updateModalNav();
      }
    });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(224, 162, 201, 0.2);
      color: var(--white);
      border: 1px solid rgba(224, 162, 201, 0.3);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 5002;
    `;

    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = 'var(--pink)';
      closeBtn.style.color = 'var(--black)';
    });

    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'rgba(224, 162, 201, 0.2)';
      closeBtn.style.color = 'var(--white)';
    });

    closeBtn.addEventListener('click', () => document.body.removeChild(modal));

    controls.appendChild(prevBtn);
    controls.appendChild(counter);
    controls.appendChild(nextBtn);

    content.appendChild(img);
    content.appendChild(controls);
    content.appendChild(closeBtn);
    modal.appendChild(content);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    document.body.appendChild(modal);

    // Keyboard navigation
    const handleKeyboard = (e) => {
      if (e.key === 'ArrowLeft' && this.currentIndex > 0) {
        this.currentIndex--;
        img.src = this.images[this.currentIndex];
        this.updateModalNav();
      } else if (e.key === 'ArrowRight' && this.currentIndex < this.images.length - 1) {
        this.currentIndex++;
        img.src = this.images[this.currentIndex];
        this.updateModalNav();
      } else if (e.key === 'Escape') {
        document.removeEventListener('keydown', handleKeyboard);
        document.body.removeChild(modal);
      }
    };

    document.addEventListener('keydown', handleKeyboard);

    this.updateModalNav = () => {
      counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    };
  }

  // Crear botones de control
  createControlButton(text, onClick) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.cssText = `
      background: rgba(224, 162, 201, 0.2);
      color: var(--white);
      border: 1px solid rgba(224, 162, 201, 0.3);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    `;

    btn.addEventListener('mouseenter', () => {
      btn.style.background = 'var(--pink)';
      btn.style.color = 'var(--black)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'rgba(224, 162, 201, 0.2)';
      btn.style.color = 'var(--white)';
    });

    btn.addEventListener('click', onClick);

    return btn;
  }

  // Resetear zoom
  resetZoom() {
    this.zoomLevel = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.updateTransform();
  }
}
