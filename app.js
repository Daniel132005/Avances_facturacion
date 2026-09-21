/**
 * DevLog - Lógica de la Bitácora de Avances
 */

const state = {
  posts: [],
  currentTag: 'all',
  searchQuery: '',
  viewMode: 'timeline',
  lightboxImages: [],
  currentLightboxIndex: 0
};

const FALLBACK_POSTS = [
  {
    "id": "dia-2",
    "date": "2026-09-21",
    "dayNumber": 2,
    "title": "Diseño del Dashboard y Sistema de Notificaciones",
    "category": "Frontend / UI",
    "tags": [
      "UI",
      "Dashboard",
      "CSS",
      "Frontend"
    ],
    "summary": "Implementación de los nuevos widgets analíticos, paneles interactivos y paleta de colores refinada.",
    "highlights": [
      "Componentes modulares de métricas en tiempo real",
      "Soporte dinámico para modo oscuro y claro",
      "Optimización responsiva para pantallas móviles y desktop"
    ],
    "screenshots": [
      {
        "url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        "caption": "Vista previa del Dashboard con gráficos interactivos y métricas"
      },
      {
        "url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        "caption": "Panel de resumen de actividad y widgets analíticos"
      }
    ],
    "author": "Daniel"
  },
  {
    "id": "dia-1",
    "date": "2026-09-20",
    "dayNumber": 1,
    "title": "Estructuración Inicial de la Arquitectura",
    "category": "Setup & Backend",
    "tags": [
      "Setup",
      "Backend",
      "Database"
    ],
    "summary": "Definición del modelo de datos, rutas de API principales y configuración del entorno de desarrollo.",
    "highlights": [
      "Configuración del repositorio y pipeline inicial",
      "Modelado de la base de datos y esquemas principales",
      "Pruebas de conectividad y endpoints base del servicio"
    ],
    "screenshots": [
      {
        "url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
        "caption": "Estructura de directorios y configuración base del proyecto"
      }
    ],
    "author": "Daniel"
  }
];

const postsContainer = document.getElementById('postsContainer');
const emptyState = document.getElementById('emptyState');
const tagsFilterContainer = document.getElementById('tagsFilterContainer');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const viewToggleBtn = document.getElementById('viewToggleBtn');
const viewToggleIcon = document.getElementById('viewToggleIcon');
const viewToggleText = document.getElementById('viewToggleText');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const postsCountBadge = document.getElementById('postsCountBadge');
const statDaysCount = document.getElementById('statDaysCount');
const statScreenshotsCount = document.getElementById('statScreenshotsCount');
const statTagsCount = document.getElementById('statTagsCount');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');

const lightboxModal = document.getElementById('lightboxModal');
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
const lightboxNextBtn = document.getElementById('lightboxNextBtn');

const newPostModal = document.getElementById('newPostModal');
const newPostOverlay = document.getElementById('newPostOverlay');
const openNewPostModalBtn = document.getElementById('openNewPostModalBtn');
const closeNewPostModalBtn = document.getElementById('closeNewPostModalBtn');
const newPostForm = document.getElementById('newPostForm');
const addScreenshotBtn = document.getElementById('addScreenshotBtn');
const screenshotsList = document.getElementById('screenshotsList');
const previewPostBtn = document.getElementById('previewPostBtn');
const downloadJsonBtn = document.getElementById('downloadJsonBtn');
const jsonOutputSection = document.getElementById('jsonOutputSection');
const jsonPreviewCode = document.getElementById('jsonPreviewCode');
const copyJsonBtn = document.getElementById('copyJsonBtn');
const toastNotification = document.getElementById('toastNotification');
const toastMessage = document.getElementById('toastMessage');

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadPosts();
  setupEventListeners();
  setDefaultFormValues();
});

async function loadPosts() {
  try {
    const res = await fetch('data/posts.json');
    if (!res.ok) throw new Error('No se pudo cargar posts.json');
    const data = await res.json();
    state.posts = Array.isArray(data) ? data : FALLBACK_POSTS;
  } catch (err) {
    console.warn('Cargando datos fallback locales:', err);
    state.posts = FALLBACK_POSTS;
  }

  const localDrafts = JSON.parse(localStorage.getItem('devlog_local_drafts') || '[]');
  if (localDrafts.length > 0) {
    state.posts = [...localDrafts, ...state.posts];
  }

  state.posts.sort((a, b) => (b.dayNumber || 0) - (a.dayNumber || 0));

  updateStats();
  renderTags();
  renderPosts();
}

