import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export const Select = ({ label, className = '', children, ...props }: SelectProps) => (
  <div>
    <label className="block text-sm font-medium text-ink-soft mb-1">{label}</label>
    <select className={`w-full px-3 py-2 bg-field border border-line-strong rounded-md text-ink focus:ring-accent focus:border-accent sm:text-sm ${className}`} {...props}>
      {children}
    </select>
  </div>
);
