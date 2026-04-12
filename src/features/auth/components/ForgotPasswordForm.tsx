import { Button, Card } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormInput } from "@/core/components/form/index";
import { AuthCard, RouterLink } from "@/core/components/ui";
import { useValidation } from "@/core/hooks/useValidation";
import { useForgotPassword } from "../hooks";
import { type ForgotPassword, createAuthSchemas } from "../schemas";

export function ForgotPasswordForm() {
  const { t } = useTranslation();
  const schemas = useValidation(createAuthSchemas);
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutateAsync: forgotPasswordAsync, isPending } = useForgotPassword();

  const {
    handleSubmit,
    getValues,
    register,
    formState: { errors },
  } = useForm<ForgotPassword>({
    resolver: zodResolver(schemas.forgotPassword),
    defaultValues: { email: "" },
  });

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <Card.Content className="flex flex-col gap-4 py-8 text-center">
          <div className="bg-success-50 mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full">
            <Check className="text-success h-8 w-8" />
          </div>
          <h2 className="text-success text-xl font-semibold">
            {t("auth.forgotPassword.success.title")}
          </h2>
          <p
            className="text-default-600"
            dangerouslySetInnerHTML={{
              __html: t("auth.forgotPassword.success.message", {
                email: getValues("email"),
              }),
            }}
          />
          <p className="text-default-500 text-sm">
            {t("auth.forgotPassword.success.instruction")}
          </p>
          <RouterLink to="/login" className="mt-4 text-sm">
            {t("auth.forgotPassword.backToLogin")}
          </RouterLink>
        </Card.Content>
      </Card>
    );
  }

  return (
    <AuthCard
      title={t("auth.forgotPassword.title")}
      subtitle={t("auth.forgotPassword.subtitle")}
    >
      <form
        onSubmit={handleSubmit(async (data) => {
          await forgotPasswordAsync(data);
          setIsSuccess(true);
        })}
        className="flex flex-col gap-4"
      >
        <FormInput
          {...register("email")}
          type="email"
          label={t("common.fields.email")}
          error={errors.email}
          isRequired
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isPending={isPending}
          isDisabled={isPending}
        >
          {isPending ? t("common.loading") : t("auth.forgotPassword.sendReset")}
        </Button>

        <div className="text-center text-sm">
          <RouterLink to="/login">
            {t("auth.forgotPassword.backToLogin")}
          </RouterLink>
        </div>
      </form>
    </AuthCard>
  );
}
