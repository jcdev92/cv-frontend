import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const Textarea = ({ label, className = '', ...props }: TextareaProps) => (
  <div>
    <label className="block text-sm font-medium text-ink-soft mb-1">{label}</label>
    <textarea className={`w-full px-3 py-2 bg-field border border-line-strong rounded-md text-ink focus:ring-accent focus:border-accent placeholder-muted sm:text-sm ${className}`} {...props} />
  </div>
);
