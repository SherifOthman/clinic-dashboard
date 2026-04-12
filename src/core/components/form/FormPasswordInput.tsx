import {
  FieldError as FieldErrorComponent,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { FieldError } from "react-hook-form";

interface FormPasswordInputProps
  extends Omit<React.ComponentProps<typeof Input>, "type"> {
  label: string;
  error?: FieldError;
  isRequired?: boolean;
}

export function FormPasswordInput({
  label,
  error,
  isRequired,
  ...props
}: FormPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField isRequired={isRequired} isInvalid={!!error}>
      <Label>{label}</Label>
      <div className="relative w-full">
        <Input
          type={showPassword ? "text" : "password"}
          className="w-full"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-default-400 hover:text-default-600 absolute inset-e-3 top-1/2 z-10 -translate-y-1/2"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {error?.message && (
        <FieldErrorComponent>{error.message}</FieldErrorComponent>
      )}
    </TextField>
  );
}

