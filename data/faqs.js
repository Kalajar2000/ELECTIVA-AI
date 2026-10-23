// Base de preguntas frecuentes iniciales de la Electiva de IA
// Cada pregunta incluye su contador verificado por el profesor y etiquetas de búsqueda

const INITIAL_FAQS = [
  {
    id: "faq-producto-asistencia",
    category: "asistencia",
    categoryLabel: "📋 Asistencia y Formatos",
    count: 37,
    title: "¿Qué pongo en “producto” en el formulario de asistencia?",
    summary: "Pon el entregable tangible de tu equipo (ej. commit de GitHub, frame de Figma o documento en Classroom). No pongas tu nombre ni 'asistí'.",
    tags: ["producto", "asistencia", "formulario", "entrega", "link", "github", "figma", "classroom", "presente"],
    classRef: "Clase 03 • Min 14:20",
    details: {
      purpose: "El campo 'Producto' sirve estrictamente para comprobar el avance tangible de tu equipo durante las 2 horas de taller práctico. No es un pase de lista pasivo; es evidencia de ejecución semanal.",
      allowed: [
        "Enlace al commit de GitHub: ej. github.com/org/repo/commit/4a8f9b...",
        "Link directo al frame de Figma: con permisos de lectura para el correo institucional.",
        "Nombre exacto del archivo subido a Classroom: ej. 'Borrador PRD sección 2 - Grupo 4'."
      ],
      forbidden: [
        "Escribir únicamente 'Asistí a clase', 'Presente', tu propio nombre o 'trabajamos en grupo'. Estos registros quedan como no válidos."
      ],
      template: "Entrega S04: [Hito] - Rama: feature/ia-core"
    }
  },
  {
    id: "faq-prd-lluvia-ideas",
    category: "prd",
    categoryLabel: "🚀 Entregas & PRD",
    count: 29,
    title: "¿El PRD es lo mismo que la lluvia de ideas?",
    summary: "No. La lluvia de ideas es exploración libre; el PRD formaliza requerimientos funcionales, métricas y alcance técnico del prototipo.",
    tags: ["prd", "lluvia de ideas", "brainstorming", "ideas", "requerimientos", "documento", "entrega", "alcance"],
    classRef: "Clase 02 • Guía en Notion",
    details: {
      purpose: "El PRD (Product Requirements Document) es el contrato funcional del software. Define qué problema resuelve, quién es el usuario y qué hace y no hace la aplicación.",
      allowed: [
        "Problema validado con contexto real del usuario.",
        "Las 4 funciones esenciales delimitadas sin ambigüedad.",
        "Sección explícita de 'Lo que NO hace' para acotar el prototipo."
      ],
      forbidden: [
        "Listas de deseos infinitas sin priorización.",
        "Ideas generales sin criterios de aceptación o pruebas."
      ],
      template: "Plantilla Oficial PRD: [Materia][Grupo X] - Documento de Requerimientos v1.0"
    }
  },
  {
    id: "faq-antigravity-permisos",
    category: "antigravity",
    categoryLabel: "🔑 Antigravity & Permisos",
    count: 24,
    title: "¿Qué escoger cuando Antigravity pide permiso de administrador?",
    summary: "Otorga acceso únicamente a la carpeta de tu proyecto (workspace). Nunca otorgues permisos sudo globales ni compartas llaves privadas.",
    tags: ["antigravity", "permisos", "administrador", "admin", "workspace", "sudo", "carpeta", "seguridad"],
    classRef: "Guía de Instalación CLI",
    details: {
      purpose: "Antigravity necesita leer y escribir dentro del directorio del proyecto para crear código y correr pruebas locales de manera segura en un entorno aislado.",
      allowed: [
        "Autorizar acceso exclusivo a la carpeta de tu repositorio local.",
        "Permitir la ejecución de comandos estándar de Node, Python o Git en el proyecto."
      ],
      forbidden: [
        "Ejecutar el entorno con 'sudo' o dar acceso al disco raíz (/System o ~/.ssh).",
        "Subir credenciales o tokens personales al código fuente."
      ],
      template: "Permiso recomendado: 'Workspace only - Sandboxed'"
    }
  },
  {
    id: "faq-invitacion-github",
    category: "github",
    categoryLabel: "🐙 GitHub & Repo",
    count: 19,
    title: "¿Qué hacer si no me llega la invitación de GitHub de la organización?",
    summary: "Entra directo a github.com/orgs/electiva-ia/invitation con tu sesión iniciada o verifica que registraste tu usuario exacto sin @.",
    tags: ["github", "invitacion", "organizacion", "repo", "repositorio", "correo", "acceso"],
    classRef: "Documentación GitHub Classroom",
    details: {
      purpose: "Los correos de invitación suelen caer en Spam o ser retenidos por el firewall del correo universitario.",
      allowed: [
        "Ingresar en el navegador a: github.com/orgs/[organizacion]/invitation.",
        "Verificar en la configuración de GitHub que tu correo universitario esté verificado.",
        "Comprobar que pasaste tu usuario exacto (sin arroba ni espacios)."
      ],
      forbidden: [
        "Crear un repositorio personal por fuera de la organización oficial (no se calificará).",
        "Esperar al día de la entrega para avisar que no tenías acceso."
      ],
      template: "Enlace directo: https://github.com/orgs/electiva-ia-2025/invitation"
    }
  },
  {
    id: "faq-companero-no-responde",
    category: "asistencia",
    categoryLabel: "📋 Asistencia y Formatos",
    count: 15,
    title: "¿Qué hacer si un compañero de equipo no responde?",
    summary: "Deja constancia en los commits de GitHub y en el chat grupal. Si pasan más de 48h sin respuesta antes de la entrega, repórtalo en el formulario.",
    tags: ["compañero", "equipo", "grupo", "no responde", "desaparecido", "participacion", "avance"],
    classRef: "Reglamento del Curso • Sección 4",
    details: {
      purpose: "La evaluación en la electiva es individual y por equipo. Cada estudiante debe tener evidencia de commits y aportes en el repositorio.",
      allowed: [
        "Dejar registro de los intentos de contacto en el chat oficial del equipo.",
        "Avanzar con los compañeros activos y asignar tareas de forma transparente en los Pull Requests.",
        "Reportar la novedad en el formulario semanal de seguimiento de avance."
      ],
      forbidden: [
        "Eliminar al compañero sin aviso previo al profesor.",
        "Dejar de entregar el proyecto justificándose en la inacción de otro miembro."
      ],
      template: "Reporte de novedad: [Equipo X] - Ausencia de integrante > 48h hábiles"
    }
  },
  {
    id: "faq-primera-entrega",
    category: "prd",
    categoryLabel: "🚀 Entregas & PRD",
    count: 42,
    title: "¿Cuándo y cómo se entrega la primera versión del proyecto?",
    summary: "La fecha límite es el miércoles antes del Hito 1 a las 23:59. Se entrega mediante commit en la rama 'main' de tu repositorio de GitHub.",
    tags: ["entrega", "primera version", "v1", "fecha", "plazo", "hora", "limite", "miercoles", "main"],
    classRef: "Cronograma del Sílabo",
    details: {
      purpose: "El Hito 1 valida que el equipo cuenta con el PRD aprobado, el frontend interactivo montado y la base del repositorio sincronizada.",
      allowed: [
        "Hacer commit y push a la rama 'main' antes de las 23:59 del miércoles.",
        "Incluir el README.md actualizado con las instrucciones de ejecución local."
      ],
      forbidden: [
        "Enviar archivos .zip por correo institucional.",
        "Hacer commits posteriores a las 23:59 sin autorización previa (se toma el hash anterior)."
      ],
      template: "Formato de commit de entrega: 'release: entrega hito 1 v1.0.0'"
    }
  },
  {
    id: "faq-grabacion-asistencia",
    category: "asistencia",
    categoryLabel: "📋 Asistencia y Formatos",
    count: 31,
    title: "¿Si veo la grabación de la clase me cuenta como asistencia?",
    summary: "No. Las grabaciones son material de consulta. La asistencia se valida únicamente en la sesión en vivo con el registro del campo 'Producto'.",
    tags: ["grabacion", "video", "asistencia", "falta", "asistir", "reponer", "sesion", "zoom", "meet"],
    classRef: "Políticas Académicas Institucionales",
    details: {
      purpose: "La electiva es un taller práctico sincrónico donde se resuelven bloqueos y se programa en equipo en tiempo real.",
      allowed: [
        "Ver la grabación para ponerse al día antes de la siguiente clase.",
        "Tramitar incapacidad médica oficial en caso de fuerza mayor ante la secretaría académica."
      ],
      forbidden: [
        "Llenar el formulario de asistencia de forma extemporánea o pidiendo a un compañero que lo llene.",
        "Considerar la visualización del video como reemplazo de la participación en taller."
      ],
      template: "Justificación médica: radicada por el sistema oficial de la universidad"
    }
  },
  {
    id: "faq-cambio-grupo",
    category: "asistencia",
    categoryLabel: "📋 Asistencia y Formatos",
    count: 18,
    title: "¿Alguien se puede cambiar de grupo?",
    summary: "Los cambios solo se permiten durante la primera semana. Luego de aprobado el PRD los grupos son definitivos para simular equipos de desarrollo reales.",
    tags: ["cambio", "grupo", "equipo", "cambiar", "integrantes", "traslado"],
    classRef: "Clase 01 • Metodología de Equipos",
    details: {
      purpose: "Simular dinámicas ágiles reales de la industria tecnológica donde los equipos deben gestionar desacuerdos técnicos y entregar resultados.",
      allowed: [
        "Resolver diferencias técnicas mediante votaciones o mediación en asesoría con el profesor.",
        "Solicitar reubicación únicamente si ambos grupos involucrados están de acuerdo y la solicitan en la semana 1."
      ],
      forbidden: [
        "Desarmar equipos a mitad de semestre dejando a compañeros sin proyecto.",
        "Trabajar de forma individual sin autorización expresa del profesor."
      ],
      template: "Solicitud semana 1: Solicitud mutua de intercambio de integrantes"
    }
  }
];

// Hacer disponible globalmente
if (typeof window !== "undefined") {
  window.INITIAL_FAQS = INITIAL_FAQS;
}
