import { PhoneNumberInput } from "@/core/components/PhoneNumberInput";
import { FormInput } from "@/core/components/form/FormInput";
import { createOptionalPhoneNumberSchema } from "@/core/utils/phoneValidation";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import i18next from "i18next";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useUpdateProfile } from "../hooks";
import type { User } from "../types/index";

const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "validation.required" })
    .max(50, { message: "validation.maxLength" }),
  lastName: z
    .string()
    .min(1, { message: "validation.required" })
    .max(50, { message: "validation.maxLength" }),
  phoneNumber: createOptionalPhoneNumberSchema(i18next.t.bind(i18next)),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { t } = useTranslation();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber || "",
    },
  });

  const phoneNumber = watch("phoneNumber");

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber || undefined,
      },
      {
        onSuccess: () => {
          // Reset form dirty state after successful update
          // This will disable the save button until user makes new changes
        },
      },
    );
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <h3 className="text-lg font-semibold">{t("profile.personalInfo")}</h3>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label={t("auth.register.firstName")}
              {...register("firstName")}
              error={errors.firstName?.message}
              variant="bordered"
            />
            <FormInput
              label={t("auth.register.lastName")}
              {...register("lastName")}
              error={errors.lastName?.message}
              variant="bordered"
            />
          </div>

          <Input
            label={t("auth.register.email")}
            value={user.email}
            variant="bordered"
            type="email"
            isReadOnly
            description={t("forms.emailCannotBeChanged")}
          />

          <PhoneNumberInput
            value={phoneNumber || ""}
            onChange={(value) =>
              setValue("phoneNumber", value, { shouldValidate: true })
            }
            label={t("auth.register.phoneNumber")}
            placeholder={t("profile.enterPhoneNumber")}
            isInvalid={!!errors.phoneNumber}
            errorMessage={errors.phoneNumber?.message}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              color="primary"
              startContent={<Save className="w-4 h-4" />}
              isLoading={updateProfile.isPending}
              isDisabled={!isDirty}
            >
              {t("forms.saveChanges")}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
