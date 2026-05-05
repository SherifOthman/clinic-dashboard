import { PageHeader } from "@/core/components/ui/PageHeader";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import { Eye, EyeOff, Star } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAllTestimonials, useToggleTestimonial } from "./dashboardHooks";
import type { AdminTestimonialDto } from "./dashboardApi";
import { Pagination } from "@heroui/react";

const PAGE_SIZE = 12;

export default function ReviewsPage() {
  const { t } = useTranslation();
  const { data: reviews = [], isLoading } = useAllTestimonials();
  const toggle = useToggleTestimonial();
  const [page, setPage] = useState(1);

  const published = reviews.filter((r) => r.isApproved).length;
  const hidden    = reviews.filter((r) => !r.isApproved).length;

  const totalPages = Math.ceil(reviews.length / PAGE_SIZE);
  const paged = reviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title={t("navigation.reviews")}
        subtitle={`${published} published · ${hidden} hidden`}
      />

      {isLoading ? null : reviews.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center text-muted">
          <Star className="h-12 w-12 opacity-30" />
          <p>No reviews yet</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paged.map((r) => (
              <ReviewCard
                key={r.id}
                review={r}
                onToggle={() => toggle.mutate(r.id)}
                isPending={toggle.isPending && toggle.variables === r.id}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                total={totalPages}
                page={page}
                onChange={setPage}
                color="accent"
                showControls
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ReviewCard({
  review,
  onToggle,
  isPending,
}: {
  review: AdminTestimonialDto;
  onToggle: () => void;
  isPending: boolean;
}) {
  const { formatDateShort } = useDateFormat();

  return (
    <div className={`relative flex flex-col gap-4 rounded-xl border p-5 transition-opacity ${
      review.isApproved ? "border-border bg-surface" : "border-border/50 bg-surface opacity-60"
    }`}>
      <div className="absolute top-3 right-3">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          review.isApproved ? "bg-success/10 text-success" : "bg-muted/20 text-muted"
        }`}>
          {review.isApproved ? "Published" : "Hidden"}
        </span>
      </div>

      <div className="flex items-center gap-3 pr-16">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
          {review.authorName.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-sm">{review.authorName}</p>
          <p className="text-xs text-muted">{review.position}</p>
          <p className="text-xs text-accent">{review.clinicName}</p>
        </div>
      </div>

      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`h-4 w-4 ${s <= review.rating ? "fill-warning text-warning" : "text-border"}`}
          />
        ))}
      </div>

      <p className="text-sm text-muted leading-relaxed flex-1">"{review.text}"</p>

      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <span className="text-xs text-muted">{formatDateShort(review.createdAt)}</span>
        <button
          type="button"
          disabled={isPending}
          onClick={onToggle}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            review.isApproved
              ? "bg-danger/10 text-danger hover:bg-danger/20"
              : "bg-success/10 text-success hover:bg-success/20"
          } disabled:opacity-50`}
        >
          {review.isApproved
            ? <><EyeOff className="h-3.5 w-3.5" /> Hide</>
            : <><Eye className="h-3.5 w-3.5" /> Publish</>
          }
        </button>
      </div>
    </div>
  );
}
