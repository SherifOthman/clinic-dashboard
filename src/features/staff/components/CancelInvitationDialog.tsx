import { ConfirmDialog } from "@/core/components/ui/ConfirmDialog";
import { useTranslation } from "react-i18next";
import { useCancelInvitation } from "../staffHooks";
import type { InvitationDto } from "../types";

interface CancelInvitationDialogProps {
  /** The invitation to cancel, or null when closed */
  invitation: InvitationDto | null;
  onClose: () => void;
}

export function CancelInvitationDialog({
  invitation,
  onClose,
}: CancelInvitationDialogProps) {
  const { t } = useTranslation();
  const cancelInvitation = useCancelInvitation();

  const handleConfirm = () => {
    if (!invitation) return;
    cancelInvitation.mutate(invitation.id, { onSuccess: onClose });
  };

  return (
    <ConfirmDialog
      isOpen={!!invitation}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={t("staff.cancelInvitation")}
      message={t("staff.cancelInvitationConfirm", {
        email: invitation?.email ?? "",
      })}
      confirmText={t("staff.cancelInvitation")}
      variant="danger"
      isLoading={cancelInvitation.isPending}
    />
  );
}
