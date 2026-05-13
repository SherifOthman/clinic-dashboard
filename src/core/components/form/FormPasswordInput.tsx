import {
  Button,
  FieldError as FieldErrorComponent,
  InputGroup,
  Label,
  TextField,
} from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { FieldError } from "react-hook-form";

interface FormPasswordInputProps
  extends Omit<React.ComponentProps<typeof InputGroup.Input>, "type"> {
  label: string;
  error?: FieldError;
  isRequired?: boolean;
}

export function FormPasswordInput({
  label, error, isRequired, ...props
}: FormPasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <TextField isRequired={isRequired} isInvalid={!!error}>
      <Label>{label}</Label>
      <InputGroup>
        <InputGroup.Input
          type={show ? "text" : "password"}
          {...props}
        />
        <InputGroup.Suffix className="pr-0">
          <Button
            isIconOnly
            aria-label={show ? "Hide password" : "Show password"}
            size="sm"
            variant="ghost"
            onPress={() => setShow((s) => !s)}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </InputGroup.Suffix>
      </InputGroup>
      {error?.message && (
        <FieldErrorComponent>{error.message}</FieldErrorComponent>
      )}
    </TextField>
  );
}
