import { useTranslation } from "react-i18next";
import { Invitations } from "./components/Invitations";
import { PageHeader } from "@/core/components/ui/PageHeader";

export default function InvitationsPage() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader title={t("staff.invitations")} subtitle={t("staff.invitationsSubtitle")} />
      <Invitations />
    </div>
  );
}

