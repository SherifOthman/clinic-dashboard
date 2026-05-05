import { PageHeader } from "@/core/components/ui/PageHeader";
import { ConfirmDialog } from "@/core/components/ui/ConfirmDialog";
import { Button, Chip, Input, Switch, Textarea } from "@heroui/react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useSpecializations, useCreateSpecialization,
  useUpdateSpecialization, useDeleteSpecialization,
} from "./adminHooks";
import type { SpecializationDto } from "./adminApi";
import { ReferenceFormDialog } from "./components/ReferenceFormDialog";

export default function SpecializationsPage() {
  const { t } = useTranslation();
  const { data = [], isLoading } = useSpecializations();
  const create = useCreateSpecialization();
  const update = useUpdateSpecialization();
  const remove = useDeleteSpecialization();

  const [editing, setEditing]   = useState<SpecializationDto | null>(null);
  const [adding, setAdding]     = useState(false);
  const [deleting, setDeleting] = useState<SpecializationDto | null>(null);

  const handleSave = (form: { nameEn: string; nameAr: string; descriptionEn: string; descriptionAr: string; isActive: boolean }) => {
    if (editing) {
      update.mutate({ id: editing.id, ...form }, { onSuccess: () => setEditing(null) });
    } else {
      create.mutate(form, { onSuccess: () => setAdding(false) });
    }
  };

  return (
    <div>
      <PageHeader
        title={t("navigation.adminSpecializations")}
        subtitle={`${data.length} specializations`}
        action={
          <Button variant="primary" size="sm" onPress={() => setAdding(true)}>
            <Plus className="h-4 w-4" /> {t("common.add")}
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-2 mt-6">
          {[1,2,3,4,5].map(i => <div key={i} className="h-12 animate-pulse rounded-lg bg-surface-secondary" />)}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-border bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary/50">
                <th className="px-4 py-3 text-start font-medium text-muted">Name (EN)</th>
                <th className="px-4 py-3 text-start font-medium text-muted">Name (AR)</th>
                <th className="px-4 py-3 text-start font-medium text-muted">Status</th>
                <th className="px-4 py-3 text-end font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map(item => (
                <tr key={item.id} className="hover:bg-surface-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{item.nameEn}</td>
                  <td className="px-4 py-3 text-muted" dir="rtl">{item.nameAr}</td>
                  <td className="px-4 py-3">
                    <Chip size="sm" variant="soft" color={item.isActive ? "success" : "default"}>
                      {item.isActive ? t("common.status.active") : t("common.status.inactive")}
                    </Chip>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" isIconOnly onPress={() => setEditing(item)}>
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" isIconOnly onPress={() => setDeleting(item)}
                        className="text-danger hover:bg-danger/10">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(adding || editing) && (
        <ReferenceFormDialog
          title={editing ? "Edit Specialization" : "Add Specialization"}
          initial={editing ?? undefined}
          isSaving={create.isPending || update.isPending}
          onSave={handleSave}
          onClose={() => { setAdding(false); setEditing(null); }}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => { remove.mutate(deleting!.id, { onSuccess: () => setDeleting(null) }); }}
        title="Delete Specialization"
        message={`Delete "${deleting?.nameEn}"? This cannot be undone. If doctors are assigned to it, deletion will be blocked — deactivate it instead.`}
        isLoading={remove.isPending}
      />
    </div>
  );
}
