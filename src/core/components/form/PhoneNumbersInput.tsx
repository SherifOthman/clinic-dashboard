import { Button } from "@heroui/react";
import { Phone, Plus, X } from "lucide-react";
import {
  useFieldArray,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormPhoneInput } from "./FormPhoneInput";

interface PhoneNumbersInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: string;
  label?: string;
  maxItems?: number;
}

/**
 * Dynamic list of phone number inputs backed by react-hook-form useFieldArray.
 *
 * Each entry is a plain E.164 string (e.g. "+201098021259") — not a wrapper object.
 * useFieldArray requires objects, so the array items are treated as `any` internally.
 *
 * Validation only runs after the first submit attempt (submitCount > 0) to avoid
 * showing errors on a fresh form before the user has interacted.
 */
export function PhoneNumbersInput<T extends FieldValues>({
  form,
  name,
  label,
  maxItems = 5,
}: PhoneNumbersInputProps<T>) {
  const { t } = useTranslation();
  const {
    control,
    watch,
    setValue,
    formState: { errors, submitCount },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  });

  const phoneNumbers: string[] = watch(name as any) || [];
  const fieldErrors = errors[name as any] as any;

  // Start with one empty input so the user doesn't have to click "Add Phone",
  // but it's not required — they can leave it blank or remove it.
  if (fields.length === 0) {
    append("" as any);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Phone className="text-accent h-5 w-5" />
          <span className="font-medium">
            {label || t("common.fields.phoneNumber")}
          </span>
        </div>
        {fields.length < maxItems && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onPress={() => append("" as any)}
          >
            <Plus className="h-4 w-4" />
            {t("phoneNumbers.addPhone")}
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-2">
            <div className="flex-1">
              <FormPhoneInput
                label={
                  index === 0
                    ? t("common.fields.phoneNumber")
                    : `${t("common.fields.phoneNumber")} ${index + 1}`
                }
                isRequired={false}
                value={phoneNumbers[index] || ""}
                onChange={(val) =>
                  setValue(`${name}.${index}` as any, val as any, {
                    shouldValidate: submitCount > 0,
                  })
                }
                error={fieldErrors?.[index]}
              />
            </div>
            {fields.length > 1 && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                isIconOnly
                onPress={() => remove(index)}
                className="text-danger mb-0.5"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
