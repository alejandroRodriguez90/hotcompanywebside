import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center relative z-10">
      <div className="max-w-md mx-auto flex flex-col items-center">
        {/* Número 404 estilizado con gradiente */}
        <div className="font-display font-black text-7xl sm:text-9xl tracking-tighter bg-gradient-to-r from-[#E10600] via-[#FF6A13] to-[#FFB020] bg-clip-text text-transparent mb-4">
          404
        </div>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#F5F1EC] mb-3">
          Página No Encontrada
        </h1>

        <p className="text-sm text-[#A89F98] leading-relaxed mb-8">
          La ruta que intentas consultar no existe o ha sido reubicada dentro de nuestra plataforma digital.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            icon={<Home className="w-4 h-4" />}
          >
            Volver al Inicio
          </Button>

          <Button
            variant="secondary"
            onClick={() => window.history.back()}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Regresar
          </Button>
        </div>
      </div>
    </div>
  );
};
