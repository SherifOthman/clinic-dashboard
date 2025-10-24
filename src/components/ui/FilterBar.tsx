import { Input } from "@heroui/input";
import { Search } from "lucide-react";
import { ReactNode } from "react";

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  children?: ReactNode;
  className?: string;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  children,
  className = "",
}: FilterBarProps) {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <Input
        placeholder={searchPlaceholder}
        value={searchValue}
        onValueChange={onSearchChange}
        startContent={<Search size={18} />}
        className="max-w-md"
        variant="bordered"
      />
      {children}
    </div>
  );
}
