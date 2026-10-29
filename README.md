# HOT COMPANY S.A.S. — Sitio Web Corporativo

Sitio web corporativo para **HOT COMPANY S.A.S.** (NIT: 901.188.234-2), empresa colombiana de soluciones digitales con sede en Bogotá D. C.

Estética: **Dark Nightlife Premium** + **Glass System iOS/Liquid Glass** + **Acentos de Marca Naranja/Ámbar** (`#E10600`, `#FF6A13`, `#FFB020`).

---

## 🛠️ Stack Tecnológico

| Tecnología | Rol |
|---|---|
| **Vite 6** + **React 19** + **TypeScript** | Base de la aplicación |
| **Tailwind CSS v4** | Estilos atómicos y variables `@theme` |
| **Motion** (`motion/react`) | Animaciones 3D, parallax, spring |
| **Lenis** | Scroll inercial suave global |
| **React Router 7** | Enrutamiento SPA |
| **Lucide React** | Iconografía (trazo 1.5) |
| **Unbounded Variable** | Tipografía de títulos |
| **DM Sans Variable** | Tipografía de cuerpo |
| **JetBrains Mono Variable** | Datos técnicos (CIIU, NIT) |

---

## 📋 Requisitos

- **Node.js** `20.19+` o `22.12+`
- **npm** `10+`

---

## 🚀 Inicio Rápido

```bash
npm install              # Instalar dependencias
npm run dev              # Servidor de desarrollo en http://localhost:5173
npm run lint             # Linter ESLint
npx tsc --noEmit         # Verificación de tipos TypeScript
npm run build            # Build de producción (solo para validar)
```

---

## 📁 Estructura de Carpetas

```text
hotcompany.webside/
├── public/
│   ├── brand/                  # Activos de marca
│   │   ├── logo.jpeg           # Logo principal (dado 3D, fondo negro)
│   │   └── Logo-removebg-preview.jpg
│   ├── images/
│   │   └── carousel/           # Imágenes reales del carrusel (HC1.webp ... HC6.webp)
│   ├── videos/                 # Videos disponibles para el Hero
│   │   ├── hero-plexus.mp4     # Video 1: Plexus digital principal
│   │   ├── hero-poster.jpg     # Poster video 1
│   │   ├── HotCompani1.mp4     # Video 2 alternativo
│   │   ├── HotCompani1-poster.jpg
│   │   ├── HotCompani2.mp4     # Video 3 alternativo
│   │   └── HotCompani2-poster.jpg
│   ├── favicon-32.png          # Favicon 32×32 (generado con sips)
│   ├── favicon-192.png         # Favicon 192×192
│   ├── apple-touch-icon.png    # Apple Touch Icon 180×180
│   └── og-image.png            # Open Graph 630×630
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx        # Barra fija, glass-strong, links centrados, 4 links móvil
│   │   │   ├── Footer.tsx        # Datos legales, CIIU, aviso de no intermediación
│   │   │   ├── Loader.tsx        # Logo giratorio + barra de progreso
│   │   │   ├── CustomCursor.tsx  # Cursor personalizado (solo pointer:fine)
│   │   │   └── Background.tsx    # 4 orbes, dado flotante, cuadrícula, ruido
│   │   ├── sections/
│   │   │   ├── Hero.tsx          # Headline + CTA + Video plexus + Carrusel passepartout
│   │   │   ├── HeroVideo.tsx     # Video de fondo teñido a naranja con selector DEV ?video=N
│   │   │   ├── Carousel.tsx      # Carrusel coverflow passepartout 3:4 con hover progresivo
│   │   │   ├── Services.tsx      # Bento grid asimétrico con orbes de refracción
│   │   │   ├── HowItWorks.tsx    # Línea de tiempo vertical scroll-linked
│   │   │   └── Contact.tsx       # Formulario glass + panel WhatsApp y orbes ambientales
│   │   └── ui/
│   │       ├── Button.tsx        # Botón Halo Drift (píldora #050505, halo 7s, grid twinkle)
│   │       ├── WhatsAppIcon.tsx  # Icono SVG nativo de WhatsApp
│   │       ├── Card.tsx          # Card 3D tilt + spotlight
│   │       ├── Marquee.tsx       # Franja de capacidades con animación CSS
│   │       ├── SectionTitle.tsx  # Título de sección con badge y reveal
│   │       ├── Counter.tsx       # Contador animado en viewport
│   │       └── Reveal.tsx        # Entrada suave escalonada al scroll
│   ├── hooks/
│   │   ├── useReducedMotion.ts   # Detección de accesibilidad
│   │   └── useScrollDirection.ts # Detección de scroll para navbar inteligente
│   ├── lib/
│   │   └── constants.ts          # Fuente única de verdad (HERO_VIDEOS, CAROUSEL_SLIDES, etc.)
│   └── styles/
│       ├── index.css             # Tailwind v4, tipografías, resets
│       └── tokens.css            # Tokens CSS, sistema Glass, variables
```

