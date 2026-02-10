import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Phone, Plus, X } from "lucide-react";
import {
  useFieldArray,
  type Control,
  type FieldValues,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { PhoneNumberInput } from "./PhoneNumberInput";

interface PhoneNumbersInputProps<T extends FieldValues> {
  control: Control<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  name: string;
  label?: string;
  showLabels?: boolean;
  maxItems?: number;
  errors?: any;
}

export function PhoneNumbersInput<T extends FieldValues>({
  control,
  watch,
  setValue,
  name,
  label,
  showLabels = false,
  maxItems = 5,
  errors,
}: PhoneNumbersInputProps<T>) {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  });
  const phoneNumbers = watch(name as any) || [];

  const addPhone = () => {
    if (fields.length < maxItems) {
      const newPhone = showLabels
        ? { phoneNumber: "", label: "" }
        : { phoneNumber: "" };
      append(newPhone as any);
    }
  };

  const removePhone = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Phone className="w-5 h-5 text-primary" />
          <h4 className="text-md font-medium text-foreground">
            {label || t("auth.register.phoneNumber")}
          </h4>
        </div>

        {fields.length < maxItems && (
          <Button
            type="button"
            size="sm"
            variant="flat"
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            onPress={addPhone}
          >
            {t("phoneNumbers.addPhone")}
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-3">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <PhoneNumberInput
                  value={(phoneNumbers as any)[index]?.phoneNumber || ""}
                  onChange={(value) =>
                    setValue(
                      `${name}.${index}.phoneNumber` as any,
                      value as any,
                      { shouldValidate: true },
                    )
                  }
                  label={
                    index === 0
                      ? t("phoneNumbers.primaryPhone")
                      : `${t("auth.register.phoneNumber")} ${index + 1}`
                  }
                  placeholder={t("phoneNumbers.enterPhoneNumber")}
                  isInvalid={!!errors?.[index]?.phoneNumber}
                  errorMessage={errors?.[index]?.phoneNumber?.message}
                  isRequired={index === 0}
                />
              </div>

              {fields.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="flat"
                  color="danger"
                  isIconOnly
                  onPress={() => removePhone(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {showLabels && (
              <Input
                value={(phoneNumbers as any)[index]?.label || ""}
                onChange={(e) =>
                  setValue(
                    `${name}.${index}.label` as any,
                    e.target.value as any,
                  )
                }
                label={t("phoneNumbers.phoneLabel")}
                placeholder={t("phoneNumbers.phoneLabelPlaceholder")}
                variant="bordered"
                isInvalid={!!errors?.[index]?.label}
                errorMessage={errors?.[index]?.label?.message}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
