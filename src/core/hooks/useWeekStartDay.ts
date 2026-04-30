import { useMe } from "@/features/auth/hooks";

/**
 * Returns the clinic's configured week start day (0 = Sunday … 6 = Saturday).
 * Falls back to 6 (Saturday) if not set — common in Middle-East clinics.
 */
export function useWeekStartDay(): number {
  const { user } = useMe();
  return user?.weekStartDay ?? 6;
}
