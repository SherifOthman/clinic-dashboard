import { useValidation } from "@/core/hooks/useValidation";
import { Button, Card } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormPasswordInput } from "@/core/components/form/index";
import { useChangePassword } from "@/features/auth/hooks";
import {
  type ChangePassword,
  createAuthSchemas,
} from "@/features/auth/schemas";

export function ChangePasswordForm() {
  const { t } = useTranslation();
  const schemas = useValidation(createAuthSchemas);
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePassword>({
    resolver: zodResolver(schemas.changePassword),
  });

  const onSubmit = (data: ChangePassword) => {
    changePassword.mutate(data, { onSuccess: () => reset() });
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>{t("auth.changePassword.title")}</Card.Title>
      </Card.Header>
      <Card.Content>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormPasswordInput
            {...register("currentPassword")}
            label={t("auth.changePassword.currentPassword")}
            placeholder={t("auth.changePassword.enterCurrentPassword")}
            error={errors.currentPassword}
          />

          <FormPasswordInput
            {...register("newPassword")}
            label={t("auth.changePassword.newPassword")}
            placeholder={t("auth.changePassword.enterNewPassword")}
            error={errors.newPassword}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isDisabled={changePassword.isPending}
              isPending={changePassword.isPending}
            >
              <Lock className="h-4 w-4" />
              {t("auth.changePassword.changePassword")}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
}
