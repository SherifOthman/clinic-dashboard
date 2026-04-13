/**
 * Thin wrapper around LocationFilterButton that converts numeric GeoNames IDs
 * to the string keys expected by LocationFilterButton.
 */
import { LocationFilterButton } from "@/core/components/ui/LocationFilterButton";
import type { LucideIcon } from "lucide-react";
import { useMemo } from "react";

interface GeonameItem {
  geonameId: number;
  name: string;
}

interface GeonameFilterButtonProps {
  value: number | undefined;
  onChange: (geonameId: number | null) => void;
  items: GeonameItem[];
  isLoading?: boolean;
  placeholder: string;
  modalTitle: string;
  icon: LucideIcon;
}

export function GeonameFilterButton({
  value,
  onChange,
  items,
  isLoading,
  placeholder,
  modalTitle,
  icon,
}: GeonameFilterButtonProps) {
  const filterItems = useMemo(
    () => items.map((i) => ({ key: i.geonameId.toString(), label: i.name })),
    [items],
  );

  return (
    <LocationFilterButton
      value={value != null ? value.toString() : undefined}
      onChange={(key) => onChange(key ? parseInt(key) : null)}
      items={filterItems}
      isLoading={isLoading}
      placeholder={placeholder}
      modalTitle={modalTitle}
      icon={icon}
    />
  );
}
