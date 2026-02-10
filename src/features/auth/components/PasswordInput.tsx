import { Input } from "@heroui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PasswordInputProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  isRequired?: boolean;
  errorMessage?: string;
  isInvalid?: boolean;
}

export function PasswordInput({
  label,
  value,
  onValueChange,
  isRequired = false,
  errorMessage,
  isInvalid = false,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
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
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      isRequired={isRequired}
      label={label}
      startContent={<Eye className="w-4 h-4 text-default-400" />}
      type={isVisible ? "text" : "password"}
      value={value}
      variant="bordered"
      onValueChange={onValueChange}
    />
  );
}
