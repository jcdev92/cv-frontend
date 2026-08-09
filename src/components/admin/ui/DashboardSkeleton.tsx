import { ColdStartBanner } from './ColdStartBanner';
import { SkeletonBlock } from './SkeletonBlock';

interface DashboardSkeletonProps {
  showColdStartMessage: boolean;
  variant?: 'list' | 'grid' | 'form';
}

const HeaderSkeleton = () => (
  <div className="flex justify-between items-center">
    <div className="space-y-2">
      <SkeletonBlock className="h-7 w-56" />
      <SkeletonBlock className="h-4 w-72" />
    </div>
    <SkeletonBlock className="h-10 w-32" />
  </div>
);

const ListItemSkeleton = () => (
  <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm dark:bg-gray-900 dark:border-gray-700">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <SkeletonBlock className="h-5 w-2/5" />
        <SkeletonBlock className="h-4 w-3/5" />
      </div>
      <SkeletonBlock className="h-6 w-16 ml-4" />
    </div>
    <SkeletonBlock className="h-4 w-full mt-4" />
    <SkeletonBlock className="h-4 w-3/4 mt-2" />
    <div className="flex gap-2 mt-4">
      <SkeletonBlock className="h-6 w-20 rounded-full" />
      <SkeletonBlock className="h-6 w-24 rounded-full" />
      <SkeletonBlock className="h-6 w-16 rounded-full" />
    </div>
  </div>
);

const GridItemSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden dark:bg-gray-900 dark:border-gray-700">
    <SkeletonBlock className="h-40 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <div className="flex justify-between items-start">
        <SkeletonBlock className="h-5 w-2/3" />
        <SkeletonBlock className="h-6 w-16" />
      </div>
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-4/5" />
      <SkeletonBlock className="h-5 w-3/4" />
    </div>
  </div>
);

const FormSkeleton = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-700">
    <div className="space-y-2 mb-6">
      <SkeletonBlock className="h-7 w-48" />
      <SkeletonBlock className="h-4 w-80" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-10 w-full" />
        </div>
        <SkeletonBlock className="h-10 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-10 w-full" />
        </div>
        <SkeletonBlock className="h-10 w-full" />
      </div>
      <div className="space-y-4">
        <SkeletonBlock className="h-10 w-full" />
        <SkeletonBlock className="h-10 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-10 w-full" />
        </div>
      </div>
    </div>
    <SkeletonBlock className="h-28 w-full mt-6" />
    <div className="flex justify-end mt-6">
      <SkeletonBlock className="h-10 w-40" />
    </div>
  </div>
);

export const DashboardSkeleton = ({ showColdStartMessage, variant = 'list' }: DashboardSkeletonProps) => {
  const content =
    variant === 'grid' ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GridItemSkeleton />
        <GridItemSkeleton />
        <GridItemSkeleton />
        <GridItemSkeleton />
      </div>
    ) : variant === 'form' ? (
      <FormSkeleton />
    ) : (
      <div className="space-y-4">
        <ListItemSkeleton />
        <ListItemSkeleton />
        <ListItemSkeleton />
      </div>
    );

  return (
    <div className="space-y-6">
      {showColdStartMessage && <ColdStartBanner />}
      <HeaderSkeleton />
      {content}
    </div>
  );
};