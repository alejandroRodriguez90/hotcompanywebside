import React, { useEffect } from 'react';
import { LegalPage } from '../components/legal/LegalPage';
import { PRIVACY_POLICY } from '../lib/legal';

export const Privacy: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = PRIVACY_POLICY.metaTitle;
  }, []);

  return (
    <LegalPage
      document={PRIVACY_POLICY}
      badge="Habeas Data · Ley 1581 de 2012"
      titlePrefix="Política de Privacidad y"
      titleHighlight="Tratamiento de Datos Personales"
      description="Política de Privacidad y Tratamiento de Datos Personales de HOT COMPANY S.A.S."
    />
  );
};

export default Privacy;
