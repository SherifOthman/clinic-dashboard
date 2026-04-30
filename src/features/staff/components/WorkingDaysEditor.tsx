import { Button, Chip, Label, Modal, Switch, TimeField } from "@heroui/react";
import { Time, parseTime } from "@internationalized/date";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { WorkingDayInput } from "../staffApi";
import { useSaveWorkingDays } from "../staffHooks";

const DEFAULT_START = "09:00";
const DEFAULT_END = "17:00";
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6] as const;

/** Returns days reordered so `startDay` comes first */
function reorderDays(startDay: number): number[] {
  const days = [0, 1, 2, 3, 4, 5, 6];
  return [...days.slice(startDay), ...days.slice(0, startDay)];
}

function dayLabel(day: number, locale: string) {
  const date = new Date(2024, 0, 7 + day);
  return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date);
}

function timeToString(t: Time): string {
  return `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}`;
}

interface WorkingDaysEditorProps {
  staffId: string;
  branchId: string;
  initialData: {
    day: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];
  /** When true, renders inline (no modal shell). When false/undefined, renders inside a Modal. */
  inline?: boolean;
  readOnly?: boolean;
  onClose?: () => void;
}

export function WorkingDaysEditor({
  staffId,
  branchId,
  initialData,
  inline = false,
  readOnly = false,
  onClose,
}: WorkingDaysEditorProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "ar" ? "ar-EG" : "en-GB";
  const save = useSaveWorkingDays(staffId, branchId);

  // Default start day: Saturday (6). User can change it.
  const [weekStartDay, setWeekStartDay] = useState<number>(6);
  const orderedDays = reorderDays(weekStartDay);

  const buildSchedule = (): WorkingDayInput[] =>
    ALL_DAYS.map((d) => {
      const existing = initialData.find((x) => x.day === d);
      return existing
        ? {
            day: d,
            startTime: existing.startTime,
            endTime: existing.endTime,
            isAvailable: existing.isAvailable,
          }
        : {
            day: d,
            startTime: DEFAULT_START,
            endTime: DEFAULT_END,
            isAvailable: false,
          };
    });

  const [schedule, setSchedule] = useState<WorkingDayInput[]>(buildSchedule);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setSchedule(buildSchedule());
    setDirty(false);
  }, [initialData]);

  const toggle = (day: number, val: boolean) => {
    setSchedule((prev) =>
      prev.map((s) => (s.day === day ? { ...s, isAvailable: val } : s)),
    );
    setDirty(true);
  };

  const setTime = (
    day: number,
    field: "startTime" | "endTime",
    time: Time | null,
  ) => {
    if (!time) return;
    setSchedule((prev) =>
      prev.map((s) =>
        s.day === day ? { ...s, [field]: timeToString(time) } : s,
      ),
    );
    setDirty(true);
  };

  const handleSave = async () => {
    await save.mutateAsync(schedule);
    setDirty(false);
    onClose?.();
  };

  const body = (
    <div className="flex flex-col gap-1.5">
      {/* Week start day selector */}
      {!readOnly && (
        <div className="mb-2 flex items-center justify-end gap-2">
          <span className="text-default-500 text-xs">{t("staff.weekStartDay")}:</span>
          <div className="flex gap-1">
            {ALL_DAYS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setWeekStartDay(d)}
                className={`rounded px-2 py-0.5 text-xs font-medium transition-all ${
                  weekStartDay === d
                    ? "bg-accent text-white"
                    : "bg-default-100 text-default-500 hover:bg-default-200"
                }`}
              >
                {new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
                  new Date(2024, 0, 7 + d),
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      {orderedDays.map((dayNum) => {
        const s = schedule.find((x) => x.day === dayNum)!;
        return (
        <div
          key={s.day}
          className={`flex flex-col gap-1.5 rounded-lg px-3 py-2 transition-colors ${
            s.isAvailable ? "bg-accent/5" : "bg-default-50"
          }`}
        >
          <div className="flex items-center gap-2">
            <Switch
              isSelected={s.isAvailable}
              onChange={(val) => toggle(s.day, val)}
              size="sm"
              isDisabled={readOnly}
              aria-label={dayLabel(s.day, locale)}
            >
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Content>
                <Label
                  className={`text-sm font-medium ${s.isAvailable ? "" : "text-default-400"}`}
                >
                  {dayLabel(s.day, locale)}
                </Label>
              </Switch.Content>
            </Switch>
            {!s.isAvailable && (
              <Chip
                size="sm"
                variant="soft"
                color="default"
                className="text-default-400 ms-auto"
              >
                {t("staff.dayOff")}
              </Chip>
            )}
          </div>

          {s.isAvailable && (
            <div className="flex items-center gap-2 ps-8" dir="ltr">
              <TimeField
                value={parseTime(s.startTime)}
                onChange={(time) => setTime(s.day, "startTime", time)}
                aria-label={`${dayLabel(s.day, locale)} start`}
                granularity="minute"
                hourCycle={12}
                isDisabled={readOnly}
              >
                <TimeField.Group>
                  <TimeField.Input>
                    {(seg) => <TimeField.Segment segment={seg} />}
                  </TimeField.Input>
                </TimeField.Group>
              </TimeField>
              <span className="text-default-400 text-sm">—</span>
              <TimeField
                value={parseTime(s.endTime)}
                onChange={(time) => setTime(s.day, "endTime", time)}
                aria-label={`${dayLabel(s.day, locale)} end`}
                granularity="minute"
                hourCycle={12}
                isDisabled={readOnly}
              >
                <TimeField.Group>
                  <TimeField.Input>
                    {(seg) => <TimeField.Segment segment={seg} />}
                  </TimeField.Input>
                </TimeField.Group>
              </TimeField>
            </div>
          )}
        </div>
        );
      })}

      {!readOnly && inline && (
        <div className="mt-2 flex justify-end">
          <Button
            variant="primary"
            size="sm"
            isPending={save.isPending}
            isDisabled={save.isPending || !dirty}
            onPress={handleSave}
          >
            {t("forms.saveChanges")}
          </Button>
        </div>
      )}
    </div>
  );

  // Inline mode: just render the body directly
  if (inline) return body;

  // Modal mode: wrap in modal shell
  return (
    <>
      <Modal.CloseTrigger />
      <Modal.Header>
        <Modal.Heading>{t("staff.editWorkingDays")}</Modal.Heading>
      </Modal.Header>
      <Modal.Body className="flex flex-col gap-2">{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" slot="close">
          {t("common.cancel")}
        </Button>
        <Button
          variant="primary"
          isPending={save.isPending}
          isDisabled={save.isPending}
          onPress={handleSave}
        >
          {t("forms.saveChanges")}
        </Button>
      </Modal.Footer>
    </>
  );
}
