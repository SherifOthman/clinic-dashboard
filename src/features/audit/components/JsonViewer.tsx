import { formatAuditValue, formatFieldKey } from "../auditHelpers";

interface ChangeValue {
  Old: unknown;
  New: unknown;
}

interface JsonViewerProps {
  json: string;
  isRTL: boolean;
  action: string;
}

/** Fields that are internal IDs — not useful to show to humans */
const SKIP_FIELDS = new Set([
  "PatientCode",
  "Patient Code",
  "Id",
  "ClinicId",
  "UserId",
  "BranchId",
  "DoctorId",
  "SpecializationId",
  "VisitTypeId",
  "AppointmentId",
]);

export function JsonViewer({ json, isRTL, action }: JsonViewerProps) {
  try {
    const parsed = JSON.parse(json) as Record<string, unknown>;
    const isSnapshot =
      action === "Create" || action === "Delete" || action === "Restore";

    const entries = Object.entries(parsed).filter(([key]) => {
      // Always skip internal IDs in snapshots — they add noise
      if (isSnapshot && SKIP_FIELDS.has(key)) return false;
      return true;
    });

    if (entries.length === 0) {
      return (
        <p className="text-muted text-sm italic">No details available.</p>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        {entries.map(([key, value]) => {
          const isChange =
            !isSnapshot &&
            value !== null &&
            typeof value === "object" &&
            "Old" in (value as object);
          const change = value as ChangeValue;
          const fieldLabel = formatFieldKey(key);

          return (
            <div
              key={key}
              className={`border-divider rounded-lg border p-3 ${isRTL ? "text-right" : ""}`}
            >
              <p className="text-default-500 mb-2 text-xs font-medium tracking-wide uppercase">
                {fieldLabel}
              </p>

              {isChange ? (
                /* Update diff: Old → New */
                <div
                  className={`flex items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span className="bg-danger/10 text-danger min-w-0 shrink overflow-x-auto rounded px-2 py-0.5 text-xs">
                    {formatAuditValue(key, change.Old)}
                  </span>
                  <span className="text-default-400 shrink-0 text-xs">→</span>
                  <span className="bg-success/10 text-success min-w-0 shrink overflow-x-auto rounded px-2 py-0.5 text-xs">
                    {formatAuditValue(key, change.New)}
                  </span>
                </div>
              ) : (
                /* Snapshot: single value */
                <p
                  className={`text-sm ${
                    action === "Create"
                      ? "text-success"
                      : action === "Delete"
                        ? "text-danger"
                        : "text-foreground"
                  } ${isRTL ? "text-right" : ""}`}
                >
                  {formatAuditValue(key, value)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  } catch {
    return <pre className="text-xs">{json}</pre>;
  }
}
