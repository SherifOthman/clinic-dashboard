interface AuthFormContainerProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export function AuthFormContainer({
  children,
  onSubmit,
}: AuthFormContainerProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {children}
    </form>
  );
}
