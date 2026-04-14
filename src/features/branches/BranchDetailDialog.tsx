import { Dialog } from "@/core/components/ui/Dialog";
import { InfoRow } from "@/core/components/ui/InfoRow";
import { useGeonameLabel } from "@/core/location/hooks";
import { formatPhoneInternational } from "@/core/utils/phoneFormat";
import { Button, Chip } from "@heroui/react";
import { Building2, Edit, MapPin, Phone, Power } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { BranchDto } from "./branchesApi";
import { useSetBranchActiveStatus } from "./branchesHooks";

interface BranchDetailDialogProps {
  branch: BranchDto | null;
  onClose: () => void;
  onEdit: (branch: BranchDto) => void;
}

export function BranchDetailDialog({
  branch,
  onClose,
  onEdit,
}: BranchDetailDialogProps) {
  const { t } = useTranslation();
  const toggleActive = useSetBranchActiveStatus();

  const cityName = useGeonameLabel(
    branch?.cityGeonameId ?? null,
    "city",
    branch?.stateGeonameId,
  );
  const stateName = useGeonameLabel(
    branch?.stateGeonameId ?? null,
    "state",
    undefined,
  );

  if (!branch) return null;

  const locationParts = [stateName, cityName].filter(Boolean);

  const footer = (
    <div className="flex w-full gap-3">
      {!branch.isMainBranch && (
        <Button
          variant="outline"
          size="sm"
          className={
            branch.isActive ? "text-danger flex-1" : "text-success flex-1"
          }
          isPending={
            toggleActive.isPending && toggleActive.variables?.id === branch.id
          }
          onPress={() =>
            toggleActive.mutate({ id: branch.id, isActive: !branch.isActive })
          }
        >
          <Power className="h-4 w-4" />
          {branch.isActive
            ? t("common.status.deactivate")
            : t("common.status.activate")}
        </Button>
      )}
      <Button
        variant="primary"
        size="sm"
        onPress={() => {
          onEdit(branch);
          onClose();
        }}
        className="flex-1"
      >
        <Edit className="h-4 w-4" />
        {t("common.edit")}
      </Button>
    </div>
  );

  return (
    <Dialog isOpen={!!branch} onClose={onClose} size="sm" footer={footer}>
      <div className="flex flex-col gap-5">
        {/* ── Header ── */}
        <div className="flex flex-col items-center gap-3 pt-1 text-center">
          <div className="bg-accent-soft flex h-16 w-16 items-center justify-center rounded-2xl">
            <Building2 className="text-accent h-7 w-7" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-foreground text-xl font-bold">{branch.name}</h2>
            <div className="flex flex-wrap justify-center gap-1.5">
              {branch.isMainBranch && (
                <Chip size="sm" variant="soft" color="accent">
                  {t("branches.main")}
                </Chip>
              )}
              <Chip
                size="sm"
                variant="soft"
                color={branch.isActive ? "success" : "danger"}
              >
                {branch.isActive
                  ? t("common.status.active")
                  : t("common.status.inactive")}
              </Chip>
            </div>
          </div>
        </div>

        <div className="border-divider border-t" />

        {/* ── Details ── */}
        <div className="divide-divider divide-y">
          {branch.addressLine && (
            <InfoRow
              icon={<Building2 className="h-4 w-4" />}
              label={t("branches.addressLine")}
            >
              {branch.addressLine}
            </InfoRow>
          )}
          {locationParts.length > 0 && (
            <InfoRow
              icon={<MapPin className="h-4 w-4" />}
              label={t("location.cityState")}
            >
              {locationParts.join(", ")}
            </InfoRow>
          )}
          {branch.phoneNumbers.length > 0 && (
            <InfoRow
              icon={<Phone className="h-4 w-4" />}
              label={t("common.fields.phoneNumber")}
            >
              <div className="flex flex-col gap-0.5">
                {branch.phoneNumbers.map((p, i) => (
                  <span key={i} dir="ltr" className="font-mono text-sm">
                    {formatPhoneInternational(p.phoneNumber)}
                  </span>
                ))}
              </div>
            </InfoRow>
          )}
        </div>
      </div>
    </Dialog>
  );
}
