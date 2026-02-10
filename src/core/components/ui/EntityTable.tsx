import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { ReactNode, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "../../hooks/useDebounce";

export interface SortOption {
  key: string;
  value?: string;
  label: string;
}

export interface TableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
}

export interface TableAction<T> {
  key: string;
  label: string | ((item: T) => string);
  icon?: ReactNode | ((item: T) => ReactNode);
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  onAction: (item: T) => void;
}

type SortDirection = "ascending" | "descending";

interface EntityTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  currentSort?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (sortBy: string, direction: "asc" | "desc") => void;
  onSearch?: (searchTerm: string) => void;
  getRowKey: (item: T) => string;
  headerAction?: ReactNode;
  onRowClick?: (item: T) => void;
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function EntityTable<T>({
  data,
  columns,
  actions = [],
  isLoading = false,
  searchPlaceholder,
  currentSort,
  sortDirection = "asc",
  onSort,
  onSearch,
  getRowKey,
  headerAction,
  onRowClick,
  totalCount = 0,
  pageNumber = 1,
  pageSize = 10,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
}: EntityTableProps<T>) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const lastSearchValue = useRef("");

  if (debouncedSearchValue !== lastSearchValue.current) {
    lastSearchValue.current = debouncedSearchValue;
    if (onSearch) {
      onSearch(debouncedSearchValue);
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handlePageSizeChange = (keys: any) => {
    if (!onPageSizeChange) return;
    const newPageSize = parseInt(Array.from(keys)[0] as string);
    if (newPageSize !== pageSize) {
      onPageSizeChange(newPageSize);
    }
  };

  const pageSizeOptions = [
    { key: "10", label: "10" },
    { key: "25", label: "25" },
    { key: "50", label: "50" },
    { key: "100", label: "100" },
  ];

  const selectedPageSize = new Set([pageSize.toString()]);

  // Convert our "asc"/"desc" to Hero UI's "ascending"/"descending"
  const heroUISortDirection: SortDirection =
    sortDirection === "asc" ? "ascending" : "descending";

  // Prepare columns for Hero UI Table
  const tableColumns = (() => {
    const cols = columns.map((column) => ({
      key: column.key,
      label: column.label,
      allowsSorting: column.sortable && !!onSort,
    }));

    if (actions.length > 0) {
      cols.push({
        key: "actions",
        label: t("patients.actions"),
        allowsSorting: false,
      });
    }

    return cols;
  })();

  const renderCell = (item: T, columnKey: string) => {
    if (columnKey === "actions") {
      return (
        <div className="flex gap-2">
          {actions.map((action) => (
            <Button
              key={action.key}
              size="sm"
              variant="flat"
              color={action.color || "default"}
              onPress={() => action.onAction(item)}
              startContent={
                typeof action.icon === "function"
                  ? action.icon(item)
                  : action.icon
              }
            >
              {typeof action.label === "function"
                ? action.label(item)
                : action.label}
            </Button>
          ))}
        </div>
      );
    }

    const column = columns.find((col) => col.key === columnKey);
    if (column?.render) {
      return column.render(item);
    }

    return (item as any)[columnKey];
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center gap-4">
          {onSearch && (
            <div className="flex-1 max-w-sm">
              <Input
                placeholder={searchPlaceholder || t("common.search")}
                value={searchValue}
                onValueChange={handleSearchChange}
                startContent={<Search className="w-4 h-4 text-default-400" />}
                size="sm"
                variant="bordered"
                isClearable
                onClear={() => handleSearchChange("")}
                description={
                  searchValue
                    ? t("table.searchingFor", { term: searchValue })
                    : undefined
                }
              />
            </div>
          )}
          {headerAction && <div>{headerAction}</div>}
        </div>

        {(currentSort || searchValue) && (
          <div className="flex items-center gap-2 text-sm text-default-600">
            <span>{t("table.active")}:</span>
            {currentSort && (
              <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-md">
                <span>
                  {t("table.sortedBy")}{" "}
                  {columns.find((c) => c.key === currentSort)?.label}
                </span>
                {sortDirection === "asc" ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </div>
            )}
            {searchValue && (
              <div className="px-2 py-1 bg-secondary/10 rounded-md">
                {t("table.search")}: &ldquo;{searchValue}&rdquo;
              </div>
            )}
          </div>
        )}
      </div>

      <Table
        aria-label={t("table.entityTable")}
        onRowAction={
          onRowClick
            ? (key) => {
                const item = data.find((item) => getRowKey(item) === key);
                if (item) onRowClick(item);
              }
            : undefined
        }
        onSortChange={
          onSort
            ? (descriptor) => {
                // Convert Hero UI's "ascending"/"descending" back to our "asc"/"desc"
                const direction =
                  descriptor.direction === "ascending" ? "asc" : "desc";
                onSort(descriptor.column as string, direction);
              }
            : undefined
        }
        sortDescriptor={
          currentSort
            ? {
                column: currentSort,
                direction: heroUISortDirection,
              }
            : undefined
        }
      >
        <TableHeader columns={tableColumns}>
          {(column) => (
            <TableColumn key={column.key} allowsSorting={column.allowsSorting}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={data}
          isLoading={isLoading}
          emptyContent={
            <div className="text-center py-8">
              <p className="text-default-500 mb-2">{t("common.noData")}</p>
              {searchValue && (
                <p className="text-sm text-default-400">
                  {t("table.adjustSearch")}
                </p>
              )}
            </div>
          }
          loadingContent={
            <div className="text-center py-8">
              <p className="text-default-500">{t("common.loading")}</p>
            </div>
          }
        >
          {(item) => (
            <TableRow key={getRowKey(item)}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey as string)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {onPageChange && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {onPageSizeChange && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-default-600">
                  {t("table.show")}:
                </span>
                <Select
                  selectedKeys={selectedPageSize}
                  onSelectionChange={handlePageSizeChange}
                  className="w-20"
                  size="sm"
                  variant="bordered"
                  aria-label={t("table.itemsPerPage")}
                >
                  {pageSizeOptions.map((option) => (
                    <SelectItem key={option.key}>{option.label}</SelectItem>
                  ))}
                </Select>
                <span className="text-sm text-default-600">
                  {t("table.perPage")}
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <Pagination
              total={totalPages}
              page={pageNumber}
              onChange={onPageChange}
              showControls
              size="sm"
              variant="bordered"
            />
          </div>
          <div className="flex justify-end">
            <p className="text-sm text-default-600">
              {t("table.showingResults", {
                start: (pageNumber - 1) * pageSize + 1,
                end: Math.min(pageNumber * pageSize, totalCount),
                total: totalCount,
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
