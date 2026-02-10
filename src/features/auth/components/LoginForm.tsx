import { Button } from "@heroui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormInput } from "@/core/components/form/FormInput";
import { FormPasswordInput } from "@/core/components/form/FormPasswordInput";
import { setServerErrors } from "@/core/utils/setServerErrors";
import { useLogin } from "../hooks";
import { createLoginSchema, type LoginFormData } from "../schemas";
import { AuthFormContainer } from "./AuthFormContainer";
import { AuthSubmitButton } from "./AuthSubmitButton";

// Admin credentials for demo
const ADMIN_DEMO = {
  email: "superadmin@clinic.com",
  password: "SuperAdmin123!",
};

export function LoginForm() {
  const { t } = useTranslation();
  const { mutateAsync: loginAsync, error, isError, isPending } = useLogin();

  const {
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema()),
  });

  useEffect(() => {
    if (isError && error) {
      setServerErrors(error, setError, t);
    }
  }, [isError, error, setError, t]);

  const onSubmit = async (data: LoginFormData) => {
    await loginAsync(data);
  };

  const fillAdminCredentials = () => {
    reset({
      email: ADMIN_DEMO.email,
      password: ADMIN_DEMO.password,
    });
  };

  return (
    <AuthFormContainer onSubmit={handleSubmit(onSubmit)}>
      {/* Admin Demo Button */}
      <div className="mb-6 p-4 bg-default-50 rounded-lg border border-default-200">
        <p className="text-sm font-medium text-default-700 mb-3 text-center">
          Demo Admin Account
        </p>
        <div className="flex justify-center">
          <Button
            size="sm"
            variant="flat"
            color="primary"
            onPress={fillAdminCredentials}
            className="text-xs"
            startContent={<Shield size={14} />}
          >
            Fill Admin Credentials
          </Button>
        </div>
      </div>

      {/* Email/Username Input */}
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <FormInput
            {...field}
            isRequired
            error={errors.email}
            label={t("auth.login.email")}
            type="text"
          />
        )}
      />

      {/* Password Input */}
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <FormPasswordInput
            {...field}
            isRequired
            error={errors.password}
            label={t("auth.login.password")}
          />
        )}
      />

      {/* Login Button */}
      <div className="flex justify-center">
        <AuthSubmitButton isLoading={isPending}>
          {t("auth.login.title")}
        </AuthSubmitButton>
      </div>
    </AuthFormContainer>
  );
}
