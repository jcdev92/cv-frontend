import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export const SectionHeader = ({ title, subtitle, action }: SectionHeaderProps) => (
  <div className="flex justify-between items-center">
    <div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
      {subtitle && <p className="text-gray-500 text-sm dark:text-gray-400">{subtitle}</p>}
    </div>
    {action}
  </div>
);
