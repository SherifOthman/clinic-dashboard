import { useDebounce } from "@/core/hooks/useDebounce";
import { useBaseTableState } from "@/core/hooks/useTableState";
import { useState } from "react";
import type { AuditAction, AuditSearchParams } from "./types";

export function useAuditTableState() {
  const { baseState, searchParams, updateParams, buildFilterParams } = useBaseTableState();

  // Text searches stay in local state — debounced before hitting the API.
  // They don't go in the URL because they're transient typing state.
  const [userSearch, setUserSearch] = useState("");
  const [clinicSearch, setClinicSearch] = useState("");
  const debouncedUserSearch   = useDebounce(userSearch, 400);
  const debouncedClinicSearch = useDebounce(clinicSearch, 400);

  const entityType = searchParams.get("entityType") || undefined;
  const action     = (searchParams.get("action") as AuditAction) || undefined;
  const entityId   = searchParams.get("entityId") || undefined;
  const from       = searchParams.get("from") || undefined;
  const to         = searchParams.get("to")   || undefined;

  const auditState: AuditSearchParams = {
    ...baseState,
    entityType,
    action,
    entityId,
    from,
    to,
    userSearch:   debouncedUserSearch   || undefined,
    clinicSearch: debouncedClinicSearch || undefined,
  };

  const updateAuditState = (updates: Partial<{
    pageNumber?: number;
    pageSize?: number;
    entityType?: string | null;
    action?: string | null;
    entityId?: string | null;
    from?: string | null;
    to?: string | null;
  }>) => {
    const params = buildFilterParams(updates);
    if ("entityType" in updates) { params.entityType = updates.entityType; params.page = 1; }
    if ("action" in updates)     { params.action     = updates.action;     params.page = 1; }
    if ("entityId" in updates)   { params.entityId   = updates.entityId;   params.page = 1; }
    if ("from" in updates)       { params.from       = updates.from;       params.page = 1; }
    if ("to" in updates)         { params.to         = updates.to;         params.page = 1; }
    updateParams(params);
  };

  const clearAllFilters = () => {
    setUserSearch("");
    setClinicSearch("");
    updateParams({ entityType: null, action: null, entityId: null, from: null, to: null, page: 1 });
  };

  return {
    auditState,
    updateAuditState,
    userSearch,   setUserSearch,
    clinicSearch, setClinicSearch,
    entityType, action, entityId, from, to,
    clearAllFilters,
  };
}
