import { PageHeader } from "@/core/components/ui/PageHeader";
import { toArabicNumerals } from "@/core/utils/arabicNumerals";
import { isSuperAdmin } from "@/core/utils/permissions";
import { useMe } from "@/features/auth/hooks";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuditLogs, useMyClinicAuditLogs } from "./auditHooks";
import { useAuditTableState } from "./auditTableState";
import { AuditDetailDialog } from "./components/AuditDetailDialog";
import { AuditFilters } from "./components/AuditFilters";
import { AuditTable } from "./components/AuditTable";
import type { AuditLogItem } from "./types";

export default function AuditPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { user } = useMe();
  const superAdmin = isSuperAdmin(user);

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

  // SuperAdmin sees all clinics; Clinic Owner sees only their own clinic
  const superAdminQuery  = useAuditLogs(superAdmin ? auditState : {});
  const ownerQuery       = useMyClinicAuditLogs(!superAdmin ? auditState : {});
  const { data, isLoading } = superAdmin ? superAdminQuery : ownerQuery;

  return (
    <div className="flex flex-col gap-4 py-4">
      <PageHeader title={t("audit.title")} subtitle={t("audit.subtitle")}>
        {data && (
          <p className="text-default-400 mt-1 text-xs">
            {isRTL
              ? `${toArabicNumerals(String(data.totalCount))} سجل`
              : `${data.totalCount} records`}
          </p>
        )}
      </PageHeader>

      <AuditFilters
        isRTL={isRTL}
        userSearch={userSearch}
        onUserSearchChange={setUserSearch}
        // Clinic search only shown to SuperAdmin — owners are always scoped to their clinic
        clinicSearch={superAdmin ? clinicSearch : undefined}
        onClinicSearchChange={superAdmin ? setClinicSearch : undefined}
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
