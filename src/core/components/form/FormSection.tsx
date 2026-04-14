interface FormSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export function FormSection({ icon, title, children }: FormSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-accent">{icon}</span>
        <p className="text-foreground text-sm font-semibold">{title}</p>
      </div>
      <div className="border-divider rounded-xl border p-4">{children}</div>
    </div>
  );
}
