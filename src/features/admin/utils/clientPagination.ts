import type { PagedResult } from "@/core/types";

/**
 * Slices a local array into a page and builds a PagedResult-shaped metadata
 * object so TablePagination can be used without a backend paginated endpoint.
 */
export function buildClientPage<T>(
  items: T[],
  page: number,
  pageSize: number,
): { items: T[]; meta: Omit<PagedResult<T>, "items"> } {
  const totalCount  = items.length;
  const totalPages  = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage    = Math.min(Math.max(1, page), totalPages);
  const start       = (safePage - 1) * pageSize;
  const sliced      = items.slice(start, start + pageSize);

  return {
    items: sliced,
    meta: {
      pageNumber:      safePage,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage:     safePage < totalPages,
      hasPreviousPage: safePage > 1,
    },
  };
}
