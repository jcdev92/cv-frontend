import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => (
  <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 text-center dark:bg-gray-900 dark:border-gray-700">
    <Icon className="mx-auto h-12 w-12 text-gray-300 mb-3 dark:text-gray-600" />
    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
    <p className="text-gray-500 mt-1 dark:text-gray-400">{description}</p>
  </div>
);
