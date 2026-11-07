/**
 * TEXTOS LEGALES — HOT COMPANY S.A.S.
 *
 * Fuente: documentos oficiales de la empresa (Política de Privacidad y Términos y Condiciones).
 * Transcritos fielmente de los borradores entregados. Los elementos marcados con
 * "TODO LEGAL" requieren revisión del equipo jurídico antes de publicar.
 *
 * Para editar: modifica solo los strings de este archivo. El renderizado lo maneja LegalPage.tsx.
 * La negrita se marca con **texto** y se renderiza como <strong>.
 * Los correos dentro de texto se detectan automáticamente y se enlazan con mailto:.
 */

import { COMPANY_INFO } from './constants';

// ── Tipos ────────────────────────────────────────────────────────────

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'contact'; lines: { label: string; value: string }[] };

export interface LegalSection {
  number: number;
  title: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  updatedAt: string;
  sections: LegalSection[];
}

// ── Política de Privacidad y Tratamiento de Datos Personales (12 secciones) ──

// TODO LEGAL: confirmar datos de empresa (razón social, NIT, domicilio) con el equipo legal.
// TODO LEGAL: confirmar que info@hotcompany.app es el correo a citar en los Términos y la Política de Privacidad.
// El borrador original decía "Hot Compnay S.A.S" (typo) y NIT "9011882342" (sin guion).

