import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => (
  <div className="bg-surface border-2 border-dashed border-line rounded-xl p-12 text-center">
    <Icon className="mx-auto h-12 w-12 text-faint mb-3" />
    <h3 className="text-lg font-medium text-ink">{title}</h3>
    <p className="text-muted mt-1">{description}</p>
  </div>
);
