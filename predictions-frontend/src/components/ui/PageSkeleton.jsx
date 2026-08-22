export default function PageSkeleton({ rows = 4, rail = false, className = '' }) {
  return (
    <div className={`flex min-h-[40dvh] animate-rise-in flex-col ${className}`} aria-hidden="true">
      <div className="hidden h-14 border-b border-border-base bg-surface-bar lg:block">
        <div className="flex h-full items-center gap-4 px-6">
          <div className="h-3 w-24 animate-pulse rounded-sm bg-surface-track" />
          <div className="h-3 w-16 animate-pulse rounded-sm bg-surface-track" />
        </div>
      </div>
      <div className={`grid min-h-0 flex-1 gap-4 p-4 ${rail ? 'lg:grid-cols-[minmax(0,1fr)_minmax(16rem,var(--rail-max))]' : ''}`}>
        <div className="flex flex-col gap-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-lg border border-border-card bg-surface-elevated"
            />
          ))}
        </div>
        {rail && (
          <div className="hidden flex-col gap-3 lg:flex">
            <div className="h-40 animate-pulse rounded-lg bg-surface-elevated" />
            <div className="h-40 animate-pulse rounded-lg bg-surface-elevated" />
          </div>
        )}
      </div>
    </div>
  );
}
