/**
 * Generic location filter button + modal.
 *
 * Renders a trigger button that opens a searchable radio-list modal.
 * Supports an optional "most used" pills section at the top.
 *
 * Used by PatientStateFilter and PatientCityFilter — any future
 * location-style filter can reuse this without duplication.
 */
import { Button, Modal, Radio, RadioGroup, SearchField } from "@heroui/react";
import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MostUsedPills } from "./MostUsedPills";

export interface LocationFilterItem {
  /** The key sent to the backend / used as the filter value */
  key: string;
  /** Display label (already localised by the caller) */
  label: string;
  /** Secondary label used for search matching (e.g. Arabic name) */
  labelAlt?: string;
}

interface LocationFilterButtonProps {
  /** Current selected key (undefined = nothing selected) */
  value: string | undefined;
  onChange: (key: string | null) => void;

  /** All available items */
  items: LocationFilterItem[];
  /** Pre-computed most-used items (pass [] to disable the section) */
  mostUsedItems?: LocationFilterItem[];
  /** Called when the user picks an item — use to track usage */
  onUsed?: (key: string) => void;
  /** Called when the modal opens — use to trigger lazy data fetch */
  onOpen?: () => void;

  isLoading?: boolean;

  /** Trigger button label when nothing is selected */
  placeholder: string;
  /** Modal heading */
  modalTitle: string;
  /** Section label above the full list when most-used is shown */
  allItemsLabel?: string;
  /** Section label above the most-used pills */
  mostUsedLabel?: string;

  icon: LucideIcon;
}

export function LocationFilterButton({
  value,
  onChange,
  items,
  mostUsedItems = [],
  onUsed,
  onOpen,
  isLoading = false,
  placeholder,
  modalTitle,
  allItemsLabel,
  mostUsedLabel,
  icon: Icon,
}: LocationFilterButtonProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const openModal = () => {
    onOpen?.(); // trigger lazy fetch on first open
    setIsOpen(true);
  };

  const selectedItem = items.find((i) => i.key === value);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        (i.labelAlt ?? "").toLowerCase().includes(q),
    );
  }, [items, search]);

  const handleSelect = (key: string, close: () => void) => {
    if (value === key) {
      onChange(null);
    } else {
      onUsed?.(key);
      onChange(key);
    }
    setSearch("");
    setIsOpen(false);
    close();
  };

  return (
    <>
      {/* ── Trigger ── */}
      <Button
        variant={value ? "primary" : "outline"}
        size="sm"
        onPress={openModal}
        className="h-9 gap-1.5"
      >
        <Icon className="h-3.5 w-3.5" />
        {selectedItem ? selectedItem.label : placeholder}
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className="ms-1 opacity-70 hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </Button>

      {/* ── Modal ── */}
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={(open) => !open && setIsOpen(false)}
      >
        <Modal.Container size="sm">
          <Modal.Dialog>
            {({ close }) => (
              <>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>{modalTitle}</Modal.Heading>
                </Modal.Header>

                <Modal.Body className="flex flex-col gap-4">
                  {/* Search */}
                  <SearchField
                    value={search}
                    onChange={setSearch}
                    aria-label={t("common.search")}
                  >
                    <SearchField.Group>
                      <SearchField.SearchIcon className="ms-3" />
                      <SearchField.Input
                        placeholder={t("common.search")}
                        className="text-sm"
                      />
                      <SearchField.ClearButton />
                    </SearchField.Group>
                  </SearchField>

                  {isLoading ? (
                    <p className="text-muted py-6 text-center text-sm">
                      {t("common.loading")}
                    </p>
                  ) : (
                    <>
                      {/* Most-used pills — hidden while searching */}
                      {!search.trim() && (
                        <MostUsedPills
                          items={mostUsedItems}
                          selectedKeys={value ? [value] : []}
                          onSelect={(key) => handleSelect(key, close)}
                          label={mostUsedLabel}
                        />
                      )}

                      {/* Full list */}
                      <div className="flex flex-col gap-1">
                        {!search.trim() &&
                          mostUsedItems.length > 0 &&
                          allItemsLabel && (
                            <p className="text-muted text-xs font-semibold tracking-wide uppercase">
                              {allItemsLabel}
                            </p>
                          )}
                        <div className="max-h-64 overflow-y-auto">
                          {filtered.length === 0 ? (
                            <p className="text-muted py-6 text-center text-sm">
                              {t("common.noResults")}
                            </p>
                          ) : (
                            <RadioGroup
                              value={value ?? ""}
                              onChange={(v) => handleSelect(v, close)}
                              className="gap-0"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2">
                                {filtered.map((item) => (
                                  <Radio
                                    key={item.key}
                                    value={item.key}
                                    className="hover:bg-surface-secondary rounded-md px-3 py-2"
                                  >
                                    <Radio.Control>
                                      <Radio.Indicator />
                                    </Radio.Control>
                                    <Radio.Content>
                                      <span className="text-sm">
                                        {item.label}
                                      </span>
                                    </Radio.Content>
                                  </Radio>
                                ))}
                              </div>
                            </RadioGroup>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </Modal.Body>

                {value && (
                  <Modal.Footer>
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={() => {
                        onChange(null);
                        close();
                      }}
                    >
                      <X className="h-3.5 w-3.5" />
                      {t("filters.clearAll")}
                    </Button>
                  </Modal.Footer>
                )}
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
