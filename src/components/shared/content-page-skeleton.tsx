
import { Skeleton } from '@/components/ui/skeleton';
import type React from 'react';

interface ContentPageSkeletonProps {
  itemCount?: number;
}

const defaultProps: Required<Pick<ContentPageSkeletonProps, 'itemCount'>> = {
  itemCount: 3, // Default to 3 items for a cleaner initial look
};

export default function ContentPageSkeleton({ itemCount = defaultProps.itemCount }: ContentPageSkeletonProps) {
  return (
    <div className="space-y-8"> {/* Increased spacing between skeleton item blocks */}
      {[...Array(itemCount)].map((_, i) => (
        <div key={`content-skeleton-item-${i}`} className="space-y-4"> {/* Spacing within an item block */}
          <Skeleton className="h-10 w-3/4" /> {/* Simulates a main heading */}
          <div className="space-y-3"> {/* Grouping for paragraph-like skeletons */}
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
