import { useGeonameLabel } from "@/core/location/hooks";
import { Card, Chip } from "@heroui/react";
import { Building2, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { BranchDto } from "../branchesApi";

interface BranchCardProps {
  branch: BranchDto;
  onView: () => void;
}

export function BranchCard({ branch, onView }: BranchCardProps) {
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
                    <Chip size="sm" variant="soft" color="accent">
                      {t("branches.main")}
                    </Chip>
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
        </Card.Content>
      </Card>
    </button>
  );
}
