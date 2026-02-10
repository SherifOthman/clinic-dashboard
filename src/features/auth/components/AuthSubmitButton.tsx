import { Button } from "@heroui/button";

interface AuthSubmitButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
}

export function AuthSubmitButton({
  children,
  isLoading = false,
  disabled = false,
}: AuthSubmitButtonProps) {
  return (
    <Button
      className="w-full"
      color="primary"
      size="lg"
      type="submit"
      isLoading={isLoading}
      isDisabled={disabled}
    >
      {children}
    </Button>
  );
}
