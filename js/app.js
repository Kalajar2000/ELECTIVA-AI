// =========================================================================
// APLICACIÓN: "¿YA LE PREGUNTASTE A LA IA?" - ELECTIVA IA
// =========================================================================
// 1. Buscador de dudas frecuentes
// 2. Contador de frecuencia y vista detallada oficial + Respuestas de compañeros
// 3. Generador de prompts asistido con Gemini AI y fallback dinámico
// 4. Contacto directo al profesor como último recurso
// =========================================================================

const AppState = {
  faqs: window.INITIAL_FAQS || [],
  currentFilter: "all",
  searchQuery: "",
  activeView: "buscar-faq",
  selectedFaqId: null,
  selectedStack: ["Antigravity", "GitHub", "HTML / Tailwind", "JavaScript"],
  teacherEmail: "santiago@nexxai.world"
};

// Utilidad para normalizar texto (sin tildes, minúsculas)
function normalizeText(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", async () => {
  if (window.DataService) {
    await window.DataService.init();
    AppState.faqs = await window.DataService.getFaqs();
  }

  initSearchAndFilters();
  initNavigation();
  initPromptGenerator();
  renderFaqCards();

  handleHashRouting();
  window.addEventListener("hashchange", handleHashRouting);
});

// =========================================================================
// 1. FUNCIÓN 1: BUSCADOR Y FILTROS EN TIEMPO REAL
// =========================================================================

