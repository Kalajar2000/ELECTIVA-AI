// =========================================================================
// CONFIGURACIÓN DE GEMINI API
// =========================================================================
// Por seguridad (y para cumplir con la protección de secretos de GitHub),
// la API Key NO se incluye en el código del repositorio público.
// Se almacena de manera segura en el navegador local (localStorage).

window.GEMINI_CONFIG = {
  apiKey: "", // Vacío en Git para proteger la clave
  model: "gemini-2.5-flash-lite"
};

window.getGeminiApiKey = function() {
  if (window.GEMINI_CONFIG && window.GEMINI_CONFIG.apiKey && window.GEMINI_CONFIG.apiKey.trim() !== "") {
    return window.GEMINI_CONFIG.apiKey.trim();
  }
  return localStorage.getItem("GEMINI_API_KEY") || "";
};

window.setGeminiApiKey = function(key) {
  if (key && key.trim()) {
    localStorage.setItem("GEMINI_API_KEY", key.trim());
    return true;
  }
  return false;
};
