import { Input } from "@heroui/input";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "../../hooks";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onSearch: (searchTerm: string) => void;
  debounceMs?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Search input component with debounced search functionality
 */
export function SearchInput({
  placeholder,
  value: externalValue,
  onValueChange,
  onSearch,
  debounceMs = 300,
  className,
  size = "md",
}: SearchInputProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(externalValue || "");
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  // Update internal state when external value changes
  useEffect(() => {
    if (externalValue !== undefined) {
      setSearchTerm(externalValue);
    }
  }, [externalValue]);

  // Call onSearch when debounced value changes
  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleChange = (value: string) => {
    setSearchTerm(value);
    onValueChange?.(value);
  };

  const handleClear = () => {
    setSearchTerm("");
    onValueChange?.("");
  };

  return (
    <Input
      value={searchTerm}
      onValueChange={handleChange}
      placeholder={placeholder || t("common.search")}
      startContent={<Search className="w-4 h-4 text-default-400" />}
      endContent={
        searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="text-default-400 hover:text-default-600"
          >
            <X className="w-4 h-4" />
          </button>
        )
      }
      variant="bordered"
      size={size}
      className={className}
    />
  );
}
