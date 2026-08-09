interface SkeletonBlockProps {
  className: string;
}

export const SkeletonBlock = ({ className }: SkeletonBlockProps) => (
  <div className={`animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800 ${className}`} />
);
