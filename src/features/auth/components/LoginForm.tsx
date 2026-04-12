import { useValidation } from "@/core/hooks/useValidation";
import { Button } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Lock, Shield } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { createAuthSchemas, type Login } from "../schemas";

import { FormInputField } from "@/core/components/form/FormInputField";
import { FormPasswordInputField } from "@/core/components/form/FormPasswordInputField";

import { AuthCard, RouterLink } from "@/core/components/ui";
import { useLogin } from "../hooks";

const ADMIN_DEMO = {
  email: "superadmin@clinic.com",
  password: "SuperAdmin123!",
};
const OWNER_DEMO = { email: "owner@clinic.com", password: "ClinicOwner123!" };
const DOCTOR_DEMO = { email: "doctor@clinic.com", password: "Doctor123!" };
const RECEPTIONIST_DEMO = {
  email: "receptionist@clinic.com",
  password: "Receptionist123!",
};

export function LoginForm() {
  const { t } = useTranslation();
  const schemas = useValidation(createAuthSchemas);
  const { mutateAsync: loginAsync, isPending } = useLogin();
  const [lockoutMessage, setLockoutMessage] = useState<string | null>(null);
  const [inactiveMessage, setInactiveMessage] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<Login>({
    resolver: zodResolver(schemas.login),
    defaultValues: { emailOrUsername: "", password: "" },
  });

  const onSubmit = async (data: Login) => {
    setLockoutMessage(null);
    setInactiveMessage(null);
    try {
      await loginAsync(data);
    } catch (err) {
      const axiosErr = err as AxiosError<{ code?: string; detail?: string }>;
      const code = axiosErr.response?.data?.code;
      const detail = axiosErr.response?.data?.detail;
      if (code === "ACCOUNT_LOCKED" && detail) {
        setLockoutMessage(detail);
      } else if (code === "STAFF_INACTIVE") {
        setInactiveMessage(t("auth.login.accountInactive"));
      }
    }
  };

  return (
    <AuthCard title={t("auth.login.title")} subtitle={t("auth.login.subtitle")}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="border-divider bg-default-50 rounded-lg border p-4">
          <p className="mb-3 text-center text-sm font-medium">Demo Accounts</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onPress={() =>
                reset({
                  emailOrUsername: ADMIN_DEMO.email,
                  password: ADMIN_DEMO.password,
                })
              }
            >
              <Shield className="h-4 w-4" /> SuperAdmin
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onPress={() =>
                reset({
                  emailOrUsername: OWNER_DEMO.email,
                  password: OWNER_DEMO.password,
                })
              }
            >
              <Shield className="h-4 w-4" /> Owner
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onPress={() =>
                reset({
                  emailOrUsername: DOCTOR_DEMO.email,
                  password: DOCTOR_DEMO.password,
                })
              }
            >
              <Shield className="h-4 w-4" /> Doctor
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onPress={() =>
                reset({
                  emailOrUsername: RECEPTIONIST_DEMO.email,
                  password: RECEPTIONIST_DEMO.password,
                })
              }
            >
              <Shield className="h-4 w-4" /> Receptionist
            </Button>
          </div>
        </div>

        {/* Lockout banner */}
        {lockoutMessage && (
          <div className="border-warning-soft-hover bg-warning/5 flex items-start gap-3 rounded-lg border p-3">
            <Lock className="text-warning mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-warning text-sm">{lockoutMessage}</p>
          </div>
        )}

        {/* Inactive staff banner */}
        {inactiveMessage && (
          <div className="border-danger/20 bg-danger/5 flex items-start gap-3 rounded-lg border p-3">
            <Lock className="text-danger mt-0.5 h-4 w-4 shrink-0" />
            <p className="text-danger text-sm">{inactiveMessage}</p>
          </div>
        )}

        <FormInputField
          name="emailOrUsername"
          control={control}
          label={t("auth.login.emailOrUsername")}
          isRequired
        />

        <FormPasswordInputField
          name="password"
          control={control}
          label={t("common.fields.password")}
          isRequired
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isPending={isPending}
          isDisabled={isPending || !!lockoutMessage || !!inactiveMessage}
        >
          {isPending ? t("auth.login.signingIn") : t("auth.login.signIn")}
        </Button>

        <div className="flex flex-col gap-3 text-center text-sm">
          <RouterLink className="mx-auto" to="/forgot-password">
            {t("auth.login.forgotPassword")}
          </RouterLink>
          <p className="text-default-500">
            {t("auth.login.noAccount")}{" "}
            <RouterLink to="/register">{t("auth.login.signUp")}</RouterLink>
          </p>
        </div>
      </form>
    </AuthCard>
  );
}
