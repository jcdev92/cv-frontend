interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorBanner = ({ message, onDismiss }: ErrorBannerProps) => (
  <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-danger-soft text-danger text-sm font-medium border border-danger-soft">
    <span>{message}</span>
    {onDismiss && (
      <button type="button" onClick={onDismiss} className="ml-4 text-danger hover:text-danger" aria-label="Cerrar">
        ×
      </button>
    )}
  </div>
);
