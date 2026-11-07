# HOT COMPANY S.A.S. — Sitio Web Corporativo

Sitio web corporativo para **HOT COMPANY S.A.S.** (NIT: 901.188.234-2), empresa colombiana de soluciones digitales con sede en Bogotá D. C.  
Dominio canónico de producción: **`https://hotcompany.app`**

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
npm run sync:landing     # Compilar y sincronizar landing /desarrollo desde ../Firma-React
npm run lint             # Linter ESLint
npx tsc --noEmit         # Verificación de tipos TypeScript
npm run build            # Build de producción
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
│   │   └── carousel/           # Imágenes del carrusel (HC1.webp ... HC6.webp)
│   ├── videos/                 # Videos para el Hero
│   │   ├── hero-hc1.mp4        # Video principal por defecto
│   │   ├── hero-hc1-poster.jpg # Poster video principal
│   │   ├── hero-plexus.mp4     # Video alternativo solo para DEV (?video=2)
│   │   └── hero-poster.jpg     # Poster video alternativo DEV
│   ├── desarrollo/             # Landing externa sincronizada desde ../Firma-React
│   │   ├── .htaccess           # Configuración Apache y CSP propio de la landing
│   │   ├── index.html          # Entry point compilado de la landing
│   │   └── assets/             # Bundles y media de la landing
│   ├── favicon-32.png          # Favicon 32×32
│   ├── favicon-192.png         # Favicon 192×192
│   ├── apple-touch-icon.png    # Apple Touch Icon 180×180
│   ├── og-image.png            # Open Graph
│   ├── robots.txt              # Reglas de indexación
│   ├── sitemap.xml             # Mapa del sitio canónico
│   └── .htaccess               # Configuración Apache principal (SPA, compresión, caché, seguridad)
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx        # Barra fija, glass-strong, links centrados, menú móvil
│   │   │   ├── Footer.tsx        # Datos legales, enlace a /desarrollo/, aviso de no intermediación
│   │   │   ├── Loader.tsx        # Logo giratorio + barra de progreso
│   │   │   ├── CustomCursor.tsx  # Cursor personalizado (solo pointer:fine)
│   │   │   └── Background.tsx    # Orbes, dado flotante, cuadrícula, ruido
│   │   ├── legal/
│   │   │   └── LegalPage.tsx     # Plantilla unificada para páginas legales
│   │   ├── sections/
│   │   │   ├── Hero.tsx          # Headline + CTA + Video principal + Carrusel passepartout
│   │   │   ├── HeroVideo.tsx     # Video de fondo protegido por import.meta.env.DEV
│   │   │   ├── Carousel.tsx      # Carrusel coverflow passepartout 3:4 con hover progresivo
│   │   │   ├── Services.tsx      # Bento grid asimétrico con orbes de refracción
│   │   │   ├── HowItWorks.tsx    # Línea de tiempo vertical scroll-linked
│   │   │   └── Contact.tsx       # Formulario glass + panel WhatsApp y orbes ambientales
│   │   └── ui/
│   │       ├── Button.tsx        # Botón Halo Drift (píldora #050505, halo 7s, grid twinkle)
│   │       ├── WhatsAppIcon.tsx  # Icono SVG nativo de WhatsApp
│   │       └── Marquee.tsx       # Franja de capacidades con animación CSS
│   ├── hooks/
│   │   ├── useReducedMotion.ts   # Detección de accesibilidad
│   │   └── useScrollDirection.ts # Detección de scroll para navbar inteligente
│   ├── lib/
│   │   ├── constants.ts          # Constantes de contenido, empresa y UI
│   │   └── legal.ts              # Contenido estructurado de Privacidad y Términos
│   ├── pages/
│   │   ├── Home.tsx              # Página principal SPA
│   │   ├── Privacy.tsx           # Política de Privacidad (/privacidad)
│   │   ├── Terms.tsx             # Términos y Condiciones (/terminos)
│   │   └── NotFound.tsx          # Página 404
│   ├── App.tsx                   # Rutas y providers globales
│   └── styles/
│       ├── index.css             # Tailwind v4, tipografías, resets
│       └── tokens.css            # Tokens CSS, sistema Glass, variables
```

---

## 🚦 Enrutamiento

| Ruta | Componente / Comportamiento |
|---|---|
| `/` | `Home.tsx` — Página principal corporativa |
| `/privacidad` | `Privacy.tsx` — Política de Privacidad y Tratamiento de Datos |
| `/terminos` | `Terms.tsx` — Términos y Condiciones de Uso (Canónica) |
| `/terminos-y-condiciones` | Redirección 301 con `<Navigate to="/terminos" replace />` |
| `/desarrollo/` | Landing estática externa servida independientemente desde `public/desarrollo/` |
| `*` | `NotFound.tsx` — Pantalla 404 personalizada |

---

## 🎥 Video de Fondo en el Hero (`HeroVideo.tsx`)

Ubicación: `src/components/sections/HeroVideo.tsx`  
Configuración: `HERO_VIDEOS` en `src/lib/constants.ts`

- **Video por defecto en producción:** `hero-hc1.mp4` con `tint: 'none'` y poster `hero-hc1-poster.jpg`.
- **Selector DEV para pruebas internas:**  
  Protegido estrictamente con `import.meta.env.DEV`. Solo en entorno de desarrollo permite probar el video alternativo:
  - `?video=1` → `hero-hc1.mp4` (principal)
  - `?video=2` → `hero-plexus.mp4` (dev-only, no destinado a producción)
  *En producción (`npm run build`), el query param se ignora por completo y siempre se reproduce `hero-hc1.mp4`.*
- **Tratamiento visual**: Máscara `mask-image` inferior, capa oscura de contraste (WCAG AA).
- **Rendimiento y A11y**: `IntersectionObserver` pausa el video fuera del viewport; `prefers-reduced-motion` y Data Saver muestran el poster estático. Parallax sutil con `useScroll` (`transform: translateY` únicamente).

---

## 💻 Landing Externa `/desarrollo/`

La landing de desarrollo está construida como un proyecto Vite independiente ubicado en `../Firma-React`.
- **Sincronización:** Mediante el comando `npm run sync:landing`, el proyecto compila con base `/desarrollo/` y copia los archivos generados a `public/desarrollo/`.
- **Seguridad y Aislamiento:** Posee su propio archivo `public/desarrollo/.htaccess` con políticas CSP adaptadas a sus librerías internas y scripts.
- **Acceso:** Enlazada en el footer del sitio corporativo mediante enlace estándar `<a href="/desarrollo/">` con recarga completa.

---

## 🔘 Botones "Halo Drift & Small Pixels" (`Button.tsx`)

Ubicación: `src/components/ui/Button.tsx`  
Todos los botones interactivos del sitio utilizan este único componente unificado con exactamente 2 variantes: `"primary"` y `"secondary"`.

### Características Visuales y de Interacción
- **Diseño base**: Píldora negra pura (`#050505`), tipografía DM Sans medium, borde fino translúcido, sombra interior y una línea de luz brillante en el borde superior en reposo.
- **Sin movimiento físico en hover**: El botón permanece quieto (sin elevación ni translación). Solo el estado `:active` conserva una microcompresión suave (`scale(0.98)`).
- **Reposo**: Un halo suave de luz radial naranja deriva lentamente en loop orgánico de ~7s (`buttonHaloDrift` en CSS puro).
- **Hover con Small Pixels**: El halo se intensifica y una trama de pequeños cuadritos titila con fade escalonado dentro de una máscara radial centrada en el cursor (`--mx/--my` con rAF).
- **Variantes**:
  - `primary`: Halo y resplandor inferior intensos, acento ámbar/naranja de marca.
  - `secondary`: Borde ligeramente más visible y halo difuso más sutil.
