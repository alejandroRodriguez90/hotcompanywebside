import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Building2, FileText, CheckCircle2, Mail, MapPin } from 'lucide-react';
import { COMPANY_INFO } from '../lib/constants';
import { Button } from '../components/ui/Button';

export const Privacy: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <main className="relative z-10 min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-[#F5F1EC]">
      {/* Ambient gradient orbs */}
      <div
        aria-hidden="true"
        className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 rounded-full pointer-events-none -z-10 opacity-20 blur-[140px]"
        style={{ background: 'radial-gradient(circle, #E10600 0%, #FF6A13 45%, #FFB020 90%)' }}
      />

      {/* Header and Back Button */}
      <div className="mb-10 sm:mb-14">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A89F98] hover:text-[#FF6A13] transition-colors mb-6 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A13] rounded-lg p-1"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Volver al inicio</span>
        </Link>

        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-5 border border-white/10">
          <Shield className="w-3.5 h-3.5 text-[#FF6A13]" strokeWidth={1.5} />
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#FFB020]">
            Habeas Data · Ley 1581 de 2012
          </span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl tracking-tight leading-[1.15] mb-4">
          Política de Tratamiento de <span className="text-gradient">Datos Personales</span>
        </h1>

        <p className="font-sans text-base sm:text-lg text-[#A89F98] leading-relaxed max-w-3xl">
          En cumplimiento de la Ley Estatutaria 1581 de 2012, el Decreto Reglamentario 1377 de 2013 y demás normas concordantes de la República de Colombia, HOT COMPANY S.A.S. adopta la presente Política para el tratamiento y protección de datos personales.
        </p>
      </div>

      <div className="flex flex-col gap-8 text-[#A89F98] font-sans text-sm sm:text-[15px] leading-relaxed">
        {/* 1. Responsable del Tratamiento */}
        <section className="glass rounded-[28px] p-6 sm:p-8 border border-white/10">
          <div className="flex items-center gap-3 mb-4 text-[#F5F1EC]">
            <div className="w-9 h-9 rounded-xl glass-tint-warm flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-[#FF6A13]" strokeWidth={1.5} />
            </div>
            <h2 className="font-display font-bold text-lg sm:text-xl tracking-tight text-[#F5F1EC]">
              1. Identificación del Responsable del Tratamiento
            </h2>
          </div>

          <p className="mb-4">
            El responsable del tratamiento de los datos personales recolectados a través de esta plataforma digital es:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-mono bg-black/40 rounded-2xl p-4 sm:p-5 border border-white/5 mb-4">
            <div>
              <span className="text-[#A89F98]/60 block text-[11px]">Razón Social:</span>
              <strong className="text-[#F5F1EC]">{COMPANY_INFO.name}</strong>
            </div>
            <div>
              <span className="text-[#A89F98]/60 block text-[11px]">NIT:</span>
              <strong className="text-[#F5F1EC]">{COMPANY_INFO.nit}</strong>
            </div>
            <div>
              <span className="text-[#A89F98]/60 block text-[11px]">Domicilio Principal:</span>
              <span className="text-[#F5F1EC]">{COMPANY_INFO.address}</span>
            </div>
            <div>
              <span className="text-[#A89F98]/60 block text-[11px]">Ciudad y País:</span>
              <span className="text-[#F5F1EC]">{COMPANY_INFO.city}</span>
            </div>
            <div>
              <span className="text-[#A89F98]/60 block text-[11px]">Correo Electrónico:</span>
              <a href={`mailto:${COMPANY_INFO.email}`} className="text-[#FF6A13] hover:underline">
                {COMPANY_INFO.email}
              </a>
            </div>
            <div>
              <span className="text-[#A89F98]/60 block text-[11px]">Línea de Atención:</span>
              <a href={COMPANY_INFO.phoneHref} className="text-[#FFB020] hover:underline">
                {COMPANY_INFO.phoneDisplay}
              </a>
            </div>
          </div>

          <p className="text-xs text-[#A89F98]/70">
            {/* // TODO LEGAL: Registrar bases de datos ante el Registro Nacional de Bases de Datos (RNBD) administrado por la Superintendencia de Industria y Comercio (SIC) si los activos totales superan el umbral normativo (100.000 UVT). */}
            Actividades económicas registradas (CIIU): {COMPANY_INFO.ciiu.map((c) => `${c.code} (${c.desc})`).join(', ')}.
          </p>
        </section>

        {/* 2. Marco Normativo y Definiciones */}
        <section className="glass rounded-[28px] p-6 sm:p-8 border border-white/10">
          <div className="flex items-center gap-3 mb-4 text-[#F5F1EC]">
            <div className="w-9 h-9 rounded-xl glass-tint-warm flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-[#FF6A13]" strokeWidth={1.5} />
            </div>
            <h2 className="font-display font-bold text-lg sm:text-xl tracking-tight text-[#F5F1EC]">
              2. Marco Normativo y Principios Rectores
            </h2>
          </div>

          <p className="mb-3">
            La presente política se rige por la Constitución Política de Colombia (Artículo 15), la Ley 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto Único Reglamentario 1074 de 2015) y demás disposiciones aplicables emitidas por la Superintendencia de Industria y Comercio (SIC).
          </p>

          <p className="mb-3">
            El tratamiento de datos personales por parte de HOT COMPANY S.A.S. se fundamenta en los siguientes principios:
          </p>

          <ul className="list-disc list-inside space-y-2 ml-1 text-xs sm:text-sm">
            <li><strong className="text-[#F5F1EC]">Principio de Legalidad:</strong> Sujeto estrictamente a lo establecido en la ley.</li>
            <li><strong className="text-[#F5F1EC]">Principio de Finalidad:</strong> Con un propósito legítimo informado de manera previa al titular.</li>
            <li><strong className="text-[#F5F1EC]">Principio de Libertad:</strong> Solo se realiza con el consentimiento previo, expreso e informado del titular.</li>
            <li><strong className="text-[#F5F1EC]">Principio de Veracidad o Calidad:</strong> La información debe ser veraz, completa, exacta, actualizada y comprobable.</li>
            <li><strong className="text-[#F5F1EC]">Principio de Transparencia:</strong> Garantía del derecho del titular a obtener información acerca de sus datos en cualquier momento.</li>
            <li><strong className="text-[#F5F1EC]">Principio de Seguridad y Confidencialidad:</strong> Medidas técnicas, humanas y administrativas necesarias para evitar adulteración, pérdida o acceso no autorizado.</li>
          </ul>
        </section>

        {/* 3. Finalidades del Tratamiento */}
        <section className="glass rounded-[28px] p-6 sm:p-8 border border-white/10">
          <div className="flex items-center gap-3 mb-4 text-[#F5F1EC]">
            <div className="w-9 h-9 rounded-xl glass-tint-warm flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#4ADE80]" strokeWidth={1.5} />
            </div>
            <h2 className="font-display font-bold text-lg sm:text-xl tracking-tight text-[#F5F1EC]">
              3. Finalidades del Tratamiento de los Datos
            </h2>
          </div>

          <p className="mb-3">
            Los datos personales que HOT COMPANY S.A.S. recopila a través del formulario web, canales de mensajería (WhatsApp) o comunicaciones directas serán utilizados para las siguientes finalidades legítimas:
          </p>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <strong className="text-[#F5F1EC] block mb-1">a) Gestión de contacto y asesoría comercial:</strong>
              Responder a consultas, solicitudes de cotización o requerimientos de información sobre nuestros servicios de desarrollo de software, plataformas web, publicidad y comercio electrónico.
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <strong className="text-[#F5F1EC] block mb-1">b) Operación y facilitación de la plataforma:</strong>
              Habilitar espacios digitales de conexión entre usuarios y prestadores independientes, facilitando el contacto directo sin intermediación financiera en acuerdos ni cobros.
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <strong className="text-[#F5F1EC] block mb-1">c) Relaciones contractuales y comerciales:</strong>
              Adelantar trámites precontractuales, contractuales, de facturación y soporte técnico con clientes y proveedores.
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <strong className="text-[#F5F1EC] block mb-1">d) Cumplimiento de obligaciones legales:</strong>
              Atender requerimientos de autoridades judiciales, administrativas y tributarias colombianas (DIAN, Secretarías de Hacienda, SIC).
            </div>

            {/* // TODO LEGAL: Indicar si se realizan transmisiones o transferencias internacionales de datos a servidores en la nube (Vercel, AWS, Google Cloud, Formspree). */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <strong className="text-[#F5F1EC] block mb-1">e) Seguridad y prevención de fraudes:</strong>
              Validar la autenticidad de los mensajes mediante herramientas anti-spam y auditoría interna de accesos.
            </div>
          </div>
        </section>

        {/* 4. Derechos de los Titulares */}
        <section className="glass rounded-[28px] p-6 sm:p-8 border border-white/10">
          <h2 className="font-display font-bold text-lg sm:text-xl tracking-tight text-[#F5F1EC] mb-4">
            4. Derechos de los Titulares (Artículo 8, Ley 1581 de 2012)
          </h2>

          <p className="mb-4">
            Como titular de datos personales, usted cuenta con los siguientes derechos frente a HOT COMPANY S.A.S.:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <strong className="text-[#FF6A13] block mb-0.5">Conocer, actualizar y rectificar</strong>
              Sus datos personales frente a datos parciales, inexactos, incompletos o que induzcan a error.
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <strong className="text-[#FF6A13] block mb-0.5">Solicitar prueba de autorización</strong>
              Salvo en los casos expresamente exceptuados por el artículo 10 de la Ley 1581 de 2012.
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <strong className="text-[#FFB020] block mb-0.5">Ser informado sobre el uso</strong>
              Recibir información previa solicitud respecto del uso específico que se le ha dado a sus datos.
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <strong className="text-[#FFB020] block mb-0.5">Presentar quejas ante la SIC</strong>
              Por infracciones a lo dispuesto en la normativa vigente una vez agotado el trámite directo.
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <strong className="text-[#4ADE80] block mb-0.5">Revocar la autorización</strong>
              Y/o solicitar la supresión del dato cuando no medie un deber legal o contractual de permanecer en la base de datos.
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <strong className="text-[#4ADE80] block mb-0.5">Acceso gratuito</strong>
              Acceder en forma gratuita a sus datos personales que hayan sido objeto de tratamiento al menos una vez al mes.
            </div>
          </div>
        </section>

        {/* 5. Procedimiento y Canales para Consultas y Reclamos */}
        <section className="glass rounded-[28px] p-6 sm:p-8 border border-white/10">
          <h2 className="font-display font-bold text-lg sm:text-xl tracking-tight text-[#F5F1EC] mb-4">
            5. Canales y Procedimiento para Consultas, Reclamos y Habeas Data
          </h2>

          <p className="mb-4">
            Los titulares de datos o sus causahabientes podrán ejercer sus derechos enviando una comunicación escrita con su nombre completo, número de documento de identificación y descripción clara de su solicitud al siguiente canal oficial:
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/10 mb-6">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl glass-tint-warm flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#FF6A13]" strokeWidth={1.5} />
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#A89F98] uppercase tracking-wider block">Canal Escrito Oficial</span>
                <a href={`mailto:${COMPANY_INFO.email}?subject=Solicitud%20Habeas%20Data%20-%20Ley%201581`} className="text-[#F5F1EC] hover:text-[#FFB020] font-mono font-medium transition-colors">
                  {COMPANY_INFO.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1 sm:border-l sm:border-white/10 sm:pl-4">
              <div className="w-10 h-10 rounded-xl glass-tint-warm flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#FFB020]" strokeWidth={1.5} />
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#A89F98] uppercase tracking-wider block">Atención Física</span>
                <span className="text-[#F5F1EC] text-xs font-mono">{COMPANY_INFO.address}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <strong className="text-[#F5F1EC] block mb-1">Trámite de Consultas (Art. 14, Ley 1581):</strong>
              Serán atendidas en un término máximo de diez (10) días hábiles contados a partir de la fecha de recibo. Si no fuere posible atenderla dentro de dicho término, se informará al interesado antes del vencimiento expresando los motivos de demora y señalando la fecha en que se atenderá, la cual en ningún caso superará los cinco (5) días hábiles siguientes al vencimiento del primer término.
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <strong className="text-[#F5F1EC] block mb-1">Trámite de Reclamos (Art. 15, Ley 1581):</strong>
              El reclamo deberá formularse mediante solicitud dirigida al Responsable, con identificación del titular, descripción de los hechos y documentos de soporte. El término máximo para atender el reclamo será de quince (15) días hábiles contados a partir del día siguiente a su recepción. En caso de imposibilidad justificada, se informará con un plazo adicional de hasta ocho (8) días hábiles.
            </div>
          </div>

          {/* // TODO LEGAL: Designar expresamente el Oficial de Protección de Datos Personales (DPO) interno de la compañía. */}
        </section>

        {/* 6. Vigencia */}
        <section className="glass rounded-[28px] p-6 sm:p-8 border border-white/10">
          <h2 className="font-display font-bold text-lg sm:text-xl tracking-tight text-[#F5F1EC] mb-4">
            6. Vigencia de la Política y de las Bases de Datos
          </h2>

          <p className="mb-3">
            La presente Política de Tratamiento de Datos Personales rige a partir de su publicación en este sitio web. Los datos personales suministrados se conservarán mientras sean necesarios para cumplir con las finalidades descritas, durante el tiempo que exijan las normas comerciales, contables y tributarias en Colombia (mínimo 10 años conforme al Código de Comercio y Estatuto Tributario), o hasta que el titular revoque válidamente su autorización.
          </p>

          <p className="text-xs text-[#A89F98]/70">
            {/* // TODO LEGAL: Actualizar fecha de revisión anual de la política documental. */}
            Última actualización: Octubre de 2026 · Versión 1.0 Corporativa · HOT COMPANY S.A.S.
          </p>
        </section>

        {/* Action Button */}
        <div className="flex justify-center pt-4">
          <Link to="/">
            <Button variant="primary" size="lg" icon={<ArrowLeft className="w-4 h-4" />}>
              Volver a la página principal
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Privacy;
