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
  primary: 'bg-accent text-on-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-page',
  secondary: 'text-ink-soft hover:text-ink',
  danger: 'bg-danger text-on-accent hover:bg-danger-hover',
  ghost: 'text-faint hover:text-accent hover:bg-accent-soft',
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
