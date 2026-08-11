import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export const BackButton = ({ onClick, label = 'Volver a la lista' }: BackButtonProps) => (
  <button onClick={onClick} className="flex items-center text-muted hover:text-accent mb-6 transition">
    <ArrowLeft className="h-4 w-4 mr-2" /> {label}
  </button>
);
