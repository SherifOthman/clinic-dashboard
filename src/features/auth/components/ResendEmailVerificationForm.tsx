import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { FormInput } from "@/core/components/form/FormInput";
import { setServerErrors } from "@/core/utils/setServerErrors";
import { useTranslation } from "react-i18next";
import { useResendEmailVerification } from "../hooks";
import {
  createResendEmailVerificationSchema,
  type ResendEmailVerificationFormData,
} from "../schemas";
import { AuthFormContainer } from "./AuthFormContainer";
import { AuthSubmitButton } from "./AuthSubmitButton";

interface ResendEmailVerificationFormProps {
  defaultEmail?: string;
  onSuccess?: (message: string) => void;
}

export function ResendEmailVerificationForm({
  defaultEmail = "",
  onSuccess,
}: ResendEmailVerificationFormProps) {
  const { t } = useTranslation();
  const {
    mutateAsync: resendEmailAsync,
    error,
    isError,
    isPending,
    isSuccess,
  } = useResendEmailVerification();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResendEmailVerificationFormData>({
    resolver: zodResolver(createResendEmailVerificationSchema()),
    defaultValues: {
      email: defaultEmail,
    },
  });

  useEffect(() => {
    if (isError && error) {
      setServerErrors(error, setError, t);
    }
  }, [isError, error, setError]);

  useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess("Verification email has been sent. Please check your inbox.");
    }
  }, [isSuccess, onSuccess]);

  const onSubmit = async (data: ResendEmailVerificationFormData) => {
    await resendEmailAsync(data);
  };

  return (
    <AuthFormContainer onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        {...register("email")}
        isRequired
        error={errors.email}
        label={t("auth.register.email")}
        type="email"
      />

      <AuthSubmitButton isLoading={isPending}>
        {isPending
          ? t("auth.emailVerification.sending")
          : t("auth.emailVerification.sendVerificationEmail")}
      </AuthSubmitButton>
    </AuthFormContainer>
  );
}
