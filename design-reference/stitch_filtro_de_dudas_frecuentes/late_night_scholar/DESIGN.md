---
name: Late Night Scholar
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#474651'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#777682'
  outline-variant: '#c8c5d3'
  surface-tint: '#5654a8'
  primary: '#1a146b'
  on-primary: '#ffffff'
  primary-container: '#312e81'
  on-primary-container: '#9c9af4'
  inverse-primary: '#c3c0ff'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#002b1b'
  on-tertiary: '#ffffff'
  tertiary-container: '#00432d'
  on-tertiary-container: '#40b888'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#100563'
  on-primary-fixed-variant: '#3e3c8f'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 34px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system bridges the gap between structured academic protocol and the late-night reality of tired university students. It balances an authoritative university tone with self-aware levity, empathy, and conversational reassurance.

- **Design Persona:** The empathetic teaching assistant who stays up late, respects your time, values clear documentation, and gently reminds you to check the syllabus before sending an email at 3:17 AM.
- **Visual Aesthetic:** Minimalist editorial utility with soft tactile warmth. Crisp, legible layouts supported by elevated, paper-like cards, structured informational callouts, and expressive accent highlights.
- **Emotional Intent:** Reduces student anxiety, stops frantic inbox spam, and rewards self-sufficiency through clear search pathways and instant clarity.

## Colors

The palette employs a warm off-white canvas with dark slate text for extended nighttime reading comfort without full dark-mode glare.

- **Primary (`#312E81` - Deep Indigo):** Foundational anchor for navigation bars, primary calls to action, active tab indicators, and major headers. Establishes institutional gravitas.
- **Secondary (`#F59E0B` - Vibrant Amber):** Alert and dynamic activity color. Exclusively reserved for hit frequency badges (e.g., *"Preguntado 42 veces"*), attention notices, and "before sending" warning tags.
- **Tertiary (`#059669` - Crisp Emerald):** Positive feedback color. Used for instant copy confirmations, "Resolved" status chips, and definitive answer callout borders.
- **Neutral (`#1E293B` - Deep Slate):** Primary typographic tone and dense UI borders. Paired with background tints (`#FBFBF9` warm off-white surface, `#F1F3F5` container surfaces) to maintain high contrast while reducing eye strain.

### Functional Category Tags
- **Asistencia:** Slate Indigo tint (`#EEF2FF` surface, `#3730A3` text).
- **PRD & Entregas:** Terracotta Crimson tint (`#FEF2F2` surface, `#991B1B` text).
- **Herramientas & Permisos:** Amber Gold tint (`#FFFBEB` surface, `#92400E` text).
- **GitHub & Código:** Emerald Green tint (`#ECFDF5` surface, `#065F46` text).

## Typography

The typography structure separates expressive conversational signposts from reading prose.

- **Headlines (Plus Jakarta Sans):** Geometric, welcoming, and energetic. The tight tracking and heavy weight deliver an approachable, human, yet resolute tone across query titles and hero statements.
- **Body & Labels (Inter):** Neutral, robust, and highly functional. Inter handles dense technical instructions, snippet breakdowns, copyable templates, and metadata chips without distraction or fatigue.

## Layout & Spacing

A structured 12-column grid system anchors the desktop experience with generous safe zones and distinct vertical rhythm.

- **Desktop (1024px+):** 12-column fluid grid locked inside a max container width of `1200px`. Uses `gutter` (1.5rem) and outer `margin` (2rem). Left 4 columns hold sticky filters, search presets, and topic categorization. Right 8 columns present the accordion feed, resolution paths, and draft templates.
- **Tablet (768px - 1023px):** 8-column layout. Filters collapse into a horizontally scrollable chip track beneath the search bar.
- **Mobile (< 768px):** 4-column layout. Margin shrinks to `1rem`. Action cards stack sequentially with tight inner vertical spacing (`space-md`). Sticky action headers provide zero-latency access to the global search modal.

## Elevation & Depth

Visual hierarchy relies on crisp, paper-like tonal layers backed by warm-tinted ambient shadows rather than harsh drop shadows.

- **Level 0 (Canvas):** Warm off-white (`#FBFBF9`), non-reflective, flat base.
- **Level 1 (Card Default):** Pure White (`#FFFFFF`) with a subtle 1px border (`#E2E8F0`) and an ambient shadow: `0 2px 4px rgba(30, 41, 59, 0.04), 0 8px 16px rgba(30, 41, 59, 0.03)`.
- **Level 2 (Hover / Active Expansion):** Slightly elevated card state: `0 4px 6px -1px rgba(49, 46, 129, 0.06), 0 12px 24px -2px rgba(49, 46, 129, 0.08)`. Border shifts to an indigo tint (`#C7D2FE`).
- **Level 3 (Modal / Search Palette):** Overlay surface with strong backdrop blur (`backdrop-filter: blur(8px); background: rgba(251, 251, 249, 0.92)`) bounded by `0 20px 25px -5px rgba(15, 23, 42, 0.12)`.

## Shapes

The design uses standard rounded geometry (`0.5rem` / `8px` base) to project friendliness and modernity while keeping structural alignments precise.

- **Components (`rounded-md` - 0.5rem):** Input containers, buttons, question cards, code snippets, and modal dialogue containers.
- **Badges & Chips (`rounded-full`):** Category tags, counter badges, and hit pills use full pill shaping to differentiate them from actionable rectangular inputs.
- **Structural Groupings (`rounded-lg` - 1rem):** Master hero blocks, email draft templates, and sticky query sidebars.

## Components

### Buttons
- **Primary:** Deep Indigo (`#312E81`) background, white text, bold font (`label-lg`), `0.5rem` border radius, subtle hover elevation (`Level 2`).
- **Secondary / Ghost:** Transparent background, slate text (`#1E293B`), 1px slate-gray border (`#CBD5E1`). On hover: warm neutral background (`#F1F5F9`).
- **Action (Emerald Copy):** For "Copiar plantilla de email". On trigger, transitions seamlessly to Emerald (`#059669`) with checkmark indicator and instant visual feedback.

### FAQ Cards & Accordions
- Default state: Level 1 white card, displaying question title (`headline-sm`), topic badge, and the Amber frequency badge on the top right.
- Expanded state: Expands vertically to reveal concise direct answers, immediate action links (e.g., direct PRD link), and a copyable email template if reaching out is still needed.
- Left-hand accent indicator: A 4px vertical pill on the card's left edge (Emerald for verified professor answers, Indigo for course rules).

### Topic Badges & Hit Counters
- **Category Chips:** Pill-shaped, small uppercase typography (`label-sm`), low-saturation pastel backgrounds with dark high-contrast foreground text.
- **Hit Counter Badge:** Flame or alert icon prefix paired with amber tinting (`#FEF3C7` background, `#B45309` text). Text pattern: *"37 veces este semestre"*.

### Search Field (Hero & Sticky)
- Prominent input field with deep slate search icon and keyboard navigation shortcut (`Ctrl + K` or `⌘K`).
- Soft shadow, 1.5px border in Slate-200, transitioning to a 2px Indigo ring when focused.
- Placeholder text: *"Busca antes de enviar ese correo: entregas, repositorios, faltas..."*

### Email Draft Box ("Si aún necesitas escribir...")
- Contained inner box with dotted border (`#CBD5E1`) and pale paper tone (`#F8FAFC`).
- Pre-filled template complete with proper subject line conventions: `[Materia][Grupo X] Consulta: {Tema}`.
- Includes a direct "Copiar al portapapeles" floating utility button.