- **Soporte polimórfico**: Renderiza como `<button>` o como `<a>` (`as="a"` o pasando prop `href`).

---

## 🎠 Carrusel Coverflow Passepartout (`Carousel.tsx`)

Ubicación: `src/components/sections/Carousel.tsx`  
Imágenes: `public/images/carousel/` (`HC1.webp` ... `HC6.webp`)  
Datos: `CAROUSEL_SLIDES` en `src/lib/constants.ts`

- **Marco "Passepartout"**: Contenedor externo `#050505` con esquinas redondeadas de 40px, padding de 10–12px, borde especular y contenedor interior redondeado para la imagen.
- **Hover en tarjeta activa**: Revela progresivamente el texto y degradado con Motion. En táctil siempre visible; estático bajo `prefers-reduced-motion`.
- **Navegación**: Drag/swipe con inercia, flechas de teclado `←` `→`, autoplay de 5s con pausa en hover y foco.

---

## 🌀 Franja de Capacidades (`Marquee.tsx`)

Ubicación: `src/components/ui/Marquee.tsx`

- **Diseño plano y rápido**: Franja de altura fija 60px, borde translúcido. Animación CSS continua a 15 s/vuelta.
- **Pausa**: En hover y cuando el componente no está visible en el viewport (`IntersectionObserver`).
- **Accesibilidad**: `aria-hidden="true"`, se desactiva bajo `prefers-reduced-motion`.

---

