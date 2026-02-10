import { FormPasswordInput } from "@/core/components/form/FormPasswordInput";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useChangePassword } from "../hooks/useAuthMutations";
import {
  createChangePasswordSchema,
  type ChangePasswordFormData,
} from "../schemas";
import type { ChangePasswordDto } from "../types/index";

export function ChangePasswordForm() {
  const { t } = useTranslation();
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(createChangePasswordSchema()),
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    const changePasswordData: ChangePasswordDto = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    };

    changePassword.mutate(changePasswordData, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">
          {t("auth.changePassword.title")}
        </h3>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormPasswordInput
            label={t("auth.changePassword.currentPassword")}
            {...register("currentPassword")}
            error={errors.currentPassword?.message}
            variant="bordered"
            placeholder={t("auth.changePassword.enterCurrentPassword")}
          />

          <FormPasswordInput
            label={t("auth.changePassword.newPassword")}
            {...register("newPassword")}
            error={errors.newPassword?.message}
            variant="bordered"
            placeholder={t("auth.changePassword.enterNewPassword")}
            description={t("auth.changePassword.passwordRequirements")}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              color="primary"
              startContent={<Lock className="w-4 h-4" />}
              isLoading={changePassword.isPending}
            >
              {t("auth.changePassword.changePassword")}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
