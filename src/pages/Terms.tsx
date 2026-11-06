import React, { useEffect } from 'react';
import { LegalPage } from '../components/legal/LegalPage';
import { TERMS_AND_CONDITIONS } from '../lib/legal';

export const Terms: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = TERMS_AND_CONDITIONS.metaTitle;
  }, []);

  return (
    <LegalPage
      document={TERMS_AND_CONDITIONS}
      badge="Términos del Servicio · HOT COMPANY S.A.S."
      titlePrefix="Términos y Condiciones"
      titleHighlight="de Uso"
      description="Términos y Condiciones que regulan el acceso, registro y utilización de la plataforma APP HC."
    />
  );
};

export default Terms;

