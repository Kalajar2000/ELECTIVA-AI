// Lógica principal de la aplicación "¿Ya le preguntaste a la IA?"

// Estado global de la aplicación
const AppState = {
  faqs: window.INITIAL_FAQS || [],
  currentFilter: "all",
  searchQuery: "",
  activeView: "buscar-faq",
  selectedFaqId: null,
};

// Utilidad para normalizar texto (quitar acentos, mayúsculas y caracteres especiales)
function normalizeText(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Inicialización cuando carga el DOM
document.addEventListener("DOMContentLoaded", () => {
  initSearchAndFilters();
  initNavigation();
  renderFaqCards();
});

// Función de búsqueda y filtros
function initSearchAndFilters() {
  const searchInput = document.getElementById("faq-search-input");
  const filterButtons = document.querySelectorAll(".filter-chip");
  const clearSearchBtn = document.getElementById("btn-clear-search");

  // Escuchar escritura en el buscador en tiempo real
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      AppState.searchQuery = e.target.value;
      if (clearSearchBtn) {
        if (AppState.searchQuery.length > 0) {
          clearSearchBtn.classList.remove("hidden");
        } else {
          clearSearchBtn.classList.add("hidden");
        }
      }
      renderFaqCards();
    });

    // Atajos de teclado ⌘K / Ctrl+K y Escape
    window.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
      if (e.key === "Escape" && document.activeElement === searchInput) {
        searchInput.value = "";
        AppState.searchQuery = "";
        if (clearSearchBtn) clearSearchBtn.classList.add("hidden");
        renderFaqCards();
        searchInput.blur();
      }
    });
  }

  // Botón para limpiar búsqueda
  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = "";
      AppState.searchQuery = "";
      clearSearchBtn.classList.add("hidden");
      renderFaqCards();
      searchInput.focus();
    });
  }

  // Botones de filtro de categorías
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const filter = btn.getAttribute("data-filter");
      AppState.currentFilter = filter;

      // Actualizar estilo visual activo de los botones
      filterButtons.forEach((b) => {
        b.classList.remove("active", "bg-primary", "text-on-primary");
        b.classList.add("bg-surface-container-lowest", "text-on-surface");
      });
      btn.classList.add("active", "bg-primary", "text-on-primary");
      btn.classList.remove("bg-surface-container-lowest", "text-on-surface");

      renderFaqCards();
    });
  });
}

// Filtra las FAQs según la búsqueda y categoría actual
function getFilteredFaqs() {
  const queryNormalized = normalizeText(AppState.searchQuery);
  const queryTokens = queryNormalized.split(/\s+/).filter(Boolean);

  return AppState.faqs.filter((faq) => {
    // 1. Filtro por categoría
    const matchesCategory =
      AppState.currentFilter === "all" || faq.category === AppState.currentFilter;
    if (!matchesCategory) return false;

    // 2. Si no hay texto de búsqueda, mostrar todas las de la categoría
    if (queryTokens.length === 0) return true;

    // 3. Crear texto buscable combinado (título, resumen, tags y categoría)
    const searchable = normalizeText(
      `${faq.title} ${faq.summary} ${faq.tags ? faq.tags.join(" ") : ""} ${faq.categoryLabel}`
    );

    // Todos los términos escritos por el estudiante deben coincidir (ej. "producto" Y "asistencia")
    return queryTokens.every((token) => searchable.includes(token));
  });
}

