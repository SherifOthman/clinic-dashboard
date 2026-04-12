import { useEffect, useState } from "react";

/**
 * Delays updating the returned value until `delay` ms have passed
 * since the last change to `value`.
 *
 * Typical use: debounce a search input before sending it to the API
 * so we don't fire a request on every keystroke.
 *
 * How it works:
 *   - Every time `value` changes, a new setTimeout is scheduled.
 *   - The cleanup function cancels the previous timer.
 *   - Only when the user stops typing for `delay` ms does `debounced` update.
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
