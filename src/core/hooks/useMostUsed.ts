import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

/**
 * Generic most-used tracker backed by useLocalStorage.
 *
 * useLocalStorage already provides reactive state — when increment()
 * is called the stored value updates and React re-renders, so any
 * useMemo that depends on the return value of getMostUsed will
 * recompute automatically. No manual revision counter needed.
 *
 * Usage:
 *   const { getMostUsed, increment } = useMostUsed("patient_state_usage");
 *   const top = useMemo(() => getMostUsed(items, (i) => i.key, 6), [items, getMostUsed]);
 */
export function useMostUsed(storageKey: string) {
  const [counts, setCounts] = useLocalStorage<Record<string, number>>(
    storageKey,
    {},
  );

  const increment = useCallback(
    (key: string) => {
      setCounts((prev) => ({ ...prev, key: (prev[key] ?? 0) + 1 }));
    },
    [setCounts],
  );

  const getMostUsed = useCallback(
    <T>(items: T[], keyOf: (item: T) => string, limit = 6): T[] =>
      items
        .filter((item) => (counts[keyOf(item)] ?? 0) > 0)
        .sort((a, b) => (counts[keyOf(b)] ?? 0) - (counts[keyOf(a)] ?? 0))
        .slice(0, limit),
    [counts],
  );

  return { getMostUsed, increment };
}
