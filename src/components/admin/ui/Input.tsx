import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = ({ label, className = '', ...props }: InputProps) => (
  <div>
    <label className="block text-sm font-medium text-ink-soft mb-1">{label}</label>
    <input className={`w-full px-3 py-2 bg-field border border-line-strong rounded-md text-ink focus:ring-accent focus:border-accent placeholder-muted sm:text-sm ${className}`} {...props} />
  </div>
);
