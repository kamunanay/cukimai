import { cn } from '../../lib/utils';

export function Skeleton({ className, count = 1 }: { className?: string; count?: number }) {
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
