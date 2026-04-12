import { Button, Modal } from "@heroui/react";
import { Edit } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useWorkingDays } from "../staffHooks";
import { WorkingDaysEditor } from "./WorkingDaysEditor";

function formatTime12h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function dayLabel(day: number, locale: string) {
  const date = new Date(2024, 0, 7 + day);
  return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);
}

export function WorkingDaysDisplay({
  staffId,
  branchId,
}: {
  staffId: string;
  branchId: string;
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "ar" ? "ar-EG" : "en-GB";
  const { data, isLoading } = useWorkingDays(staffId, branchId);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const activeDays = data?.filter((d) => d.isAvailable) ?? [];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{t("staff.workingDays")}</h3>
        <Button size="sm" variant="ghost" onPress={() => setIsEditOpen(true)}>
          <Edit className="h-3.5 w-3.5" />
          {t("common.edit")}
        </Button>
      </div>

      {isLoading ? (
        <div className="bg-default-100 h-8 animate-pulse rounded-lg" />
      ) : activeDays.length === 0 ? (
        <p className="text-default-400 text-sm">{t("staff.noWorkingDays")}</p>
      ) : (
        <div className="flex flex-col gap-1">
          {activeDays.map((d) => (
            <div
              key={d.day}
              className="flex items-center justify-between text-sm"
            >
              <span className="font-medium">{dayLabel(d.day, locale)}</span>
              <span className="text-default-500 text-xs" dir="ltr">
                {formatTime12h(d.startTime)} — {formatTime12h(d.endTime)}
              </span>
            </div>
          ))}
        </div>
      )}

      <Modal.Backdrop isOpen={isEditOpen} onOpenChange={setIsEditOpen}>
        <Modal.Container size="sm">
          <Modal.Dialog>
            {({ close }) => (
              <WorkingDaysEditor
                staffId={staffId}
                branchId={branchId}
                initialData={data ?? []}
                onClose={close}
              />
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </div>
  );
}
