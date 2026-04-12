import { translateError } from "@/core/utils/formUtils";
import { FieldError, Label, ListBox, Select } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps<T extends FieldValues>
  extends Omit<React.ComponentProps<typeof Select>, "children" | "name"> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: SelectOption[];
  isRequired?: boolean;
  placeholder?: string;
  isRTL?: boolean;
}

/**
 * Select dropdown component for forms
 * Wraps HeroUI Select with consistent styling
 */
export function FormSelect<T extends FieldValues>({
  name,
  control,
  label,
  options,
  isRequired,
  placeholder = "Select an option",
  isRTL,
  ...props
}: FormSelectProps<T>) {
  const { t } = useTranslation();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const errorMessage = error?.message;

        return (
          <Select
            {...field}
            isRequired={isRequired}
            isInvalid={!!error}
            placeholder={placeholder}
            {...props}
          >
            <Label>{label}</Label>
            <Select.Trigger>
              <Select.Value className={`px-1 ${isRTL ? "text-right" : ""}`} />
              <Select.Indicator>
                <ChevronDown size={20} />
              </Select.Indicator>
            </Select.Trigger>
            <Select.Popover>
              <ListBox dir={isRTL ? "rtl" : "ltr"}>
                {options.map((option) => (
                  <ListBox.Item
                    key={option.value}
                    id={option.value}
                    textValue={option.label}
                    isDisabled={option.disabled}
                  >
                    {option.label}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
            {errorMessage && (
              <FieldError>{translateError(errorMessage, t)}</FieldError>
            )}
          </Select>
        );
      }}
    />
  );
}

