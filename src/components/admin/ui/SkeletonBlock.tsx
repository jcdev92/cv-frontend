interface SkeletonBlockProps {
  className: string;
}

export const SkeletonBlock = ({ className }: SkeletonBlockProps) => (
  <div className={`animate-pulse rounded-lg bg-surface-soft ${className}`} />
);
