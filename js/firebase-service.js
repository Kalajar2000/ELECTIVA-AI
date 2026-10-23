// =========================================================================
// SERVICIO DE DATOS (FIREBASE FIRESTORE & LOCAL STORAGE ADAPTER)
// =========================================================================
// Este servicio maneja la lectura y guardado de las preguntas frecuentes y
// los aportes colaborativos de los estudiantes.

const DataService = {
  db: null,
  isCloudActive: false,

  // Inicializa el servicio
  async init() {
    const statusText = document.getElementById("db-status-text");
    const statusBadge = document.getElementById("db-status-badge");

    if (window.isFirebaseConfigured && window.isFirebaseConfigured()) {
      try {
        if (typeof firebase !== "undefined") {
          if (!firebase.apps.length) {
            firebase.initializeApp(window.FIREBASE_CONFIG);
          }
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
        }
      } catch (err) {
        console.warn("No se pudo conectar a Firebase, usando modo local:", err);
      }
    }

    // Modo Local
    this.isCloudActive = false;
    if (statusText) statusText.innerText = "Base de datos local activa";
    if (statusBadge) statusBadge.classList.remove("hidden");
  },

  // Obtiene todas las preguntas frecuentes
  async getFaqs() {
    if (this.isCloudActive && this.db) {
      try {
        const snapshot = await this.db.collection("faqs").get();
        if (!snapshot.empty) {
          const cloudFaqs = [];
          snapshot.forEach((doc) => {
            cloudFaqs.push({ id: doc.id, ...doc.data() });
          });
          return cloudFaqs;
        } else {
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

    const localSaved = localStorage.getItem("ELECTIVA_IA_FAQS");
    if (localSaved) {
      try {
        return JSON.parse(localSaved);
      } catch (e) {}
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

    if (window.AppState && window.AppState.faqs) {
      const item = window.AppState.faqs.find((f) => f.id === faqId);
      if (item) {
        item.count = (item.count || 0) + 1;
        localStorage.setItem("ELECTIVA_IA_FAQS", JSON.stringify(window.AppState.faqs));
      }
    }
  },

  // Agrega un aporte o respuesta comunitaria entre estudiantes
  async addCommunityAnswer(faqId, answerText, author = "Compañero anónimo") {
    const newAnswer = {
      id: "ans_" + Date.now(),
      author: author.trim() || "Compañero anónimo",
      text: answerText.trim(),
      createdAt: new Date().toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    if (this.isCloudActive && this.db) {
      try {
        const ref = this.db.collection("faqs").doc(faqId);
        await ref.update({
          communityAnswers: firebase.firestore.FieldValue.arrayUnion(newAnswer)
        });
        return newAnswer;
      } catch (e) {
        console.warn("No se pudo guardar en Firestore, guardando local:", e);
      }
    }

    if (window.AppState && window.AppState.faqs) {
      const faq = window.AppState.faqs.find((f) => f.id === faqId);
      if (faq) {
        faq.communityAnswers = faq.communityAnswers || [];
        faq.communityAnswers.unshift(newAnswer);
        localStorage.setItem("ELECTIVA_IA_FAQS", JSON.stringify(window.AppState.faqs));
      }
    }

    return newAnswer;
  }
};

window.DataService = DataService;
