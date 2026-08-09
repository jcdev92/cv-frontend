import { Cloud } from 'lucide-react';

interface PortfolioSkeletonProps {
  showColdStartMessage: boolean;
}

const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800 ${className}`} />
);

const PortfolioSkeleton = ({ showColdStartMessage }: PortfolioSkeletonProps) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans dark:bg-gray-950">
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 dark:bg-gray-900/80 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <SkeletonBlock className="h-6 w-48" />
          <div className="hidden md:flex space-x-8">
            <SkeletonBlock className="h-4 w-16" />
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-4 w-20" />
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {showColdStartMessage && (
            <div className="mb-6 flex items-start justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200">
              <div className="flex items-start gap-3">
                <Cloud className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-semibold">El servidor está arrancando</p>
                  <p className="mt-0.5 text-xs opacity-90">
                    La API está alojada en un hosting gratuito que se suspende por inactividad. La primera carga puede tardar entre 15 y 60 segundos. Se cargará automáticamente.
                  </p>
                </div>
              </div>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-amber-600 border-t-transparent dark:border-amber-300" />
            </div>
          )}

          <div className="py-12 md:py-20 flex flex-col-reverse md:flex-row items-center md:justify-between gap-10 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1 w-full">
              <SkeletonBlock className="h-10 w-3/4 mb-4" />
              <SkeletonBlock className="h-6 w-1/2 mb-6" />
              <SkeletonBlock className="h-4 w-full mb-2" />
              <SkeletonBlock className="h-4 w-5/6 mb-2" />
              <SkeletonBlock className="h-4 w-2/3 mb-8" />
              <div className="flex gap-4">
                <SkeletonBlock className="h-11 w-36" />
                <SkeletonBlock className="h-11 w-36" />
              </div>
            </div>
            <div className="w-48 h-48 md:w-72 md:h-72 shrink-0">
              <SkeletonBlock className="w-full h-full rounded-full" />
            </div>
          </div>

          <div className="py-16 space-y-10">
            <SkeletonBlock className="h-6 w-40 mb-4" />
            <div className="space-y-6">
              <SkeletonBlock className="h-16 w-full" />
              <SkeletonBlock className="h-16 w-full" />
              <SkeletonBlock className="h-16 w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-16">
            <div className="space-y-4">
              <SkeletonBlock className="h-6 w-32" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-2/3" />
            </div>
            <div className="space-y-4">
              <SkeletonBlock className="h-6 w-32" />
              <SkeletonBlock className="h-16 w-full" />
              <SkeletonBlock className="h-16 w-full" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortfolioSkeleton;