import { Dialog } from "@/core/components/ui/Dialog";
import { Button, Input, Label, Switch, TextArea } from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ReferenceFormDialogProps {
  title: string;
  initial?: { nameEn: string; nameAr: string; descriptionEn?: string; descriptionAr?: string; isActive?: boolean };
  isSaving: boolean;
  onSave: (data: { nameEn: string; nameAr: string; descriptionEn: string; descriptionAr: string; isActive: boolean }) => void;
  onClose: () => void;
}

export function ReferenceFormDialog({ title, initial, isSaving, onSave, onClose }: ReferenceFormDialogProps) {
  const { t } = useTranslation();
  const [nameEn, setNameEn]     = useState(initial?.nameEn ?? "");
  const [nameAr, setNameAr]     = useState(initial?.nameAr ?? "");
  const [descEn, setDescEn]     = useState(initial?.descriptionEn ?? "");
  const [descAr, setDescAr]     = useState(initial?.descriptionAr ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  const isEdit  = !!initial;
  const canSave = nameEn.trim() && nameAr.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({ nameEn: nameEn.trim(), nameAr: nameAr.trim(), descriptionEn: descEn.trim(), descriptionAr: descAr.trim(), isActive });
  };

  return (
    <Dialog isOpen onClose={onClose} size="md" ariaLabel={title}
      header={<h2 className="text-lg font-bold">{title}</h2>}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="nameEn" className="text-xs font-medium text-muted">Name (English) *</Label>
            <Input id="nameEn" value={nameEn} onChange={e => setNameEn(e.target.value)} required autoFocus placeholder="e.g. Cardiology" fullWidth />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="nameAr" className="text-xs font-medium text-muted">Name (Arabic) *</Label>
            <Input id="nameAr" value={nameAr} onChange={e => setNameAr(e.target.value)} required dir="rtl" placeholder="مثال: أمراض القلب" fullWidth />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="descEn" className="text-xs font-medium text-muted">Description (English)</Label>
            <TextArea id="descEn" value={descEn} onChange={e => setDescEn(e.target.value)} rows={3} placeholder="Optional description..." fullWidth />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="descAr" className="text-xs font-medium text-muted">Description (Arabic)</Label>
            <TextArea id="descAr" value={descAr} onChange={e => setDescAr(e.target.value)} rows={3} placeholder="وصف اختياري..." dir="rtl" fullWidth />
          </div>
        </div>
        {isEdit && (
          <div className="flex items-center gap-3">
            <Switch isSelected={isActive} onChange={e => setIsActive(e.target.checked)} />
            <span className="text-sm">{isActive ? t("common.status.active") : t("common.status.inactive")}</span>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onPress={onClose} isDisabled={isSaving}>{t("common.cancel")}</Button>
          <Button variant="primary" type="submit" isPending={isSaving} isDisabled={!canSave}>
            {t("common.save")}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
