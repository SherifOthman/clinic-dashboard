import { DataTable, type Column } from "@/core/components/ui/DataTable";
import { PageHeader } from "@/core/components/ui/PageHeader";
import { ConfirmDialog } from "@/core/components/ui/ConfirmDialog";
import { TablePagination } from "@/core/components/ui/TablePagination";
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

  const handleSave = (form: { nameEn: string; nameAr: string; descriptionEn: string; descriptionAr: string; isActive: boolean }) => {
    if (editing) {
      update.mutate({ id: editing.id, ...form }, { onSuccess: () => setEditing(null) });
    } else {
      create.mutate(form, { onSuccess: () => { setAdding(false); setPage(1); } });
    }
  };

  const columns: Column<ChronicDiseaseDto>[] = [
    {
      key: "nameEn",
      label: t("admin.nameEn"),
      render: (item) => (
        <span className={item.isActive ? "font-medium" : "font-medium opacity-50"}>
          {item.nameEn}
        </span>
      ),
    },
    {
      key: "nameAr",
      label: t("admin.nameAr"),
      render: (item) => (
        <span className={`text-muted ${item.isActive ? "" : "opacity-50"}`} dir="rtl">
          {item.nameAr}
        </span>
      ),
    },
    {
      key: "isActive",
      label: t("admin.status"),
      render: (item) => (
        <Chip size="sm" variant="soft" color={item.isActive ? "success" : "default"}>
          {item.isActive ? t("common.status.active") : t("common.status.inactive")}
        </Chip>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (item) => (
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
              <p>{item.isActive ? t("admin.deactivateOrDelete") : t("common.delete")}</p>
            </Tooltip.Content>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={t("navigation.adminChronicDiseases")}
        subtitle={data ? t("admin.chronicDiseases.subtitle", { count: data.totalCount }) : ""}
        action={
          <Button variant="primary" size="sm" onPress={() => setAdding(true)}>
            <Plus className="h-4 w-4" /> {t("common.add")}
          </Button>
        }
      />

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyMessage={t("admin.chronicDiseases.empty")}
        />

        <TablePagination
          data={data}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>

      {(adding || editing) && (
        <ReferenceFormDialog
          title={editing ? t("admin.chronicDiseases.editTitle") : t("admin.chronicDiseases.addTitle")}
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
        title={t("admin.chronicDiseases.deleteTitle")}
        message={t("admin.chronicDiseases.deleteMessage", { name: deleting?.nameEn ?? "" })}
        isLoading={remove.isPending}
      />
    </div>
  );
}
