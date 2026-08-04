interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorBanner = ({ message, onDismiss }: ErrorBannerProps) => (
  <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm font-medium border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
    <span>{message}</span>
    {onDismiss && (
      <button type="button" onClick={onDismiss} className="ml-4 text-red-500 hover:text-red-700 dark:hover:text-red-300" aria-label="Cerrar">
        ×
      </button>
    )}
  </div>
);
