import { useDebounce } from "@/core/hooks/useDebounce";
import { useBaseTableState } from "@/core/hooks/useTableState";
import { useState } from "react";
import type { AuditAction, AuditSearchParams } from "./types";

export function useAuditTableState() {
  const {
    baseState,
    updateBaseState,
    searchParams,
    updateParam,
    setSearchParams,
  } = useBaseTableState();

  // Text search inputs are local state — debounced before hitting the API
  const [userSearch, setUserSearch] = useState("");
  const [clinicSearch, setClinicSearch] = useState("");
  const debouncedUserSearch = useDebounce(userSearch, 400);
  const debouncedClinicSearch = useDebounce(clinicSearch, 400);

  const entityType = searchParams.get("entityType") || undefined;
  const action = (searchParams.get("action") as AuditAction) || undefined;
  const entityId = searchParams.get("entityId") || undefined;
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;

  const auditState: AuditSearchParams = {
    ...baseState,
    entityType,
    action,
    entityId,
    from,
    to,
    userSearch: debouncedUserSearch || undefined,
    clinicSearch: debouncedClinicSearch || undefined,
  };

  const clearAllFilters = () => {
    setUserSearch("");
    setClinicSearch("");
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      ["entityType", "action", "entityId", "from", "to", "page"].forEach((k) =>
        p.delete(k),
      );
      return p;
    });
  };

  return {
    auditState,
    updateBaseState,
    updateParam,
    // text search (local, debounced)
    userSearch,
    setUserSearch,
    clinicSearch,
    setClinicSearch,
    // URL-backed filters
    entityType,
    action,
    entityId,
    from,
    to,
    clearAllFilters,
  };
}