function updateStats() {
  const totalDays = state.posts.length;
  let totalScreenshots = 0;
  const allTags = new Set();

  state.posts.forEach(post => {
    if (post.screenshots && Array.isArray(post.screenshots)) {
      totalScreenshots += post.screenshots.length;
    }
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => allTags.add(tag.trim()));
    }
  });

  postsCountBadge.textContent = totalDays + (totalDays === 1 ? ' avance registrado' : ' avances registrados');
  statDaysCount.textContent = totalDays;
  statScreenshotsCount.textContent = totalScreenshots;
  statTagsCount.textContent = allTags.size;
}

function renderTags() {
  const allTags = new Set();
  state.posts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => allTags.add(tag.trim()));
    }
  });

  tagsFilterContainer.innerHTML = '<button class="tag-btn ' + (state.currentTag === 'all' ? 'active' : '') + '" data-tag="all">Todos</button>';

  allTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'tag-btn ' + (state.currentTag === tag ? 'active' : '');
    btn.setAttribute('data-tag', tag);
    btn.textContent = '#' + tag;
    tagsFilterContainer.appendChild(btn);
  });
}

function renderPosts() {
  const filtered = state.posts.filter(post => {
    const matchesTag = state.currentTag === 'all' || (post.tags && post.tags.includes(state.currentTag));
    
    const query = state.searchQuery.toLowerCase().trim();
    if (!query) return matchesTag;

    const inTitle = (post.title || '').toLowerCase().includes(query);
    const inSummary = (post.summary || '').toLowerCase().includes(query);
    const inCategory = (post.category || '').toLowerCase().includes(query);
    const inHighlights = (post.highlights || []).some(h => h.toLowerCase().includes(query));

    return matchesTag && (inTitle || inSummary || inCategory || inHighlights);
  });

  if (filtered.length === 0) {
    postsContainer.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  postsContainer.className = state.viewMode === 'grid' ? 'grid-view' : 'timeline-view';

  postsContainer.innerHTML = filtered.map(post => {
    const highlightsHtml = post.highlights && post.highlights.length > 0 ? 
      '<div class="highlights-block"><div class="highlights-title"><i class="fa-solid fa-list-check"></i> Logros & Tareas del Día</div><ul class="highlights-list">' +
      post.highlights.map(item => '<li><i class="fa-solid fa-check"></i> <span>' + item + '</span></li>').join('') +
      '</ul></div>' : '';

    const screenshotsHtml = post.screenshots && post.screenshots.length > 0 ? 
      '<div class="gallery-block"><div class="gallery-grid">' +
      post.screenshots.map((ss, idx) => 
        '<div class="screenshot-card" data-post-id="' + post.id + '" data-ss-index="' + idx + '">' +
        '<img src="' + ss.url + '" alt="' + (ss.caption || 'Captura de pantalla') + '" loading="lazy" onerror="this.src=\'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80\'">' +
        '<div class="screenshot-overlay">' +
        '<div class="zoom-icon-badge"><i class="fa-solid fa-magnifying-glass-plus"></i></div>' +
        '<div class="screenshot-caption-text">' + (ss.caption || 'Ver captura completa') + '</div>' +
        '</div></div>'
      ).join('') +
      '</div></div>' : '';

    const tagsHtml = post.tags && post.tags.length > 0 ? 
      '<div class="post-tags">' +
      post.tags.map(t => '<span class="post-tag">#' + t + '</span>').join('') +
      '</div>' : '';

    return '<article class="timeline-item" id="post-' + post.id + '">' +
      '<div class="timeline-node"></div>' +
      '<div class="post-card">' +
        '<header class="post-header">' +
          '<div class="post-meta-left">' +
            '<span class="day-badge">DÍA ' + (post.dayNumber || 0) + '</span>' +
            '<span class="date-text"><i class="fa-regular fa-calendar"></i> ' + formatDate(post.date) + '</span>' +
            (post.category ? '<span class="post-category">' + post.category + '</span>' : '') +
          '</div>' +
        '</header>' +
        '<h2 class="post-title">' + post.title + '</h2>' +
        '<p class="post-summary">' + post.summary + '</p>' +
        highlightsHtml +
        screenshotsHtml +
        '<footer class="post-footer">' +
          tagsHtml +
          '<div class="post-author"><i class="fa-regular fa-user"></i> ' + (post.author || 'Daniel') + '</div>' +
        '</footer>' +
      '</div>' +
    '</article>';
  }).join('');

  attachScreenshotEvents();
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  return dateStr;
}

function attachScreenshotEvents() {
  document.querySelectorAll('.screenshot-card').forEach(card => {
    card.addEventListener('click', () => {
      const postId = card.getAttribute('data-post-id');
      const ssIndex = parseInt(card.getAttribute('data-ss-index'), 10);
      const post = state.posts.find(p => p.id === postId);
      if (post && post.screenshots && post.screenshots[ssIndex]) {
        openLightbox(post.screenshots, ssIndex);
      }
    });
  });
}

function openLightbox(screenshots, index) {
  state.lightboxImages = screenshots;
  state.currentLightboxIndex = index;
  updateLightboxImage();
  lightboxModal.classList.add('active');
  lightboxModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function updateLightboxImage() {
  const current = state.lightboxImages[state.currentLightboxIndex];
  if (!current) return;
  lightboxImg.src = current.url;
  lightboxCaption.textContent = current.caption || ('Captura ' + (state.currentLightboxIndex + 1) + ' de ' + state.lightboxImages.length);
  
  lightboxPrevBtn.style.display = state.lightboxImages.length > 1 ? 'flex' : 'none';
  lightboxNextBtn.style.display = state.lightboxImages.length > 1 ? 'flex' : 'none';
}

function closeLightbox() {
  lightboxModal.classList.remove('active');
  lightboxModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function nextLightbox() {
  if (state.lightboxImages.length <= 1) return;
  state.currentLightboxIndex = (state.currentLightboxIndex + 1) % state.lightboxImages.length;
  updateLightboxImage();
}

function prevLightbox() {
  if (state.lightboxImages.length <= 1) return;
  state.currentLightboxIndex = (state.currentLightboxIndex - 1 + state.lightboxImages.length) % state.lightboxImages.length;
  updateLightboxImage();
}

function setupEventListeners() {
  tagsFilterContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.tag-btn');
    if (!btn) return;
    state.currentTag = btn.getAttribute('data-tag');
    document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderPosts();
  });

  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
    renderPosts();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    state.searchQuery = '';
    clearSearchBtn.style.display = 'none';
    renderPosts();
  });

  resetFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    state.searchQuery = '';
    clearSearchBtn.style.display = 'none';
    state.currentTag = 'all';
    renderTags();
    renderPosts();
  });

  viewToggleBtn.addEventListener('click', () => {
    state.viewMode = state.viewMode === 'timeline' ? 'grid' : 'timeline';
    if (state.viewMode === 'grid') {
      viewToggleIcon.className = 'fa-solid fa-table-cells-large';
      viewToggleText.textContent = 'Cuadrícula';
    } else {
      viewToggleIcon.className = 'fa-solid fa-timeline';
      viewToggleText.textContent = 'Timeline';
    }
    renderPosts();
  });

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('devlog_theme', newTheme);
    updateThemeIcon(newTheme);
  });

  lightboxCloseBtn.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);
  lightboxNextBtn.addEventListener('click', nextLightbox);
  lightboxPrevBtn.addEventListener('click', prevLightbox);

  document.addEventListener('keydown', (e) => {
    if (lightboxModal.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    }
    if (newPostModal.classList.contains('active') && e.key === 'Escape') {
      closeNewPostModal();
    }
  });

  openNewPostModalBtn.addEventListener('click', openNewPostModal);
  closeNewPostModalBtn.addEventListener('click', closeNewPostModal);
  newPostOverlay.addEventListener('click', closeNewPostModal);

  addScreenshotBtn.addEventListener('click', () => addScreenshotInputRow());

  newPostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPost = buildPostObjectFromForm();
    const jsonStr = JSON.stringify(newPost, null, 2);
    jsonPreviewCode.querySelector('code').textContent = jsonStr;
    jsonOutputSection.style.display = 'block';
    
    navigator.clipboard.writeText(jsonStr).then(() => {
      showToast('¡JSON copiado al portapapeles!');
    }).catch(() => {
      showToast('JSON generado correctamente');
    });
  });

  copyJsonBtn.addEventListener('click', () => {
    const code = jsonPreviewCode.querySelector('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
      showToast('¡Copiado al portapapeles!');
    });
  });

  previewPostBtn.addEventListener('click', () => {
    const newPost = buildPostObjectFromForm();
    const localDrafts = JSON.parse(localStorage.getItem('devlog_local_drafts') || '[]');
    localDrafts.unshift(newPost);
    localStorage.setItem('devlog_local_drafts', JSON.stringify(localDrafts));
    
    state.posts.unshift(newPost);
    updateStats();
    renderTags();
    renderPosts();
    closeNewPostModal();
    showToast('Avance previsualizado y guardado localmente');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  });

  downloadJsonBtn.addEventListener('click', () => {
    const newPost = buildPostObjectFromForm();
    const fullPostsArray = [newPost, ...state.posts];
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullPostsArray, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "posts.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Descargando posts.json actualizado...');
  });
}

