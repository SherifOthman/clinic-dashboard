import { cn } from "@/core/utils";
import { Skeleton, Table } from "@heroui/react";
import { useTranslation } from "react-i18next";
import type { Column } from "./DataTable";

interface TableSkeletonProps {
  columns: Column<any>[];
  rows?: number;
}

/**
 * Skeleton loading state for DataTable.
 *
 * Mirrors the exact same Table structure (ScrollContainer → Content → Header → Body)
 * so the layout doesn't shift when real data arrives.
 *
 * RTL support:
 *   dir={isRTL ? "rtl" : "ltr"} on Table.Content flips the column order
 *   natively in the browser — no JS reordering needed.
 *
 * First column gets an avatar circle + two text lines to match the
 * name/code cell pattern used in patient and staff tables.
 * Other columns get a single shimmer line with varying widths so
 * rows look natural rather than identical.
 */
export function TableSkeleton({ columns, rows = 8 }: TableSkeletonProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Loading"
          aria-busy="true"
          dir={isRTL ? "rtl" : "ltr"}
          className="min-w-[600px] whitespace-nowrap"
        >
          <Table.Header>
            {columns.map((column, index) => (
              <Table.Column
                key={column.key}
                isRowHeader={index === 0}
                className={cn("rtl:text-right", isRTL && "text-right")}
              >
                {column.label}
              </Table.Column>
            ))}
          </Table.Header>

          <Table.Body>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <Table.Row key={rowIndex} id={String(rowIndex)}>
                {columns.map((column, colIndex) => (
                  <Table.Cell key={column.key}>
                    {colIndex === 0 ? (
                      // First column: avatar circle + two text lines
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                        <div
                          className={cn(
                            "flex flex-col gap-1.5",
                            isRTL && "items-end",
                          )}
                        >
                          <Skeleton className="h-3 w-28 rounded" />
                          <Skeleton
                            className={cn(
                              "h-2.5 w-16 rounded",
                              isRTL && "ml-auto flex",
                            )}
                          />
                        </div>
                      </div>
                    ) : (
                      // Other columns: single line, widths cycle through 3 sizes
                      // so adjacent rows don't look identical
                      <div>
                        <Skeleton
                          className={cn(
                            "h-3 rounded",
                            colIndex % 3 === 0
                              ? "w-16"
                              : colIndex % 3 === 1
                                ? "w-24"
                                : "w-20",
                          )}
                        />
                      </div>
                    )}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