// Renderiza las tarjetas de FAQs en el contenedor
function renderFaqCards() {
  const container = document.getElementById("faq-cards-container");
  const resultsCount = document.getElementById("results-count");
  const emptyState = document.getElementById("faq-empty-state");

  if (!container) return;

  const filtered = getFilteredFaqs();

  // Actualizar contador de resultados
  if (resultsCount) {
    if (filtered.length === AppState.faqs.length && AppState.searchQuery === "") {
      resultsCount.innerText = `Mostrando las ${filtered.length} dudas frecuentes oficiales`;
    } else {
      resultsCount.innerText = `Mostrando ${filtered.length} ${
        filtered.length === 1 ? "duda encontrada" : "dudas encontradas"
      }`;
    }
  }

  // Estado vacío si no hay coincidencias
  if (filtered.length === 0) {
    container.innerHTML = "";
    if (emptyState) {
      emptyState.classList.remove("hidden");
      const emptyTermSpan = document.getElementById("empty-search-term");
      if (emptyTermSpan) emptyTermSpan.innerText = AppState.searchQuery;
    }
    return;
  }

  if (emptyState) {
    emptyState.classList.add("hidden");
  }

  // Generar HTML de cada tarjeta
  container.innerHTML = filtered
    .map((faq) => {
      // Color según categoría para el tag
      return `
      <article 
        class="faq-card group bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-space-lg flex flex-col justify-between border border-surface-container hover:border-primary/30"
        data-faq-id="${faq.id}"
        data-category="${faq.category}"
      >
        <div>
          <div class="flex items-center justify-between gap-space-sm mb-space-sm">
            <span class="px-space-sm py-space-xs rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-medium">
              ${faq.categoryLabel}
            </span>
            <span class="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold shrink-0 shadow-2xs">
              <span class="material-symbols-outlined text-[14px]">local_fire_department</span>
              Preguntada ${faq.count} veces
            </span>
          </div>

          <h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors mb-space-xs font-semibold leading-snug">
            ${highlightMatch(faq.title, AppState.searchQuery)}
          </h3>

          <p class="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-space-md leading-relaxed">
            ${highlightMatch(faq.summary, AppState.searchQuery)}
          </p>
        </div>

        <div class="flex items-center justify-between pt-space-sm border-t border-surface-container-low mt-auto">
          <button 
            type="button" 
            onclick="openFaqDetail('${faq.id}')"
            class="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-primary hover:text-primary-container font-semibold group/link focus:outline-none"
          >
            <span>Ver respuesta completa</span>
            <span class="material-symbols-outlined text-[18px] group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
          </button>
          <span class="font-label-sm text-label-sm text-outline font-medium">${faq.classRef || "Electiva IA"}</span>
        </div>
      </article>
      `;
    })
    .join("");
}

