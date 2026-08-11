import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export const SectionHeader = ({ title, subtitle, action }: SectionHeaderProps) => (
  <div className="flex justify-between items-center">
    <div>
      <h3 className="text-xl font-bold text-ink">{title}</h3>
      {subtitle && <p className="text-muted text-sm">{subtitle}</p>}
    </div>
    {action}
  </div>
);
