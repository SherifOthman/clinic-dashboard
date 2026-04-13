import { useSearchParams } from "react-router-dom";

export interface BaseTableState {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
}

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
 * own hook using the `updateParam` helper returned here.
 */
export function useBaseTableState(defaults?: Partial<BaseTableState>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const baseState: BaseTableState = {
    pageNumber: parseInt(searchParams.get("page") || "1"),
    pageSize: parseInt(
      searchParams.get("size") || String(defaults?.pageSize ?? 10),
    ),
    searchTerm: searchParams.get("search") || "",
    sortBy: searchParams.get("sortBy") || defaults?.sortBy || "",
    sortDirection:
      (searchParams.get("sortDirection") as "asc" | "desc") || "asc",
  };

  const updateParams = (
    updates: Record<string, string | number | null | undefined>,
    options?: { replace?: boolean },
  ) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          p.delete(key);
        } else {
          p.set(key, String(value));
        }
      });

      return p;
    }, options);
  };

  return {
    baseState,
    searchParams,
    updateParams,
  };
}
