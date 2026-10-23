// =========================================================================
// CONFIGURACIÓN DE GEMINI API
// =========================================================================
// Para activar la asistencia de Gemini en la generación de prompts:
// 1. Obtén tu API Key gratuita en https://aistudio.google.com/app/apikey
// 2. Puedes pegar tu clave en la variable apiKey abajo, o el usuario puede
//    ingresarla directamente en la aplicación desde el navegador.
//
// CONSEJO DE SEGURIDAD PARA PRODUCCIÓN:
// En https://console.cloud.google.com/apis/credentials puedes restringir tu clave
// para que SOLO funcione desde tu dominio (ej. localhost y tu usuario.github.io).

window.GEMINI_CONFIG = {
  apiKey: "", // Pega tu clave de Gemini aquí si deseas dejarla preconfigurada
  model: "gemini-1.5-flash"
};

window.getGeminiApiKey = function() {
  // Primero revisa si hay una clave configurada en este archivo
  if (window.GEMINI_CONFIG && window.GEMINI_CONFIG.apiKey && window.GEMINI_CONFIG.apiKey.trim() !== "") {
    return window.GEMINI_CONFIG.apiKey.trim();
  }
  // De respaldo, revisa si el usuario la guardó localmente en su navegador
  return localStorage.getItem("GEMINI_API_KEY") || "";
};