## 🗂️ Bento Grid de Servicios (`Services.tsx`)

- **Distribución asimétrica**:
  - Fila 1: `01 Soluciones Tecnológicas` + `02 Plataformas Digitales`
  - Fila 2: `03 Publicidad y Mercadeo` + `04 Comercio Electrónico`
- **Estructura**: Arriba chip CIIU + numeral. Abajo título, descripción y mini-tags de palabras clave.

---

## 💬 Contacto & WhatsApp

- **Formulario conectado**: Gestionado a través de `VITE_FORM_ENDPOINT`. En ausencia de endpoint, activa un fallback directo y transparente a WhatsApp oficial (`+57 312 661 1763`).
- **Icono nativo**: SVG vectorial optimizado en `WhatsAppIcon.tsx`.

---

## 🚀 Despliegue a Producción (Hostinger)

El proyecto está preparado para desplegarse como un Single Page Application (SPA) estático en servidores Apache de **Hostinger**.

### 1. Variables de Entorno
Crea un archivo `.env.production` (o configura la variable en tu entorno de build):
```bash
VITE_FORM_ENDPOINT=https://tu-endpoint-de-formulario.com
```

### 2. Comandos de Compilación
```bash
# 1. Sincronizar landing externa
npm run sync:landing

# 2. Validar tipos y linter
npm run lint
npx tsc --noEmit

# 3. Compilar bundle de producción
npm run build
```

El resultado se genera en la carpeta `dist/`.

### 3. Funcionamiento de `.htaccess`
Durante el build, Vite copia `public/.htaccess` a `dist/`. Este archivo gestiona:
1. **Redirecciones canónicas (301):**
   - HTTP → HTTPS (a prueba de proxy mediante `%{HTTP:X-Forwarded-Proto}`).
   - `www.hotcompany.app` → `https://hotcompany.app`.
   - `/terminos-y-condiciones` → `https://hotcompany.app/terminos`.
2. **Fallback SPA:** Redirige URLs inexistentes a `index.html` (respetando carpetas existentes como `/desarrollo/`).
3. **Compresión Gzip / Deflate:** Comprime HTML, CSS, JS, SVG, JSON y fuentes.
4. **Caché diferenciado:**
   - Bundles `.js`, `.css` y fuentes: `max-age=31536000, public, immutable`.
   - Imágenes y videos: `max-age=2592000, public`.
   - `index.html`: `no-cache, no-store, must-revalidate`.
5. **Encabezados de Seguridad:** HSTS prudente (`max-age=86400`), CSP estricto, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.

---

## 📋 Checklist de Despliegue

### Pre-deploy:
- [ ] Asegurarse de que el certificado SSL esté instalado y activo en Hostinger para `hotcompany.app` y `www.hotcompany.app` antes de publicar.
- [ ] Configurar `VITE_FORM_ENDPOINT` en `.env.production` con el endpoint definitivo y recompilar con `npm run build`.
- [ ] Verificar que `public/og-image.png` tenga una versión final de 1200×630 px (proporción 1.91:1) proporcionada por diseño.
- [ ] Confirmar que `dist/.htaccess` y `dist/desarrollo/.htaccess` estén presentes.

### Post-deploy:
- [ ] **Redirecciones:** Ejecutar `curl -I http://hotcompany.app` y confirmar respuesta `301` hacia `https://hotcompany.app/`.
- [ ] **Ruta legal:** Probar acceso directo a `https://hotcompany.app/privacidad` y `https://hotcompany.app/terminos` (confirmar status 200 sin 404).
- [ ] **Caché:** Ejecutar `curl -I https://hotcompany.app/` y comprobar `Cache-Control: no-cache, no-store, must-revalidate`.
- [ ] **Landing `/desarrollo/`:** Acceder a `https://hotcompany.app/desarrollo/` y verificar en la consola de DevTools que no existan bloqueos de CSP.
- [ ] **Formulario:** Enviar prueba y verificar recepción en endpoint o redirección a WhatsApp sin errores.

---

## 📌 Pendientes y Aprobaciones del Equipo

1. [ ] **Endpoint del formulario**: Recibir y configurar la URL definitiva de Juan en `VITE_FORM_ENDPOINT`.
2. [ ] **Aprobación de copys comerciales**: Revisión de afirmaciones cuantitativas y legales (marcadas con `// TODO:` en `src/lib/constants.ts`).
3. [ ] **Revisión legal**: Aprobación final con abogado del dominio y términos (marcados con `// TODO LEGAL:` en `src/lib/legal.ts`).
4. [ ] **Asset de Open Graph**: Sustituir `public/og-image.png` por la versión definitiva de 1200×630 px.
