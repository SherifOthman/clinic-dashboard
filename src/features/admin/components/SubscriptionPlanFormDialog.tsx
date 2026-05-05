import { Dialog } from "@/core/components/ui/Dialog";
import { Button, Input, Label, Switch, TextArea } from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { SubscriptionPlanDto } from "../adminApi";

type FormData = Omit<SubscriptionPlanDto, "id">;

const DEFAULT: FormData = {
  name: "", nameAr: "", description: "", descriptionAr: "",
  monthlyFee: 0, yearlyFee: 0, setupFee: 0,
  maxBranches: 1, maxStaff: 5,
  maxPatientsPerMonth: 500, maxAppointmentsPerMonth: 1000, maxInvoicesPerMonth: 500,
  storageLimitGB: 5,
  hasInventoryManagement: false, hasReporting: true, hasAdvancedReporting: false,
  hasApiAccess: false, hasMultipleBranches: false, hasCustomBranding: false,
  hasPrioritySupport: false, hasBackupAndRestore: true, hasIntegrations: false,
  isActive: true, isPopular: false, displayOrder: 99,
};

interface Props {
  initial?: SubscriptionPlanDto;
  isSaving: boolean;
  onSave: (data: FormData) => void;
  onClose: () => void;
}

export function SubscriptionPlanFormDialog({ initial, isSaving, onSave, onClose }: Props) {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormData>(initial ? { ...initial } : DEFAULT);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const num = (v: string) => parseFloat(v) || 0;
  const int = (v: string) => parseInt(v) || 0;

  const canSave = form.name.trim() && form.nameAr.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    onSave(form);
  };

  const FeatureSwitch = ({ label, field }: { label: string; field: keyof FormData }) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <Switch
        isSelected={form[field] as boolean}
        onChange={e => set(field, e.target.checked as FormData[typeof field])}
        size="sm"
      />
      <span className="text-sm">{label}</span>
    </label>
  );

  return (
    <Dialog isOpen onClose={onClose} size="lg" ariaLabel={initial ? "Edit Plan" : "Add Plan"}
      header={<h2 className="text-lg font-bold">{initial ? "Edit Subscription Plan" : "Add Subscription Plan"}</h2>}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Names */}
        <div className="grid grid-cols-2 gap-3">
          <Input label="Name (EN)" value={form.name} onChange={e => set("name", e.target.value)} isRequired autoFocus />
          <Input label="Name (AR)" value={form.nameAr} onChange={e => set("nameAr", e.target.value)} isRequired dir="rtl" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted">Description (EN)</Label>
            <TextArea value={form.description}   onChange={e => set("description",   e.target.value)} rows={2} placeholder="Plan description..." fullWidth />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted">Description (AR)</Label>
            <TextArea value={form.descriptionAr} onChange={e => set("descriptionAr", e.target.value)} rows={2} placeholder="وصف الخطة..." dir="rtl" fullWidth />
          </div>
        </div>

        {/* Pricing */}
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Pricing</p>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Monthly Fee ($)" type="number" value={String(form.monthlyFee)} onChange={e => set("monthlyFee", num(e.target.value))} />
            <Input label="Yearly Fee ($)"  type="number" value={String(form.yearlyFee)}  onChange={e => set("yearlyFee",  num(e.target.value))} />
            <Input label="Setup Fee ($)"   type="number" value={String(form.setupFee)}   onChange={e => set("setupFee",   num(e.target.value))} />
          </div>
        </div>

        {/* Limits */}
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Limits</p>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Max Branches"      type="number" value={String(form.maxBranches)}             onChange={e => set("maxBranches",             int(e.target.value))} />
            <Input label="Max Staff"         type="number" value={String(form.maxStaff)}                onChange={e => set("maxStaff",                int(e.target.value))} />
            <Input label="Storage (GB)"      type="number" value={String(form.storageLimitGB)}          onChange={e => set("storageLimitGB",          int(e.target.value))} />
            <Input label="Patients/mo"       type="number" value={String(form.maxPatientsPerMonth)}     onChange={e => set("maxPatientsPerMonth",     int(e.target.value))} />
            <Input label="Appointments/mo"   type="number" value={String(form.maxAppointmentsPerMonth)} onChange={e => set("maxAppointmentsPerMonth", int(e.target.value))} />
            <Input label="Invoices/mo"       type="number" value={String(form.maxInvoicesPerMonth)}     onChange={e => set("maxInvoicesPerMonth",     int(e.target.value))} />
          </div>
        </div>

        {/* Features */}
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Features</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <FeatureSwitch label="Reporting"          field="hasReporting" />
            <FeatureSwitch label="Advanced Reporting" field="hasAdvancedReporting" />
            <FeatureSwitch label="API Access"         field="hasApiAccess" />
            <FeatureSwitch label="Multiple Branches"  field="hasMultipleBranches" />
            <FeatureSwitch label="Custom Branding"    field="hasCustomBranding" />
            <FeatureSwitch label="Priority Support"   field="hasPrioritySupport" />
            <FeatureSwitch label="Inventory Mgmt"     field="hasInventoryManagement" />
            <FeatureSwitch label="Backup & Restore"   field="hasBackupAndRestore" />
            <FeatureSwitch label="Integrations"       field="hasIntegrations" />
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-3 gap-3 items-center">
          <Input label="Display Order" type="number" value={String(form.displayOrder)} onChange={e => set("displayOrder", int(e.target.value))} />
          <label className="flex items-center gap-2 cursor-pointer">
            <Switch isSelected={form.isPopular} onChange={e => set("isPopular", e.target.checked)} size="sm" />
            <span className="text-sm">Popular</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Switch isSelected={form.isActive} onChange={e => set("isActive", e.target.checked)} size="sm" />
            <span className="text-sm">Active</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" onPress={onClose} isDisabled={isSaving}>{t("common.cancel")}</Button>
          <Button variant="primary" type="submit" isPending={isSaving} isDisabled={!canSave}>
            {t("common.save")}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
