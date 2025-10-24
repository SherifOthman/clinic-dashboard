import { Pagination } from "@heroui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { ReactNode, useMemo } from "react";
import { TableSkeleton } from "./TableSkeleton";

interface Column {
  key: string;
  label: string;
  width?: string;
  minWidth?: string;
}

interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  isLoading?: boolean;
  renderCell: (item: T, columnKey: string) => ReactNode;
  className?: string;
  emptyContent?: ReactNode;
  onRowClick?: (item: T) => void;
  // Pagination props
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading = false,
  renderCell,
  className = "",
  emptyContent = "No data available",
  onRowClick,
  page = 1,
  pageSize = 10,
  onPageChange,
  showPagination = true,
}: DataTableProps<T>) {
  // Calculate paginated data
  const paginatedData = useMemo(() => {
    if (!showPagination) return data;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, page, pageSize, showPagination]);

  const totalPages = Math.ceil(data.length / pageSize);

  if (isLoading) {
    return <TableSkeleton rows={6} columns={columns.length} />;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto bg-content1 rounded-lg shadow-sm border border-divider">
        <Table
          aria-label="Data table"
          className={`border-none ${className}`}
          removeWrapper
          classNames={{
            th: "bg-content2 text-default-700 font-semibold first:rounded-tl-lg last:rounded-tr-lg",
            td: "border-b border-divider/50",
          }}
        >
          <TableHeader>
            {columns.map((column) => (
              <TableColumn
                key={column.key}
                style={{
                  width: column.width,
                  minWidth: column.minWidth || "120px",
                }}
              >
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody emptyContent={emptyContent}>
            {paginatedData.map((item) => (
              <TableRow
                key={item.id}
                className={
                  onRowClick
                    ? "cursor-pointer hover:bg-default-50 dark:hover:bg-default-100 transition-colors group"
                    : "group"
                }
                onClick={(e) => {
                  if (
                    (e.target as HTMLElement).closest("[data-action-button]")
                  ) {
                    return;
                  }
                  onRowClick?.(item);
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {renderCell(item, column.key)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            page={page}
            onChange={onPageChange}
            showControls
            className="gap-2"
          />
        </div>
      )}
    </div>
  );
}
