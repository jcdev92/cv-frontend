import type { InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const Checkbox = ({ label, className = '', ...props }: CheckboxProps) => (
  <div className="flex items-center mt-6">
    <input type="checkbox" className={`h-4 w-4 text-accent focus:ring-accent border-line-strong rounded bg-field ${className}`} {...props} />
    <label htmlFor={props.id} className="ml-2 block text-sm text-ink">{label}</label>
  </div>
);
