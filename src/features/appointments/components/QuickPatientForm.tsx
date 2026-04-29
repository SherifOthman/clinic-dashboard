import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { PatientFormData } from "@/features/patients/schemas";

interface QuickPatientFormProps {
  onSubmit: (data: PatientFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function QuickPatientForm({ onSubmit, onCancel, isLoading }: QuickPatientFormProps) {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { setError(t("validation.required")); return; }
    if (!dateOfBirth) { setError(t("validation.required")); return; }
    setError("");

    onSubmit({
      fullName: fullName.trim(),
      dateOfBirth,
      gender,
      bloodType: "",
      countryGeonameId: null,
      stateGeonameId: null,
      cityGeonameId: null,
      phoneNumbers: phone ? [phone] : [],
      chronicDiseaseIds: [],
    });
  };

  return (
    <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
      <div className="mb-3 flex items-center gap-2">
        <button type="button" onClick={onCancel} className="text-muted hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <p className="text-sm font-semibold">{t("appointments.addNewPatient")}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {error && <p className="text-xs text-danger">{error}</p>}

        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-xs font-medium text-muted">{t("common.fields.fullName")} *</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)}
              className={inputCls} placeholder="Ahmed Hassan" required />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted">{t("patients.dateOfBirth")} *</label>
            <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)}
              className={inputCls} max={new Date().toISOString().split("T")[0]} required dir="ltr" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted">{t("common.fields.gender")}</label>
            <select value={gender} onChange={(e) => setGender(e.target.value as "Male" | "Female")}
              className={inputCls}>
              <option value="Male">{t("common.fields.male")}</option>
              <option value="Female">{t("common.fields.female")}</option>
            </select>
          </div>

          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-xs font-medium text-muted">{t("common.fields.phoneNumber")}</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              className={inputCls} placeholder="+201001234567" dir="ltr" />
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onPress={onCancel} className="flex-1">
            {t("common.cancel")}
          </Button>
          <Button type="submit" variant="primary" size="sm" className="flex-1"
            isPending={isLoading} isDisabled={isLoading}>
            {t("patients.createPatient")}
          </Button>
        </div>
      </form>
    </div>
  );
}