---

## 🎥 Video de Fondo en el Hero (`HeroVideo.tsx`)

Ubicación: `src/components/sections/HeroVideo.tsx`  
Configuración: `HERO_VIDEOS` en `src/lib/constants.ts`

- **Video por defecto:** `HotCompani2.mp4` (primer elemento del array `HERO_VIDEOS`). El plexus digital pasa a ser `?video=2`.
- **Campo `tint`** (`'brand' | 'none'`, default `'brand'`): con `'brand'` aplica `sepia/saturate/hue-rotate` y la capa `mix-blend-color` de gradiente rojo-naranja para fundir cualquier tono frío a la paleta corporativa. Con `'none'` se omite todo el color grading (para videos que ya tengan paleta cálida).
- **Selector para pruebas en Desarrollo**:
  En entorno de desarrollo (`import.meta.env.DEV`), alterna entre videos con `?video=N` (índice base 1):
  - `?video=1` → `HotCompani2.mp4` (principal)
  - `?video=2` → `hero-plexus.mp4`
  - `?video=3` → `HotCompani1.mp4`
  *En producción, el parámetro se ignora y siempre carga el primero.*
- **Tratamiento visual**: Máscara `mask-image` inferior, capa oscura de contraste (WCAG AA), filtros de tinte suavizados (`sepia 80%, saturate 340%`).
- **Rendimiento y A11y**: `IntersectionObserver` pausa el video fuera del viewport; `prefers-reduced-motion` y Data Saver muestran el poster estático. Parallax sutil con `useScroll` (`transform: translateY` únicamente).

---

## 🔘 Botones "Halo Drift & Small Pixels" (`Button.tsx`)

Ubicación: `src/components/ui/Button.tsx`  
Todos los botones interactivos del sitio utilizan este único componente unificado con exactamente 2 variantes: `"primary"` y `"secondary"`.

### Características Visuales y de Interacción
- **Diseño base**: Píldora negra pura (`#050505`), tipografía DM Sans medium, borde fino translúcido, sombra interior y una línea de luz brillante en el borde superior en reposo.
- **Sin movimiento físico en hover**: El botón permanece quieto (sin elevación ni translación). Solo el estado `:active` conserva una microcompresión suave (`scale(0.98)`).
- **Reposo**: Un halo suave de luz radial naranja deriva lentamente en loop orgánico de ~7s (`buttonHaloDrift` en CSS puro).
- **Hover con Small Pixels**: El halo se intensifica y una trama de pequeños cuadritos (2px, separación ~6px, paleta naranja/ámbar) titila con fade escalonado dentro de una máscara radial centrada en el cursor (`--mx/--my` con rAF, sin re-renders de React).
- **Resplandor inferior**: Se enciende durante el hover con transición suave de ~300ms.
- **Variantes**:
  - `primary`: Halo y resplandor inferior intensos, acento ámbar/naranja de marca.
  - `secondary`: Borde ligeramente más visible y halo difuso más sutil.
- **Soporte polimórfico**: Renderiza como `<button>` o como `<a>` (`as="a"` o pasando prop `href`).
- **Estados y A11y**: `:focus-visible` con anillo naranja accesible, `isLoading` con spinner animado `Loader2`, destello en touch, y versión estática con `prefers-reduced-motion`.

---

## 🎠 Carrusel Coverflow Passepartout (`Carousel.tsx`)

Ubicación: `src/components/sections/Carousel.tsx`  
Imágenes: `public/images/carousel/` (`HC1.webp` ... `HC6.webp`)  
Datos: `CAROUSEL_SLIDES` en `src/lib/constants.ts`

### Funcionamiento y Estructura Visual
- **Dimensiones aumentadas**: Slide activo protagonista (~400×520px en escritorio, ~270×360px en móvil, proporción 3:4). En el Hero ocupa una grilla `lg:grid-cols-[5fr_7fr]`. Solo se muestran 2 vecinos (1 por lado) escalados a `0.8`, inclinados `rotateY: ±12°`, ligeramente abajo y atrás (`translateY: 16px`, `opacity: 0.7`, sin blur), parcialmente cubiertos por el slide activo. Slides más lejanos permanecen ocultos.
- **Marco "Passepartout"**: La imagen no toca el borde. Cada tarjeta posee un contenedor externo color fondo `#050505` con esquinas redondeadas de 40px, padding uniforme de 10–12px (`p-2.5 sm:p-3`), borde especular 145deg, y un contenedor interior concéntrico redondeado para la imagen con `overflow-hidden`.
- **Hover en tarjeta activa**: Estado `isRevealed` gestionado por React (Motion `initial/animate`) revela progresivamente un degradado desde abajo (~300ms, retraso 80ms para descripción). En táctil: siempre visible. `prefers-reduced-motion`: visible, sin animación.
- **Cursor de arrastre**: Cursor tipo `grab / grabbing` con título descriptivo "Arrastrar".
- **Navegación limpia**: Píldora de vidrio centrada debajo con puntos interactivos; el activo se alarga en `#FF6A13`. Drag/swipe con inercia, navegación con flechas de teclado `←` `→`, y autoplay de 5s con pausa en hover y foco.

