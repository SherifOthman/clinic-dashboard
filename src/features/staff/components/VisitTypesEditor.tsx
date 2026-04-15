import {
  Button,
  Input,
  Label,
  NumberField,
  Switch,
  TextField,
} from "@heroui/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type {
  DoctorVisitTypeDto,
  UpsertDoctorVisitTypeRequest,
} from "../staffApi";
import {
  useRemoveVisitType,
  useUpsertVisitType,
  useVisitTypes,
} from "../staffHooks";

interface VisitTypesEditorProps {
  staffId: string;
  branchId: string;
  readOnly?: boolean;
}

interface FormState {
  id?: string;
  nameAr: string;
  nameEn: string;
  price: number;
  isActive: boolean;
}

const EMPTY: FormState = { nameAr: "", nameEn: "", price: 0, isActive: true };

export function VisitTypesEditor({
  staffId,
  branchId,
  readOnly = false,
}: VisitTypesEditorProps) {
  const { t } = useTranslation();
  const { data: visitTypes = [], isLoading } = useVisitTypes(staffId, branchId);
  const upsert = useUpsertVisitType(staffId);
  const remove = useRemoveVisitType(staffId);
  const [form, setForm] = useState<FormState | null>(null);

  const openAdd = () => setForm({ ...EMPTY });
  const openEdit = (vt: DoctorVisitTypeDto) =>
    setForm({
      id: vt.id,
      nameAr: vt.nameAr,
      nameEn: vt.nameEn,
      price: vt.price,
      isActive: vt.isActive,
    });
  const closeForm = () => setForm(null);

  const handleSave = async () => {
    if (!form) return;
    const req: UpsertDoctorVisitTypeRequest = {
      branchId,
      visitTypeId: form.id ?? null,
      nameAr: form.nameAr,
      nameEn: form.nameEn,
      price: form.price,
      isActive: form.isActive,
    };
    await upsert.mutateAsync(req);
    closeForm();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-default-100 h-12 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Existing visit types */}
      {visitTypes.map((vt) => (
        <div
          key={vt.id}
          className={`border-divider flex items-center gap-3 rounded-lg border px-3 py-2.5 ${!vt.isActive ? "opacity-50" : ""}`}
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-tight font-medium">{vt.nameAr}</p>
            <p className="text-default-400 text-xs">{vt.nameEn}</p>
          </div>
          <span
            className="text-accent shrink-0 text-sm font-semibold tabular-nums"
            dir="ltr"
          >
            {vt.price.toLocaleString()}
          </span>
          {!readOnly && (
            <div className="flex shrink-0 gap-0.5">
              <Button
                size="sm"
                variant="ghost"
                isIconOnly
                aria-label={t("common.edit")}
                onPress={() => openEdit(vt)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                color="danger"
                isIconOnly
                aria-label={t("common.delete")}
                isDisabled={remove.isPending}
                onPress={() => remove.mutate(vt.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      ))}

      {visitTypes.length === 0 && !form && (
        <p className="text-default-400 text-sm">{t("staff.noVisitTypes")}</p>
      )}

      {/* Inline add/edit form */}
      {form && (
        <div className="border-accent-soft-hover bg-accent/5 mt-1 flex flex-col gap-3 rounded-lg border p-3">
          <div className="grid grid-cols-2 gap-2">
            <TextField
              value={form.nameAr}
              onChange={(v) => setForm((f) => f && { ...f, nameAr: v })}
            >
              <Label className="text-xs">{t("staff.visitTypeNameAr")}</Label>
              <Input placeholder="كشف" dir="rtl" variant="secondary" />
            </TextField>
            <TextField
              value={form.nameEn}
              onChange={(v) => setForm((f) => f && { ...f, nameEn: v })}
            >
              <Label className="text-xs">{t("staff.visitTypeNameEn")}</Label>
              <Input placeholder="Consultation" dir="ltr" variant="secondary" />
            </TextField>
          </div>

          <div className="flex items-end gap-3">
            <NumberField
              value={form.price}
              onChange={(v) => setForm((f) => f && { ...f, price: v ?? 0 })}
              minValue={0}
              className="flex-1"
              variant="secondary"
            >
              <Label className="text-xs">{t("staff.visitTypePrice")}</Label>
              <NumberField.Group>
                <NumberField.DecrementButton />
                <NumberField.Input />
                <NumberField.IncrementButton />
              </NumberField.Group>
            </NumberField>

            <Switch
              isSelected={form.isActive}
              onChange={(v) => setForm((f) => f && { ...f, isActive: v })}
              size="sm"
              className="mb-0.5"
              aria-label={t("common.status.active")}
            >
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Content>
                <Label className="text-xs">{t("common.status.active")}</Label>
              </Switch.Content>
            </Switch>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onPress={closeForm}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="primary"
              size="sm"
              isPending={upsert.isPending}
              isDisabled={
                !form.nameAr.trim() || !form.nameEn.trim() || upsert.isPending
              }
              onPress={handleSave}
            >
              {t("forms.save")}
            </Button>
          </div>
        </div>
      )}

      {/* Add button */}
      {!readOnly && !form && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 self-start"
          onPress={openAdd}
        >
          <Plus className="h-3.5 w-3.5" />
          {t("staff.addVisitType")}
        </Button>
      )}
    </div>
  );
}
