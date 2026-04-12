import { useState } from "react";

type SetValue<T> = T | ((val: T) => T);

/**
 * useState that persists its value in localStorage.
 *
 * - Reads the initial value from localStorage on mount (falls back to `initialValue`).
 * - Every write syncs to localStorage automatically.
 * - Supports functional updates: setValue(prev => prev + 1).
 * - Silent fail on errors (localStorage may be disabled or full in some browsers).
 *
 * Note: this does NOT sync across browser tabs. If you need cross-tab sync,
 * you'd need to listen to the "storage" window event.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: SetValue<T>) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: SetValue<T>) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch {
      // Silent fail — localStorage might be disabled or full
    }
  };

  return [storedValue, setValue];
}
