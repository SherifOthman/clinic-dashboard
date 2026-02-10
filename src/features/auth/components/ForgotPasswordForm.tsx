import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormInput } from "@/core/components/form/FormInput";
import { setServerErrors } from "@/core/utils/setServerErrors";
import { useForgotPassword } from "../hooks";
import {
  createForgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../schemas";
import { AuthFormContainer } from "./AuthFormContainer";
import { AuthSubmitButton } from "./AuthSubmitButton";

export function ForgotPasswordForm() {
  const { t } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    mutateAsync: forgotPasswordAsync,
    error,
    isError,
    isPending,
  } = useForgotPassword();

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(createForgotPasswordSchema()),
  });

  useEffect(() => {
    if (isError && error) {
      setServerErrors(error, setError, t);
    }
  }, [isError, error, setError, t]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordAsync(data);
      setIsSuccess(true);
    } catch {
      // Error is handled by the hook and setServerErrors
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-success">
          {t("auth.forgotPassword.success.title")}
        </h3>
        <p
          className="text-default-600"
          dangerouslySetInnerHTML={{
            __html: t("auth.forgotPassword.success.message", {
              email: getValues("email"),
            }),
          }}
        />
        <p className="text-sm text-default-500">
          {t("auth.forgotPassword.success.instruction")}
        </p>
      </div>
    );
  }

  return (
    <AuthFormContainer onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        {...register("email")}
        isRequired
        error={errors.email}
        label={t("auth.forgotPassword.email")}
        type="email"
      />

      <AuthSubmitButton isLoading={isPending}>
        {isPending ? t("common.loading") : t("auth.forgotPassword.sendReset")}
      </AuthSubmitButton>
    </AuthFormContainer>
  );
}
