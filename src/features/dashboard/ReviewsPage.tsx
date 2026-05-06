import { PageHeader } from "@/core/components/ui/PageHeader";
import { TablePagination } from "@/core/components/ui/TablePagination";
import { toArabicNumerals } from "@/core/utils/arabicNumerals";
import { Star } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAllTestimonials, useToggleTestimonial } from "./dashboardHooks";
import { ReviewCard } from "./components/ReviewCard";

export default function ReviewsPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAllTestimonials(page);
  const toggle = useToggleTestimonial();

  const reviews    = data?.items ?? [];
  const published  = reviews.filter((r) => r.isApproved).length;
  const hidden     = reviews.filter((r) => !r.isApproved).length;
  const totalCount = data?.totalCount ?? 0;

  const num = (n: number) => isRTL ? toArabicNumerals(String(n)) : String(n);

  const subtitle = data?.totalCount != null ? (
    <span className="flex flex-wrap items-center gap-1 text-sm text-muted">
      <span className="font-semibold text-accent">{num(totalCount)}</span>
      <span>{t("reviews.subtitleTotal")}</span>
      <span className="mx-1 text-border">·</span>
      <span className="font-semibold text-success">{num(published)}</span>
      <span>{t("reviews.subtitlePublished")}</span>
      <span className="mx-1 text-border">·</span>
      <span className="font-semibold text-muted">{num(hidden)}</span>
      <span>{t("reviews.subtitleHidden")}</span>
    </span>
  ) : undefined;

  return (
    <div>
      <PageHeader title={t("navigation.reviews")} subtitle={subtitle} />

      {isLoading ? null : reviews.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center text-muted">
          <Star className="h-12 w-12 opacity-30" />
          <p>{t("reviews.noReviews")}</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {reviews.map((r) => (
              <ReviewCard
                key={r.id}
                review={r}
                onToggle={() => toggle.mutate(r.id)}
                isPending={toggle.isPending && toggle.variables === r.id}
              />
            ))}
          </div>
          <TablePagination data={data} currentPage={page} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
