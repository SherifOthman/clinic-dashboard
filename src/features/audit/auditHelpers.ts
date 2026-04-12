import type { DateValue } from "@internationalized/date";
import { parseDate } from "@internationalized/date";
import { AUTH_EVENT_LABELS, FIELD_LABELS } from "./auditConstants";
import type { AuditLogItem } from "./types";

export function parseDateSafe(str: string | null): DateValue | null {
  if (!str) return null;
  try {
    return parseDate(str.split("T")[0]);
  } catch {
    return null;
  }
}

export function formatFieldKey(key: string): string {
  if (key.includes(" ")) return key;
  return FIELD_LABELS[key] ?? key.replace(/([A-Z])/g, " $1").trim();
}

/** Extract the most meaningful identifier from the changes JSON snapshot */
export function extractSubject(item: AuditLogItem): string | null {
  if (!item.changes) return null;
  try {
    const parsed = JSON.parse(item.changes);
    if (item.entityType === "Auth")
      return parsed.event
        ? (AUTH_EVENT_LABELS[parsed.event] ?? parsed.event)
        : null;
    const name =
      parsed["Full Name"] ?? parsed.FullName ?? parsed.Name ?? parsed.name;
    if (name && typeof name === "string") return name;
    const nameChange = parsed["Full Name"] ?? parsed.FullName;
    if (nameChange && typeof nameChange === "object" && "New" in nameChange)
      return nameChange.New;
    const email = parsed.Email ?? parsed.email ?? parsed.UserEmail;
    if (email && typeof email === "string") return email;
    return null;
  } catch {
    return null;
  }
}

/** Parse user agent string into readable browser + OS */
export function parseUserAgent(ua: string): string {
  if (!ua) return "—";
  const browser = ua.includes("Edg/")
    ? "Edge"
    : ua.includes("Chrome/")
      ? "Chrome"
      : ua.includes("Firefox/")
        ? "Firefox"
        : ua.includes("Safari/") && !ua.includes("Chrome")
          ? "Safari"
          : ua.includes("OPR/") || ua.includes("Opera")
            ? "Opera"
            : "Browser";
  const os = ua.includes("Windows NT")
    ? "Windows"
    : ua.includes("Mac OS X")
      ? "macOS"
      : ua.includes("Android")
        ? "Android"
        : ua.includes("iPhone") || ua.includes("iPad")
          ? "iOS"
          : ua.includes("Linux")
            ? "Linux"
            : "";
  return os ? `${browser} · ${os}` : browser;
}
