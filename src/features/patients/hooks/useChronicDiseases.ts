import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { chronicDiseasesApi } from "../api/chronicDiseasesApi";

export function useChronicDiseases() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  return useQuery({
    queryKey: ["chronicDiseases", currentLanguage],
    queryFn: () => chronicDiseasesApi.getAll(currentLanguage),
  });
}
