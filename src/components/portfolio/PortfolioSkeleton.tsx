import { ColdStartBanner, SkeletonBlock } from '../admin/ui';

interface PortfolioSkeletonProps {
  showColdStartMessage: boolean;
}

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
          {showColdStartMessage && <ColdStartBanner />}

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