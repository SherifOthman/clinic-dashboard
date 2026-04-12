import { formatFieldKey } from "../auditHelpers";

interface ChangeValue {
  Old: unknown;
  New: unknown;
}

interface JsonViewerProps {
  json: string;
  isRTL: boolean;
  action: string;
}

export function JsonViewer({ json, isRTL, action }: JsonViewerProps) {
  try {
    const parsed = JSON.parse(json) as Record<string, unknown>;
    const isSnapshot =
      action === "Create" || action === "Delete" || action === "Restore";
    const skipInSnapshot = new Set(["PatientCode", "Patient Code"]);

    return (
      <div className="flex flex-col gap-2">
        {Object.entries(parsed)
          .filter(([key]) => !(isSnapshot && skipInSnapshot.has(key)))
          .map(([key, value]) => {
            const isChange =
              !isSnapshot &&
              value !== null &&
              typeof value === "object" &&
              "Old" in (value as object);
            const change = value as ChangeValue;
            return (
              <div
                key={key}
                className={`border-divider rounded-lg border p-3 ${isRTL ? "text-right" : ""}`}
              >
                <p className="text-default-500 mb-2 text-xs font-medium tracking-wide uppercase">
                  {formatFieldKey(key)}
                </p>
                {isChange ? (
                  <div
                    className={`flex items-center gap-2 text-sm ${isRTL ? "justify-end" : ""}`}
                  >
                    {isRTL ? (
                      <>
                        <span className="bg-success/10 text-success min-w-0 shrink overflow-x-auto rounded px-2 py-0.5 font-mono text-xs">
                          {String(change.New ?? "—")}
                        </span>
                        <span
                          className="text-default-400 shrink-0 text-xs"
                          dir="ltr"
                        >
                          →
                        </span>
                        <span className="bg-danger/10 text-danger min-w-0 shrink overflow-x-auto rounded px-2 py-0.5 font-mono text-xs">
                          {String(change.Old ?? "—")}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="bg-danger/10 text-danger min-w-0 shrink overflow-x-auto rounded px-2 py-0.5 font-mono text-xs">
                          {String(change.Old ?? "—")}
                        </span>
                        <span className="text-default-400 shrink-0 text-xs">
                          →
                        </span>
                        <span className="bg-success/10 text-success min-w-0 shrink overflow-x-auto rounded px-2 py-0.5 font-mono text-xs">
                          {String(change.New ?? "—")}
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <p
                    className={`overflow-x-auto font-mono text-sm ${
                      action === "Create"
                        ? "text-success"
                        : action === "Delete"
                          ? "text-danger"
                          : ""
                    } ${isRTL ? "text-right" : ""}`}
                  >
                    {String(value ?? "—")}
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