---

## 🌀 Franja de Capacidades (`Marquee.tsx`)

Ubicación: `src/components/ui/Marquee.tsx`

- **Diseño plano y rápido**: Franja de altura fija 60px, borde superior e inferior translúcido. Animación CSS `translateX(0 → -50%)` a 15 s/vuelta (velocidad alta). Sin efectos 3D ni perspectiva.
- **Alternancia de estilos**: ítems impares con texto lleno `color:#A89F98`; ítems pares solo con contorno (`-webkit-text-stroke 0.8px`). Hover cambia icono y texto al acento de marca en 200 ms.
- **Separador pip**: cuadrado redondeado 6px, color acento, con rotación CSS continua lenta (4 s/vuelta).
- **Pausa**: en hover (JS `animationPlayState`) y fuera del viewport (IntersectionObserver).
- **Fade lateral**: `mask-image linear-gradient` transparente → negro al 8% / 92% → transparente.
- **Accesibilidad**: `aria-hidden="true"`. `prefers-reduced-motion` → franja estática sin animación.

---

## 🗂️ Bento Grid de Servicios (`Services.tsx`)

- **Desktop (lg+)**: Grilla 12 columnas, 2 filas con `grid-auto-rows: clamp(260px, 32svh, 340px)` (~280–320px c/u); gap 20px. Distribución asimétrica sin huecos:
  - Fila 1: `01 Soluciones Tecnológicas` (7 cols) + `02 Plataformas Digitales` (5 cols)
  - Fila 2: `03 Publicidad y Mercadeo` (5 cols) + `04 Comercio Electrónico` (7 cols)
- **Tablet**: 2 columnas iguales, altura automática. **Móvil**: 1 columna apilada.
- **Estructura interna `flex-col justify-between`**: Arriba → chip CIIU + numeral en contorno (top-right, bajo opacidad). Abajo → subtítulo mono, título, descripción `text-[15px] line-clamp-4 w-[90%]` + mini-tags de palabras clave en vidrio.
- **Tags por servicio** (en `constants.ts`, campo `tags: string[]`): `01` Software/Web/Apps móviles; `02` Portales/Contacto directo; `03` Mercadeo digital/Promoción; `04` Comercio en línea/Ventas.
- **Encabezado compacto**: Badge + título en fila horizontal en `sm+`. Vidrio, spotlight y hovers sin cambios.

---

## 💬 Canales de Contacto Directo & WhatsApp (`WhatsAppIcon.tsx`)

Ubicación: `src/components/ui/WhatsAppIcon.tsx`  
- **Icono vectorial nativo**: Dibujo SVG original de alta definición (globo de conversación con auricular telefónico).
- **Integración fluida**: Empleado en el CTA secundario del Hero y en la tarjeta de contacto rápido en la sección Contacto, conectando directamente al enlace oficial `https://wa.me/573502418881`.
- **Navbar optimizado**: La cabecera desktop cuenta con enlaces perfectamente centrados y estética limpia sin botones flotantes sobrantes; el menú móvil conserva únicamente los 4 enlaces de navegación principales.

---

## 🪟 Sistema Glass (iOS / Liquid Glass)

Clases en `src/styles/tokens.css`:

| Clase | Uso |
|---|---|
| `.glass` | Tarjetas, chips, badges, controles |
| `.glass-strong` | Navbar, menú móvil, paneles informativos |
| `.glass-tint-warm` | Tarjetas destacadas (naranja/rojo sutil) |
| `.glass-spotlight` | + pseudo `::after` que sigue al mouse via CSS vars |

- **Orbes ambientales**: Se distribuyen orbes de gradiente (rojo, naranja, ámbar) de baja opacidad detrás de las secciones (Servicios, Cómo Funciona, Contacto) para dotar de color y refracción viva al efecto de desenfoque de vidrio sin comprometer el contraste AA.

---

## ♿ Accesibilidad y Rendimiento

