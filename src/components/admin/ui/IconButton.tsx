import type { ButtonHTMLAttributes } from 'react';

export const IconButton = ({ className = '', children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={`rounded-md transition ${className}`} {...props}>
    {children}
  </button>
);
