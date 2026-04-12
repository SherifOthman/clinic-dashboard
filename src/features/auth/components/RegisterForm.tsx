import { useValidation } from "@/core/hooks/useValidation";
import { Button, Label, Radio, RadioGroup } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  FormInput,
  FormPasswordInput,
  FormPhoneInput,
} from "@/core/components/form/index";
import { AuthCard, RouterLink } from "@/core/components/ui";
import { useDebouncedValidation } from "@/core/hooks/useDebouncedValidation";
import { useRegister } from "../hooks";
import {
  useEmailValidation,
  useUsernameValidation,
} from "../hooks/useFieldValidation";
import { type Register, createAuthSchemas } from "../schemas";

export function RegisterForm() {
  const { t } = useTranslation();
  const schemas = useValidation(createAuthSchemas);
  const { mutateAsync: registerAsync, isPending } = useRegister();

  const {
    handleSubmit,
    setError,
    clearErrors,
    watch,
    register,
    control,
    formState: { errors },
  } = useForm<Register>({
    resolver: zodResolver(schemas.register),
  });

  useDebouncedValidation({
    fieldName: "email",
    fieldValue: watch("email"),
    validationHook: useEmailValidation,
    setError,
    clearErrors,
    errorMessage: t("validation.emailAlreadyExists"),
  });
  useDebouncedValidation({
    fieldName: "userName",
    fieldValue: watch("userName"),
    validationHook: useUsernameValidation,
    setError,
    clearErrors,
    errorMessage: t("validation.usernameAlreadyExists"),
  });

  return (
    <AuthCard
      title={t("auth.register.title")}
      subtitle={t("auth.register.subtitle")}
    >
      <form
        onSubmit={handleSubmit((data) => registerAsync(data))}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            {...register("firstName")}
            label={t("common.fields.firstName")}
            error={errors.firstName}
            isRequired
            noNumbers
          />
          <FormInput
            {...register("lastName")}
            label={t("common.fields.lastName")}
            error={errors.lastName}
            isRequired
            noNumbers
          />
        </div>

        <FormInput
          {...register("userName")}
          label={t("common.fields.username")}
          error={errors.userName}
          isRequired
        />
        <FormInput
          {...register("email")}
          type="email"
          label={t("common.fields.email")}
          error={errors.email}
          isRequired
        />

        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <FormPhoneInput
              {...field}
              label={t("common.fields.phoneNumber")}
              error={errors.phoneNumber}
              isRequired
            />
          )}
        />

        {/* Gender */}
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <RadioGroup
              orientation="horizontal"
              value={field.value ?? ""}
              onChange={field.onChange}
              isInvalid={!!errors.gender}
            >
              <Label isRequired>{t("common.fields.gender")}</Label>
              <Radio value="Male">
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                <Radio.Content>
                  <Label>{t("common.fields.male")}</Label>
                </Radio.Content>
              </Radio>
              <Radio value="Female">
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                <Radio.Content>
                  <Label>{t("common.fields.female")}</Label>
                </Radio.Content>
              </Radio>
            </RadioGroup>
          )}
        />

        <FormPasswordInput
          {...register("password")}
          label={t("common.fields.password")}
          error={errors.password}
          isRequired
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isPending={isPending}
          isDisabled={isPending}
        >
          {t("auth.register.title")}
        </Button>

        <div className="text-center text-sm">
          <p className="text-default-500">
            {t("auth.register.haveAccount")}{" "}
            <RouterLink to="/login">{t("auth.register.signIn")}</RouterLink>
          </p>
        </div>
      </form>
    </AuthCard>
  );
}
