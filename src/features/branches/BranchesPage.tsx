import { Loading } from "@/core/components/ui/Loading";
import { PageHeader } from "@/core/components/ui/PageHeader";
import { useDialogState } from "@/core/hooks/useDialogState";
import { canManageBranches } from "@/core/utils/permissions";
import { useMe } from "@/features/auth/hooks";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BranchCard } from "./components/BranchCard";
import { BranchDetailDialog } from "./components/BranchDetailDialog";
import { BranchFormDialog } from "./components/BranchFormDialog";
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
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("branches.title")}
        subtitle={t("branches.subtitle")}
        action={
          canManageBranches(user) ? (
            <Button variant="primary" onPress={branchForm.openCreate}>
              <Plus className="h-4 w-4" />
              {t("branches.addBranch")}
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <Loading className="h-40" />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {branches?.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              onView={() => setDetailBranchId(branch.id)}
            />
          ))}
        </div>
      )}

      <BranchDetailDialog
        branch={detailBranch}
        onClose={() => setDetailBranchId(null)}
        onEdit={openEdit}
      />

      <BranchFormDialog
        state={{ ...branchForm.state, branch: editBranch }}
        onClose={handleClose}
      />
    </div>
  );
}
