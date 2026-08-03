import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const Textarea = ({ label, className = '', ...props }: TextareaProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">{label}</label>
    <textarea className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 sm:text-sm ${className}`} {...props} />
  </div>
);
