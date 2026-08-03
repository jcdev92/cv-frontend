import type { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900',
  secondary: 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-500 dark:hover:text-blue-400 dark:hover:bg-blue-500/10',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5',
};

export const Button = ({ variant = 'primary', size = 'md', loading = false, className = '', children, disabled, ...props }: ButtonProps) => (
  <button
    className={`inline-flex items-center justify-center rounded-md font-medium transition disabled:opacity-70 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
    {children}
  </button>
);
