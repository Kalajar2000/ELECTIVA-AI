// =========================================================================
// SERVICIO DE DATOS (FIREBASE FIRESTORE & LOCAL STORAGE ADAPTER)
// =========================================================================
// Este servicio maneja la lectura y guardado de las preguntas frecuentes.
// Si Firebase está configurado, sincroniza con Firestore en tiempo real.
// Si no, utiliza de forma transparente los datos locales y LocalStorage.

const DataService = {
  db: null,
  isCloudActive: false,

  // Inicializa el servicio
  async init() {
    const statusText = document.getElementById("db-status-text");
    const statusBadge = document.getElementById("db-status-badge");

    if (window.isFirebaseConfigured && window.isFirebaseConfigured()) {
      try {
        await this.loadFirebaseSDK();
        firebase.initializeApp(window.FIREBASE_CONFIG);
        this.db = firebase.firestore();
        this.isCloudActive = true;

        if (statusText) statusText.innerText = "Firestore en la nube conectado";
        if (statusBadge) {
          statusBadge.classList.remove("hidden");
          const dot = statusBadge.querySelector("span:first-child");
          if (dot) dot.className = "w-2 h-2 rounded-full bg-tertiary-fixed animate-ping";
        }
        console.log("🔥 Conectado exitosamente a Firebase Firestore.");
        return;
      } catch (err) {
        console.warn("No se pudo conectar a Firebase, usando modo local:", err);
      }
    }

    // Modo Local
    this.isCloudActive = false;
    if (statusText) statusText.innerText = "Base de datos local activa";
    if (statusBadge) statusBadge.classList.remove("hidden");
  },

  // Carga dinámica de los scripts de Firebase para no ralentizar si no se usan
  loadFirebaseSDK() {
    return new Promise((resolve, reject) => {
      if (window.firebase) return resolve();

      const scriptApp = document.createElement("script");
      scriptApp.src = "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js";
      scriptApp.onload = () => {
        const scriptFirestore = document.createElement("script");
        scriptFirestore.src = "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js";
        scriptFirestore.onload = resolve;
        scriptFirestore.onerror = reject;
        document.head.appendChild(scriptFirestore);
      };
      scriptApp.onerror = reject;
      document.head.appendChild(scriptApp);
    });
  },

  // Obtiene todas las preguntas frecuentes
  async getFaqs() {
    // Si Firebase está activo, consultar colección 'faqs'
    if (this.isCloudActive && this.db) {
      try {
        const snapshot = await this.db.collection("faqs").orderBy("count", "desc").get();
        if (!snapshot.empty) {
          const cloudFaqs = [];
          snapshot.forEach((doc) => {
            cloudFaqs.push({ id: doc.id, ...doc.data() });
          });
          return cloudFaqs;
        } else {
          // Si la colección está vacía, sembrar las 8 iniciales en Firestore
          console.log("Sembrando preguntas iniciales en Firestore...");
          for (const faq of window.INITIAL_FAQS) {
            await this.db.collection("faqs").doc(faq.id).set(faq);
          }
          return window.INITIAL_FAQS;
        }
      } catch (e) {
        console.warn("Error leyendo de Firestore, usando datos locales:", e);
      }
    }

    // Respaldo Local (LocalStorage o INITIAL_FAQS)
    const localSaved = localStorage.getItem("ELECTIVA_IA_FAQS");
    if (localSaved) {
      try {
        return JSON.parse(localSaved);
      } catch (e) {
        // Ignorar si está corrupto
      }
    }

    return window.INITIAL_FAQS || [];
  },

  // Incrementa el contador de veces preguntada
  async incrementFaqCount(faqId) {
    if (this.isCloudActive && this.db) {
      try {
        const ref = this.db.collection("faqs").doc(faqId);
        await ref.update({
          count: firebase.firestore.FieldValue.increment(1),
        });
      } catch (e) {
        console.warn("No se pudo incrementar en Firestore:", e);
      }
    }

    // Actualizar también en memoria local
    if (window.AppState && window.AppState.faqs) {
      const item = window.AppState.faqs.find((f) => f.id === faqId);
      if (item) {
        item.count = (item.count || 0) + 1;
        localStorage.setItem("ELECTIVA_IA_FAQS", JSON.stringify(window.AppState.faqs));
      }
    }
  },

  // Agrega una nueva pregunta frecuente
  async saveFaq(newFaq) {
    if (this.isCloudActive && this.db) {
      try {
        await this.db.collection("faqs").doc(newFaq.id).set(newFaq);
        return true;
      } catch (e) {
        console.error("Error guardando en Firestore:", e);
      }
    }

    // Guardar en LocalStorage
    if (window.AppState && window.AppState.faqs) {
      window.AppState.faqs.unshift(newFaq);
      localStorage.setItem("ELECTIVA_IA_FAQS", JSON.stringify(window.AppState.faqs));
    }
    return true;
  }
};

window.DataService = DataService;
