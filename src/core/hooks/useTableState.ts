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

  const updateBaseState = (updates: Partial<BaseTableState>) => {
    setSearchParams(
      (prev) => {
        const p = new URLSearchParams(prev);

        if (updates.pageNumber !== undefined)
          p.set("page", String(updates.pageNumber));
        if (updates.pageSize !== undefined)
          p.set("size", String(updates.pageSize));

        if (updates.searchTerm !== undefined) {
          updates.searchTerm
            ? p.set("search", updates.searchTerm)
            : p.delete("search");
          // Reset to page 1 whenever the search term changes
          p.set("page", "1");
        }

        if (updates.sortBy !== undefined) {
          updates.sortBy ? p.set("sortBy", updates.sortBy) : p.delete("sortBy");
        }
        if (updates.sortDirection !== undefined) {
          // Only store "desc" — omit the param entirely when ascending (cleaner URLs)
          updates.sortDirection !== "asc"
            ? p.set("sortDirection", updates.sortDirection)
            : p.delete("sortDirection");
        }

        return p;
      },
      // replace: true so typing in the search box doesn't flood browser history
      { replace: true },
    );
  };

  /**
   * Set or clear a single URL param, always resetting page to 1.
   * Pass null/undefined to remove the param.
   * Pass replace:true to avoid adding a browser history entry (use for text inputs).
   */
  const updateParam = (
    key: string,
    value: string | null | undefined,
    options?: { replace?: boolean },
  ) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (value) p.set(key, value);
      else p.delete(key);
      p.set("page", "1");
      return p;
    }, options);
  };

  return {
    baseState,
    updateBaseState,
    setSearchParams,
    searchParams,
    updateParam,
  };
}
