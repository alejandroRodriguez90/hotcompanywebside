import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  Building2,
  Database,
  CheckCircle2,
  FileCheck,
  Eye,
  Share2,
  Globe,
  Lock,
  Clock,
  UserCheck,
  UserX,
  Mail,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  FileText,
  Users,
  Building,
  CreditCard,
  Slash,
  ShieldCheck,
  Award,
  RefreshCw,
  Scale,
  type LucideIcon,
} from 'lucide-react';
import type { LegalDocument } from '../../lib/legal';
import { Button } from '../ui/Button';

interface LegalPageProps {
  document: LegalDocument;
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
}

const PRIVACY_ICONS: Record<number, LucideIcon> = {
  1: Building2,
  2: Database,
  3: CheckCircle2,
  4: FileCheck,
  5: Eye,
  6: Share2,
  7: Globe,
  8: Lock,
  9: Clock,
  10: UserCheck,
  11: UserX,
  12: Mail,
};

const TERMS_ICONS: Record<number, LucideIcon> = {
  1: Building2,
  2: AlertTriangle,
  3: Sparkles,
  4: UserCheck,
  5: ShieldAlert,
  6: FileText,
  7: Users,
  8: Building,
  9: CreditCard,
  10: Slash,
  11: Lock,
  12: ShieldCheck,
  13: Award,
  14: RefreshCw,
  15: Scale,
  16: Mail,
};

function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-[#F5F1EC] font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export const LegalPage: React.FC<LegalPageProps> = ({
  document,
  badge,
  titlePrefix,
  titleHighlight,
  description,
}) => {
  const iconMap = document.slug === 'privacidad' ? PRIVACY_ICONS : TERMS_ICONS;

  return (
    <main
      id={document.slug}
      className="relative z-10 min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-[#F5F1EC]"
    >
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
            {badge}
          </span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl tracking-tight leading-[1.15] mb-4">
          {titlePrefix} <span className="text-gradient">{titleHighlight}</span>
        </h1>

        <p className="font-sans text-base sm:text-lg text-[#A89F98] leading-relaxed max-w-3xl">
          {description}
        </p>
      </div>

      <div className="flex flex-col gap-8 text-[#A89F98] font-sans text-sm sm:text-[15px] leading-relaxed">
        {document.sections.map((section) => {
          const Icon = iconMap[section.number] || FileText;

          return (
            <section
              key={section.number}
              id={`seccion-${section.number}`}
              className="glass rounded-[28px] p-6 sm:p-8 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4 text-[#F5F1EC]">
                <div className="w-9 h-9 rounded-xl glass-tint-warm flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#FF6A13]" strokeWidth={1.5} />
                </div>
                <h2 className="font-display font-bold text-lg sm:text-xl tracking-tight text-[#F5F1EC]">
                  {section.number}. {section.title}
                </h2>
              </div>

              {section.blocks.map((block, bIdx) => {
                if (block.type === 'contact') {
                  return (
                    <div
                      key={bIdx}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-mono bg-black/40 rounded-2xl p-4 sm:p-5 border border-white/5 my-4"
                    >
                      {block.lines.map((line, lIdx) => (
                        <div key={lIdx}>
                          <span className="text-[#A89F98]/60 block text-[11px]">{line.label}:</span>
                          {line.value.includes('@') ? (
                            <a
                              href={`mailto:${line.value}`}
                              className="text-[#FF6A13] hover:underline font-mono"
                            >
                              {line.value}
                            </a>
                          ) : line.value.startsWith('http') || line.value.includes('.com') ? (
                            <a
                              href={line.value.startsWith('http') ? line.value : `https://${line.value}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#FFB020] hover:underline font-mono"
                            >
                              {line.value}
                            </a>
                          ) : (
                            <strong className="text-[#F5F1EC] font-medium">{line.value}</strong>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                }

                if (block.type === 'list') {
                  return (
                    <ul
                      key={bIdx}
                      className="list-disc list-inside space-y-2 ml-1 text-xs sm:text-sm my-3 text-[#A89F98]"
                    >
                      {block.items.map((item, iIdx) => (
                        <li key={iIdx} className="leading-relaxed">
                          <span className="text-[#A89F98]">{renderFormattedText(item)}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p key={bIdx} className="mb-3 leading-relaxed text-[#A89F98]">
                    {renderFormattedText(block.text)}
                  </p>
                );
              })}
            </section>
          );
        })}
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-8">
        <Link to="/">
          <Button variant="primary" size="lg" icon={<ArrowLeft className="w-4 h-4" />}>
            Volver a la página principal
          </Button>
        </Link>
      </div>
    </main>
  );
};
