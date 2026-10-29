/**
 * DATOS CORPORATIVOS Y CONFIGURACIÓN EDITABLE — HOT COMPANY S.A.S.
 *
 * Todos los textos, enlaces y datos de la empresa están centralizados aquí.
 * Los elementos marcados con "TODO" requieren validación o aprobación del cliente.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface ServiceCard {
  id: string;
  number: string;
  ciiu: string;
  title: string;
  tagline: string;
  description: string;
  size: 'large' | 'wide' | 'medium';
  /** Mini keyword tags shown at the bottom of the card */
  tags: string[];
}

export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
  highlight: string;
}

export const COMPANY_INFO = {
  name: 'HOT COMPANY S.A.S.',
  nit: '901.188.234-2',
  address: 'Calle 6 # 68-45, Bogotá D. C.',
  mapsUrl: 'https://maps.google.com/?q=Calle+6+%23+68-45,+Bogotá',
  city: 'Bogotá D. C., Colombia',
  email: 'hotcompanyapp@gmail.com',
  phone: '350 241 8881',
  phoneDisplay: '+57 350 241 8881',
  phoneHref: 'tel:+573502418881',
  whatsappUrl: 'https://wa.me/573502418881?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Hot%20Company%20S.A.S.',
  ciiu: [
    { code: '6201', desc: 'Desarrollo de sistemas informáticos' },
    { code: '6312', desc: 'Portales web' },
    { code: '7310', desc: 'Publicidad' },
    { code: '4791', desc: 'Comercio al por menor por Internet' },
  ],
  legalDisclaimer:
    'HOT COMPANY S.A.S. es una plataforma digital de intermediación. El acuerdo, tarifas y pago se realizan directamente entre el usuario y el prestador de servicios independiente, sin intermediación financiera por parte de la plataforma.',
};

export const NAV_LINKS: NavLink[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Contacto', href: '#contacto' },
];

export const HERO_CONTENT = {
  tag: 'INNOVACIÓN DIGITAL COLOMBIANA',
  // TODO: Revisar frase de impacto con el equipo comercial
  titleHighlight: 'Tecnología,',
  titleRest: 'presencia y conexión.',
  subtitle:
    'Desarrollamos software, operamos plataformas digitales, gestionamos publicidad y habilitamos comercio electrónico para empresas que quieren crecer en el entorno digital.',
  ctaPrimary: 'Servicios',
  ctaWhatsApp: 'Hablar por WhatsApp',
  badge: 'Acuerdo y pago directo entre las partes',
};

export interface HeroVideoOption {
  id: string;
  name: string;
  mp4: string;
  webm?: string;
  poster?: string;
  /** 'brand' applies sepia/hue-rotate + mix-blend-color tint layer (default). 'none' skips color grading. */
  tint?: 'brand' | 'none';
}

export const HERO_VIDEOS: HeroVideoOption[] = [
  {
    id: 'hotcompani2',
    name: 'Hot Company 2 (Principal)',
    mp4: '/videos/HotCompani2.mp4',
    tint: 'brand',
  },
  {
    id: 'hero-plexus',
    name: 'Plexus Digital',
    mp4: '/videos/hero-plexus.mp4',
    webm: '/videos/hero-plexus.webm',
    poster: '/videos/hero-poster.jpg',
    tint: 'brand',
  },
  {
    id: 'hotcompany-1',
    name: 'Hot Company 1',
    mp4: '/videos/HotCompani1.mp4',
    tint: 'brand',
  },
];

export interface CarouselSlideData {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  description: string;
}

export const CAROUSEL_SLIDES: CarouselSlideData[] = [
  {
    id: 'hc1',
    src: '/images/carousel/HC1.webp',
    alt: 'Monitores curvos con gráficos de control y operadores en centro de operaciones digitales',
    title: 'Centro de Control Digital',
    subtitle: 'Monitoreo y métricas en tiempo real',
    description: 'Supervisión y control de plataformas, flujos y arquitectura de sistemas de misión crítica.',
  },
  {
    id: 'hc2',
    src: '/images/carousel/HC2.webp',
    alt: 'Smartphone con interfaz de tarjetas flotantes y catálogo multimedia digital',
    title: 'Ecosistema Móvil y Portales',
    subtitle: 'Catálogos interactivos y servicios',
    description: 'Plataforma con tarjetas flotantes interactivas para navegación fluida y multimedia.',
  },
  {
    id: 'hc3',
    src: '/images/carousel/HC3.webp',
    alt: 'Pantalla de cristal con partículas lumínicas y listado de contactos digitales',
    title: 'Red de Contacto Directo',
    subtitle: 'Conexión transparente de servicios',
    description: 'Ecosistema de intermediación donde el acuerdo y contacto se realiza de forma directa.',
  },
  {
    id: 'hc4',
    src: '/images/carousel/HC4.webp',
    alt: 'Interacción táctil en interfaz móvil con publicaciones y contenidos',
    title: 'Plataforma de Publicación',
    subtitle: 'Gestión y difusión de contenidos',
    description: 'Espacios interactivos para que anunciantes y prestadores promuevan sus ofertas.',
  },
  {
    id: 'hc5',
    src: '/images/carousel/HC5.webp',
    alt: 'Desarrollador probando aplicación móvil frente a laptop con editor de código',
    title: 'Ingeniería y Código Fuente',
    subtitle: 'Desarrollo robusto multiplataforma',
    description: 'Arquitectura técnica de software, pruebas en dispositivos reales e integración continua.',
  },
  {
    id: 'hc6',
    src: '/images/carousel/HC6.webp',
    alt: 'Smartphone con diagrama de arquitectura técnica para iOS, Android, Cross-Platform y UX',
    title: 'Arquitectura de Apps',
    subtitle: 'iOS, Android, Cross-Platform y UX',
    description: 'Desarrollo en stacks nativos y multiplataforma con estándares de usabilidad y rendimiento.',
  },
];

