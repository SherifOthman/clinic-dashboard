import { Dialog } from "@/core/components/ui/Dialog";
import { Button, Input, Switch, Textarea } from "@heroui/react";
import { useEffect, useState } from "react";
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
  const [nameEn, setNameEn]             = useState(initial?.nameEn ?? "");
  const [nameAr, setNameAr]             = useState(initial?.nameAr ?? "");
  const [descEn, setDescEn]             = useState(initial?.descriptionEn ?? "");
  const [descAr, setDescAr]             = useState(initial?.descriptionAr ?? "");
  const [isActive, setIsActive]         = useState(initial?.isActive ?? true);

  const isEdit = !!initial;
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
          <Input
            label="Name (English)"
            value={nameEn}
            onChange={e => setNameEn(e.target.value)}
            isRequired
            autoFocus
          />
          <Input
            label="Name (Arabic)"
            value={nameAr}
            onChange={e => setNameAr(e.target.value)}
            isRequired
            dir="rtl"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Textarea
            label="Description (English)"
            value={descEn}
            onChange={e => setDescEn(e.target.value)}
            rows={3}
          />
          <Textarea
            label="Description (Arabic)"
            value={descAr}
            onChange={e => setDescAr(e.target.value)}
            rows={3}
            dir="rtl"
          />
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
