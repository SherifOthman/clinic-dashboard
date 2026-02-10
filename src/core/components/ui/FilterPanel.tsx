import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { DatePicker } from "@heroui/date-picker";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { parseDate } from "@internationalized/date";
import { Filter, FilterX } from "lucide-react";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

export interface FilterOption {
  key: string;
  label: string;
  type: "select" | "date" | "dateRange" | "number" | "numberRange" | "text";
  options?: Array<{ key: string; label: string; value: any }>;
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface FilterValues {
  [key: string]: any;
}

interface FilterPanelProps {
  filters: FilterOption[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onClear: () => void;
  isCollapsible?: boolean;
  title?: string;
  className?: string;
}

export function FilterPanel({
  filters,
  values,
  onChange,
  onClear,
  isCollapsible = true,
  title = "Filters",
  className = "",
}: FilterPanelProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleValueChange = (key: string, value: any) => {
    onChange({
      ...values,
      [key]: value,
    });
  };

  const handleClear = () => {
    onClear();
    if (isCollapsible) {
      setIsExpanded(false);
    }
  };

  const hasActiveFilters = Object.values(values).some(
    (value) => value !== undefined && value !== null && value !== "",
  );

  const renderFilter = (filter: FilterOption): ReactNode => {
    const value = values[filter.key];

    switch (filter.type) {
      case "select":
        return (
          <Select
            key={filter.key}
            label={filter.label}
            placeholder={
              filter.placeholder || `Select ${filter.label.toLowerCase()}`
            }
            selectedKeys={value ? new Set([value.toString()]) : new Set()}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];
              const selectedOption = filter.options?.find(
                (opt) => opt.key === selectedKey,
              );
              handleValueChange(filter.key, selectedOption?.value);
            }}
            size="sm"
            variant="bordered"
          >
            {filter.options?.map((option) => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            )) || []}
          </Select>
        );

      case "date":
        return (
          <DatePicker
            key={filter.key}
            label={filter.label}
            value={value ? parseDate(value) : null}
            onChange={(date) => handleValueChange(filter.key, date?.toString())}
            size="sm"
            variant="bordered"
          />
        );

      case "dateRange":
        return (
          <div key={filter.key} className="space-y-2">
            <p className="text-sm font-medium text-default-700">
              {filter.label}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <DatePicker
                label={t("filters.from")}
                value={
                  values[`${filter.key}From`]
                    ? parseDate(values[`${filter.key}From`])
                    : null
                }
                onChange={(date) =>
                  handleValueChange(`${filter.key}From`, date?.toString())
                }
                size="sm"
                variant="bordered"
              />
              <DatePicker
                label={t("filters.to")}
                value={
                  values[`${filter.key}To`]
                    ? parseDate(values[`${filter.key}To`])
                    : null
                }
                onChange={(date) =>
                  handleValueChange(`${filter.key}To`, date?.toString())
                }
                size="sm"
                variant="bordered"
              />
            </div>
          </div>
        );

      case "number":
        return (
          <Input
            key={filter.key}
            type="number"
            label={filter.label}
            placeholder={filter.placeholder}
            value={value?.toString() || ""}
            onValueChange={(val) =>
              handleValueChange(filter.key, val ? parseInt(val) : undefined)
            }
            min={filter.min}
            max={filter.max}
            size="sm"
            variant="bordered"
          />
        );

      case "numberRange":
        return (
          <div key={filter.key} className="space-y-2">
            <p className="text-sm font-medium text-default-700">
              {filter.label}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                label={t("filters.min")}
                placeholder={t("filters.min")}
                value={values[`min${filter.key}`]?.toString() || ""}
                onValueChange={(val) =>
                  handleValueChange(
                    `min${filter.key}`,
                    val ? parseInt(val) : undefined,
                  )
                }
                min={filter.min}
                max={filter.max}
                size="sm"
                variant="bordered"
              />
              <Input
                type="number"
                label={t("filters.max")}
                placeholder={t("filters.max")}
                value={values[`max${filter.key}`]?.toString() || ""}
                onValueChange={(val) =>
                  handleValueChange(
                    `max${filter.key}`,
                    val ? parseInt(val) : undefined,
                  )
                }
                min={filter.min}
                max={filter.max}
                size="sm"
                variant="bordered"
              />
            </div>
          </div>
        );

      case "text":
        return (
          <Input
            key={filter.key}
            label={filter.label}
            placeholder={filter.placeholder}
            value={value || ""}
            onValueChange={(val) => handleValueChange(filter.key, val)}
            size="sm"
            variant="bordered"
          />
        );

      default:
        return null;
    }
  };

  if (isCollapsible) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="flat"
            startContent={<Filter className="w-4 h-4" />}
            onPress={() => setIsExpanded(!isExpanded)}
            color={hasActiveFilters ? "primary" : "default"}
          >
            {title}{" "}
            {hasActiveFilters &&
              `(${Object.keys(values).filter((k) => values[k] !== undefined && values[k] !== null && values[k] !== "").length})`}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="flat"
              color="danger"
              size="sm"
              startContent={<FilterX className="w-4 h-4" />}
              onPress={handleClear}
            >
              Clear
            </Button>
          )}
        </div>

        {isExpanded && (
          <Card>
            <CardHeader>
              <h4 className="text-lg font-semibold">{title}</h4>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filters.map(renderFilter)}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">{title}</h4>
        {hasActiveFilters && (
          <Button
            variant="flat"
            color="danger"
            size="sm"
            startContent={<FilterX className="w-4 h-4" />}
            onPress={handleClear}
          >
            Clear Filters
          </Button>
        )}
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filters.map(renderFilter)}
        </div>
      </CardBody>
    </Card>
  );
}
