import { Badge, Button, Card, Checkbox, CheckboxGroup } from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAvailablePermissions, useRoleDefaults, useSetRoleDefaults } from "./permissionsHooks";

const ROLES = ["Owner", "Doctor", "Receptionist"] as const;
type Role = (typeof ROLES)[number];

export default function RoleDefaultsPage() {
  const { t } = useTranslation();
  const { data: available = [], isLoading: loadingAvailable } = useAvailablePermissions();
  const { data: defaults = {}, isLoading: loadingDefaults } = useRoleDefaults();
  const setRoleDefaults = useSetRoleDefaults();

  const [selected, setSelected] = useState<Record<Role, string[]>>({
    Owner: [],
    Doctor: [],
    Receptionist: [],
  });
  const [initialized, setInitialized] = useState(false);

  // Sync server data into local state once loaded
  if (!initialized && !loadingDefaults && Object.keys(defaults).length > 0) {
    setSelected({
      Owner: defaults["Owner"] ?? [],
      Doctor: defaults["Doctor"] ?? [],
      Receptionist: defaults["Receptionist"] ?? [],
    });
    setInitialized(true);
  }

  const handleSave = (role: Role) => {
    setRoleDefaults.mutate({ role, permissions: selected[role] });
  };

  const isLoading = loadingAvailable || loadingDefaults;

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          {t("permissions.roleDefaults.title", "Role Default Permissions")}
        </h1>
        <p className="text-default-500 text-sm">
          {t(
            "permissions.roleDefaults.subtitle",
            "Set the default permissions assigned to new staff members per role. Existing members are not affected.",
          )}
        </p>
      </div>

      {isLoading ? (
        <p className="text-default-400">{t("common.loading", "Loading...")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {ROLES.map((role) => (
            <Card key={role}>
              <Card.Header className="flex items-center justify-between">
                <Card.Title>{role}</Card.Title>
                <Badge variant="soft">{selected[role].length} / {available.length}</Badge>
              </Card.Header>
              <Card.Content className="flex flex-col gap-4">
                <CheckboxGroup
                  value={selected[role]}
                  onChange={(vals) =>
                    setSelected((prev) => ({ ...prev, [role]: vals as string[] }))
                  }
                  aria-label={`${role} permissions`}
                >
                  {available.map((perm) => (
                    <Checkbox key={perm} value={perm}>
                      {perm}
                    </Checkbox>
                  ))}
                </CheckboxGroup>

                <Button
                  variant="primary"
                  size="sm"
                  onPress={() => handleSave(role)}
                  isPending={setRoleDefaults.isPending}
                  isDisabled={setRoleDefaults.isPending}
                >
                  {t("common.save", "Save")}
                </Button>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
