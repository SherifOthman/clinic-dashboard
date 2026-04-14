import { MostUsedPills } from "@/core/components/ui/MostUsedPills";
import { useMostUsed } from "@/core/hooks/useMostUsed";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Chip,
  Label,
  Modal,
  SearchField,
} from "@heroui/react";
import { Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useChronicDiseases } from "../patientsHooks";
import type { PatientFormData } from "../schemas";
import type { ChronicDisease } from "../types";

// ── Component ─────────────────────────────────────────────────────────────────

interface PatientChronicDiseasesProps {
  form: UseFormReturn<PatientFormData>;
}

export function PatientChronicDiseases({ form }: PatientChronicDiseasesProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const { data: diseases = [], isLoading, error } = useChronicDiseases();
  const { getMostUsed, increment } = useMostUsed("chronic_disease_usage");

  const { watch, setValue } = form;
  // Normalize to lowercase — patient detail returns uppercase GUIDs, disease list uses lowercase
  const selectedIds: string[] = (watch("chronicDiseaseIds") ?? []).map(
    (id: string) => id.toLowerCase(),
  );

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const name = (d: ChronicDisease) => (isAr ? d.nameAr : d.nameEn);

  const mostUsedItems = useMemo(
    () =>
      getMostUsed(diseases, (d) => d.id, 8).map((d) => ({
        key: d.id,
        label: name(d),
      })),
    [diseases, getMostUsed, isAr],
  );

  const filtered = useMemo(
    () =>
      search.trim()
        ? diseases.filter((d) =>
            name(d).toLowerCase().includes(search.toLowerCase()),
          )
        : diseases,
    [diseases, search, isAr],
  );

  const selectedDiseases = diseases.filter((d) => selectedIds.includes(d.id));

  const handleClose = () => {
    if (selectedIds.length > 0) selectedIds.forEach((id) => increment(id));
    setSearch("");
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Label>{t("patients.chronicDiseases")}</Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onPress={() => setIsOpen(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          {selectedIds.length > 0
            ? `${t("patients.addDiseases")} (${selectedIds.length})`
            : t("patients.addDiseases")}
        </Button>
      </div>

      {/* Selected chips */}
      {selectedDiseases.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedDiseases.map((d) => (
            <Chip key={d.id} size="sm" variant="soft" color="warning">
              {name(d)}
              <button
                type="button"
                onClick={() =>
                  setValue(
                    "chronicDiseaseIds",
                    selectedIds.filter((s) => s !== d.id) as any,
                  )
                }
                className="ml-1 opacity-60 hover:opacity-100"
                aria-label={`Remove ${name(d)}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Chip>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={(open) => !open && handleClose()}
      >
        <Modal.Container size="md">
          <Modal.Dialog>
            {({ close }) => (
              <>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>{t("patients.chronicDiseases")}</Modal.Heading>
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

                  {error ? (
                    <p className="text-danger py-6 text-center text-sm">
                      {t("common.loadError")}
                    </p>
                  ) : isLoading ? (
                    <p className="text-default-400 py-6 text-center text-sm">
                      {t("common.loading")}
                    </p>
                  ) : (
                    <>
                      {/* Most used — hidden when searching */}
                      {!search.trim() && (
                        <MostUsedPills
                          items={mostUsedItems}
                          selectedKeys={selectedIds}
                          onSelect={(key) =>
                            setValue(
                              "chronicDiseaseIds",
                              (selectedIds.includes(key)
                                ? selectedIds.filter((s) => s !== key)
                                : [...selectedIds, key]) as any,
                            )
                          }
                          label={t("patients.mostUsed")}
                        />
                      )}

                      {/* All diseases — same pattern as original working popover */}
                      <div className="flex flex-col gap-1">
                        {!search.trim() && mostUsedItems.length > 0 && (
                          <p className="text-default-500 text-xs font-semibold tracking-wide uppercase">
                            {t("patients.allDiseases")}
                          </p>
                        )}
                        <div className="max-h-64 overflow-y-auto">
                          {filtered.length === 0 ? (
                            <p className="text-default-400 py-6 text-center text-sm">
                              {t("common.noResults")}
                            </p>
                          ) : (
                            <CheckboxGroup
                              value={selectedIds}
                              onChange={(v) =>
                                setValue("chronicDiseaseIds", v as any)
                              }
                              className="gap-0"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2">
                                {filtered.map((d) => (
                                  <label
                                    key={d.id}
                                    className="hover:bg-default-100 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5"
                                  >
                                    <Checkbox value={d.id}>
                                      <Checkbox.Control>
                                        <Checkbox.Indicator />
                                      </Checkbox.Control>
                                    </Checkbox>
                                    <span className="text-sm">{name(d)}</span>
                                  </label>
                                ))}
                              </div>
                            </CheckboxGroup>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </Modal.Body>

                <Modal.Footer>
                  {selectedIds.length > 0 && (
                    <span className="text-default-500 me-auto text-sm">
                      {selectedIds.length} {t("patients.conditions")}
                    </span>
                  )}
                  <Button
                    variant="primary"
                    onPress={() => {
                      handleClose();
                      close();
                    }}
                  >
                    {t("common.done")}
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </div>
  );
}
