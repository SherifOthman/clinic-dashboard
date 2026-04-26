import { FormInputField } from "@/core/components/form/FormInputField";
import { FormSection } from "@/core/components/form/FormSection";
import { LocationSelector } from "@/core/components/form/LocationSelector";
import { PhoneNumbersInput } from "@/core/components/form/PhoneNumbersInput";
import { Dialog } from "@/core/components/ui/Dialog";
import type { DialogState } from "@/core/types";
import { Button } from "@heroui/react";
import { Building2, MapPin, Phone } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { BranchDto, CreateBranchRequest } from "./branchesApi";
import { useCreateBranch, useUpdateBranch } from "./branchesHooks";

interface BranchFormDialogProps {
  state: DialogState & { branch?: BranchDto };
  onClose: () => void;
}

const emptyDefaults: CreateBranchRequest = {
  name: "",
  addressLine: "",
  stateGeonameId: undefined,
  cityGeonameId: undefined,
  phoneNumbers: [""],
};

export function BranchFormDialog({ state, onClose }: BranchFormDialogProps) {
  const { t } = useTranslation();
  const branch = state.mode === "edit" ? (state.branch ?? null) : null;
  const isEditing = !!branch;

  const createBranch = useCreateBranch();
  const updateBranch = useUpdateBranch();

  const form = useForm<CreateBranchRequest>({ defaultValues: emptyDefaults });
  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (branch) {
      reset({
        name: branch.name,
        addressLine: branch.addressLine ?? "",
        stateGeonameId: branch.stateGeonameId,
        cityGeonameId: branch.cityGeonameId,
        phoneNumbers: branch.phoneNumbers.map((p) => p.phoneNumber),
      });
    } else {
      reset(emptyDefaults);
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
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormSection icon={<Building2 className="h-4 w-4" />} title={t("branches.branchInfo")}>
            <div className="flex flex-col gap-4">
              <FormInputField name="name" control={control} label={t("common.fields.name")} isRequired autoFocus />
              <FormInputField name="addressLine" control={control} label={t("branches.addressLine")} isRequired />
            </div>
          </FormSection>

          <div className="flex flex-col gap-4">
            <FormSection icon={<MapPin className="h-4 w-4" />} title={t("common.fields.address")}>
              <LocationSelector form={form} stateGeonameIdField="stateGeonameId" cityGeonameIdField="cityGeonameId" />
            </FormSection>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-accent"><Phone className="h-4 w-4" /></span>
                <p className="text-foreground text-sm font-semibold">{t("common.fields.phoneNumber")}</p>
              </div>
              <PhoneNumbersInput form={form} name="phoneNumbers" maxItems={3} />
            </div>
          </div>

          <div className="border-divider flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="ghost" onPress={onClose}>{t("common.cancel")}</Button>
            <Button type="submit" variant="primary" isPending={isPending} isDisabled={isPending}>
              {isEditing ? t("common.update") : t("common.create")}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Dialog>
  );
}
