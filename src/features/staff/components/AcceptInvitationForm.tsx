import { FormInputField } from "@/core/components/form/FormInputField";
import { FormPasswordInput } from "@/core/components/form/FormPasswordInput";
import { FormPhoneInput } from "@/core/components/form/FormPhoneInput";
import { AuthCard } from "@/core/components/ui/AuthCard";
import { useValidation } from "@/core/hooks/useValidation";
import { Button, Label, Radio, RadioGroup } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  type AcceptInvitationForm as AcceptInvitationFormType,
  createStaffSchemas,
} from "../schemas";
import { useAcceptInvitationWithRegistration } from "../staffHooks";

interface AcceptInvitationFormProps {
  token: string;
}

export function AcceptInvitationForm({ token }: AcceptInvitationFormProps) {
  const { t } = useTranslation();
  const schemas = useValidation(createStaffSchemas);
  const acceptInvitation = useAcceptInvitationWithRegistration();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInvitationFormType>({
    resolver: zodResolver(schemas.acceptInvitation),
    defaultValues: {
      fullName: "",
      userName: "",
      password: "",
      phoneNumber: "",
      gender: "Male",
    },
  });

  const onSubmit = (data: AcceptInvitationFormType) => {
    acceptInvitation.mutate({ token, data });
  };

  return (
    <AuthCard
      title={t("staff.acceptInvitation.title")}
      subtitle={t("staff.acceptInvitation.subtitle")}
      className="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormInputField
          name="fullName"
          control={control}
          label={t("common.fields.fullName")}
          isRequired
          noNumbers
        />

        <FormInputField
          name="userName"
          control={control}
          label={t("staff.acceptInvitation.username")}
          isRequired
        />

        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <FormPhoneInput
              {...field}
              label={t("staff.acceptInvitation.phoneNumber")}
              error={errors.phoneNumber}
              isRequired
            />
          )}
        />

        {/* Gender */}
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">
                {t("common.fields.gender")} *
              </Label>
              <RadioGroup
                value={field.value}
                onChange={field.onChange}
                orientation="horizontal"
                isInvalid={!!errors.gender}
                aria-label={t("common.fields.gender")}
              >
                <Radio value="Male">
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  <Radio.Content>
                    <Label>{t("common.fields.male")}</Label>
                  </Radio.Content>
                </Radio>
                <Radio value="Female">
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  <Radio.Content>
                    <Label>{t("common.fields.female")}</Label>
                  </Radio.Content>
                </Radio>
              </RadioGroup>
            </div>
          )}
        />

        <FormPasswordInput
          {...register("password")}
          label={t("staff.acceptInvitation.password")}
          error={errors.password}
          isRequired
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isPending={acceptInvitation.isPending}
          isDisabled={acceptInvitation.isPending}
        >
          {acceptInvitation.isPending
            ? t("staff.acceptInvitation.submitting")
            : t("staff.acceptInvitation.submit")}
        </Button>
      </form>
    </AuthCard>
  );
}