function initSearchAndFilters() {
  const searchInput = document.getElementById("faq-search-input");
  const filterButtons = document.querySelectorAll(".filter-chip");
  const clearSearchBtn = document.getElementById("btn-clear-search");

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

    window.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (AppState.activeView !== "buscar-faq") {
          switchView("buscar-faq");
        }
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

  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = "";
      AppState.searchQuery = "";
      clearSearchBtn.classList.add("hidden");
      renderFaqCards();
      searchInput.focus();
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const filter = btn.getAttribute("data-filter");
      AppState.currentFilter = filter;

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

function getFilteredFaqs() {
  const queryNormalized = normalizeText(AppState.searchQuery);
  const queryTokens = queryNormalized.split(/\s+/).filter(Boolean);

  return AppState.faqs.filter((faq) => {
    const matchesCategory =
      AppState.currentFilter === "all" || faq.category === AppState.currentFilter;
    if (!matchesCategory) return false;

    if (queryTokens.length === 0) return true;

    const searchable = normalizeText(
      `${faq.title} ${faq.summary} ${faq.tags ? faq.tags.join(" ") : ""} ${faq.categoryLabel}`
    );
    return queryTokens.every((token) => searchable.includes(token));
  });
}

function renderFaqCards() {
  const container = document.getElementById("faq-cards-container");
  const resultsCount = document.getElementById("results-count");
  const emptyState = document.getElementById("faq-empty-state");

  if (!container) return;

  const filtered = getFilteredFaqs();

  if (resultsCount) {
    if (filtered.length === AppState.faqs.length && AppState.searchQuery === "") {
      resultsCount.innerText = `Mostrando las ${filtered.length} dudas frecuentes oficiales`;
    } else {
      resultsCount.innerText = `Mostrando ${filtered.length} ${
        filtered.length === 1 ? "duda encontrada" : "dudas encontradas"
      }`;
    }
  }

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

  container.innerHTML = filtered
    .map((faq) => {
      const answersCount = faq.communityAnswers ? faq.communityAnswers.length : 0;
      return `
      <article 
        class="faq-card group bg-surface-container-lowest rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 p-space-lg flex flex-col justify-between border border-surface-container hover:border-primary/40 cursor-pointer"
        data-faq-id="${faq.id}"
        onclick="openFaqDetail('${faq.id}')"
      >
        <div>
          <div class="flex items-center justify-between gap-space-sm mb-space-sm">
            <span class="px-space-sm py-1 rounded-full bg-surface-container text-primary text-xs font-semibold">
              ${faq.categoryLabel}
            </span>
            <div class="flex items-center gap-1.5 shrink-0">
              ${answersCount > 0 ? `
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-container/15 text-tertiary-container text-xs font-semibold">
                  <span class="material-symbols-outlined text-[13px]">forum</span>
                  ${answersCount} ${answersCount === 1 ? 'aporte' : 'aportes'}
                </span>
              ` : ''}
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold shadow-2xs">
                <span class="material-symbols-outlined text-[14px]">local_fire_department</span>
                Preguntada ${faq.count} veces
              </span>
            </div>
          </div>

          <h3 class="font-headline text-lg text-on-surface group-hover:text-primary transition-colors mb-2 font-bold leading-snug">
            ${highlightMatch(faq.title, AppState.searchQuery)}
          </h3>

          <p class="text-sm text-on-surface-variant line-clamp-3 mb-space-md leading-relaxed">
            ${highlightMatch(faq.summary, AppState.searchQuery)}
          </p>
        </div>

        <div class="flex items-center justify-between pt-space-sm border-t border-surface-container-low mt-auto">
          <span class="inline-flex items-center gap-1 text-sm text-primary font-bold group-hover:text-primary-container">
            <span>Ver respuesta oficial</span>
            <span class="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </span>
          <span class="text-xs text-outline font-medium">${faq.classRef || "Electiva IA"}</span>
        </div>
      </article>
      `;
    })
    .join("");
}

function highlightMatch(text, query) {
  if (!query || !query.trim()) return text;
  const tokens = query.trim().split(/\s+/).filter(Boolean);
  let highlighted = text;

  tokens.forEach((token) => {
    try {
      const regex = new RegExp(`(${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
      highlighted = highlighted.replace(regex, '<mark class="bg-secondary-fixed/50 text-on-surface font-semibold rounded px-0.5">$1</mark>');
    } catch (e) {
      // Caracteres especiales
    }
  });

  return highlighted;
}

function prefillAndSwitchToPrompt() {
  const problemInput = document.getElementById("input-problem");
  if (problemInput && AppState.searchQuery) {
    problemInput.value = AppState.searchQuery;
    updateLivePrompt();
  }
  switchView("prompt-para-ia");
}

// =========================================================================
// 2. FUNCIÓN 2: DETALLE COMPLETO Y RESPUESTAS DE COMPAÑEROS
// =========================================================================

function openFaqDetail(faqId) {
  AppState.selectedFaqId = faqId;
  const faq = AppState.faqs.find((f) => f.id === faqId);
  if (!faq) return;

  if (window.DataService) {
    window.DataService.incrementFaqCount(faqId);
  }

  const detailView = document.getElementById("faq-detail-container");
  if (!detailView) return;

  const communityAnswers = faq.communityAnswers || [];

  detailView.innerHTML = `
    <!-- Botón Volver -->
    <div class="mb-space-md">
      <button 
        onclick="switchView('buscar-faq')"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container-high text-primary hover:bg-surface-container text-xs sm:text-sm font-semibold transition-colors"
      >
        <span class="material-symbols-outlined text-[18px]">arrow_back</span>
        <span>Volver al buscador de preguntas</span>
      </button>
    </div>

    <!-- Tarjeta Principal del Detalle -->
    <article class="relative bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container p-space-lg md:p-space-xl overflow-hidden mb-space-lg">
      <div class="absolute left-0 top-0 bottom-0 w-2 bg-primary"></div>

      <!-- Encabezado de la Duda -->
      <div class="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
        <span class="px-3 py-1 rounded-full bg-surface-container text-primary text-xs font-semibold">
          ${faq.categoryLabel}
        </span>
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs sm:text-sm font-bold shadow-2xs">
          <span class="material-symbols-outlined text-[16px]">local_fire_department</span>
          Esta pregunta ya me la han hecho ${faq.count} veces
        </span>
      </div>

      <h1 class="font-display text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-space-md">
        ${faq.title}
      </h1>

      <!-- Mensaje de Verificación Oficial -->
      <div class="flex items-center justify-between gap-2 p-3 bg-surface-container-low rounded-xl mb-space-lg border-l-4 border-tertiary-container">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-tertiary-container text-[22px]">verified</span>
          <span class="text-xs sm:text-sm font-bold text-on-surface">Respuesta oficial y verificada por el profesor</span>
        </div>
        <span class="text-xs text-on-surface-variant font-medium bg-white px-2.5 py-1 rounded-lg border border-surface-container">${faq.classRef}</span>
      </div>

      <!-- Desglose Paso a Paso -->
      <div class="space-y-space-lg text-on-surface text-sm sm:text-base">
        
        <!-- Paso 1: Propósito -->
        <div class="flex gap-space-md items-start">
          <span class="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-sm shrink-0">1</span>
          <div class="space-y-1">
            <h2 class="font-headline text-base sm:text-lg text-primary font-bold">¿Cuál es el propósito de esta regla?</h2>
            <p class="text-on-surface-variant leading-relaxed text-sm">${faq.details.purpose}</p>
          </div>
        </div>

        <!-- Paso 2: Qué debes poner / hacer -->
        <div class="flex gap-space-md items-start">
          <span class="flex items-center justify-center w-8 h-8 rounded-full bg-tertiary-container text-white font-bold text-sm shrink-0">2</span>
          <div class="space-y-2 w-full">
            <h2 class="font-headline text-base sm:text-lg text-tertiary-container font-bold flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[20px]">check_circle</span>
              QUÉ DEBES PONER O HACER (Válido):
            </h2>
            <div class="bg-surface-container-low p-space-md rounded-xl space-y-2 text-xs sm:text-sm border border-surface-container">
              ${faq.details.allowed
                .map(
                  (item) => `
                <div class="flex items-start gap-2">
                  <span class="material-symbols-outlined text-tertiary-container text-[18px] shrink-0 mt-0.5">check</span>
                  <span class="text-on-surface leading-snug">${item}</span>
                </div>`
                )
                .join("")}
            </div>
          </div>
        </div>

        <!-- Paso 3: Qué NO debes hacer -->
        <div class="flex gap-space-md items-start">
          <span class="flex items-center justify-center w-8 h-8 rounded-full bg-error text-on-error font-bold text-sm shrink-0">3</span>
          <div class="space-y-2 w-full">
            <h2 class="font-headline text-base sm:text-lg text-error font-bold flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[20px]">cancel</span>
              QUÉ NO DEBES HACER (Invalida la entrega):
            </h2>
            <div class="bg-error-container/60 p-space-md rounded-xl text-xs sm:text-sm text-on-error-container space-y-2 border border-error/20">
              ${faq.details.forbidden
                .map(
                  (item) => `
                <div class="flex items-start gap-2">
                  <span class="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">close</span>
                  <span class="leading-snug">${item}</span>
                </div>`
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>

      <!-- Formato Rápido para Copiar -->
      <div class="mt-space-xl p-space-md bg-surface-container rounded-xl flex flex-col sm:flex-row items-center justify-between gap-space-md">
        <div class="flex items-center gap-space-sm min-w-0">
          <span class="material-symbols-outlined text-primary text-[24px] shrink-0">content_copy</span>
          <div class="min-w-0">
            <p class="font-bold text-xs sm:text-sm text-on-surface">Formato o plantilla recomendada:</p>
            <p class="text-xs text-on-surface-variant font-mono bg-white/80 px-2.5 py-1 rounded-md mt-1 truncate select-all border border-surface-container">${faq.details.template}</p>
          </div>
        </div>
        <button 
          type="button"
          onclick="copyFaqTemplate('${faq.details.template.replace(/'/g, "\\'")}', this)"
          class="w-full sm:w-auto px-4 py-2.5 bg-primary-container text-on-primary font-bold text-xs sm:text-sm rounded-xl shadow-xs hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <span class="material-symbols-outlined text-[18px]">copy_all</span>
          <span>Copiar formato</span>
        </button>
      </div>
    </article>

    <!-- SECCIÓN COLABORATIVA: RESPUESTAS ENTRE ESTUDIANTES -->
    <section class="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container p-space-lg md:p-space-xl mb-space-lg">
      <div class="flex items-center justify-between gap-space-sm mb-space-sm">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[22px]">forum</span>
          <h2 class="font-headline text-lg sm:text-xl font-bold text-on-surface">
            Aportes y Soluciones de Compañeros
          </h2>
        </div>
        <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
          ${communityAnswers.length} ${communityAnswers.length === 1 ? 'aporte' : 'aportes'}
        </span>
      </div>
      <p class="text-xs sm:text-sm text-on-surface-variant mb-space-md leading-relaxed">
        ¿Descubriste un tip, atajo o cómo lo solucionó tu equipo? Si sabes la respuesta, déjala aquí para ayudar a tus compañeros (no requiere login).
      </p>

      <!-- Formulario para agregar aporte -->
      <form onsubmit="handlePostCommunityAnswer(event, '${faq.id}')" class="bg-surface-container-low p-space-md rounded-xl border border-surface-container mb-space-lg flex flex-col gap-space-sm">
        <div class="flex flex-col sm:flex-row gap-space-xs sm:items-center">
          <input 
            type="text" 
            id="input-author-${faq.id}" 
            placeholder="Tu nombre o apodo (opcional)" 
            class="sm:w-64 p-2 bg-surface-container-lowest rounded-lg text-xs sm:text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
          <span class="text-2xs text-on-surface-variant">Se publicará con la fecha actual</span>
        </div>
        <textarea 
          id="input-answer-${faq.id}" 
          rows="3" 
          required 
          placeholder="Si sabes la respuesta de esta duda o tienes un tip, escribe acá tu respuesta..." 
          class="w-full p-3 bg-surface-container-lowest rounded-lg text-xs sm:text-sm border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        ></textarea>
        <div class="flex justify-end">
          <button 
            type="submit" 
            class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs sm:text-sm font-bold shadow-xs hover:opacity-95 active:scale-95 transition-all"
          >
            <span class="material-symbols-outlined text-[16px]">send</span>
            <span>Publicar respuesta</span>
          </button>
        </div>
      </form>

      <!-- Lista de aportes publicados -->
      <div id="community-answers-list-${faq.id}" class="space-y-3">
        ${communityAnswers.length === 0 ? `
          <div class="text-center py-6 text-on-surface-variant text-xs sm:text-sm bg-surface-container-low/50 rounded-xl border border-dashed border-surface-container">
            <span class="material-symbols-outlined text-[24px] text-outline mb-1 block">chat_bubble_outline</span>
            Aún no hay aportes de compañeros para esta duda. ¡Sé el primero en compartir tu experiencia!
          </div>
        ` : communityAnswers.map(ans => `
          <div class="p-space-md bg-surface-container-low rounded-xl border border-surface-container flex flex-col gap-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-primary flex items-center gap-1">
                <span class="material-symbols-outlined text-[15px]">account_circle</span>
                ${ans.author || 'Compañero anónimo'}
              </span>
              <span class="text-outline text-2xs">${ans.createdAt}</span>
            </div>
            <p class="text-xs sm:text-sm text-on-surface leading-relaxed mt-1 whitespace-pre-wrap">${ans.text}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Banner de Ayuda Adicional -->
    <div class="pt-space-md border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-space-sm text-center sm:text-left">
      <span class="text-xs text-on-surface-variant">¿Esta respuesta no resolvió exactamente tu caso?</span>
      <div class="flex items-center gap-2">
        <button onclick="switchView('prompt-para-ia')" class="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1">
          <span>Armar prompt para IA</span>
          <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
        <span class="text-outline text-xs">•</span>
        <button onclick="switchView('escribir-al-profe')" class="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1">
          <span>Escribirle al profesor</span>
          <span class="material-symbols-outlined text-[14px]">mail</span>
        </button>
      </div>
    </div>
  `;

  window.location.hash = `detalle?id=${faqId}`;
  switchView("detalle-de-duda");
}

async function handlePostCommunityAnswer(event, faqId) {
  event.preventDefault();
  const authorInput = document.getElementById(`input-author-${faqId}`);
  const answerInput = document.getElementById(`input-answer-${faqId}`);

  if (!answerInput || !answerInput.value.trim()) return;

  const author = authorInput ? authorInput.value.trim() : "";
  const answerText = answerInput.value.trim();

  if (window.DataService) {
    await window.DataService.addCommunityAnswer(faqId, answerText, author);
  }

  showToast("¡Aporte publicado con éxito!", "Gracias por ayudar a tus compañeros");
  openFaqDetail(faqId);
}

function copyFaqTemplate(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("¡Formato copiado!", "Pégalo en el formulario o entrega");
    const originalContent = btnElement.innerHTML;
    btnElement.innerHTML = `
      <span class="material-symbols-outlined text-[18px]">check</span>
      <span>¡Copiado!</span>
    `;
    btnElement.classList.remove("bg-primary-container");
    btnElement.classList.add("bg-tertiary-container");

    setTimeout(() => {
      btnElement.innerHTML = originalContent;
      btnElement.classList.add("bg-primary-container");
      btnElement.classList.remove("bg-tertiary-container");
    }, 2000);
  });
}

// =========================================================================
// 3. FUNCIÓN 3: GENERADOR DE PROMPT PARA IA CON APOYO DE GEMINI
// =========================================================================

function initPromptGenerator() {
  const problemInput = document.getElementById("input-problem");
  const workshopSelect = document.getElementById("select-workshop");
  const triedInput = document.getElementById("input-tried");
  const stackChips = document.querySelectorAll(".stack-chip");

  if (problemInput) problemInput.addEventListener("input", updateLivePrompt);
  if (workshopSelect) workshopSelect.addEventListener("change", updateLivePrompt);
  if (triedInput) triedInput.addEventListener("input", updateLivePrompt);

  stackChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const val = chip.getAttribute("data-val");
      if (AppState.selectedStack.includes(val)) {
        AppState.selectedStack = AppState.selectedStack.filter((s) => s !== val);
        chip.classList.remove("bg-primary", "text-on-primary", "shadow-xs");
        chip.classList.add("bg-surface-container-high", "text-on-surface-variant");
      } else {
        AppState.selectedStack.push(val);
        chip.classList.add("bg-primary", "text-on-primary", "shadow-xs");
        chip.classList.remove("bg-surface-container-high", "text-on-surface-variant");
      }
      updateLivePrompt();
    });
  });

  updateLivePrompt();
}

function updateLivePrompt() {
  const problemInput = document.getElementById("input-problem");
  const workshopSelect = document.getElementById("select-workshop");
  const triedInput = document.getElementById("input-tried");
  const outputElement = document.getElementById("prompt-output");

  if (!outputElement) return;

  const problem = problemInput ? problemInput.value.trim() || "[Describe tu duda o error puntual aquí]" : "";
  const workshop = workshopSelect ? workshopSelect.value : "Electiva IA";
  const tried = triedInput ? triedInput.value.trim() || "[Describe qué has intentado solucionar]" : "";
  const stack = AppState.selectedStack.length > 0 ? AppState.selectedStack.join(", ") : "el stack del curso";

  const generated = `Actúa como un profesor asistente experto en la Electiva de Inteligencia Artificial para ingeniería.

Contexto del curso:
- Módulo / Entrega actual: ${workshop}
- Stack y herramientas utilizadas: ${stack}

Mi problema o duda técnica puntual:
${problem}

Lo que ya intenté:
${tried}

Instrucciones para tu respuesta:
1. Explícame la causa raíz del problema de forma didáctica y sin rodeos.
2. Dame la solución paso a paso con el código exacto y limpio, sin suponer librerías extrañas a las del taller.
3. Indícame qué verificar en la terminal o consola del navegador para confirmar que quedó resuelto.`;

  outputElement.textContent = generated;
  updateEmailDraft(problem, tried);
}

// Pulir con Gemini AI
async function enhancePromptWithGemini() {
  const problemInput = document.getElementById("input-problem");
  const workshopSelect = document.getElementById("select-workshop");
  const triedInput = document.getElementById("input-tried");
  const outputElement = document.getElementById("prompt-output");
  const geminiBtn = document.getElementById("btn-gemini-enhance");

  const problem = problemInput ? problemInput.value.trim() : "";
  if (!problem) {
    showToast("Por favor describe tu duda", "Escribe el error antes de consultar a Gemini");
    if (problemInput) problemInput.focus();
    return;
  }

  // Verificar si hay clave de Gemini configurada
  let apiKey = window.getGeminiApiKey ? window.getGeminiApiKey() : "";
  if (!apiKey) {
    const inputKey = prompt(
      "Ingresa tu clave gratuita de Gemini API (Google AI Studio):\n\nSe guardará únicamente en tu navegador de forma segura."
    );
    if (!inputKey || !inputKey.trim()) {
      showToast("Operación cancelada", "Puedes seguir usando el generador inteligente sin API key");
      return;
    }
    localStorage.setItem("GEMINI_API_KEY", inputKey.trim());
    apiKey = inputKey.trim();
  }

  // Estado de carga visual
  let originalBtnHtml = "";
  if (geminiBtn) {
    originalBtnHtml = geminiBtn.innerHTML;
    geminiBtn.innerHTML = `
      <span class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
      <span>Gemini optimizando prompt...</span>
    `;
    geminiBtn.disabled = true;
  }

  try {
    const workshop = workshopSelect ? workshopSelect.value : "Electiva IA";
    const tried = triedInput ? triedInput.value.trim() : "He revisado la consola y código básico.";
    
    const refinedPrompt = await window.GeminiService.generateSmartPrompt({
      problem,
      workshop,
      stack: AppState.selectedStack,
      tried
    });

    if (outputElement && refinedPrompt) {
      outputElement.textContent = refinedPrompt;
      showToast("✨ ¡Prompt optimizado por Gemini!", "Listo para copiar en ChatGPT o Gemini");
    }
  } catch (err) {
    console.error("Error en GeminiService:", err);
    if (err.message === "NO_KEY" || err.message.includes("API key")) {
      localStorage.removeItem("GEMINI_API_KEY");
      showToast("Clave inválida", "Por favor revisa tu Gemini API Key");
    } else {
      showToast("Aviso de Gemini", err.message || "No se pudo conectar con Gemini");
    }
  } finally {
    if (geminiBtn) {
      geminiBtn.innerHTML = originalBtnHtml;
      geminiBtn.disabled = false;
    }
  }
}

function copyGeneratedPrompt() {
  const outputElement = document.getElementById("prompt-output");
  const copyBtn = document.getElementById("btn-copy-prompt");
  const copyBtnText = document.getElementById("btn-copy-prompt-text");

  if (!outputElement) return;

  navigator.clipboard.writeText(outputElement.textContent).then(() => {
    showToast("¡Prompt copiado al portapapeles!", "Pégalo en Gemini o ChatGPT");

    if (copyBtn && copyBtnText) {
      const originalText = copyBtnText.innerText;
      copyBtnText.innerText = "¡Copiado con éxito!";
      copyBtn.classList.remove("bg-primary-container");
      copyBtn.classList.add("bg-tertiary-container");

      setTimeout(() => {
        copyBtnText.innerText = originalText;
        copyBtn.classList.add("bg-primary-container");
        copyBtn.classList.remove("bg-tertiary-container");
      }, 2500);
    }
  });
}

function toggleTeacherEscalation(isChecked) {
  const btnGotoTeacher = document.getElementById("btn-goto-teacher");
  if (btnGotoTeacher) {
    if (isChecked) {
      btnGotoTeacher.classList.remove("hidden");
    } else {
      btnGotoTeacher.classList.add("hidden");
    }
  }
}

// =========================================================================
// 4. FUNCIÓN 4: CONTACTO AL PROFESOR (ÚLTIMO RECURSO)
// =========================================================================

function updateEmailDraft(problem, tried) {
  const previewEl = document.getElementById("email-template-preview");
  const gmailBtn = document.getElementById("btn-open-gmail");

  const subject = `[Electiva IA] Consulta de estudiante: ${problem.slice(0, 45)}...`;
  const body = `Estimado Profesor Santiago,

Me comunico luego de haber revisado las preguntas frecuentes oficiales del aula y de haber consultado con la IA sin éxito.

1. ¿Qué se intentó puntualmente?
${tried}

2. Error o comportamiento exacto:
${problem}

Quedo atento a sus indicaciones en clase o por este medio.

Muchas gracias.`;

  if (previewEl) {
    previewEl.textContent = `Asunto: ${subject}\n\n${body}`;
  }

  if (gmailBtn) {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      AppState.teacherEmail
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    gmailBtn.setAttribute("href", gmailUrl);
  }
}

function copyTeacherEmail() {
  navigator.clipboard.writeText(AppState.teacherEmail).then(() => {
    showToast("¡Correo del profesor copiado!", AppState.teacherEmail);
    const copyText = document.getElementById("copy-email-text");
    const copyIcon = document.getElementById("copy-email-icon");

    if (copyText && copyIcon) {
      copyText.innerText = "¡Correo copiado!";
      copyIcon.innerText = "check";

      setTimeout(() => {
        copyText.innerText = "Copiar correo";
        copyIcon.innerText = "content_copy";
      }, 2000);
    }
  });
}

function copyEmailTemplate() {
  const previewEl = document.getElementById("email-template-preview");
  if (previewEl) {
    navigator.clipboard.writeText(previewEl.textContent).then(() => {
      showToast("¡Plantilla de correo copiada!", "Pégala en tu cliente de correo");
    });
  }
}

// =========================================================================
// NAVEGACIÓN Y ROUTER GENERAL
// =========================================================================

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

function switchView(viewName) {
  AppState.activeView = viewName;

  document.querySelectorAll("nav a[data-path]").forEach((link) => {
    const path = link.getAttribute("data-path");
    if (path === viewName) {
      link.className = "px-space-md py-space-sm transition-colors whitespace-nowrap bg-primary-container text-on-primary font-semibold text-sm rounded-lg shadow-sm";
      link.setAttribute("aria-current", "page");
    } else {
      link.className = "font-medium text-sm px-space-md py-space-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors whitespace-nowrap";
      link.removeAttribute("aria-current");
    }
  });

  document.querySelectorAll("main > div[data-view]").forEach((viewEl) => {
    if (viewEl.getAttribute("data-view") === viewName) {
      viewEl.classList.remove("hidden");
    } else {
      viewEl.classList.add("hidden");
    }
  });

  if (viewName === "buscar-faq") window.location.hash = "buscar";
  else if (viewName === "prompt-para-ia") window.location.hash = "prompt";
  else if (viewName === "escribir-al-profe") window.location.hash = "contacto";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleHashRouting() {
  const hash = window.location.hash.replace("#", "");
  if (!hash) return;

  if (hash === "buscar") {
    switchView("buscar-faq");
  } else if (hash === "prompt") {
    switchView("prompt-para-ia");
  } else if (hash === "contacto") {
    switchView("escribir-al-profe");
  } else if (hash.startsWith("detalle")) {
    const params = new URLSearchParams(hash.split("?")[1]);
    const id = params.get("id");
    if (id) {
      openFaqDetail(id);
    } else if (AppState.selectedFaqId) {
      openFaqDetail(AppState.selectedFaqId);
    } else {
      switchView("buscar-faq");
    }
  }
}

function showToast(title, subtitle) {
  const toast = document.getElementById("app-toast");
  const titleEl = document.getElementById("toast-title");
  const subEl = document.getElementById("toast-subtitle");

  if (!toast) return;

  if (titleEl) titleEl.innerText = title;
  if (subEl) subEl.innerText = subtitle || "";

  toast.classList.remove("opacity-0", "pointer-events-none", "translate-y-12");
  toast.classList.add("opacity-100", "translate-y-0");

  setTimeout(() => {
    toast.classList.add("opacity-0", "pointer-events-none", "translate-y-12");
    toast.classList.remove("opacity-100", "translate-y-0");
  }, 3000);
}

// Exponer funciones globales para handlers en HTML
window.switchView = switchView;
window.openFaqDetail = openFaqDetail;
window.copyFaqTemplate = copyFaqTemplate;
window.copyGeneratedPrompt = copyGeneratedPrompt;
window.enhancePromptWithGemini = enhancePromptWithGemini;
window.toggleTeacherEscalation = toggleTeacherEscalation;
window.copyTeacherEmail = copyTeacherEmail;
window.copyEmailTemplate = copyEmailTemplate;
window.prefillAndSwitchToPrompt = prefillAndSwitchToPrompt;
window.handlePostCommunityAnswer = handlePostCommunityAnswer;
