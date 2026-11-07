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

// Mensajes predeterminados para WhatsApp por perfil
const WHATSAPP_WORKER_MSG = encodeURIComponent(
  'Hola, soy Worker y quiero información sobre la aplicación. Deseo hacer parte de la plataforma.'
);
const WHATSAPP_HOTEL_MSG = encodeURIComponent(
  'Hola, soy Hotel y quiero información sobre la aplicación para vincular mi establecimiento como hotel aliado.'
);

export const SITE_URL = 'https://hotcompany.app';

export const COMPANY_INFO = {
  name: 'HOT COMPANY S.A.S.',
  nit: '901.188.234-2',
  siteUrl: SITE_URL,
  // TODO: WhatsApp Business muestra "Cl. 6 Sur # 73B-68, Kennedy"; confirmar cuál es la dirección a publicar (legal vs comercial).
  address: 'Calle 6 # 68-45, Bogotá D. C.',
  mapsUrl: 'https://maps.google.com/?q=Calle+6+%23+68-45,+Bogotá',
  city: 'Bogotá D. C., Colombia',
  email: 'info@hotcompany.app',
  phone: '312 661 1763',
  phoneDisplay: '+57 312 661 1763',
  phoneTel: '+573126611763',
  phoneHref: 'tel:+573126611763',
  whatsappNumber: '573126611763',
  whatsappUrl: 'https://wa.me/573126611763?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Hot%20Company%20S.A.S.',
  whatsappUrlWorker: `https://wa.me/573126611763?text=${WHATSAPP_WORKER_MSG}`,
  whatsappUrlHotel: `https://wa.me/573126611763?text=${WHATSAPP_HOTEL_MSG}`,
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
  // TODO: aprobación del equipo
  tag: 'Plataforma privada · Red verificada',
  titleHighlight: 'Conectamos personas,',
  titleRest: 'generamos oportunidades.',
  // TODO: confirmar formulación de validación de identidad y entorno privado con el equipo técnico/legal.
  subtitle:
    'Una plataforma privada que integra acompañamiento profesional y hoteles aliados verificados en un entorno seguro, discreto y organizado.',
  ctaWorker: 'Soy Worker',
  ctaWorkerUrl: `https://wa.me/573126611763?text=${WHATSAPP_WORKER_MSG}`,
  ctaHotel: 'Soy Hotel',
  ctaHotelUrl: `https://wa.me/573126611763?text=${WHATSAPP_HOTEL_MSG}`,
  // TODO: aprobación del equipo
  badge: 'Perfiles verificados · Hoteles aliados · Entorno seguro',
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
    id: 'hc1',
    name: 'Hot Company (Principal)',
    mp4: '/videos/hero-hc1.mp4',
    poster: '/videos/hero-hc1-poster.jpg',
    tint: 'none',
  },
  {
    id: 'hero-plexus',
    name: 'Plexus Digital',
    mp4: '/videos/hero-plexus.mp4',
    poster: '/videos/hero-poster.jpg',
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
    alt: 'Verificación de identidad y perfiles autenticados en la plataforma',
    title: 'Verificación de Identidad',
    subtitle: 'Autenticación digital',
    description: 'Protocolo de validación de identidad digital para garantizar interacciones seguras y confiables.',
  },
  {
    id: 'hc2',
    src: '/images/carousel/HC2.webp',
    alt: 'Agenda organizada y gestión de disponibilidad en la app móvil',
    title: 'Agenda Organizada',
    subtitle: 'Gestión centralizada',
    description: 'Administra disponibilidad, solicitudes y tarifas en tiempo real desde una interfaz ágil y moderna.',
  },
  {
    id: 'hc3',
    src: '/images/carousel/HC3.webp',
    alt: 'Mapa interactivo con hoteles aliados y hospedajes certificados',
    title: 'Hoteles Aliados',
    subtitle: 'Red de hospedajes',
    description: 'Establecimientos certificados integrados en el mapa de la app para coordinar encuentros con discreción.',
  },
  {
    id: 'hc4',
    src: '/images/carousel/HC4.webp',
    alt: 'Entorno privado con filtros de seguridad y confidencialidad activa',
    title: 'Entorno Seguro',
    subtitle: 'Privacidad y control',
    // TODO: aprobación del equipo
    description: 'Filtros de seguridad activos y reserva interna protegida bajo estrictos estándares de confidencialidad.',
  },
  {
    id: 'hc5',
    src: '/images/carousel/HC5.webp',
    alt: 'Perfil independiente worker con respaldo operativo y solicitudes filtradas',
    title: 'Perfil Independiente',
    // TODO: aprobación del equipo
    subtitle: 'Workers verificados',
    description: 'Gestión con total respaldo: acceso a solicitudes exclusivas de usuarios autenticados y acuerdo directo.',
  },
  {
    id: 'hc6',
    src: '/images/carousel/HC6.webp',
    alt: 'Panel hotelero para optimización de habitaciones y reservas automatizadas',
    title: 'Panel Hotelero',
    subtitle: 'Optimización de ocupación',
    description: 'Canal automatizado para maximizar habitaciones disponibles y captar reservas con exclusividad de zona.',
  },
];

