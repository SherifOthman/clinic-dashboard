import { useTranslation } from "react-i18next";
import { Invitations } from "./components/Invitations";

export default function InvitationsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("staff.invitations")}</h1>
        <p className="text-default-500 text-sm">
          {t("staff.invitationsSubtitle")}
        </p>
      </div>
      <Invitations />
    </div>
  );
}

