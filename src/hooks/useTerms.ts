import { useCallback, useEffect, useState } from 'react';
import { fetchTerms, type TermsDocument } from '../lib/api';

const TERMS_ERROR_MESSAGE =
  'No pudimos confirmar la versión vigente de los términos. Revisa tu conexión e inténtalo de nuevo.';

function isTermsDocument(value: unknown): value is TermsDocument {
  if (typeof value !== 'object' || value === null) return false;
  const doc = value as Record<string, unknown>;
  return (
    typeof doc.version === 'string' &&
    doc.version.trim().length > 0 &&
    typeof doc.title === 'string' &&
    doc.title.trim().length > 0 &&
    typeof doc.content === 'string' &&
    doc.content.trim().length > 0
  );
}

/**
 * Carga los términos vigentes desde GET /api/v1/terms.
 * `reload` se usa cuando el backend reporta TERMS_VERSION_OUTDATED.
 */
export function useTerms(enabled: boolean = true) {
  const [terms, setTerms] = useState<TermsDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();

    fetchTerms<TermsDocument>(controller.signal)
      .then((response) => {
        if (!isTermsDocument(response)) {
          throw new Error('Respuesta de términos inválida');
        }
        setTerms(response);
        setError(null);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError(TERMS_ERROR_MESSAGE);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [enabled, reloadNonce]);

  const reload = useCallback(() => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    setReloadNonce((prev) => prev + 1);
  }, [enabled]);

  return { terms, loading, error, reload };
}