// TODO: Revisar y aprobar los copys de cada servicio con el cliente
export const SERVICES: ServiceCard[] = [
  {
    id: 'tech',
    number: '01',
    ciiu: 'CIIU 6201',
    size: 'large',
    title: 'Ecosistema Tecnológico',
    tagline: 'Apps móviles y panel web',
    description:
      'Desarrollamos la infraestructura tecnológica de la plataforma: app móvil para iOS y Android con mapa interactivo y catálogo interno, y un panel de control para administrar solicitudes en tiempo real.',
    tags: ['App iOS y Android', 'Mapa interactivo', 'Panel de control'],
  },
  {
    id: 'platforms',
    number: '02',
    ciiu: 'CIIU 6312',
    size: 'wide',
    title: 'Red Privada y Verificación',
    tagline: 'Comunidad exclusiva y filtrada',
    // TODO: confirmar validación de perfiles y entorno privado con el equipo técnico/legal.
    description:
      'Conectamos usuarios con prestadores independientes mediante validación digital de identidad, agenda organizada y total confidencialidad. Acuerdo y pago directos entre las partes.',
    tags: ['Identidad validada', 'Agenda organizada', 'Discreción total'],
  },
  {
    id: 'marketing',
    number: '03',
    ciiu: 'CIIU 7310',
    size: 'medium',
    title: 'Infraestructura de Hospedaje',
    tagline: 'Hoteles aliados certificados',
    description:
      'Posicionamos a establecimientos aliados dentro de la app con prioridad geográfica y exclusividad de zona, canalizando reservas internas para optimizar habitaciones disponibles.',
    tags: ['Hoteles aliados', 'Exclusividad de zona', 'Reservas internas'],
  },
  {
    id: 'ecommerce',
    number: '04',
    ciiu: 'CIIU 4791',
    size: 'medium',
    title: 'Gestión y Acuerdos Directos',
    tagline: 'Autonomía y coordinación ágil',
    description:
      'Facilitamos la consulta de disponibilidad y la coordinación de solicitudes en tiempo real con total autonomía, sin intermediación financiera en los acuerdos de las partes.',
    tags: ['Acuerdo directo', 'Disponibilidad real', 'Sin intermediación'],
  },
];

export const MARQUEE_ITEMS = [
  { label: 'Flujo Constante de Reservas Internas', icon: 'Repeat' },
  // TODO: aprobación del equipo
  { label: 'Perfiles Previamente Verificados', icon: 'BadgeCheck' },
  { label: 'Integra Nuestra Comunidad', icon: 'Users' },
  { label: 'Posicionamiento Dentro de la App', icon: 'MapPin' },
  { label: 'Prioridad Frente a Hoteles No Afiliados', icon: 'TrendingUp' },
  // TODO: confirmar "Garantizada" con el equipo legal.
  { label: 'Confidencialidad y Seguridad Garantizada', icon: 'ShieldCheck' },
];

export const HOW_IT_WORKS_CONTENT = {
  tagline: 'PROCESO TRANSPARENTE',
  title: 'Cómo Funciona la Plataforma',
  subtitle:
    'Un modelo ágil y organizado que conecta usuarios, prestadores independientes y hoteles aliados con total autonomía y discreción.',
  steps: [
    {
      step: '01',
      title: 'Registro y verificación',
      // TODO: confirmar proceso real de validación de identidad con el equipo técnico/legal.
      description:
        'Crea tu perfil según tu rol en la comunidad privada. Implementamos un protocolo de validación de identidad digital para garantizar que interactúas en un entorno seguro y confiable.',
      highlight: 'Validación de identidad digital.',
    },
    {
      step: '02',
      title: 'Acceso privado y gestión',
      // TODO: aprobación del equipo
      description:
        'Ingresa al ecosistema de la app para publicar tu disponibilidad o explorar perfiles verificados. Administra tu agenda organizada, tarifas e interacciones con total confidencialidad.',
      highlight: 'Agenda y tarifas centralizadas.',
    },
    {
      step: '03',
      title: 'Conexión y encuentro seguro',
      description:
        'Coordina tus experiencias sociales y de acompañamiento con tranquilidad. El sistema prioriza automáticamente la reserva interna en los hoteles aliados y hospedajes certificados más cercanos.',
      highlight: 'Hoteles aliados certificados.',
    },
  ] as HowItWorksStep[],
};

export const CONTACT_CONTENT = {
  tagline: 'RED PRIVADA',
  title: 'Únete a Nuestra Red',
  subtitle:
    'Si buscas gestionar tu tiempo con respaldo, acceder a experiencias confiables o vincular tu hotel aliado, contáctanos hoy mismo.',
  whatsappLabel: 'Atención para Workers, Usuarios y Hoteles',
  // TODO: si el equipo confirma un tiempo real, se agrega.
  whatsappNote: 'Te asesoramos de inmediato por WhatsApp o correo.',
};

export const FOOTER_LINKS = {
  plataforma: [
    { label: 'Servicios', href: '#servicios' },
    { label: 'Cómo funciona', href: '#como-funciona' },
    { label: 'Contacto', href: '#contacto' },
  ],
  legal: [
    { label: 'Política de Privacidad', href: '/privacidad' },
    { label: 'Términos y Condiciones', href: '/terminos' },
  ],
};
