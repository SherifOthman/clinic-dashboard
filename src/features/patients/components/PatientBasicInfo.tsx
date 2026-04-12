import { FormInputField } from "@/core/components/form/FormInputField";
import { translateError } from "@/core/utils/formUtils";
import {
  Calendar,
  DateField,
  DatePicker,
  FieldError,
  Label,
  ListBox,
  NumberField,
  Radio,
  RadioGroup,
  Select,
} from "@heroui/react";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { I18nProvider } from "react-aria-components";
import { type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  calculateAge,
  calculateDetailedAge,
  formatDetailedAge,
} from "../../../core/utils/ageUtils";
import type { PatientFormData } from "../schemas";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

// Safely parse an ISO date string into a HeroUI CalendarDate
function parseDateSafe(iso: string) {
  try {
    return parseDate(iso.split("T")[0]);
  } catch {
    return null;
  }
}

interface PatientBasicInfoProps {
  form: UseFormReturn<PatientFormData>;
}

export function PatientBasicInfo({ form }: PatientBasicInfoProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const {
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = form;

  const dateOfBirth = watch("dateOfBirth");
  const age = watch("age");
  const gender = watch("gender");
  const bloodType = watch("bloodType" as any);

  const datePickerValue = dateOfBirth ? parseDateSafe(dateOfBirth) : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Full Name */}
      <FormInputField
        name="fullName"
        control={form.control}
        label={t("patients.fullName")}
        isRequired
        noNumbers
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Date of Birth - HeroUI DatePicker */}
        <div className="flex flex-col gap-1">
          <I18nProvider locale={isAr ? "ar-EG" : "en-GB"}>
            <DatePicker
              className="w-full"
              isInvalid={!!errors.dateOfBirth}
              shouldForceLeadingZeros
              maxValue={today(getLocalTimeZone())}
              value={datePickerValue}
              onChange={(val) => {
                if (val) {
                  const iso = val.toString();
                  setValue("dateOfBirth", iso);
                  setValue("age", calculateAge(iso));
                  clearErrors("dateOfBirth");
                } else {
                  setValue("dateOfBirth", "");
                }
              }}
            >
              <Label>{t("patients.dateOfBirth")}</Label>
              <DateField.Group fullWidth>
                <DateField.Input>
                  {(segment) => <DateField.Segment segment={segment} />}
                </DateField.Input>
                <DateField.Suffix>
                  <DatePicker.Trigger>
                    <DatePicker.TriggerIndicator />
                  </DatePicker.Trigger>
                </DateField.Suffix>
              </DateField.Group>
              {errors.dateOfBirth && (
                <FieldError>
                  {translateError(errors.dateOfBirth?.message, t)}
                </FieldError>
              )}
              <DatePicker.Popover className="min-w-[320px]">
                <Calendar
                  aria-label={t("patients.dateOfBirth")}
                  maxValue={today(getLocalTimeZone())}
                >
                  <Calendar.Header>
                    <Calendar.YearPickerTrigger>
                      <Calendar.YearPickerTriggerHeading />
                      <Calendar.YearPickerTriggerIndicator
                        className={isAr ? "rotate-180" : ""}
                      />
                    </Calendar.YearPickerTrigger>
                    {/* In RTL swap order so arrows point correctly */}
                    {isAr ? (
                      <>
                        <Calendar.NavButton slot="next" />
                        <Calendar.NavButton slot="previous" />
                      </>
                    ) : (
                      <>
                        <Calendar.NavButton slot="previous" />
                        <Calendar.NavButton slot="next" />
                      </>
                    )}
                  </Calendar.Header>
                  <Calendar.Grid>
                    <Calendar.GridHeader>
                      {(day) => (
                        <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                      )}
                    </Calendar.GridHeader>
                    <Calendar.GridBody>
                      {(date) => <Calendar.Cell date={date} />}
                    </Calendar.GridBody>
                  </Calendar.Grid>
                  <Calendar.YearPickerGrid>
                    <Calendar.YearPickerGridBody>
                      {({ year }) => <Calendar.YearPickerCell year={year} />}
                    </Calendar.YearPickerGridBody>
                  </Calendar.YearPickerGrid>
                </Calendar>
              </DatePicker.Popover>
            </DatePicker>
          </I18nProvider>

          {dateOfBirth && (
            <p className="text-default-500 text-xs">
              {formatDetailedAge(calculateDetailedAge(dateOfBirth), isAr)}
            </p>
          )}
        </div>

        {/* Age - HeroUI NumberField */}
        <NumberField
          isInvalid={!!errors.age}
          value={age ?? undefined}
          minValue={0}
          maxValue={150}
          onChange={(val) => {
            setValue("age", isNaN(val) ? undefined : val);
            if (val > 0 && !isNaN(val)) {
              // Estimate DOB as Jan 1 of the birth year
              const year = new Date().getFullYear() - val;
              setValue("dateOfBirth", `${year}-01-01`);
              clearErrors("dateOfBirth");
            }
          }}
        >
          <Label>{t("patients.age")}</Label>
          <NumberField.Group>
            <NumberField.DecrementButton />
            <NumberField.Input placeholder={t("patients.enterAge")} />
            <NumberField.IncrementButton />
          </NumberField.Group>
          {errors.age && (
            <FieldError>{translateError(errors.age?.message, t)}</FieldError>
          )}
        </NumberField>
      </div>

      {/* Gender + Blood Type */}
      <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <RadioGroup
            value={gender || ""}
            onChange={(value) => setValue("gender", value as "Male" | "Female")}
            orientation="horizontal"
            aria-label={t("common.fields.gender")}
          >
            <Label>{t("common.fields.gender")}</Label>
            <Radio value="Male">
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              <Radio.Content>
                <Label>{t("common.fields.male")}</Label>
              </Radio.Content>
            </Radio>
            <Radio value="Female">
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              <Radio.Content>
                <Label>{t("common.fields.female")}</Label>
              </Radio.Content>
            </Radio>
          </RadioGroup>
          {errors.gender && (
            <p className="text-danger text-sm">
              {translateError(errors.gender?.message, t)}
            </p>
          )}
        </div>

        {/* Blood Type */}
        <Select
          placeholder={t("patients.selectBloodType")}
          value={bloodType || null}
          onChange={(v) => setValue("bloodType" as any, v ? String(v) : "")}
          aria-label={t("patients.bloodType")}
        >
          <Label>{t("patients.bloodType")}</Label>
          <Select.Trigger>
            <Select.Value className={isAr ? "text-right" : "text-left"} />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox dir={isAr ? "rtl" : "ltr"}>
              {BLOOD_TYPES.map((bt) => (
                <ListBox.Item key={bt} id={bt} textValue={bt}>
                  {bt}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>
    </div>
  );
}
