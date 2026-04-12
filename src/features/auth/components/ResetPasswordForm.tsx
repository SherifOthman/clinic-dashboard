import { useValidation } from "@/core/hooks/useValidation";
import { Button } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormInput, FormPasswordInput } from "@/core/components/form/index";
import { AuthCard } from "@/core/components/ui/AuthCard";
import { useResetPassword } from "../hooks";
import { type ResetPassword, createAuthSchemas } from "../schemas";

interface ResetPasswordFormProps {
  email: string;
  token: string;
}

export function ResetPasswordForm({ email, token }: ResetPasswordFormProps) {
  const { t } = useTranslation();
  const schemas = useValidation(createAuthSchemas);
  const { mutateAsync: resetPasswordAsync, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPassword>({
    resolver: zodResolver(schemas.resetPassword),
    defaultValues: { email, token, newPassword: "" },
  });

  return (
    <AuthCard
      title={t("auth.resetPassword.title")}
      subtitle={t("auth.resetPassword.subtitle")}
    >
      <form
        onSubmit={handleSubmit((data) => resetPasswordAsync(data))}
        className="flex flex-col gap-4"
      >
        <FormInput
          {...register("email")}
          type="email"
          label={t("common.fields.email")}
          readOnly
        />

        <FormPasswordInput
          {...register("newPassword")}
          label={t("auth.changePassword.newPassword")}
          error={errors.newPassword}
          isRequired
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isPending={isPending}
          isDisabled={isPending}
        >
          {isPending
            ? t("auth.resetPassword.resetting")
            : t("auth.resetPassword.resetPassword")}
        </Button>
      </form>
    </AuthCard>
  );
}
