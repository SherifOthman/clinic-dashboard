import { Loading } from "@/core/components/ui/Loading";
import { useDialogState } from "@/core/hooks/useDialogState";
import { useGeonameLabel } from "@/core/location/hooks";
import { canManageBranches } from "@/core/utils/permissions";
import { useMe } from "@/features/auth/hooks";
import { Button, Card, Chip } from "@heroui/react";
import { Building2, MapPin, Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BranchDetailDialog } from "./BranchDetailDialog";
import { BranchFormDialog } from "./BranchFormDialog";
import type { BranchDto } from "./branchesApi";
import { useBranches } from "./branchesHooks";

export default function BranchesPage() {
  const { t } = useTranslation();
  const { user } = useMe();
  const { data: branches, isLoading } = useBranches();

  const [detailBranchId, setDetailBranchId] = useState<string | null>(null);
  const [editBranch, setEditBranch] = useState<BranchDto | undefined>();
  const branchForm = useDialogState();

  const detailBranch = detailBranchId
    ? (branches?.find((b) => b.id === detailBranchId) ?? null)
    : null;

  const openEdit = (branch: BranchDto) => {
    setDetailBranchId(null);
    setEditBranch(branch);
    branchForm.openEdit(branch.id);
  };

  const handleClose = () => {
    branchForm.close();
    setEditBranch(undefined);
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("branches.title")}</h1>
          <p className="text-default-500 text-sm">{t("branches.subtitle")}</p>
        </div>
        {canManageBranches(user) && (
          <Button variant="primary" onPress={branchForm.openCreate}>
            <Plus className="h-4 w-4" />
            {t("branches.addBranch")}
          </Button>
        )}
      </div>

      {isLoading ? (
        <Loading className="h-40" />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {branches?.map((branch) => (
            <BranchCard key={branch.id} branch={branch} onView={() => setDetailBranchId(branch.id)} />
          ))}
        </div>
      )}

      <BranchDetailDialog branch={detailBranch} onClose={() => setDetailBranchId(null)} onEdit={openEdit} />

      <BranchFormDialog state={{ ...branchForm.state, branch: editBranch }} onClose={handleClose} />
    </div>
  );
}

// ── Branch Card ───────────────────────────────────────────────────────────────

function BranchCard({ branch, onView }: { branch: BranchDto; onView: () => void }) {
  const { t } = useTranslation();
  const cityName = useGeonameLabel(branch.cityGeonameId, "city", branch.stateGeonameId);
  const stateName = useGeonameLabel(branch.stateGeonameId, "state", undefined);
  const locationLabel = [stateName, cityName].filter(Boolean).join(", ");

  return (
    <button type="button" onClick={onView} className="w-full text-start">
      <Card className="transition-shadow hover:shadow-md">
        <Card.Content className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <Building2 className="text-accent h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{branch.name}</span>
                  {branch.isMainBranch && (
                    <Chip size="sm" variant="soft" color="accent">{t("branches.main")}</Chip>
                  )}
                </div>
                {branch.addressLine && (
                  <p className="text-default-500 text-xs">{branch.addressLine}</p>
                )}
                {locationLabel && (
                  <p className="text-default-400 flex items-center gap-1 text-xs">
                    <MapPin className="h-3 w-3" />
                    {locationLabel}
                  </p>
                )}
              </div>
            </div>
            <Chip size="sm" variant="soft" color={branch.isActive ? "success" : "danger"}>
              {branch.isActive ? t("common.status.active") : t("common.status.inactive")}
            </Chip>
          </div>
        </Card.Content>
      </Card>
    </button>
  );
}
