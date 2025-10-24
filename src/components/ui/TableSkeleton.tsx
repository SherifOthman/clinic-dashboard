import { Card, CardBody } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
  return (
    <Card>
      <CardBody className="p-0">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-divider">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-20 rounded" />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center gap-4 p-4 border-b border-divider last:border-b-0"
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex items-center gap-3">
                {colIndex === 0 && (
                  <Skeleton className="h-8 w-8 rounded-full" />
                )}
                <Skeleton className="h-4 w-16 rounded" />
              </div>
            ))}
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
