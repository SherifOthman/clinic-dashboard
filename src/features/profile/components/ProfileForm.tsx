import { useValidation } from "@/core/hooks/useValidation";
import {
  Button,
  Card,
  Input,
  Label,
  Radio,
  RadioGroup,
  TextField,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormInputField } from "@/core/components/form/FormInputField";
import { FormPhoneInput } from "@/core/components/form/index";
import { useUpdateProfile } from "@/features/auth/hooks";
import { type UpdateProfile, createAuthSchemas } from "@/features/auth/schemas";
import { User } from "@/features/auth/types";

export function ProfileForm({ user }: { user: User }) {
  const { t } = useTranslation();
  const schemas = useValidation(createAuthSchemas);
  const updateProfile = useUpdateProfile();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<UpdateProfile>({
    resolver: zodResolver(schemas.updateProfile),
    values: {
      fullName: user.fullName,
      userName: user.userName,
      phoneNumber: user.phoneNumber || "",
      gender: (user.gender as "Male" | "Female") ?? "Male",
    },
  });

  const gender = watch("gender");

  return (
    <Card>
      <Card.Header>
        <Card.Title>{t("profile.personalInfo")}</Card.Title>
      </Card.Header>
      <Card.Content>
        <form
          onSubmit={handleSubmit((data: UpdateProfile) =>
            updateProfile.mutate(data),
          )}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 gap-4">
            <FormInputField
              name="fullName"
              control={control}
              label={t("common.fields.fullName")}
            />
          </div>

          <FormInputField
            name="userName"
            control={control}
            label={t("common.fields.username")}
          />

          {/* Email � read-only */}
          <TextField isReadOnly>
            <Label className="text-default-400">
              {t("common.fields.email")}
            </Label>
            <Input
              value={user.email}
              type="email"
              readOnly
              className="cursor-not-allowed opacity-50"
            />
          </TextField>

          {/* Gender */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">
              {t("common.fields.gender")}
            </Label>
            <RadioGroup
              value={gender}
              onChange={(val) =>
                setValue("gender", val as "Male" | "Female", {
                  shouldDirty: true,
                })
              }
              orientation="horizontal"
              aria-label={t("common.fields.gender")}
            >
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
          </div>

          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <FormPhoneInput
                {...field}
                label={t("phoneInput.phoneNumber")}
                error={errors.phoneNumber}
                isRequired
              />
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isDisabled={updateProfile.isPending || !isDirty}
              isPending={updateProfile.isPending}
            >
              <Save className="h-4 w-4" />
              {updateProfile.isPending ? "Loading..." : t("forms.saveChanges")}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
}
