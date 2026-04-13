import { toArabicNumerals } from "@/core/utils/arabicNumerals";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuditLogs } from "./auditHooks";
import { useAuditTableState } from "./auditTableState";
import { AuditDetailDialog } from "./components/AuditDetailDialog";
import { AuditFilters } from "./components/AuditFilters";
import { AuditTable } from "./components/AuditTable";
import type { AuditLogItem } from "./types";

export default function AuditPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const {
    auditState,
    updateAuditState,
    userSearch,
    setUserSearch,
    clinicSearch,
    setClinicSearch,
    entityType,
    action,
    from,
    to,
    clearAllFilters,
  } = useAuditTableState();

  const { data, isLoading } = useAuditLogs(auditState);

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="mb-2">
        <h1 className="text-2xl font-bold sm:text-3xl">{t("audit.title")}</h1>
        <p className="text-default-500 text-sm">{t("audit.subtitle")}</p>
        {data && (
          <p className="text-default-400 mt-1 text-xs">
            {isRTL
              ? `${toArabicNumerals(String(data.totalCount))} سجل`
              : `${data.totalCount} records`}
          </p>
        )}
      </div>

      <AuditFilters
        isRTL={isRTL}
        userSearch={userSearch}
        onUserSearchChange={setUserSearch}
        clinicSearch={clinicSearch}
        onClinicSearchChange={setClinicSearch}
        entityType={entityType}
        onEntityTypeChange={(v) => updateAuditState({ entityType: v })}
        action={action}
        onActionChange={(v) => updateAuditState({ action: v })}
        from={from}
        onFromChange={(v) => updateAuditState({ from: v })}
        to={to}
        onToChange={(v) => updateAuditState({ to: v })}
        onClearAll={clearAllFilters}
      />

      <AuditTable
        data={data}
        isLoading={isLoading}
        pageNumber={auditState.pageNumber ?? 1}
        onRowClick={(item: AuditLogItem) => setSelectedLog(item)}
        onPageChange={(p) => updateAuditState({ pageNumber: p })}
        onPageSizeChange={(s) =>
          updateAuditState({ pageSize: s, pageNumber: 1 })
        }
      />

      <AuditDetailDialog
        item={selectedLog}
        isRTL={isRTL}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
