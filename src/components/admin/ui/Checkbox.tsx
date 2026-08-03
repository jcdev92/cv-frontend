import type { InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const Checkbox = ({ label, className = '', ...props }: CheckboxProps) => (
  <div className="flex items-center mt-6">
    <input type="checkbox" className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 ${className}`} {...props} />
    <label htmlFor={props.id} className="ml-2 block text-sm text-gray-900 dark:text-gray-100">{label}</label>
  </div>
);
