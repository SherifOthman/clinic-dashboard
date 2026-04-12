import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import { calculateDetailedAge, formatDetailedAge } from "@/core/utils/ageUtils";
import { Card } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface RecentPatientDto {
  id: string;
  patientCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  registeredAt: string;
}

function useRecentPatients() {
  return useQuery({
    queryKey: ["dashboard", "recent-patients"],
    queryFn: async () => {
      const res = await apiClient.get<RecentPatientDto[]>(
        `${API_ENDPOINTS.dashboard}/recent-patients`,
      );
      return res.data;
    },
    staleTime: 60 * 1000,
  });
}

export function RecentPatients() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const { formatDateShort, formatTimeOnly } = useDateFormat();
  const { data, isLoading } = useRecentPatients();

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="text-accent h-5 w-5" />
            <h3 className="font-semibold">{t("dashboard.recentPatients")}</h3>
          </div>
          <Link
            to="/patients"
            className="text-accent flex items-center gap-1 text-sm hover:underline"
          >
            {t("common.viewAll")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Card.Header>
      <Card.Content className="p-0">
        {isLoading ? (
          <div className="flex flex-col gap-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="border-divider flex items-center gap-3 border-t px-5 py-3"
              >
                <div className="bg-default-100 h-8 w-8 animate-pulse rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <div className="bg-default-100 h-3.5 w-32 animate-pulse rounded" />
                  <div className="bg-default-100 h-3 w-20 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.length === 0 ? (
          <p className="text-default-400 px-5 py-6 text-center text-sm">
            {t("patients.noPatients")}
          </p>
        ) : (
          <div className="flex flex-col gap-0">
            {data?.map((patient) => (
              <div
                key={patient.id}
                className="border-divider flex items-center gap-3 border-t px-5 py-3"
              >
                <div className="bg-accent/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                  <span className="text-accent text-xs font-semibold">
                    {patient.fullName.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {patient.fullName}
                  </p>
                  <p className="text-default-400 text-xs">
                    {formatDetailedAge(
                      calculateDetailedAge(patient.dateOfBirth),
                      isAr,
                    )}
                    {" · "}
                    {patient.gender === "Male"
                      ? t("common.fields.male")
                      : t("common.fields.female")}
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-default-500 text-xs">
                    {formatDateShort(patient.registeredAt)}
                  </p>
                  <p className="text-accent text-xs">
                    {formatTimeOnly(patient.registeredAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card.Content>
    </Card>
  );
}