// TODO: Revisar y aprobar los copys de cada servicio con el cliente
export const SERVICES: ServiceCard[] = [
  {
    id: 'tech',
    number: '01',
    ciiu: 'CIIU 6201',
    size: 'large',
    title: 'Soluciones Tecnológicas',
    tagline: 'Sistemas informáticos a medida',
    description:
      'Diseño, desarrollo y mantenimiento de sistemas informáticos, software, páginas web y aplicaciones móviles adaptadas a los requerimientos específicos de cada organización.',
    tags: ['Software', 'Web', 'Apps móviles'],
  },
  {
    id: 'platforms',
    number: '02',
    ciiu: 'CIIU 6312',
    size: 'wide',
    title: 'Plataformas Digitales',
    tagline: 'Portales y ecosistemas en línea',
    description:
      'Creación, operación y administración de plataformas donde los usuarios consultan servicios de terceros, conocen sus características y se contactan directamente con los prestadores. Operamos el espacio; el acuerdo y el pago son directos entre las partes.',
    tags: ['Portales', 'Contacto directo', 'Ecosistemas'],
  },
  {
    id: 'marketing',
    number: '03',
    ciiu: 'CIIU 7310',
    size: 'medium',
    title: 'Publicidad y Mercadeo',
    tagline: 'Visibilidad y alcance digital',
    description:
      'Mercadeo digital, publicidad y promoción de productos y servicios en web, apps y otros canales electrónicos para dar visibilidad a las ofertas de nuestros clientes.',
    tags: ['Mercadeo digital', 'Promoción', 'Alcance'],
  },
  {
    id: 'ecommerce',
    number: '04',
    ciiu: 'CIIU 4791',
    size: 'medium',
    title: 'Comercio Electrónico',
    tagline: 'Ventas e intercambio digital',
    description:
      'Comercialización de bienes, productos y servicios por Internet y actividades comerciales complementarias para empresas que quieren operar en canales digitales.',
    tags: ['Comercio en línea', 'Ventas', 'Internet'],
  },
];

export const MARQUEE_ITEMS = [
  'Diseño Web',
  'Apps iOS',
  'Apps Android',
  'Software a Medida',
  'Portales Digitales',
  'Marketing Digital',
  'E-commerce',
  'Sistemas Informáticos',
];

export const HOW_IT_WORKS_CONTENT = {
  tagline: 'PROCESO TRANSPARENTE',
  title: 'Cómo Funciona',
  subtitle:
    'Un modelo claro y respetuoso de la autonomía entre usuarios y prestadores de servicios independientes.',
  steps: [
    {
      step: '01',
      title: 'Explora y Descubre',
      description:
        'Navega el catálogo de perfiles, portfolios y servicios disponibles en la plataforma con total privacidad y fluidez.',
      highlight: 'Información detallada y organizada.',
    },
    {
      step: '02',
      title: 'Contacta Directamente',
      description:
        'Usa los canales de contacto directos (WhatsApp, llamada, correo) indicados por cada prestador para comunicarte sin intermediarios.',
      highlight: 'Comunicación punto a punto, sin barreras.',
    },
    {
      step: '03',
      title: 'Acuerda de Forma Autónoma',
      description:
        'El pacto de servicio, los detalles, condiciones y el pago se conciertan libremente entre el usuario y el prestador. HOT COMPANY no interviene en la transacción.',
      highlight: 'Libertad y autonomía completa entre las partes.',
    },
  ] as HowItWorksStep[],
};

export const CONTACT_CONTENT = {
  tagline: 'ATENCIÓN DIRECTA',
  title: 'Contáctanos',
  subtitle:
    '¿Quieres saber cómo podemos ayudarte? Escríbenos y te orientamos sin compromiso.',
  whatsappLabel: 'Respuesta directa',
  whatsappNote: 'Tiempo de respuesta habitual: menos de 2 horas hábiles.',
};

export const FOOTER_LINKS = {
  plataforma: [
    { label: 'Servicios', href: '#servicios' },
    { label: 'Cómo funciona', href: '#como-funciona' },
    { label: 'Contacto', href: '#contacto' },
  ],
  legal: [
    // TODO: Crear y enlazar documentos legales definitivos
    { label: 'Aviso Legal y +18', href: '#aviso-legal' },
    { label: 'Política de Privacidad', href: '#politica-privacidad' },
    { label: 'Términos y Condiciones', href: '#terminos' },
  ],
};
