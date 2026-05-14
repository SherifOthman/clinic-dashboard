import { useBaseTableState } from "@/core/hooks/useTableState";
import { todayStr } from "@/core/utils/dateUtils";

export function useAppointmentsTableState() {
  const { baseState, searchParams, updateParams, buildFilterParams } = useBaseTableState();

  const appointmentsState = {
    ...baseState,
    dateStr:   searchParams.get("date")      ?? todayStr(),
    branchId:  searchParams.get("branch")     ?? undefined,
    doctorId:  searchParams.get("doctor")     ?? undefined,
    visitType: searchParams.get("visitType")  ?? "",
    payment:   searchParams.get("payment")    ?? "",
  };

  const updateAppointmentsState = (updates: Record<string, string | undefined | null>) => {
    const params = buildFilterParams(updates);

    if ("dateStr" in updates)   params.date      = updates.dateStr === todayStr() ? null : updates.dateStr;
    if ("branchId" in updates)  params.branch     = updates.branchId ?? null;
    if ("doctorId" in updates)  params.doctor     = updates.doctorId ?? null;
    if ("searchTerm" in updates) params.search    = updates.searchTerm || null;
    if ("visitType" in updates)  params.visitType = updates.visitType || null;
    if ("payment" in updates)    params.payment   = updates.payment || null;

    updateParams(params);
  };

  return { appointmentsState, updateAppointmentsState };
}
