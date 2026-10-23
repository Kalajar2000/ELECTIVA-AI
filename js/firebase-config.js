// =========================================================================
// CONFIGURACIÓN DE FIREBASE (FIRESTORE)
// =========================================================================
// Si deseas conectar tu base de datos en la nube de Firebase:
// 1. Ve a https://console.firebase.google.com/ y crea un proyecto gratuito.
// 2. Crea una base de datos "Cloud Firestore" en modo de prueba o producción.
// 3. Agrega una aplicación web y copia las claves aquí abajo.
//
// NOTA IMPORTANTE:
// Si dejas estos valores vacíos o como están, la app funcionará al 100%
// con la base de datos local predeterminada sin ningún error.

window.FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Indica si las credenciales fueron configuradas por el profesor
window.isFirebaseConfigured = function() {
  return (
    window.FIREBASE_CONFIG &&
    window.FIREBASE_CONFIG.apiKey &&
    window.FIREBASE_CONFIG.apiKey.trim() !== "" &&
    window.FIREBASE_CONFIG.projectId &&
    window.FIREBASE_CONFIG.projectId.trim() !== ""
  );
};
