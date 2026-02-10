import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormInput } from "@/core/components/form/FormInput";
import { FormPasswordInput } from "@/core/components/form/FormPasswordInput";
import { FormPhoneInput } from "@/core/components/FormPhoneInput";
import { NameFields } from "@/core/components/NameFields";
import { setServerErrors } from "@/core/utils/setServerErrors";
import { useEffect } from "react";
import { useRegister } from "../hooks";
import { createRegisterSchema, type RegisterFormData } from "../schemas";
import { AuthFormContainer } from "./AuthFormContainer";
import { AuthSubmitButton } from "./AuthSubmitButton";

export function RegisterForm() {
  const { t } = useTranslation();
  const {
    mutateAsync: registerAsync,
    isPending,
    isError,
    error,
  } = useRegister();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(createRegisterSchema()),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (isError && error) {
      setServerErrors(error, setError, t);
    }
  }, [isError, error, setError, t]);

  const onSubmit = async (data: RegisterFormData) => {
    await registerAsync(data);
  };

  return (
    <AuthFormContainer onSubmit={handleSubmit(onSubmit)}>
      {/* Name Input */}
      <NameFields register={register} errors={errors} isUserForm={true} />

      {/* UserName Input */}
      <FormInput
        {...register("userName")}
        isRequired
        error={errors.userName}
        label={t("auth.register.username")}
      />

      {/* Email Input */}
      <FormInput
        {...register("email")}
        isRequired
        error={errors.email}
        label={t("auth.register.email")}
        type="email"
      />

      {/* Password Input */}
      <FormPasswordInput
        {...register("password")}
        isRequired
        error={errors.password}
        label={t("auth.register.password")}
      />

      {/* PhoneNumber Input */}
      <FormPhoneInput
        name="phoneNumber"
        control={control}
        label={t("auth.register.phoneNumber")}
        isRequired
      />

      {/* Register Button */}
      <AuthSubmitButton isLoading={isPending || isSubmitting}>
        {isPending || isSubmitting
          ? t("common.loading")
          : t("auth.register.title")}
      </AuthSubmitButton>
    </AuthFormContainer>
  );
}
