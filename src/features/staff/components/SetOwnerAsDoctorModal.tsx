import { FormSelect } from "@/core/components/form/FormSelect";
import { useValidation } from "@/core/hooks/useValidation";
import { getLocalizedValue } from "@/core/utils/i18nUtils";
import { useSpecializations } from "@/features/onboarding/onboardingHooks";
import { Button, Modal } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { type SetOwnerAsDoctorForm, createStaffSchemas } from "../schemas";
import { useSetOwnerAsDoctor } from "../staffHooks";

interface SetOwnerAsDoctorModalProps {
  trigger: React.ReactElement<{ onPress?: () => void }>;
}

export function SetOwnerAsDoctorModal({ trigger }: SetOwnerAsDoctorModalProps) {
  const { t, i18n } = useTranslation();
  const schemas = useValidation(createStaffSchemas);
  const setOwnerAsDoctor = useSetOwnerAsDoctor();
  const { data: specializations = [] } = useSpecializations();
  const isRTL = i18n.language === "ar";

  const [isOpen, setIsOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm<SetOwnerAsDoctorForm>({
    resolver: zodResolver(schemas.setOwnerAsDoctor),
    defaultValues: { specializationId: "" },
  });

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  const onSubmit = (data: SetOwnerAsDoctorForm) => {
    setOwnerAsDoctor.mutate(
      { specializationId: data.specializationId || undefined },
      { onSuccess: handleClose },
    );
  };

  const specializationOptions = specializations.map((s) => ({
    value: s.id,
    label: getLocalizedValue(isRTL, s.nameAr, s.nameEn) ?? s.nameEn,
  }));

  return (
    <>
      {React.cloneElement(trigger, { onPress: () => setIsOpen(true) })}

      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={(open) => !open && handleClose()}
      >
        <Modal.Container size="sm">
          <Modal.Dialog dir={isRTL ? "rtl" : "ltr"}>
            <Modal.CloseTrigger />
            <Modal.Header className="mt-5">
              <Modal.Heading>{t("staff.ownerDoctor.modalTitle")}</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <form
                id="set-owner-doctor-form"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormSelect
                  name="specializationId"
                  control={control}
                  label={t("staff.invite.specialization")}
                  options={specializationOptions}
                  placeholder={t("staff.invite.selectSpecialization")}
                  isRTL={isRTL}
                />
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="tertiary" onPress={handleClose}>
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                form="set-owner-doctor-form"
                variant="primary"
                isPending={setOwnerAsDoctor.isPending}
                isDisabled={setOwnerAsDoctor.isPending}
              >
                {t("staff.ownerDoctor.confirm")}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
