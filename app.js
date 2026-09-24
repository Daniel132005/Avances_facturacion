/**
 * Nexus Facturación - Visor de Bitácora y Avances de Desarrollo
 * Modo Solo Lectura (Público / Clientes / Stakeholders)
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
    "id": "dia-4",
    "date": "2026-09-23",
    "dayNumber": 4,
    "title": "Terminal de Caja POS, Flujo Rápido de Cobro e Integración Fiscal con Impresora BIXOLON",
    "category": "Frontend POS & Impresión Fiscal",
    "tags": [
      "Terminal Caja",
      "POS",
      "BIXOLON SRP-350/812",
      "Impresión Fiscal",
      "SENIAT",
      "UX Cajero",
      "Atajos de Teclado",
      "Multimoneda & IGTF"
    ],
    "summary": "Optimización integral de la interfaz del cajero para agilizar la facturación en punto de venta, diseño de plantilla de ticket fiscal según normativas SENIAT e integración directa con impresoras fiscales BIXOLON (modelos SRP-350 y SRP-812).",
    "highlights": [
      "Terminal de Caja Optimizado (POS): Nueva vista ágil para cajero con atajos de teclado rápidos (F2 Nuevo Cliente, F3 Agregar Producto, F9 Procesar Pago) diseñada para alto volumen de despacho",
      "Modal de Cobro y Liquidación Rápida: Flujo en dos pasos con cálculo automático en Bolívares y Divisas (Tasa BCV en vivo), soporte para Punto/Débito, Pago Móvil, Transferencia, Efectivo y recargo IGTF (+3%)",
      "Plantilla y Diseño de Factura Fiscal 80mm: Formato de ticket térmico homologado según especificaciones del SENIAT con desglose de alícuotas (16%, 8%, exento), RIF, datos del receptor y pie de máquina fiscal (MF)",
      "Integración de Impresión Fiscal BIXOLON: Protocolo de comunicación con impresoras fiscales BIXOLON SRP-350 y SRP-812 con confirmación de emisión exitosa, re-impresión inmediata [P] y enlace directo al ERP",
      "Experiencia Operativa Cero Fricción: Navegación por teclado completa ([Enter / Espacio] para emitir siguiente factura, [Esc] para regresar) maximizando la velocidad de atención en caja"
    ],
    "screenshots": [
      {
        "url": "assets/uploads/factura-proquimicos-carga.png",
        "caption": "Terminal de Caja POS: Interfaz optimizada para cajero con selección rápida de cliente, tasa BCV en vivo y atajos de función"
      },
      {
        "url": "assets/uploads/factura-proquimicos-cobro.png",
        "caption": "Módulo de Liquidación y Cobro: Modal rápido con selección de método de pago (Punto / Débito, Pago Móvil, Divisas con IGTF) y referencia bancaria"
      },
      {
        "url": "assets/uploads/factura-proquimicos-preview.png",
        "caption": "Preview de Impresión Fiscal BIXOLON: Ticket fiscal SENIAT 80mm generado con éxito, comandos de re-impresión y emisión continua"
      }
    ]
  },
  {
    "id": "avance-3",
    "date": "2026-09-22",
    "dayNumber": 3,
    "title": "Arquitectura de Backend: Sistema RBAC de Roles, Pooler PgBouncer y Seguridad RLS",
    "category": "Backend & Infraestructura DB",
    "tags": [
      "PostgreSQL",
      "RLS",
      "RBAC",
      "Seguridad",
      "Supabase Pooler",
      "Auth.js",
      "Server Actions",
      "Auditoría"
    ],
    "summary": "Consolidación integral de la capa de backend: arquitectura de roles y permisos (RBAC), endurecimiento de políticas RLS multi-tenant en PostgreSQL, gestión de transacciones concurrentes con pooler de conexiones y logs de auditoría inmutables.",
    "highlights": [
      "Matriz de Roles y Permisos (RBAC): Configuración de roles de Administrador, Supervisor de Caja, Cajero/Operador y Auditor con validación a nivel de middleware y base de datos",
      "Aislamiento RLS Multi-Tenant: Políticas RLS estrictas en PostgreSQL basadas en empresa_id y sucursal_id con bloqueo total de fugas entre empresas",
      "Contexto de Sesión conTenant(): Inyección atómica de SET LOCAL app.current_tenant y SET LOCAL app.current_user para transacciones de cobro y emisión",
      "Optimización del Connection Pooler: Configuración en Transaction Mode con PgBouncer para garantizar alta concurrencia en múltiples cajas simultáneas",
      "Trazabilidad y Auditoría (audit_logs): Tabla inmutable de logs para registrar cada creación, anulación, cobro con IGTF y ajuste de inventario",
      "Guardias de Server Actions: Validación de esquemas con Zod y verificación de claims de sesión antes de ejecutar mutaciones críticas"
    ],
    "screenshots": []
  },
  {
    "id": "dia-2",
    "date": "2026-09-20",
    "dayNumber": 2,
    "title": "MVP en Next.js 16, Migraciones PostgreSQL con RLS y Motor de Correlativos",
    "category": "Fullstack & Base de Datos",
    "tags": [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "RLS",
      "Supabase",
      "Auth.js",
      "TailwindCSS",
      "Vitest"
    ],
    "summary": "Construcción completa del MVP funcional con Next.js 16, TypeScript, Tailwind v4 y base de datos Supabase/PostgreSQL con seguridad RLS estricta y asignación atómica de correlativos fiscales.",
    "highlights": [
      "Migraciones DB (000 a 012): Roles con nexus_app, políticas RLS por empresa_id, unicidad de punto de emisión y ajustes de pooler",
      "Autenticación Auth.js multi-empresa con cambio de contexto activo en vivo sin necesidad de re-login",
      "Transacciones con conTenant() inyectando SET LOCAL para aislamiento estricto que falla cerrado",
      "Asignador atómico de correlativos fiscales con UPDATE ... RETURNING para evitar huecos en numeración",
      "Pantallas operativas: Login, Dashboard con KPIs del día, Listado y Vista de Documento en dos fases (Carga y Cobro)",
      "Integración de tasa BCV en tiempo real y pruebas automatizadas de aislamiento y concurrencia (Vitest)"
    ],
    "screenshots": [
      {
        "url": "assets/uploads/nexus-dashboard-kpis.png",
        "caption": "Dashboard Principal Nexus: KPIs en tiempo real, tasa BCV y listado de últimos documentos (PROQUIMICOS, C.A.)"
      },
      {
        "url": "assets/uploads/nexus-factura-items-cabecera.png",
        "caption": "Emisión de Documento: Encabezado de factura, selección de cliente y captura rápida de productos"
      },
      {
        "url": "assets/uploads/nexus-factura-totales-pie.png",
        "caption": "Detalle de Factura: Grilla de ítems con cantidades, precios en USD/Bs y barra de totales con atajos de teclado"
      },
      {
        "url": "assets/uploads/nexus-factura-modulo-cobro.png",
        "caption": "Módulo de Cobro: Formas de pago (Transferencia), desglose fiscal de base imponible, IVA 16% y saldo cuadrado"
      }
    ]
  },
  {
    "id": "dia-1",
    "date": "2026-09-19",
    "dayNumber": 1,
    "title": "Análisis de Requerimientos, Arquitectura Multi-Empresa e Identidad de Marca Nexus",
    "category": "Arquitectura & Diseño UI",
    "tags": [
      "Arquitectura",
      "MultiTenant",
      "PostgreSQL",
      "UI/UX",
      "Branding",
      "Requerimientos"
    ],
    "summary": "Definición integral de especificaciones funcionales, modelo de datos multi-tenant, reglas fiscales/RLS y diseño de identidad de marca Nexus Facturación.",
    "highlights": [
      "Análisis de requerimientos: Tenancy con aislamiento D1 por empresa_id, consolidación y multimoneda con tasa congelada",
      "Documentación técnica: Estrategia de asignación de correlativos (D5), matriz de riesgos y máquina de estados",
      "Diseño de UI e identidad: Maquetas de login claro/oscuro y especímenes tipográficos para caja",
      "Diseño vectorial: Creación de isotipos y logotipos de Nexus Facturación y Proquímicos",
      "Modelado relacional inicial para empresas, sucursales, puntos de emisión, usuarios, catálogos y documentos"
    ],
    "screenshots": [
      {
        "url": "assets/uploads/login-caja-nexus-claro.png",
        "caption": "Maqueta de interfaz de Login Caja Nexus en Modo Claro"
      }
    ]
  }
];

// Elementos DOM
const postsContainer = document.getElementById('postsContainer');
const emptyState = document.getElementById('emptyState');
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
const resetFiltersBtn = document.getElementById('resetFiltersBtn');

const lightboxModal = document.getElementById('lightboxModal');
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
const lightboxNextBtn = document.getElementById('lightboxNextBtn');

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadPosts();
  setupEventListeners();
});

async function loadPosts() {
  try {
    const res = await fetch('data/posts.json?v=' + Date.now());
    if (!res.ok) throw new Error('No se pudo cargar posts.json');
    const data = await res.json();
    state.posts = Array.isArray(data) && data.length > 0 ? data : FALLBACK_POSTS;
  } catch (err) {
    console.warn('Cargando datos locales garantizados:', err);
    state.posts = FALLBACK_POSTS;
  }

  state.posts.sort((a, b) => (b.dayNumber || 0) - (a.dayNumber || 0));

  updateStats();
  renderPosts();
}

function updateStats() {
  const totalPosts = state.posts.length;
  let totalScreenshots = 0;

  state.posts.forEach(post => {
    if (post.screenshots && Array.isArray(post.screenshots)) {
      totalScreenshots += post.screenshots.length;
    }
  });

  if (postsCountBadge) postsCountBadge.textContent = totalPosts + (totalPosts === 1 ? ' avance registrado' : ' avances registrados');
  if (statDaysCount) statDaysCount.textContent = totalPosts;
  if (statScreenshotsCount) statScreenshotsCount.textContent = totalScreenshots;
}

function renderPosts() {
  const filtered = state.posts.filter(post => {
    const matchesTag = state.currentTag === 'all' || (post.tags && post.tags.includes(state.currentTag));
    
    const query = state.searchQuery.toLowerCase().trim();
    if (!query) return matchesTag;

    const inTitle = (post.title || '').toLowerCase().includes(query);
    const inSummary = (post.summary || '').toLowerCase().includes(query);
    const inCategory = (post.category || '').toLowerCase().includes(query);
    const inTags = (post.tags || []).some(t => t.toLowerCase().includes(query));
    const inHighlights = (post.highlights || []).some(h => h.toLowerCase().includes(query));

    return matchesTag && (inTitle || inSummary || inCategory || inTags || inHighlights);
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
      '<div class="highlights-block"><div class="highlights-title"><i class="fa-solid fa-list-check"></i> Logros & Tareas Realizadas</div><ul class="highlights-list">' +
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

    const footerHtml = tagsHtml ? '<footer class="post-footer">' + tagsHtml + '</footer>' : '';

    return '<article class="timeline-item" id="post-' + post.id + '">' +
      '<div class="timeline-node"></div>' +
      '<div class="post-card">' +
        '<header class="post-header">' +
          '<div class="post-meta-left">' +
            '<span class="day-badge">AVANCE #' + (post.dayNumber || 0) + '</span>' +
            '<span class="date-text"><i class="fa-regular fa-calendar"></i> ' + formatDate(post.date) + '</span>' +
            (post.category ? '<span class="post-category">' + post.category + '</span>' : '') +
          '</div>' +
        '</header>' +
        '<h2 class="post-title">' + post.title + '</h2>' +
        '<p class="post-summary">' + post.summary + '</p>' +
        highlightsHtml +
        screenshotsHtml +
        footerHtml +
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
  });
}

function initTheme() {
  const savedTheme = localStorage.getItem('devlog_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  if (theme === 'dark') {
    themeIcon.className = 'fa-solid fa-sun';
  } else {
    themeIcon.className = 'fa-solid fa-moon';
  }
}
