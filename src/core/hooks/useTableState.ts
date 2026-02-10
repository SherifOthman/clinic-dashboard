import { useSearchParams } from "react-router-dom";

export interface BaseTableState {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
}

export function useBaseTableState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const baseState: BaseTableState = (() => {
    const pageNumber = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("size") || "10");
    const searchTerm = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "";
    const sortDirection =
      searchParams.get("sortDesc") === "true" ? "desc" : "asc";

    return {
      pageNumber,
      pageSize,
      searchTerm,
      sortBy,
      sortDirection,
    };
  })();

  const updateBaseState = (updates: Partial<BaseTableState>) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);

      if (updates.pageNumber !== undefined) {
        newParams.set("page", updates.pageNumber.toString());
      }
      if (updates.pageSize !== undefined) {
        newParams.set("size", updates.pageSize.toString());
      }

      if (updates.searchTerm !== undefined) {
        if (updates.searchTerm) {
          newParams.set("search", updates.searchTerm);
        } else {
          newParams.delete("search");
        }
        newParams.set("page", "1");
      }

      if (updates.sortBy !== undefined) {
        if (updates.sortBy) {
          newParams.set("sortBy", updates.sortBy);
        } else {
          newParams.delete("sortBy");
        }
      }
      if (updates.sortDirection !== undefined) {
        newParams.set(
          "sortDesc",
          (updates.sortDirection === "desc").toString(),
        );
      }

      return newParams;
    });
  };

  return {
    baseState,
    updateBaseState,
    setSearchParams,
  };
}
