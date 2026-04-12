import { useValidation } from "@/core/hooks/useValidation";
import { Button } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormInput } from "@/core/components/form/index";
import { useResendEmailVerification } from "../hooks";
import { type ResendEmailVerification, createAuthSchemas } from "../schemas";

interface ResendEmailVerificationFormProps {
  defaultEmail?: string;
  onSuccess?: (message: string) => void;
}

export function ResendEmailVerificationForm({
  defaultEmail = "",
  onSuccess,
}: ResendEmailVerificationFormProps) {
  const { t } = useTranslation();
  const schemas = useValidation(createAuthSchemas);
  const {
    mutateAsync: resendEmailAsync,
    isPending,
    isSuccess,
  } = useResendEmailVerification();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendEmailVerification>({
    resolver: zodResolver(schemas.resendEmailVerification),
    defaultValues: { email: defaultEmail },
  });

  useEffect(() => {
    if (isSuccess && onSuccess)
      onSuccess("Verification email has been sent. Please check your inbox.");
  }, [isSuccess, onSuccess]);

  return (
    <form
      onSubmit={handleSubmit((data) => resendEmailAsync(data))}
      className="flex flex-col gap-4"
    >
      <FormInput
        {...register("email")}
        type="email"
        label={t("common.fields.email")}
        error={errors.email}
        placeholder="you@example.com"
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
          ? t("auth.emailVerification.sending")
          : t("auth.emailVerification.sendVerificationEmail")}
      </Button>
    </form>
  );
}
