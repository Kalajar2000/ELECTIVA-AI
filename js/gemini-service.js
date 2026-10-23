// =========================================================================
// SERVICIO DE GEMINI AI (ASISTENTE PEDAGÓGICO)
// =========================================================================
// Utiliza la API gratuita de Gemini (Google AI Studio) para pulir y optimizar
// las preguntas de los estudiantes, estructurando un prompt de alta precisión.

const GeminiService = {
  async generateSmartPrompt({ problem, workshop, stack, tried }) {
    const apiKey = window.getGeminiApiKey ? window.getGeminiApiKey() : "";

    if (!apiKey) {
      throw new Error("NO_KEY");
    }

    const systemInstruction = `Eres un profesor asistente experto en la Electiva de Inteligencia Artificial para ingeniería.
Tu objetivo es ayudar a un estudiante universitario a formular el MEJOR prompt posible para consultar a ChatGPT o Gemini sobre una duda técnica.

Analiza el problema del estudiante y genera un prompt claro, hiper-estructurado, profesional y sin ambigüedades.
El prompt resultante debe contener:
1. Rol asignado a la IA.
2. Contexto técnico del taller (${workshop}) y tecnologías (${stack.join(", ")}).
3. Descripción precisa del error.
4. Lo que ya se intentó para no repetir pasos obvios.
5. Criterios de respuesta paso a paso con código limpio y didáctico.

Devuelve ÚNICAMENTE el texto del prompt listo para ser copiado. No agregues saludos ni explicaciones antes o después.`;

    const userContent = `Módulo: ${workshop}
Stack: ${stack.join(", ")}
Error o duda: ${problem}
Ya intentó: ${tried}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: `${systemInstruction}\n\nDatos del estudiante:\n${userContent}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 800
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || "Error al comunicarse con la API de Gemini");
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error("No se recibió respuesta de Gemini");
    }

    return candidateText.trim();
  }
};

window.GeminiService = GeminiService;
