// =========================================================================
// CONFIGURACIÓN DE GEMINI API (CENTRALIZADA Y SEGURA)
// =========================================================================
// Para que todos los 158 estudiantes usen la misma clave sin tener que ingresarla,
// la clave se sincroniza automáticamente desde Firestore (colección 'config').
// De esta forma, NUNCA se sube a GitHub y está protegida contra escaneos públicos.

window.GEMINI_CONFIG = {
  apiKey: "", // Vacío en Git
  model: "gemini-2.5-flash-lite"
};

window.getGeminiApiKey = function() {
  // 1. Clave global del curso cargada automáticamente desde Firestore
  if (window.AppState && window.AppState.globalGeminiKey) {
    return window.AppState.globalGeminiKey.trim();
  }
  // 2. Clave configurada en memoria local
  if (window.GEMINI_CONFIG && window.GEMINI_CONFIG.apiKey && window.GEMINI_CONFIG.apiKey.trim() !== "") {
    return window.GEMINI_CONFIG.apiKey.trim();
  }
  // 3. Clave en localStorage (respaldo)
  return localStorage.getItem("GEMINI_API_KEY") || "";
};

window.setGeminiApiKey = function(key) {
  if (key && key.trim()) {
    localStorage.setItem("GEMINI_API_KEY", key.trim());
    if (window.AppState) window.AppState.globalGeminiKey = key.trim();
    return true;
  }
  return false;
};