export const PRIVACY_POLICY: LegalDocument = {
  slug: 'privacidad',
  title: 'Política de Privacidad y Tratamiento de Datos Personales',
  metaTitle: 'Política de Privacidad | HOT COMPANY S.A.S.',
  metaDescription:
    'Política de privacidad y tratamiento de datos personales de HOT COMPANY S.A.S. conforme a la Ley 1581 de 2012 de Colombia.',
  updatedAt: '2026',
  sections: [
    {
      number: 1,
      title: 'Responsable del tratamiento',
      blocks: [
        {
          type: 'contact',
          lines: [
            { label: 'Razón social', value: 'HOT COMPANY S.A.S.' },
            { label: 'NIT', value: '9011882342' },
            { label: 'Domicilio', value: 'Bogotá' },
            { label: 'Correo', value: COMPANY_INFO.email },
          ],
        },
        {
          type: 'p',
          text: 'HC será responsable del tratamiento de los datos personales recopilados a través de la página web, aplicación y demás canales asociados a la plataforma.',
        },
      ],
    },
    {
      number: 2,
      title: 'Datos que podemos recopilar',
      blocks: [
        {
          type: 'p',
          text: 'Dependiendo de las funciones utilizadas, podremos tratar:',
        },
        {
          type: 'p',
          text: '**Datos de identificación:** nombre, edad, documento o información necesaria para validar identidad.',
        },
        {
          type: 'p',
          text: '**Datos de contacto:** teléfono, correo electrónico.',
        },
        {
          type: 'p',
          text: '**Datos de perfil:** fotografía, descripción, preferencias y otra información que el usuario decida incorporar.',
        },
        {
          type: 'p',
          text: '**Datos de ubicación:** información de ubicación cuando esta función sea activada y resulte necesaria para prestar determinadas funcionalidades.',
        },
        {
          type: 'p',
          text: '**Datos técnicos:** dirección IP, dispositivo, sistema operativo, identificadores técnicos y registros de actividad.',
        },
        {
          type: 'p',
          text: '**Datos transaccionales:** información relacionada con membresías, reservas, pagos o facturación.',
        },
        {
          type: 'p',
          text: '**Datos derivados de seguridad y verificación:** información utilizada para validar identidad, prevenir fraude y proteger la plataforma.',
        },
        {
          type: 'p',
          text: 'Esto es especialmente importante porque Google Play considera, entre otros, la ubicación, datos financieros, autenticación y determinadas categorías de información del dispositivo como datos personales o sensibles y exige informar qué se recopila, utiliza, comparte y cómo se protege.',
        },
      ],
    },
    {
      number: 3,
      title: 'Finalidades',
      blocks: [
        {
          type: 'p',
          text: 'Utilizamos los datos para:',
        },
        {
          type: 'list',
          items: [
            'crear y administrar cuentas;',
            'verificar usuarios;',
            'mantener la seguridad;',
            'permitir las funcionalidades de conexión;',
            'gestionar solicitudes y reservas;',
            'facilitar servicios de establecimientos afiliados;',
            'prestar soporte;',
            'prevenir fraude y abuso;',
            'cumplir obligaciones legales;',
            'mejorar nuestros servicios;',
            'realizar análisis técnicos y estadísticos;',
            'enviar comunicaciones cuando exista autorización o fundamento legal.',
          ],
        },
      ],
    },
    {
      number: 4,
      title: 'Autorización',
      blocks: [
        {
          type: 'p',
          text: 'Cuando la legislación aplicable requiera autorización, solicitaremos al titular una autorización previa, expresa e informada para el tratamiento correspondiente.',
        },
        {
          type: 'p',
          text: 'Las finalidades deberán explicarse claramente antes de la recopilación.',
        },
      ],
    },
    {
      number: 5,
      title: 'Datos sensibles y verificación',
      blocks: [
        {
          type: 'p',
          text: 'Cuando el funcionamiento de una determinada funcionalidad requiera tratar información especialmente protegida, se informará al usuario de dicha circunstancia, de la finalidad, del tratamiento previsto y de las consecuencias de suministrarla o no suministrarla, según corresponda.',
        },
        {
          type: 'p',
          text: 'Los datos biométricos y otros datos sensibles requieren especial cuidado. La normativa colombiana reconoce, entre otros, los datos relativos a la vida sexual y los datos biométricos como sensibles.',
        },
      ],
    },
    {
      number: 6,
      title: 'Compartición de información',
      blocks: [
        {
          type: 'p',
          text: 'Podremos compartir información con:',
        },
        {
          type: 'list',
          items: [
            'proveedores tecnológicos;',
            'proveedores de verificación;',
            'proveedores de alojamiento de información;',
            'procesadores de pago;',
            'proveedores de soporte;',
            'establecimientos aliados cuando sea necesario para prestar un servicio solicitado;',
            'autoridades competentes cuando exista obligación legal.',
          ],
        },
        {
          type: 'p',
          text: 'No venderemos datos personales a terceros para fines incompatibles con las finalidades informadas.',
        },
      ],
    },
    {
      number: 7,
      title: 'Transferencias internacionales',
      blocks: [
        {
          type: 'p',
          text: 'Algunos proveedores tecnológicos pueden procesar información desde otros países.',
        },
        {
          type: 'p',
          text: 'Cuando exista transferencia o circulación internacional de datos, aplicaremos las obligaciones legales correspondientes y las medidas contractuales, técnicas y organizativas aplicables.',
        },
      ],
    },
    {
      number: 8,
      title: 'Seguridad',
      blocks: [
        {
          type: 'p',
          text: 'Aplicamos medidas de seguridad razonables destinadas a prevenir acceso, modificación, divulgación, pérdida o utilización no autorizada de información.',
        },
        {
          type: 'p',
          text: 'Los datos transmitidos entre determinados componentes tecnológicos utilizarán mecanismos de cifrado apropiados, como HTTPS/TLS.',
        },
        {
          type: 'p',
          text: 'Google Play exige precisamente que los desarrolladores traten los datos personales y sensibles de forma segura y que la transmisión utilice mecanismos modernos de cifrado.',
        },
      ],
    },
    {
      number: 9,
      title: 'Conservación',
      blocks: [
        {
          type: 'p',
          text: 'Conservaremos la información durante el tiempo necesario para cumplir las finalidades informadas, obligaciones legales, contractuales, contables, de seguridad y atención de reclamaciones.',
        },
        {
          type: 'p',
          text: 'Cuando los datos ya no sean necesarios y no exista una obligación de conservarlos, serán eliminados, anonimizados o sometidos al tratamiento correspondiente.',
        },
      ],
    },
    {
      number: 10,
      title: 'Derechos del titular',
      blocks: [
        {
          type: 'p',
          text: 'El titular podrá:',
        },
        {
          type: 'list',
          items: [
            'conocer sus datos;',
            'solicitar actualización;',
            'solicitar rectificación;',
            'conocer el uso dado a su información;',
            'solicitar supresión cuando corresponda;',
            'revocar autorizaciones cuando legalmente proceda;',
            'presentar consultas y reclamos.',
          ],
        },
      ],
    },
    {
      number: 11,
      title: 'Solicitud de eliminación de cuenta',
      blocks: [
        {
          type: 'p',
          text: 'El usuario podrá solicitar la eliminación de su cuenta y de los datos asociados mediante:',
        },
        {
          type: 'contact',
          lines: [
            { label: 'Correo', value: COMPANY_INFO.email },
            { label: 'Dentro de la aplicación', value: 'Configuración → Cuenta → Eliminar cuenta.' },
          ],
        },
      ],
    },
    {
      number: 12,
      title: 'Canal de atención de datos personales',
      blocks: [
        {
          type: 'contact',
          lines: [
            { label: 'Responsable', value: 'HC' },
            { label: 'Correo', value: COMPANY_INFO.email },
          ],
        },
        {
          type: 'p',
          text: 'Las solicitudes serán gestionadas conforme a los términos y plazos establecidos por la legislación aplicable.',
        },
      ],
    },
  ],
};

// ── Términos y Condiciones de Uso (16 secciones) ──

