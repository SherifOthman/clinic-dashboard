import { Triangle } from "lucide-react";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <Triangle className="h-9 w-9 text-primary" />
      </div>
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle && <p className="text-foreground-500 mt-2">{subtitle}</p>}
    </div>
  );
}

