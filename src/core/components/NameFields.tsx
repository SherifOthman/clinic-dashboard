import { Input } from "@heroui/input";
import {
  type FieldErrors,
  type FieldValues,
  type UseFormRegister,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

interface NameFieldsProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  isUserForm?: boolean;
  className?: string;
}

export function NameFields<T extends FieldValues>({
  register,
  errors,
  isUserForm = false,
  className = "",
}: NameFieldsProps<T>) {
  const { t } = useTranslation();

  if (isUserForm) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
        <Input
          {...register("firstName" as any)}
          label={t("auth.register.firstName")}
          variant="bordered"
          isInvalid={!!(errors as any).firstName}
          errorMessage={(errors as any).firstName?.message}
          isRequired
        />

        <Input
          {...register("lastName" as any)}
          label={t("auth.register.lastName")}
          variant="bordered"
          isInvalid={!!(errors as any).lastName}
          errorMessage={(errors as any).lastName?.message}
          isRequired
        />
      </div>
    );
  }

  return (
    <Input
      {...register("fullName" as any)}
      label={t("patients.fullName")}
      variant="bordered"
      isInvalid={!!(errors as any).fullName}
      errorMessage={(errors as any).fullName?.message}
      isRequired
      className={className}
    />
  );
}
