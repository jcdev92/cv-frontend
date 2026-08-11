import { Loader2 } from 'lucide-react';

export const Spinner = () => (
  <div className="flex justify-center py-12">
    <Loader2 className="animate-spin text-accent h-8 w-8" />
  </div>
);