function setDefaultFormValues() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('postDate').value = today;
  
  const nextDayNum = state.posts.length > 0 
    ? Math.max(...state.posts.map(p => p.dayNumber || 0)) + 1 
    : 1;
  document.getElementById('postDayNumber').value = nextDayNum;
}

function openNewPostModal() {
  setDefaultFormValues();
  newPostModal.classList.add('active');
  newPostModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeNewPostModal() {
  newPostModal.classList.remove('active');
  newPostModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function addScreenshotInputRow() {
  const row = document.createElement('div');
  row.className = 'screenshot-input-row';
  row.innerHTML = 
    '<input type="text" class="ss-url-input" placeholder="Ruta: assets/uploads/captura.png ó URL" required>' +
    '<input type="text" class="ss-caption-input" placeholder="Descripción de la captura">' +
    '<button type="button" class="btn btn-icon remove-ss-btn" title="Eliminar captura"><i class="fa-solid fa-trash"></i></button>';
  row.querySelector('.remove-ss-btn').addEventListener('click', () => row.remove());
  screenshotsList.appendChild(row);
}

function buildPostObjectFromForm() {
  const dayNumber = parseInt(document.getElementById('postDayNumber').value, 10) || 1;
  const date = document.getElementById('postDate').value;
  const title = document.getElementById('postTitle').value.trim();
  const category = document.getElementById('postCategory').value.trim();
  const tags = document.getElementById('postTags').value
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0);
  const summary = document.getElementById('postSummary').value.trim();
  const highlights = document.getElementById('postHighlights').value
    .split('\n')
    .map(h => h.trim())
    .filter(h => h.length > 0);

  const screenshots = [];
  document.querySelectorAll('.screenshot-input-row').forEach(row => {
    const url = row.querySelector('.ss-url-input').value.trim();
    const caption = row.querySelector('.ss-caption-input').value.trim();
    if (url) {
      screenshots.push({ url, caption: caption || title });
    }
  });

  return {
    id: 'dia-' + dayNumber + '-' + Date.now(),
    date,
    dayNumber,
    title,
    category,
    tags,
    summary,
    highlights,
    screenshots,
    author: 'Daniel'
  };
}

function showToast(msg) {
  toastMessage.textContent = msg;
  toastNotification.classList.add('show');
  setTimeout(() => {
    toastNotification.classList.remove('show');
  }, 3500);
}

function initTheme() {
  const savedTheme = localStorage.getItem('devlog_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  if (theme === 'dark') {
    themeIcon.className = 'fa-solid fa-moon';
  } else {
    themeIcon.className = 'fa-solid fa-sun';
  }
}
