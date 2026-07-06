import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-white/5 rounded-xl animate-pulse',
            className
          )}
        />
      ))}
    </>
  );
}

// ✅ Tambahkan export default
export default Skeleton;
