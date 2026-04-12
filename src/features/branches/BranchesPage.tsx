import { FormInputField } from "@/core/components/form/FormInputField";
import { LocationSelector } from "@/core/components/form/LocationSelector";
import { PhoneNumbersInput } from "@/core/components/form/PhoneNumbersInput";
import { Dialog } from "@/core/components/ui/Dialog";
import { Loading } from "@/core/components/ui/Loading";
import type { DialogState } from "@/core/types";
import { getLocalizedValue } from "@/core/utils/i18nUtils";
import { Button, Card, Chip } from "@heroui/react";
import { Building2, MapPin, Phone, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BranchDetailDialog } from "./BranchDetailDialog";
import type { BranchDto, CreateBranchRequest } from "./branchesApi";
import { useBranches, useCreateBranch, useUpdateBranch } from "./branchesHooks";

export default function BranchesPage() {
  const { t } = useTranslation();
  const { data: branches, isLoading } = useBranches();

  // Which branch's detail dialog is open (null = closed)
  const [detailBranchId, setDetailBranchId] = useState<string | null>(null);

  // Create / edit form dialog
  const [branchForm, setBranchForm] = useState<
    DialogState & { branch?: BranchDto }
  >({
    mode: "closed",
  });

  const detailBranch =
    detailBranchId != null
      ? (branches?.find((b) => b.id === detailBranchId) ?? null)
      : null;

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("branches.title")}</h1>
          <p className="text-default-500 text-sm">{t("branches.subtitle")}</p>
        </div>
        <Button
          variant="primary"
          onPress={() => setBranchForm({ mode: "create" })}
        >
          <Plus className="h-4 w-4" />
          {t("branches.addBranch")}
        </Button>
      </div>

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
        onEdit={(b) => {
          setDetailBranchId(null);
          setBranchForm({ mode: "edit", id: b.id, branch: b });
        }}
      />

      <BranchFormDialog
        state={branchForm}
        onClose={() => setBranchForm({ mode: "closed" })}
      />
    </div>
  );
}

// ── Branch Card ───────────────────────────────────────────────────────────────

function BranchCard({
  branch,
  onView,
}: {
  branch: BranchDto;
  onView: () => void;
}) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const cityName = getLocalizedValue(
    isAr,
    branch.cityNameAr,
    branch.cityNameEn,
  );
  const stateName = getLocalizedValue(
    isAr,
    branch.stateNameAr,
    branch.stateNameEn,
  );
  const locationLabel = [stateName, cityName].filter(Boolean).join(", ");

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={onView}
    >
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
  );
}

// ── Branch Form Dialog ────────────────────────────────────────────────────────

// ── Shared section wrapper (same pattern as PatientForm) ─────────────────────

function FormSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-accent">{icon}</span>
        <p className="text-foreground text-sm font-semibold">{title}</p>
      </div>
      <div className="border-divider rounded-xl border p-4">{children}</div>
    </div>
  );
}

function BranchFormDialog({
  state,
  onClose,
}: {
  state: DialogState & { branch?: BranchDto };
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const branch = state.mode === "edit" ? (state.branch ?? null) : null;
  const isEditing = !!branch;
  const createBranch = useCreateBranch();
  const updateBranch = useUpdateBranch();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateBranchRequest>({
    defaultValues: {
      name: "",
      addressLine: "",
      cityNameEn: undefined,
      cityNameAr: undefined,
      stateNameEn: undefined,
      stateNameAr: undefined,
      phoneNumbers: [""],
    },
  });

  // Populate form when opening in edit mode
  useEffect(() => {
    if (branch) {
      reset({
        name: branch.name,
        addressLine: branch.addressLine ?? "",
        cityNameEn: branch.cityNameEn,
        cityNameAr: branch.cityNameAr,
        stateNameEn: branch.stateNameEn,
        stateNameAr: branch.stateNameAr,
        phoneNumbers: branch.phoneNumbers.map((p) => p.phoneNumber),
      });
    } else {
      reset({
        name: "",
        addressLine: "",
        cityNameEn: undefined,
        cityNameAr: undefined,
        stateNameEn: undefined,
        stateNameAr: undefined,
        phoneNumbers: [""],
      });
    }
  }, [branch?.id]);

  const onSubmit = (data: CreateBranchRequest) => {
    if (isEditing) {
      updateBranch.mutate({ id: branch.id, data }, { onSuccess: onClose });
    } else {
      createBranch.mutate(data, { onSuccess: onClose });
    }
  };

  const isPending = createBranch.isPending || updateBranch.isPending;

  return (
    <Dialog
      isOpen={state.mode !== "closed"}
      onClose={onClose}
      title={isEditing ? t("branches.editBranch") : t("branches.addBranch")}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Branch info */}
        <FormSection
          icon={<Building2 className="h-4 w-4" />}
          title={t("branches.branchInfo")}
        >
          <div className="flex flex-col gap-4">
            <FormInputField
              name="name"
              control={control}
              label={t("common.fields.name")}
              isRequired
            />
            <FormInputField
              name="addressLine"
              control={control}
              label={t("branches.addressLine")}
              isRequired
            />
          </div>
        </FormSection>

        {/* Location + Phones side by side on larger screens */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormSection
            icon={<MapPin className="h-4 w-4" />}
            title={t("common.fields.address")}
          >
            <LocationSelector
              form={{ watch, setValue, formState: { errors } } as any}
              cityNameEnField="cityNameEn"
              cityNameArField="cityNameAr"
              stateNameEnField="stateNameEn"
              stateNameArField="stateNameAr"
            />
          </FormSection>

          <FormSection
            icon={<Phone className="h-4 w-4" />}
            title={t("common.fields.phoneNumber")}
          >
            <PhoneNumbersInput
              form={{ control, watch, setValue, formState: { errors } } as any}
              name="phoneNumbers"
              maxItems={3}
            />
          </FormSection>
        </div>

        <div className="border-divider flex justify-end gap-2 border-t pt-4">
          <Button type="button" variant="ghost" onPress={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            isPending={isPending}
            isDisabled={isPending}
          >
            {isEditing ? t("common.update") : t("common.create")}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
