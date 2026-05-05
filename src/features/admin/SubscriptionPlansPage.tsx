import { PageHeader } from "@/core/components/ui/PageHeader";
import { Button, Chip } from "@heroui/react";
import { Edit2, Plus, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useAdminSubscriptionPlans, useCreateSubscriptionPlan,
  useUpdateSubscriptionPlan, useToggleSubscriptionPlan,
} from "./adminHooks";
import type { SubscriptionPlanDto } from "./adminApi";
import { SubscriptionPlanFormDialog } from "./components/SubscriptionPlanFormDialog";

export default function SubscriptionPlansPage() {
  const { t } = useTranslation();
  const { data = [], isLoading } = useAdminSubscriptionPlans();
  const create = useCreateSubscriptionPlan();
  const update = useUpdateSubscriptionPlan();
  const toggle = useToggleSubscriptionPlan();

  const [editing, setEditing] = useState<SubscriptionPlanDto | null>(null);
  const [adding, setAdding]   = useState(false);

  const handleSave = (form: Omit<SubscriptionPlanDto, "id">) => {
    if (editing) {
      update.mutate({ id: editing.id, ...form }, { onSuccess: () => setEditing(null) });
    } else {
      create.mutate(form, { onSuccess: () => setAdding(false) });
    }
  };

  const features = (plan: SubscriptionPlanDto) => [
    plan.hasReporting && "Reporting",
    plan.hasAdvancedReporting && "Adv. Reporting",
    plan.hasApiAccess && "API",
    plan.hasMultipleBranches && "Multi-branch",
    plan.hasCustomBranding && "Branding",
    plan.hasPrioritySupport && "Priority Support",
    plan.hasIntegrations && "Integrations",
  ].filter(Boolean) as string[];

  return (
    <div>
      <PageHeader
        title={t("navigation.adminSubscriptionPlans")}
        subtitle={`${data.length} plans`}
        action={
          <Button variant="primary" size="sm" onPress={() => setAdding(true)}>
            <Plus className="h-4 w-4" /> {t("common.add")}
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-3 mt-6">
          {[1,2,3,4].map(i => <div key={i} className="h-24 animate-pulse rounded-xl bg-surface-secondary" />)}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {data.sort((a, b) => a.displayOrder - b.displayOrder).map(plan => (
            <div key={plan.id}
              className={`rounded-xl border p-5 transition-opacity ${plan.isActive ? "border-border bg-surface" : "border-border/50 bg-surface opacity-60"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base">{plan.name}</h3>
                    {plan.isPopular && (
                      <Chip size="sm" variant="soft" color="accent">Popular</Chip>
                    )}
                    <Chip size="sm" variant="soft" color={plan.isActive ? "success" : "default"}>
                      {plan.isActive ? "Active" : "Inactive"}
                    </Chip>
                  </div>
                  <p className="text-xs text-muted mt-0.5">{plan.description}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="sm" variant="ghost" isIconOnly onPress={() => setEditing(plan)}>
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" isIconOnly
                    onPress={() => toggle.mutate(plan.id)}
                    isPending={toggle.isPending && toggle.variables === plan.id}
                    className={plan.isActive ? "text-warning hover:bg-warning/10" : "text-success hover:bg-success/10"}>
                    {plan.isActive
                      ? <ToggleRight className="h-4 w-4" />
                      : <ToggleLeft className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Pricing */}
              <div className="mt-3 flex gap-4 text-sm">
                <span><span className="font-bold text-accent">${plan.monthlyFee}</span><span className="text-muted">/mo</span></span>
                <span><span className="font-bold">${plan.yearlyFee}</span><span className="text-muted">/yr</span></span>
                {plan.setupFee > 0 && <span className="text-muted">+${plan.setupFee} setup</span>}
              </div>

              {/* Limits */}
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                <span>{plan.maxBranches} branch{plan.maxBranches !== 1 ? "es" : ""}</span>
                <span>{plan.maxStaff} staff</span>
                <span>{plan.maxPatientsPerMonth.toLocaleString()} patients/mo</span>
                <span>{plan.maxAppointmentsPerMonth.toLocaleString()} appts/mo</span>
                <span>{plan.storageLimitGB}GB storage</span>
              </div>

              {/* Features */}
              {features(plan).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {features(plan).map(f => (
                    <span key={f} className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">{f}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {(adding || editing) && (
        <SubscriptionPlanFormDialog
          initial={editing ?? undefined}
          isSaving={create.isPending || update.isPending}
          onSave={handleSave}
          onClose={() => { setAdding(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