- Contraste AA en texto principal sobre fondos oscuros.
- Focus visible en todos los elementos interactivos con anillo de marca.
- Carrusel con `role="region"`, `aria-roledescription="carrusel"`, `aria-live="polite"` cuando está pausado.
- `prefers-reduced-motion`: desactiva Lenis, autoplay del carrusel, efectos 3D, y mantiene el video en poster fijo.
- `prefers-reduced-transparency`: fallback sólido en todas las clases glass.
- Animaciones limitadas a `transform` y `opacity` para máxima aceleración por hardware a 60/120 fps.

---

## 🚀 Despliegue a Producción (Hostinger)

El proyecto está preparado para desplegarse como un Single Page Application (SPA) estático en servidores Apache/cPanel de **Hostinger**.

### 1. Requisitos del Entorno
- **Node.js**: Versión `20.19+` o `22.12+` (LTS recomendada).
- **npm**: Versión `10+`.
- **Variables de Entorno**:
  - Archivo `.env` (o configurar variables de entorno en el panel de CI/CD):
    ```bash
    VITE_FORM_ENDPOINT=https://formspree.io/f/tu-endpoint-aqui
    ```
  - *Nota:* Si `VITE_FORM_ENDPOINT` se deja vacío o no se define, el formulario activa automáticamente el respaldo transparente hacia WhatsApp sin emitir falsos éxitos.

### 2. Comandos de Compilación
```bash
# 1. Instalar dependencias exactas
npm install

# 2. Validar tipos y linter
npm run lint
npx tsc --noEmit

# 3. Compilar bundle de producción
npm run build
```

El resultado de la compilación se genera en la carpeta `dist/`.

### 3. Funcionamiento de `.htaccess` en Hostinger
Durante el `build`, Vite copia automáticamente el archivo `public/.htaccess` a la raíz de `dist/`. Este archivo es esencial en Hostinger para:
1. **Enrutamiento SPA (`mod_rewrite`):** Redirige todas las peticiones a rutas internas (como `/privacidad`) hacia `index.html`, evitando errores 404 de Apache al recargar o acceder directamente.
2. **Encabezados de Seguridad (`mod_headers`):** Aplica políticas estrictas de `Content-Security-Policy` (CSP), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security` (HSTS) y `Permissions-Policy`.
3. **Caché Optimizado:** Establece `Cache-Control: max-age=31536000, public, immutable` para todos los assets con hash (`.js`, `.css`, fuentes, imágenes, videos) y `no-cache` para `index.html`.

### 4. Checklist de Despliegue

#### Pre-deploy:
- [ ] Ejecutar `npm run build` y comprobar que no haya errores de compilación ni chunks mayores a 250 kB.
- [ ] Verificar que `.env` contenga el endpoint de formulario definitivo (`VITE_FORM_ENDPOINT`).
- [ ] Confirmar que `public/.htaccess` esté presente en la raíz de `dist/`.

#### Deploy a Hostinger:
1. Acceder al **Administrador de Archivos** (o cliente SFTP) en hPanel de Hostinger.
2. Navegar a la carpeta pública del dominio: `public_html/`.
3. Subir el **contenido** de la carpeta `dist/` (asegurarse de subir también archivos ocultos como `.htaccess`).

#### Post-deploy:
- [ ] Probar la navegación a la página principal `https://hotcompany.com/`.
- [ ] Acceder directamente a `https://hotcompany.com/privacidad` y verificar que cargue sin error 404 de Apache.
- [ ] Probar el formulario de contacto con datos de prueba (verificar recepción en el endpoint o redirección correcta a WhatsApp).
- [ ] Verificar en la consola de red (DevTools) que los encabezados de seguridad (`CSP`, `HSTS`, `X-Frame-Options`) estén activos.
- [ ] Comprobar que `https://hotcompany.com/robots.txt` y `https://hotcompany.com/sitemap.xml` respondan correctamente.

---

## ⚖️ Aviso Legal

- **Modelo de no intermediación**: el acuerdo, tarifas y pago se realizan directamente entre el usuario y el prestador independiente. La plataforma no interviene financieramente.
- **CIIU registradas**: 6201 (Desarrollo informático) · 6312 (Portales web) · 7310 (Publicidad) · 4791 (Comercio por Internet).

---

## 📌 Pendientes / TODO

1. [ ] **Textos finales**: aprobación de copies por el equipo comercial (buscar `// TODO:` en `constants.ts`).
2. [ ] **Logo vectorial**: exportar SVG o PNG transparente de alta resolución para fondos claros.
3. [x] **Backend del formulario**: conectado vía `VITE_FORM_ENDPOINT` con fallback automático a WhatsApp.
4. [ ] **Analítica**: integrar Google Tag Manager / GA4 o Plausible.
5. [x] **Política de Privacidad**: redactada según Ley 1581 de 2012 y activa en `/privacidad`.
6. [ ] **Términos y Condiciones**: redactar documento definitivo para `/terminos`.