// Resalta visualmente las palabras buscadas
function highlightMatch(text, query) {
  if (!query || !query.trim()) return text;
  const tokens = query.trim().split(/\s+/).filter(Boolean);
  let highlighted = text;

  tokens.forEach((token) => {
    try {
      const regex = new RegExp(`(${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
      highlighted = highlighted.replace(regex, '<mark class="bg-secondary-fixed/50 text-on-surface font-semibold rounded px-0.5">$1</mark>');
    } catch (e) {
      // Ignorar si hay caracteres especiales
    }
  });

  return highlighted;
}

// Manejo de la navegación entre pestañas/vistas
function initNavigation() {
  const navLinks = document.querySelectorAll("nav a[data-path]");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetView = link.getAttribute("data-path");
      switchView(targetView);
    });
  });
}

// Cambiar de vista
function switchView(viewName) {
  AppState.activeView = viewName;

  // Actualizar clases de los botones de navegación
  document.querySelectorAll("nav a[data-path]").forEach((link) => {
    const path = link.getAttribute("data-path");
    if (path === viewName) {
      link.className = "px-space-md py-space-sm transition-colors whitespace-nowrap bg-primary-container text-on-primary font-label-lg rounded-lg shadow-sm font-semibold";
      link.setAttribute("aria-current", "page");
    } else {
      link.className = "font-label-lg text-label-lg px-space-md py-space-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors whitespace-nowrap";
      link.removeAttribute("aria-current");
    }
  });

  // Mostrar la sección correspondiente
  document.querySelectorAll("main > div[data-view]").forEach((viewEl) => {
    if (viewEl.getAttribute("data-view") === viewName) {
      viewEl.classList.remove("hidden");
    } else {
      viewEl.classList.add("hidden");
    }
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Abre el detalle de una FAQ (preparado para la Función 2)
function openFaqDetail(faqId) {
  AppState.selectedFaqId = faqId;
  const faq = AppState.faqs.find((f) => f.id === faqId);
  if (!faq) return;

  const detailView = document.getElementById("faq-detail-container");
  if (detailView) {
    detailView.innerHTML = `
      <div class="mb-space-md">
        <button 
          onclick="switchView('buscar-faq')"
          class="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-surface-container-high text-primary hover:bg-surface-container font-label-md text-label-md transition-colors"
        >
          <span class="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Volver al buscador</span>
        </button>
      </div>

      <div class="relative bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container p-space-lg md:p-space-xl overflow-hidden">
        <div class="absolute left-0 top-0 bottom-0 w-2 bg-primary"></div>

        <div class="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
          <span class="px-space-sm py-space-xs rounded-full bg-surface-container text-primary font-label-md text-label-md font-medium">
            ${faq.categoryLabel}
          </span>
          <span class="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-semibold">
            <span class="material-symbols-outlined text-[16px]">local_fire_department</span>
            Esta pregunta ya me la han hecho ${faq.count} veces
          </span>
        </div>

        <h1 class="font-headline-lg text-headline-lg text-primary font-bold tracking-tight mb-space-md">
          ${faq.title}
        </h1>

        <!-- Mensaje de respuesta oficial -->
        <div class="flex items-center gap-space-xs p-space-sm bg-surface-container-low rounded-lg mb-space-lg border-l-4 border-tertiary-container">
          <span class="material-symbols-outlined text-tertiary-container text-[20px]">verified</span>
          <span class="font-label-lg text-label-lg text-on-surface font-semibold">Respuesta oficial y verificada del profesor</span>
          <span class="ml-auto text-on-surface-variant font-label-sm text-label-sm bg-white px-2 py-0.5 rounded shadow-2xs">${faq.classRef}</span>
        </div>

        <!-- Pasos explicativos -->
        <div class="space-y-space-lg text-on-surface font-body-md text-body-md">
          <div class="flex gap-space-md items-start">
            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary font-headline-sm shrink-0 font-bold">1</span>
            <div class="space-y-1">
              <h2 class="font-headline-sm text-headline-sm text-primary font-bold">¿Cuál es el propósito?</h2>
              <p class="text-on-surface-variant leading-relaxed">${faq.details.purpose}</p>
            </div>
          </div>

          <div class="flex gap-space-md items-start">
            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-tertiary-container text-white font-headline-sm shrink-0 font-bold">2</span>
            <div class="space-y-space-sm w-full">
              <h2 class="font-headline-sm text-headline-sm text-tertiary-container font-bold flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[22px]">check_circle</span>
                QUÉ DEBES PONER / HACER:
              </h2>
              <div class="bg-surface-container-low p-space-md rounded-xl space-y-space-xs font-body-sm text-body-sm border border-surface-container">
                ${faq.details.allowed
                  .map(
                    (item) => `
                  <div class="flex items-start gap-space-xs">
                    <span class="material-symbols-outlined text-tertiary-container text-[18px] shrink-0 mt-0.5">check</span>
                    <span class="text-on-surface">${item}</span>
                  </div>`
                  )
                  .join("")}
              </div>
            </div>
          </div>

          <div class="flex gap-space-md items-start">
            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-error text-on-error font-headline-sm shrink-0 font-bold">3</span>
            <div class="space-y-space-sm w-full">
              <h2 class="font-headline-sm text-headline-sm text-error font-bold flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[22px]">cancel</span>
                QUÉ NO DEBES HACER:
              </h2>
              <div class="bg-error-container/60 p-space-md rounded-xl font-body-sm text-body-sm text-on-error-container space-y-1 border border-error/20">
                ${faq.details.forbidden
                  .map(
                    (item) => `
                  <div class="flex items-start gap-space-xs">
                    <span class="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">close</span>
                    <span>${item}</span>
                  </div>`
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>

        <!-- Formato rápido para copiar -->
        <div class="mt-space-xl p-space-md bg-surface-container rounded-xl flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <div class="flex items-center gap-space-sm">
            <span class="material-symbols-outlined text-primary text-[24px]">content_copy</span>
            <div>
              <p class="font-label-lg text-label-lg text-on-surface font-semibold">Formato o referencia recomendada:</p>
              <p class="font-body-sm text-body-sm text-on-surface-variant font-mono bg-white/70 px-2 py-0.5 rounded mt-1">${faq.details.template}</p>
            </div>
          </div>
          <button 
            type="button"
            onclick="copyFaqTemplate('${faq.details.template.replace(/'/g, "\\'")}', this)"
            class="w-full sm:w-auto px-space-md py-space-sm bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0 font-semibold"
          >
            <span class="material-symbols-outlined text-[18px]">copy_all</span>
            <span>Copiar formato</span>
          </button>
        </div>
      </div>
    `;
  }

  switchView("detalle-de-duda");
}

// Copiar formato de FAQ
function copyFaqTemplate(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    const originalHtml = btnElement.innerHTML;
    btnElement.innerHTML = `
      <span class="material-symbols-outlined text-[18px]">check</span>
      <span>¡Copiado!</span>
    `;
    btnElement.classList.remove("bg-primary-container");
    btnElement.classList.add("bg-tertiary-container");

    setTimeout(() => {
      btnElement.innerHTML = originalHtml;
      btnElement.classList.add("bg-primary-container");
      btnElement.classList.remove("bg-tertiary-container");
    }, 2000);
  });
}
