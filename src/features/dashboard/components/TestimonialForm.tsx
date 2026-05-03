import { isClinicOwner } from "@/core/utils/permissions";
import { useMe } from "@/features/auth/hooks";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMyTestimonial, useSubmitTestimonial } from "../dashboardHooks";

export function TestimonialForm() {
  const { t, i18n } = useTranslation();
  const { user } = useMe();

  const { data: existing, isLoading } = useMyTestimonial(isClinicOwner(user));

  const derivedPosition =
    (i18n.language === "ar" ? user?.specializationNameAr : user?.specializationNameEn)
    ?? "Clinic Owner";

  const [form, setForm] = useState({ text: "", rating: 5 });

  useEffect(() => {
    if (existing) {
      setForm({ text: existing.text, rating: existing.rating });
    }
  }, [existing]);

  const submitTestimonial = useSubmitTestimonial();

  if (!isClinicOwner(user) || isLoading) return null;

  const inputCls =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent";

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{t("dashboard.testimonial.title")}</h3>
          <p className="text-sm text-muted">{t("dashboard.testimonial.subtitle")}</p>
        </div>
        {existing && (
          <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
            {t("dashboard.testimonial.published")}
          </span>
        )}
      </div>

      {/* Preview of who will appear */}
      <div className="mb-4 flex items-center gap-3 rounded-lg bg-default/30 px-4 py-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
          {user?.fullName?.charAt(0) ?? "?"}
        </div>
        <div>
          <p className="text-sm font-medium">{user?.fullName}</p>
          <p className="text-xs text-muted">{derivedPosition}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Star rating */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setForm((f) => ({ ...f, rating: star }))}
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  star <= form.rating ? "fill-warning text-warning" : "text-border"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted">
            {t("dashboard.testimonial.yourReview")}
          </label>
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            value={form.text}
            onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
            placeholder={t("dashboard.testimonial.reviewPlaceholder")}
          />
        </div>

        <button
          type="button"
          disabled={submitTestimonial.isPending || !form.text.trim()}
          onClick={() => submitTestimonial.mutate({ text: form.text, rating: form.rating })}
          className="self-end rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90 disabled:opacity-50"
        >
          {submitTestimonial.isPending
            ? t("common.saving")
            : existing
              ? t("dashboard.testimonial.update")
              : t("dashboard.testimonial.submit")}
        </button>
      </div>
    </div>
  );
}