// TODO LEGAL: confirmar datos de empresa (razón social, NIT, domicilio) con el equipo legal.
// TODO LEGAL: confirmar que info@hotcompany.app es el correo a citar en los Términos y la Política de Privacidad.
// El borrador original decía "HOT COMPANY S.A.S" con NIT "9011882342" (sin guion).
// TODO LEGAL: Los textos describen la aplicación (cuentas, membresías, reservas, procesadores de pago, eliminación de cuenta) mientras el sitio indica acuerdo y pago directo entre las partes: validar coherencia.
// TODO LEGAL: La política no incluye explícitamente los datos del formulario de contacto de este sitio web (nombre, correo, teléfono, mensaje): evaluar agregar esa finalidad.
// TODO LEGAL: Dirección pendiente de confirmar (legal vs comercial), ya marcada en COMPANY_INFO.

export const TERMS_AND_CONDITIONS: LegalDocument = {
  slug: 'terminos-y-condiciones',
  title: 'Términos y Condiciones de Uso',
  metaTitle: 'Términos y Condiciones | HOT COMPANY S.A.S.',
  metaDescription:
    'Términos y condiciones de uso de la plataforma APP HC de HOT COMPANY S.A.S. en Colombia.',
  updatedAt: '2026',
  sections: [
    {
      number: 1,
      title: 'Información general',
      blocks: [
        {
          type: 'p',
          text: 'Estos Términos y Condiciones regulan el acceso, registro y utilización de **HC**, titular de la plataforma **APP HC**, incluyendo su sitio web, aplicación móvil, herramientas digitales y servicios relacionados.',
        },
        {
          type: 'contact',
          lines: [
            { label: 'Razón social', value: 'HOT COMPANY S.A.S' },
            { label: 'NIT', value: '9011882342' },
            { label: 'Domicilio', value: 'Bogotá' },
            { label: 'Correo de contacto', value: COMPANY_INFO.email },
            // TODO LEGAL: confirmar con el abogado que hotcompany.app es el dominio a citar en los Términos.
            { label: 'Sitio web', value: COMPANY_INFO.siteUrl.replace(/^https?:\/\//, '') },
          ],
        },
        {
          type: 'p',
          text: 'Al crear una cuenta o utilizar la plataforma, el usuario declara haber leído, entendido y aceptado estos Términos y Condiciones y las políticas relacionadas.',
        },
      ],
    },
    {
      number: 2,
      title: 'Requisito de edad',
      blocks: [
        {
          type: 'p',
          text: 'La plataforma está dirigida exclusivamente a **personas mayores de 18 años**.',
        },
        {
          type: 'p',
          text: 'No está permitido crear, utilizar o mantener una cuenta proporcionando información falsa respecto de la edad o identidad.',
        },
      ],
    },
    {
      number: 3,
      title: 'Qué es la plataforma',
      blocks: [
        {
          type: 'p',
          text: 'HC es una plataforma tecnológica que permite a personas adultas registradas crear perfiles, descubrir otros perfiles, comunicarse, gestionar solicitudes e interactuar mediante las funcionalidades disponibles.',
        },
        {
          type: 'p',
          text: 'La plataforma también puede incorporar servicios de terceros, incluyendo establecimientos de hospedaje afiliados y otros proveedores que formen parte de la red de aliados.',
        },
      ],
    },
    {
      number: 4,
      title: 'Registro y verificación',
      blocks: [
        {
          type: 'p',
          text: 'Para acceder a determinadas funcionalidades, el usuario deberá proporcionar información verdadera, actualizada y completa.',
        },
        {
          type: 'p',
          text: 'Cuando corresponda, podremos realizar procesos de validación de identidad, edad, información de perfil u otros mecanismos de seguridad.',
        },
        {
          type: 'p',
          text: 'La verificación de un perfil **no constituye una garantía absoluta sobre la conducta, identidad futura, intención o actuación de una persona**.',
        },
      ],
    },
    {
      number: 5,
      title: 'Uso responsable',
      blocks: [
        {
          type: 'p',
          text: 'Cada usuario es responsable de las decisiones que tome y de la información que comparta dentro de la plataforma.',
        },
        {
          type: 'p',
          text: 'Está prohibido utilizar la plataforma para:',
        },
        {
          type: 'list',
          items: [
            'suplantar a otra persona;',
            'publicar información falsa o engañosa;',
            'acosar, amenazar o intimidar;',
            'utilizar perfiles falsos;',
            'compartir contenido ilegal;',
            'involucrar a menores de edad;',
            'facilitar explotación, trata o cualquier forma de abuso;',
            'realizar actividades contrarias a la legislación aplicable;',
            'intentar vulnerar los sistemas de seguridad.',
          ],
        },
      ],
    },
    {
      number: 6,
      title: 'Contenido generado por usuarios',
      blocks: [
        {
          type: 'p',
          text: 'Los usuarios pueden publicar fotografías, textos y otra información permitida por la plataforma.',
        },
        {
          type: 'p',
          text: 'Cada usuario conserva la responsabilidad sobre el contenido que publica y declara contar con los derechos y autorizaciones necesarios para hacerlo.',
        },
        {
          type: 'p',
          text: 'La plataforma podrá revisar, moderar, restringir o retirar contenido que infrinja estas condiciones o las normas aplicables.',
        },
        {
          type: 'p',
          text: 'Para una aplicación con contenido generado por usuarios, esto debe acompañarse técnicamente de mecanismos reales de reporte, bloqueo y moderación, no solamente declararse en el documento. Apple exige estas funcionalidades para este tipo de servicios.',
        },
      ],
    },
    {
      number: 7,
      title: 'Interacciones entre usuarios',
      blocks: [
        {
          type: 'p',
          text: 'HC proporciona herramientas tecnológicas de conexión e interacción.',
        },
        {
          type: 'p',
          text: 'La plataforma no garantiza que una interacción determinada resulte en una reunión, reserva, relación comercial o experiencia satisfactoria.',
        },
        {
          type: 'p',
          text: 'Los usuarios deben actuar respetando el consentimiento, la seguridad, la privacidad y la legislación vigente.',
        },
      ],
    },
    {
      number: 8,
      title: 'Hoteles y establecimientos aliados',
      blocks: [
        {
          type: 'p',
          text: 'Los establecimientos afiliados actúan bajo sus propias condiciones comerciales y operativas.',
        },
        {
          type: 'p',
          text: 'La plataforma facilita la conexión y gestión tecnológica correspondiente, pero no sustituye las obligaciones legales, comerciales y operativas propias de cada establecimiento.',
        },
      ],
    },
    {
      number: 9,
      title: 'Pagos',
      blocks: [
        {
          type: 'p',
          text: 'Cuando existan servicios de pago, tarifas, membresías, reservas o cargos dentro de la plataforma, se informarán previamente sus condiciones, precios, impuestos aplicables y, cuando corresponda, políticas de cancelación y reembolso.',
        },
      ],
    },
    {
      number: 10,
      title: 'Suspensión o cancelación',
      blocks: [
        {
          type: 'p',
          text: 'Podremos limitar, suspender o cancelar una cuenta cuando:',
        },
        {
          type: 'list',
          items: [
            'se infrinjan estos términos;',
            'exista actividad fraudulenta;',
            'se detecte suplantación;',
            'exista riesgo para otros usuarios;',
            'se incumplan las normas de seguridad;',
            'exista requerimiento legal o de autoridad competente.',
          ],
        },
      ],
    },
    {
      number: 11,
      title: 'Seguridad',
      blocks: [
        {
          type: 'p',
          text: 'Implementamos medidas técnicas y organizativas orientadas a proteger la información y la operación de la plataforma.',
        },
        {
          type: 'p',
          text: 'Ningún sistema conectado a Internet puede garantizar seguridad absoluta, por lo que los usuarios también deben proteger sus credenciales y dispositivos.',
        },
      ],
    },
    {
      number: 12,
      title: 'Limitación de responsabilidad',
      blocks: [
        {
          type: 'p',
          text: 'La plataforma actúa como proveedor tecnológico dentro del alcance descrito en estos términos.',
        },
        {
          type: 'p',
          text: 'Salvo cuando la ley disponga lo contrario, HC no será responsable de hechos realizados autónomamente por terceros fuera del control razonable de la plataforma.',
        },
      ],
    },
    {
      number: 13,
      title: 'Propiedad intelectual',
      blocks: [
        {
          type: 'p',
          text: 'El software, diseño, marca, logotipos, interfaces, textos y demás elementos propiedad de HC están protegidos por las normas aplicables.',
        },
        {
          type: 'p',
          text: 'Su reproducción, modificación o utilización no autorizada está prohibida.',
        },
      ],
    },
    {
      number: 14,
      title: 'Modificaciones',
      blocks: [
        {
          type: 'p',
          text: 'Podremos actualizar estos términos para reflejar cambios legales, tecnológicos u operativos.',
        },
        {
          type: 'p',
          text: 'La versión vigente estará disponible permanentemente en el sitio web.',
        },
      ],
    },
    {
      number: 15,
      title: 'Ley aplicable',
      blocks: [
        {
          type: 'p',
          text: 'Estos términos se regirán por las leyes aplicables de la República de Colombia, sin perjuicio de las normas imperativas que correspondan según el lugar de residencia del usuario.',
        },
      ],
    },
    {
      number: 16,
      title: 'Contacto',
      blocks: [
        {
          type: 'p',
          text: 'Para consultas relacionadas con estos términos:',
        },
        {
          type: 'contact',
          lines: [
            { label: 'Correo', value: COMPANY_INFO.email },
          ],
        },
      ],
    },
  ],
};

