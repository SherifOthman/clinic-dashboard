import { DataTable } from "@/core/components/ui/DataTable";
import { TablePagination } from "@/core/components/ui/TablePagination";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import { Button, ListBox, Select } from "@heroui/react";
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
  const isRTL = i18n.language === "ar";

  // Which invitation is pending cancellation (null = dialog closed)
  const [cancellingInvitation, setCancellingInvitation] =
    useState<InvitationDto | null>(null);

  // Which invitation's detail dialog is open (null = closed)
  const [detailInvitationId, setDetailInvitationId] = useState<string | null>(
    null,
  );

  const { invitationsState, updateInvitationsState, statusParam, roleFilter } =
    useInvitationsTableState();

  const { data, isLoading } = useInvitations(invitationsState);
  const resendInvitation = useResendInvitation();

  const columns = getInvitationColumns({
    t,
    isRTL,
    formatDate: formatDateShort,
    onCancel: (inv) => setCancellingInvitation(inv),
    onResend: (inv) => resendInvitation.mutate(inv.id),
    pendingId: resendInvitation.isPending
      ? resendInvitation.variables
      : undefined,
  });

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Filters + invite button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <Select
            className="flex-1 sm:w-48 sm:flex-none"
            placeholder={t("staff.allStatuses")}
            value={statusParam ?? undefined}
            onChange={(v) =>
              updateInvitationsState({ status: v ? String(v) : null })
            }
            aria-label={t("staff.filterByStatus")}
          >
            <Select.Trigger>
              <Select.Value className={isRTL ? "text-right" : ""} />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox dir={isRTL ? "rtl" : "ltr"}>
                <ListBox.Item id="" textValue={t("staff.allStatuses")}>
                  {t("staff.allStatuses")}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                {[
                  InvitationStatus.Pending,
                  InvitationStatus.Accepted,
                  InvitationStatus.Canceled,
                  InvitationStatus.Expired,
                ].map((s) => (
                  <ListBox.Item
                    key={s}
                    id={String(s)}
                    textValue={t(
                      `staff.invitationStatus.${InvitationStatus[s]}`,
                    )}
                  >
                    {t(`staff.invitationStatus.${InvitationStatus[s]}`)}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          <Select
            className="flex-1 sm:w-48 sm:flex-none"
            placeholder={t("staff.allRoles")}
            value={roleFilter ?? undefined}
            onChange={(v) =>
              updateInvitationsState({ invRole: v ? String(v) : null })
            }
            aria-label={t("staff.filterByRole")}
          >
            <Select.Trigger>
              <Select.Value className={isRTL ? "text-right" : ""} />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox dir={isRTL ? "rtl" : "ltr"}>
                <ListBox.Item id="" textValue={t("staff.allRoles")}>
                  {t("staff.allRoles")}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="Doctor" textValue={t("staff.roles.Doctor")}>
                  {t("staff.roles.Doctor")}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item
                  id="Receptionist"
                  textValue={t("staff.roles.Receptionist")}
                >
                  {t("staff.roles.Receptionist")}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        <InviteStaffModal
          trigger={
            <Button variant="primary" className="w-full sm:w-auto">
              <UserPlus className="h-4 w-4" />
              {t("staff.inviteStaffMember")}
            </Button>
          }
        />
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
        onPageSizeChange={(s) =>
          updateInvitationsState({ pageSize: s, pageNumber: 1 })
        }
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
