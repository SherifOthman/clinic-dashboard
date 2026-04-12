import type { TFunction } from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

/**
 * Generic hook for Zod schema factories that need the current `t()` function.
 *
 * The problem it solves:
 *   Zod schemas need translated error messages, but `t()` is only available
 *   inside React components/hooks. Calling `createPatientSchema(t)` directly
 *   in a component would recreate the schema on every render.
 *
 * This hook memoizes the result and only recreates the schema when the
 * language changes (which is the only time translations actually change).
 *
 * Usage:
 *   // Single schema:
 *   const schema = useValidation(createPatientSchema);
 *
 *   // Multiple schemas from one factory:
 *   const schemas = useValidation(createAuthSchemas);
 *   const loginSchema = schemas.login;
 */
export function useValidation<T>(factory: (t: TFunction) => T): T {
  const { t, i18n } = useTranslation();
  // i18n.language in the deps ensures the schema rebuilds when language switches
  return useMemo(() => factory(t), [t, i18n.language]);
}
