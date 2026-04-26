import { formatPhoneInternational } from "@/core/utils/phoneFormat";
import { Chip } from "@heroui/react";
import { Phone, Stethoscope } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ChronicDisease {
  id: string;
  nameEn: string;
  nameAr: string;
}

interface PatientContactInfoProps {
  phoneNumbers: string[];
  chronicDiseases: ChronicDisease[];
}

export function PatientContactInfo({ phoneNumbers, chronicDiseases }: PatientContactInfoProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  if (phoneNumbers.length === 0 && chronicDiseases.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {phoneNumbers.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <Phone className="text-accent h-3.5 w-3.5" />
            <p className="text-foreground text-sm font-semibold">{t("patients.phoneNumbers")}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            {phoneNumbers.map((phone, i) => (
              <div key={i} className="flex items-center gap-2">
                <Phone className="text-muted h-3.5 w-3.5 shrink-0" />
                <span className="text-foreground font-mono text-sm tracking-wide" dir="ltr">
                  {formatPhoneInternational(phone)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {chronicDiseases.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <Stethoscope className="text-warning h-3.5 w-3.5" />
            <p className="text-foreground text-sm font-semibold">{t("patients.chronicDiseases")}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {chronicDiseases.map((d) => (
              <Chip key={d.id} size="sm" variant="soft" color="warning">
                {isRTL ? d.nameAr : d.nameEn}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
