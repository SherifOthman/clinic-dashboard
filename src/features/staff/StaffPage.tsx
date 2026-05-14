import { canInviteStaff } from "@/core/utils/permissions";
import { useMe } from "@/features/auth/hooks";
import { Tabs } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { Staff } from "./components/Staff";
import { Invitations } from "./components/Invitations";
import { PageHeader } from "@/core/components/ui/PageHeader";

export default function StaffPage() {
  const { t } = useTranslation();
  const { user } = useMe();
  const canInvite = canInviteStaff(user);

  return (
    <div>
      <PageHeader title={t("staff.title")} subtitle={t("staff.subtitle")} />

      <Tabs defaultSelectedKey="staff">
        <Tabs.ListContainer>
          <Tabs.List aria-label={t("staff.tabs")}>
            <Tabs.Tab id="staff">
              {t("staff.title")}
              <Tabs.Indicator />
            </Tabs.Tab>
            {canInvite && (
              <Tabs.Tab id="invitations">
                {t("staff.invitations")}
                <Tabs.Indicator />
              </Tabs.Tab>
            )}
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel id="staff" className="pt-4">
          <Staff />
        </Tabs.Panel>

        {canInvite && (
          <Tabs.Panel id="invitations" className="pt-4">
            <Invitations />
          </Tabs.Panel>
        )}
      </Tabs>
    </div>
  );
}
