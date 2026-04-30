/**
 * Loading skeleton for TodayAppointmentsList rows.
 * Renders `count` placeholder rows while data is fetching.
 */
export function AppointmentListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 border-t border-divider px-5 py-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-default-100" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-36 animate-pulse rounded bg-default-100" />
            <div className="h-3 w-24 animate-pulse rounded bg-default-100" />
          </div>
          <div className="h-3 w-12 animate-pulse rounded bg-default-100" />
        </div>
      ))}
    </div>
  );
}
