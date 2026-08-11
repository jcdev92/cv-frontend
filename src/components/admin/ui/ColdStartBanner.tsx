import { Cloud } from 'lucide-react';

export const ColdStartBanner = () => (
  <div className="mb-6 flex items-start justify-between gap-4 rounded-lg border border-warning-soft bg-warning-soft p-4 text-sm text-warning">
    <div className="flex items-start gap-3">
      <Cloud className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-semibold">El servidor está arrancando</p>
        <p className="mt-0.5 text-xs opacity-90">
          La API está alojada en un hosting gratuito que se suspende por inactividad. La primera carga puede tardar entre 15 y 60 segundos. Se cargará automáticamente.
        </p>
      </div>
    </div>
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-warning border-t-transparent" />
  </div>
);
