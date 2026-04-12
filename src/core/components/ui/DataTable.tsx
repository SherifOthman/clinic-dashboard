import { cn } from "@/core/utils";
import { Table } from "@heroui/react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { TableSkeleton } from "./TableSkeleton";

/**
 * Column definition for DataTable.
 * `key` must match a property name on the data item (used for sorting and fallback rendering).
 * `render` overrides the default cell rendering — use it for custom JSX (chips, avatars, etc.).
 */
export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T extends Record<string, any>> {
  columns: Column<T>[];
  data: T[];
  /** Returns a unique string key for each row (used as React key and selection id) */
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  /** Currently active sort column key */
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  /** Called when a sortable column header is clicked */
  onSortChange?: (sortBy: string, sortDirection: "asc" | "desc") => void;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage,
  onRowClick,
  sortBy,
  sortDirection,
  onSortChange,
}: DataTableProps<T>) {
  const { t } = useTranslation();

  // Toggle: if clicking the already-active column, flip direction; otherwise start asc
  const handleColumnClick = (key: string, sortable?: boolean) => {
    if (!sortable || !onSortChange) return;
    onSortChange(
      key,
      sortBy === key && sortDirection === "asc" ? "desc" : "asc",
    );
  };

  // Shows the current sort direction for the active column,
  // or a neutral double-arrow for inactive sortable columns
  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortBy !== colKey)
      return <ChevronsUpDown className="h-3 w-3 opacity-40" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    );
  };

  // Show skeleton rows while data is loading — same structure as the real table
  if (isLoading) {
    return <TableSkeleton columns={columns} />;
  }

  // Pre-build a key→item map so onSelectionChange can look up the clicked row in O(1)
  const itemById = Object.fromEntries(
    data.map((item) => [keyExtractor(item), item]),
  );

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Data table"
          className="min-w-150 whitespace-nowrap"
          // "single" selection mode lets us use onSelectionChange as a row-click handler
          // without adding a visible checkbox column
          selectionMode={onRowClick ? "single" : "none"}
          selectionBehavior="replace"
          onSelectionChange={(keys) => {
            if (!onRowClick) return;
            const key = keys === "all" ? null : [...keys][0];
            if (key) {
              const item = itemById[String(key)];
              if (item) onRowClick(item);
            }
          }}
        >
          <Table.Header>
            {columns.map((column, index) => (
              <Table.Column
                key={column.key}
                isRowHeader={index === 0}
                className={cn(
                  "rtl:text-right",
                  column.sortable &&
                    onSortChange &&
                    "cursor-pointer select-none",
                )}
                onClick={() => handleColumnClick(column.key, column.sortable)}
              >
                <span className="flex items-center gap-1">
                  {column.label}
                  {column.sortable && onSortChange && (
                    <SortIcon colKey={column.key} />
                  )}
                </span>
              </Table.Column>
            ))}
          </Table.Header>
          <Table.Body
            items={data}
            renderEmptyState={() => (
              <div className="text-default-500 flex items-center justify-center py-8">
                {emptyMessage ?? t("table.noData")}
              </div>
            )}
          >
            {(item: T) => (
              <Table.Row
                key={keyExtractor(item)}
                id={keyExtractor(item)}
                className={onRowClick ? "cursor-pointer" : ""}
              >
                {columns.map((column) => (
                  <Table.Cell key={column.key}>
                    {column.render
                      ? column.render(item)
                      : String(item[column.key] ?? "")}
                  </Table.Cell>
                ))}
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
