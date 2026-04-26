import { useSearchParams } from "react-router-dom";

export interface BaseTableState {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
}

type ParamUpdates = Record<string, string | number | null | undefined>;

/**
 * Manages table filter/sort/pagination state in the URL query string.
 *
 * Why the URL instead of useState?
 * - The user can refresh the page and land on the same filtered view.
 * - The user can share the URL and the recipient sees the same results.
 * - The browser back/forward buttons work naturally.
 *
 * URL param mapping:
 *   page          → pageNumber
 *   size          → pageSize
 *   search        → searchTerm
 *   sortBy        → sortBy (column key, e.g. "fullName")
 *   sortDirection → "desc" only (omitted when "asc" to keep URLs clean)
 *
 * Feature-specific params (gender, city, etc.) are managed by the feature's
 * own hook using the `buildFilterParams` + `updateParams` helpers returned here.
 */
export function useBaseTableState(defaults?: Partial<BaseTableState>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const baseState: BaseTableState = {
    pageNumber:    parseInt(searchParams.get("page") || "1"),
    pageSize:      parseInt(searchParams.get("size") || String(defaults?.pageSize ?? 10)),
    searchTerm:    searchParams.get("search") || "",
    sortBy:        searchParams.get("sortBy") || defaults?.sortBy || "",
    sortDirection: (searchParams.get("sortDirection") as "asc" | "desc") || "asc",
  };

  const updateParams = (updates: ParamUpdates, options?: { replace?: boolean }) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") p.delete(key);
        else p.set(key, String(value));
      });
      return p;
    }, options);
  };

  /**
   * Builds the base URL params from common table updates (page, size, sort).
   * Feature hooks call this first, then add their own filter params on top.
   *
   * Usage in a feature hook:
   *   const params = buildFilterParams(updates);
   *   if ("role" in updates) { params.role = updates.role; params.page = 1; }
   *   updateParams(params);
   */
  const buildFilterParams = (updates: {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
  }): ParamUpdates => {
    const params: ParamUpdates = {};
    if ("pageNumber" in updates) params.page = updates.pageNumber;
    if ("pageSize" in updates) params.size = updates.pageSize;
    if ("sortBy" in updates) params.sortBy = updates.sortBy;
    if ("sortDirection" in updates)
      params.sortDirection = updates.sortDirection === "asc" ? null : updates.sortDirection;
    return params;
  };

  return { baseState, searchParams, updateParams, buildFilterParams };
}
