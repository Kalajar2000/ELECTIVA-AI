// =========================================================================
// CONFIGURACIÓN DE FIREBASE (FIRESTORE)
// =========================================================================
// Conectado al proyecto: electiva-ai-faqs

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyBUuAeixjpl4PvwGg31bhwjgPmqVm6ieO0",
  authDomain: "electiva-ai-faqs.firebaseapp.com",
  projectId: "electiva-ai-faqs",
  storageBucket: "electiva-ai-faqs.firebasestorage.app",
  messagingSenderId: "299825315619",
  appId: "1:299825315619:web:db80ef977c1a2ed466d696"
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
