import { PageHeader } from "@/core/components/ui/PageHeader";
import { ConfirmDialog } from "@/core/components/ui/ConfirmDialog";
import { Button, Chip } from "@heroui/react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useChronicDiseases, useCreateChronicDisease,
  useUpdateChronicDisease, useDeleteChronicDisease,
} from "./adminHooks";
import type { ChronicDiseaseDto } from "./adminApi";
import { ReferenceFormDialog } from "./components/ReferenceFormDialog";

export default function ChronicDiseasesPage() {
  const { t } = useTranslation();
  const { data = [], isLoading } = useChronicDiseases();
  const create = useCreateChronicDisease();
  const update = useUpdateChronicDisease();
  const remove = useDeleteChronicDisease();

  const [editing, setEditing]   = useState<ChronicDiseaseDto | null>(null);
  const [adding, setAdding]     = useState(false);
  const [deleting, setDeleting] = useState<ChronicDiseaseDto | null>(null);

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
        title={t("navigation.adminChronicDiseases")}
        subtitle={`${data.length} chronic diseases`}
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
          title={editing ? "Edit Chronic Disease" : "Add Chronic Disease"}
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
        title="Delete Chronic Disease"
        message={`Delete "${deleting?.nameEn}"? If patients have this disease assigned, deletion will be blocked — deactivate it instead.`}
        isLoading={remove.isPending}
      />
    </div>
  );
}
