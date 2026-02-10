import { Triangle } from "lucide-react";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <Triangle className="w-9 h-9 text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-default-900">{title}</h1>
      <p className="text-default-600 mt-2">{subtitle}</p>
    </div>
  );
}
