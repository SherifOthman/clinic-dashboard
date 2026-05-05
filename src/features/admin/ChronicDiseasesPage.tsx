import { PageHeader } from "@/core/components/ui/PageHeader";
import { ConfirmDialog } from "@/core/components/ui/ConfirmDialog";
import { TablePagination } from "@/core/components/ui/TablePagination";
import { TableSkeleton } from "@/core/components/ui/TableSkeleton";
import { Button, Chip, Tooltip } from "@heroui/react";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useChronicDiseases, useCreateChronicDisease,
  useUpdateChronicDisease, useDeleteChronicDisease,
} from "./adminHooks";
import type { ChronicDiseaseDto } from "./adminApi";
import { ReferenceFormDialog } from "./components/ReferenceFormDialog";

const PAGE_SIZE = 10;

const COLUMNS = [
  { key: "nameEn", label: "Name (EN)" },
  { key: "nameAr", label: "Name (AR)" },
  { key: "status", label: "Status" },
  { key: "actions", label: "" },
];

export default function ChronicDiseasesPage() {
  const { t } = useTranslation();
  const [page, setPage]         = useState(1);
  const [editing, setEditing]   = useState<ChronicDiseaseDto | null>(null);
  const [adding, setAdding]     = useState(false);
  const [deleting, setDeleting] = useState<ChronicDiseaseDto | null>(null);

  const { data, isLoading } = useChronicDiseases(page, PAGE_SIZE);
  const create = useCreateChronicDisease();
  const update = useUpdateChronicDisease();
  const remove = useDeleteChronicDisease();

  const items = data?.items ?? [];

  const handleSave = (form: { nameEn: string; nameAr: string; descriptionEn: string; descriptionAr: string; isActive: boolean }) => {
    if (editing) {
      update.mutate({ id: editing.id, ...form }, { onSuccess: () => setEditing(null) });
    } else {
      create.mutate(form, { onSuccess: () => { setAdding(false); setPage(1); } });
    }
  };

  return (
    <div>
      <PageHeader
        title={t("navigation.adminChronicDiseases")}
        subtitle={data ? `${data.totalCount} chronic diseases` : ""}
        action={
          <Button variant="primary" size="sm" onPress={() => setAdding(true)}>
            <Plus className="h-4 w-4" /> {t("common.add")}
          </Button>
        }
      />

      <div className="mt-6 rounded-xl border border-border bg-surface overflow-hidden">
        {isLoading ? (
          <TableSkeleton columns={COLUMNS} />
        ) : (
          <>
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
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted">
                      No chronic diseases yet.
                    </td>
                  </tr>
                ) : items.map(item => (
                  <tr key={item.id}
                    className={`transition-colors hover:bg-surface-secondary/30 ${!item.isActive ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3 font-medium">{item.nameEn}</td>
                    <td className="px-4 py-3 text-muted" dir="rtl">{item.nameAr}</td>
                    <td className="px-4 py-3">
                      <Chip size="sm" variant="soft" color={item.isActive ? "success" : "default"}>
                        {item.isActive ? t("common.status.active") : t("common.status.inactive")}
                      </Chip>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Tooltip delay={300}>
                          <Tooltip.Trigger>
                            <Button size="sm" variant="ghost" isIconOnly onPress={() => setEditing(item)}>
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                          </Tooltip.Trigger>
                          <Tooltip.Content><p>{t("common.edit")}</p></Tooltip.Content>
                        </Tooltip>
                        <Tooltip delay={300}>
                          <Tooltip.Trigger>
                            <Button size="sm" variant="ghost" isIconOnly onPress={() => setDeleting(item)}
                              className="text-danger hover:bg-danger/10">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </Tooltip.Trigger>
                          <Tooltip.Content>
                            <p>{item.isActive ? "Deactivate / Delete" : t("common.delete")}</p>
                          </Tooltip.Content>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-border px-4">
              <TablePagination
                data={data}
                currentPage={page}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>

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
