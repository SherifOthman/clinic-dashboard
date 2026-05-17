import { useDebounce } from "@/core/hooks/useDebounce";
import { getPatients } from "@/features/patients/patientsApi";
import { PatientDialog } from "@/features/patients/components/PatientDialog";
import { Button } from "@heroui/react";
import { Plus, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

interface PatientSearchFieldProps {
  value: string;
  patientName: string;
  onChange: (id: string, name: string) => void;
  isDisabled?: boolean;
}

export function PatientSearchField({ value, patientName, onChange, isDisabled }: PatientSearchFieldProps) {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(search, 300);

  const hasSelection = !!value;

  const { data, isLoading } = useQuery({
    queryKey: ["patients", "search", debouncedSearch],
    queryFn: () => getPatients({ searchTerm: debouncedSearch || undefined, pageSize: 10 }),
    enabled: open && !hasSelection,
    staleTime: 30_000,
  });

  const patients = data?.items ?? [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current  && !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectPatient = (id: string, name: string) => {
    onChange(id, name);
    setSearch("");
    setOpen(false);
  };

  const handleClear = () => {
    onChange("", "");
    setSearch("");
    inputRef.current?.focus();
  };

  return (
    <>
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute start-3 h-4 w-4 text-muted pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={hasSelection ? patientName : search}
            readOnly={hasSelection || isDisabled}
            onChange={(e) => {
              if (!isDisabled) {
                setSearch(e.target.value.replace(/[0-9]/g, ""));
                setOpen(true);
              }
            }}
            onFocus={() => { if (!hasSelection && !isDisabled) setOpen(true); }}
            placeholder={t("appointments.searchPatient")}
            disabled={isDisabled}
            className={`w-full rounded-lg border border-border bg-background py-2 ps-9 pe-9 text-sm outline-none focus:border-accent ${hasSelection ? "text-foreground font-medium" : ""} ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
          />
          {hasSelection && (
            <button type="button" onClick={handleClear} className="absolute end-3 text-muted hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {open && !hasSelection && (
          <div ref={dropdownRef} className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-surface shadow-lg">
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-muted">{t("common.loading")}</div>
            ) : patients.length === 0 && debouncedSearch ? (
              <div className="px-4 py-3 text-sm text-muted">
                {t("appointments.noPatientFound")} &quot;{debouncedSearch}&quot;
              </div>
            ) : (
              <ul className="max-h-52 overflow-y-auto py-1">
                {patients.map((p) => {
                  const age = p.dateOfBirth
                    ? Math.floor((Date.now() - new Date(p.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                    : null;
                  const city = i18n.language === "ar" ? p.cityNameAr : p.cityNameEn;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => selectPatient(p.id, p.fullName)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-start hover:bg-surface-secondary transition-colors"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                          {p.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-tight">{p.fullName}</p>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                            <span>{p.patientCode}</span>
                            {age !== null && <><span className="opacity-40">-</span><span>{age} {t("common.yearsOld")}</span></>}
                            {city && <><span className="opacity-40">-</span><span>{city}</span></>}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="border-t border-border p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-accent"
                onPress={() => { setOpen(false); setShowCreateDialog(true); }}
              >
                <Plus className="h-4 w-4" />
                {t("appointments.addNewPatient")}
                {debouncedSearch && ` "${debouncedSearch}"`}
              </Button>
            </div>
          </div>
        )}
      </div>

      {showCreateDialog && (
        <PatientDialog
          state={{ mode: "create" }}
          onClose={() => setShowCreateDialog(false)}
          initialDraft={debouncedSearch ? { fullName: debouncedSearch } : undefined}
        />
      )}
    </>
  );
}
