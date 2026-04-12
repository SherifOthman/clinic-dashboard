import { FormInput } from "@/core/components/form/FormInput";
import { FormSelect } from "@/core/components/form/FormSelect";
import { useValidation } from "@/core/hooks/useValidation";
import { getLocalizedValue } from "@/core/utils/i18nUtils";
import { useSpecializations } from "@/features/onboarding/onboardingHooks";
import { Button, Modal } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TFunction } from "i18next";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { type InviteStaffForm, createStaffSchemas } from "../schemas";
import { useInviteStaff } from "../staffHooks";

interface InviteStaffModalProps {
  trigger: React.ReactElement<{ onPress?: () => void }>;
}

const ROLE_OPTIONS = (t: TFunction) => [
  { value: "Doctor", label: t("staff.roles.Doctor") },
  { value: "Receptionist", label: t("staff.roles.Receptionist") },
];

export function InviteStaffModal({ trigger }: InviteStaffModalProps) {
  const { t, i18n } = useTranslation();
  const schemas = useValidation(createStaffSchemas);
  const inviteStaff = useInviteStaff();
  const { data: specializations = [] } = useSpecializations();
  const isRTL = i18n.language === "ar";

  const [isOpen, setIsOpen] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteStaffForm>({
    resolver: zodResolver(schemas.inviteStaff),
  });

  const selectedRole = useWatch({ control, name: "role" });

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  const onSubmit = (data: InviteStaffForm) => {
    inviteStaff.mutate(data, { onSuccess: handleClose });
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
            <Modal.Header>
              <Modal.Heading>{t("staff.invite.title")}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="p-1">
              <form
                id="invite-staff-form"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormSelect
                  name="role"
                  control={control}
                  label={t("staff.invite.role")}
                  options={ROLE_OPTIONS(t)}
                  isRequired
                  placeholder={t("staff.invite.selectRole")}
                  isRTL={isRTL}
                />

                <FormInput
                  {...register("email")}
                  type="email"
                  label={t("staff.invite.email")}
                  error={errors.email}
                  isRequired
                />

                {selectedRole === "Doctor" && (
                  <FormSelect
                    name="specializationId"
                    control={control}
                    label={t("staff.invite.specialization")}
                    options={specializationOptions}
                    placeholder={t("staff.invite.selectSpecialization")}
                    isRTL={isRTL}
                  />
                )}
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="tertiary" onPress={handleClose}>
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                form="invite-staff-form"
                variant="primary"
                isPending={inviteStaff.isPending}
                isDisabled={inviteStaff.isPending}
              >
                {inviteStaff.isPending
                  ? t("staff.invite.sending")
                  : t("staff.invite.send")}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
