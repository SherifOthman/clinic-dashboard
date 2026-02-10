import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { FormInput } from "@/core/components/form/FormInput";
import { FormPasswordInput } from "@/core/components/form/FormPasswordInput";
import { setServerErrors } from "@/core/utils/setServerErrors";
import { useTranslation } from "react-i18next";
import { useResetPassword } from "../hooks";
import {
  createResetPasswordSchema,
  type ResetPasswordFormData,
} from "../schemas";
import { AuthFormContainer } from "./AuthFormContainer";
import { AuthSubmitButton } from "./AuthSubmitButton";

interface ResetPasswordFormProps {
  email: string;
  token: string;
}

export function ResetPasswordForm({ email, token }: ResetPasswordFormProps) {
  const { t } = useTranslation();
  const {
    mutateAsync: resetPasswordAsync,
    error,
    isError,
    isPending,
  } = useResetPassword();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(createResetPasswordSchema()),
    defaultValues: {
      email,
      token,
    },
  });

  useEffect(() => {
    setValue("email", email);
    setValue("token", token);
  }, [email, token, setValue]);

  useEffect(() => {
    if (isError && error) {
      setServerErrors(error, setError, t);
    }
  }, [isError, error, setError, t]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPasswordAsync(data);
    } catch (error) {
      console.error("Reset password error:", error);
    }
  };

  return (
    <AuthFormContainer onSubmit={handleSubmit(onSubmit)}>
      {/* Hidden fields for email and token */}
      <input type="hidden" {...register("email")} />
      <input type="hidden" {...register("token")} />

      {/* Email display (read-only) */}
      <FormInput
        value={email}
        isReadOnly
        label={t("auth.register.email")}
        type="email"
        variant="bordered"
      />

      {/* New Password */}
      <FormPasswordInput
        {...register("newPassword")}
        isRequired
        error={errors.newPassword}
        label={t("auth.resetPassword.password")}
      />

      <AuthSubmitButton isLoading={isPending}>
        {isPending
          ? t("auth.resetPassword.resetting")
          : t("auth.resetPassword.resetPassword")}
      </AuthSubmitButton>
    </AuthFormContainer>
  );
}
