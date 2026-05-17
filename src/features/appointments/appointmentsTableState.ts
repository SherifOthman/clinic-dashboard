import { useBaseTableState } from "@/core/hooks/useTableState";
import { todayStr } from "@/core/utils/dateUtils";

export function useAppointmentsTableState() {
  const { searchParams, updateParams } = useBaseTableState();

  const state = {
    dateStr:    searchParams.get("date")      ?? todayStr(),
    branchId:   searchParams.get("branch")    ?? undefined,
    doctorId:   searchParams.get("doctor")    ?? undefined,
    searchTerm: searchParams.get("q")         ?? "",
    visitType:  searchParams.get("visitType") ?? "",
    payment:    searchParams.get("payment")   ?? "",
  };

  const update = (updates: Partial<typeof state>) => {
    const params: Record<string, string | null | undefined> = {};
    if ("dateStr"    in updates) params.date      = updates.dateStr === todayStr() ? null : updates.dateStr;
    if ("branchId"   in updates) params.branch    = updates.branchId    ?? null;
    if ("doctorId"   in updates) params.doctor    = updates.doctorId    ?? null;
    if ("searchTerm" in updates) params.q         = updates.searchTerm  || null;
    if ("visitType"  in updates) params.visitType = updates.visitType   || null;
    if ("payment"    in updates) params.payment   = updates.payment     || null;
    updateParams(params, { replace: true });
  };

  return { state, update };
}
