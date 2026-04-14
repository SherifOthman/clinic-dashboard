/**
 * Generic location filter button + modal.
 *
 * Renders a trigger button that opens a searchable selectable-list modal.
 * Supports an optional "most used" pills section at the top.
 *
 * Used by PatientStateFilter and PatientCityFilter — any future
 * location-style filter can reuse this without duplication.
 */
import { Button, ListBox, Modal, SearchField } from "@heroui/react";
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
    if (key === value) {
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
      <div className="flex items-center">
        <Button
          variant={value ? "primary" : "outline"}
          size="sm"
          onPress={openModal}
          className={`h-9 gap-1.5 ${value ? "rounded-e-none" : ""}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {selectedItem ? selectedItem.label : placeholder}
        </Button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="border-accent bg-accent text-accent-foreground hover:bg-accent/90 flex h-9 items-center rounded-e-md border px-1.5"
            aria-label="Clear filter"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

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
                            <ListBox
                              aria-label={modalTitle}
                              selectionMode="single"
                              selectedKeys={
                                value ? new Set([value]) : new Set()
                              }
                              onSelectionChange={(keys) => {
                                const key = Array.from(keys)[0] as
                                  | string
                                  | undefined;
                                if (!key) return;
                                if (key === value) {
                                  onChange(null);
                                } else {
                                  onUsed?.(key);
                                  onChange(key);
                                }
                                setSearch("");
                                setIsOpen(false);
                                close();
                              }}
                              className="gap-0"
                            >
                              {filtered.map((item) => (
                                <ListBox.Item
                                  key={item.key}
                                  id={item.key}
                                  textValue={item.label}
                                  className="rounded-md px-3 py-2 text-sm"
                                >
                                  {item.label}
                                  <ListBox.ItemIndicator />
                                </ListBox.Item>
                              ))}
                            </ListBox>
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
