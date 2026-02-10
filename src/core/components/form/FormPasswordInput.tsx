import { Input, InputProps } from "@heroui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FieldError } from "react-hook-form";

interface FormPasswordInputProps extends InputProps {
  label: string;
  error?: string | FieldError;
  ref?: React.Ref<HTMLInputElement>;
}

/**
 * Reusable form password input component
 * Provides consistent password input styling with visibility toggle
 */
export function FormPasswordInput({
  label,
  error,
  isInvalid,
  errorMessage,
  ref,
  ...props
}: FormPasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const errorText = typeof error === "string" ? error : error?.message;

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      ref={ref}
      label={label}
      variant="bordered"
      type={isVisible ? "text" : "password"}
      isInvalid={isInvalid || !!error}
      errorMessage={errorMessage || errorText}
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <EyeOff className="w-4 h-4 text-default-400" />
          ) : (
            <Eye className="w-4 h-4 text-default-400" />
          )}
        </button>
      }
      {...props}
    />
  );
}
