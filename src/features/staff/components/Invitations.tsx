import { DataTable } from "@/core/components/ui/DataTable";
import { FilterSelect } from "@/core/components/ui/FilterSelect";
import { TablePagination } from "@/core/components/ui/TablePagination";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import { canInviteStaff } from "@/core/utils/permissions";
import { useMe } from "@/features/auth/hooks";
import { Button } from "@heroui/react";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useInvitations, useResendInvitation } from "../staffHooks";
import { useInvitationsTableState } from "../staffTableState";
import type { InvitationDto } from "../types";
import { InvitationStatus } from "../types";
import { CancelInvitationDialog } from "./CancelInvitationDialog";
import { getInvitationColumns } from "./invitationColumns";
import { InvitationDetailDialog } from "./InvitationDetailDialog";
import { InviteStaffModal } from "./InviteStaffModal";

export function Invitations() {
  const { t, i18n } = useTranslation();
  const { formatDateShort } = useDateFormat();
  const { user } = useMe();

  const [cancellingInvitation, setCancellingInvitation] = useState<InvitationDto | null>(null);
  const [detailInvitationId, setDetailInvitationId] = useState<string | null>(null);

  const { invitationsState, updateInvitationsState, statusParam, roleFilter } =
    useInvitationsTableState();

  const { data, isLoading } = useInvitations(invitationsState);
  const resendInvitation = useResendInvitation();

  const columns = getInvitationColumns({
    t,
    isRTL: i18n.language === "ar",
    formatDate: formatDateShort,
    onCancel: (inv) => setCancellingInvitation(inv),
    onResend: (inv) => resendInvitation.mutate(inv.id),
    pendingId: resendInvitation.isPending ? resendInvitation.variables : undefined,
  });

  const statusOptions = [
    InvitationStatus.Pending,
    InvitationStatus.Accepted,
    InvitationStatus.Canceled,
    InvitationStatus.Expired,
  ].map((s) => ({
    id: String(s),
    label: t(`staff.invitationStatus.${InvitationStatus[s]}`),
  }));

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <FilterSelect
            value={statusParam}
            onChange={(v) => updateInvitationsState({ status: v })}
            placeholder={t("staff.allStatuses")}
            ariaLabel={t("staff.filterByStatus")}
            options={statusOptions}
            className="flex-1 sm:w-48 sm:flex-none"
          />
          <FilterSelect
            value={roleFilter}
            onChange={(v) => updateInvitationsState({ invRole: v })}
            placeholder={t("staff.allRoles")}
            ariaLabel={t("staff.filterByRole")}
            options={[
              { id: "Doctor", label: t("staff.roles.Doctor") },
              { id: "Receptionist", label: t("staff.roles.Receptionist") },
            ]}
            className="flex-1 sm:w-48 sm:flex-none"
          />
        </div>

        {canInviteStaff(user) && (
          <InviteStaffModal
            trigger={
              <Button variant="primary" className="w-full sm:w-auto">
                <UserPlus className="h-4 w-4" />
                {t("staff.inviteStaffMember")}
              </Button>
            }
          />
        )}
      </div>

      <DataTable
        key={i18n.language}
        columns={columns}
        data={data?.items ?? []}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyMessage={t("staff.noInvitations")}
        sortBy={invitationsState.sortBy || undefined}
        sortDirection={invitationsState.sortDirection}
        onSortChange={(sortBy, sortDirection) =>
          updateInvitationsState({ sortBy, sortDirection, pageNumber: 1 })
        }
        onRowClick={(item) => setDetailInvitationId(item.id)}
      />

      <TablePagination
        data={data}
        currentPage={invitationsState.pageNumber ?? 1}
        onPageChange={(p) => updateInvitationsState({ pageNumber: p })}
        onPageSizeChange={(s) => updateInvitationsState({ pageSize: s, pageNumber: 1 })}
      />

      <InvitationDetailDialog
        invitationId={detailInvitationId}
        onClose={() => setDetailInvitationId(null)}
      />

      <CancelInvitationDialog
        invitation={cancellingInvitation}
        onClose={() => setCancellingInvitation(null)}
      />
    </div>
  );
}
