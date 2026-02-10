import {
  DEFAULT_VALIDATION_CONSTANTS,
  fetchValidationConstants,
  ValidationConstants,
} from "@/core/constants/validation";
import { useEffect, useState } from "react";

/**
 * Hook to fetch and cache validation constants from the API
 */
export function useValidationConstants() {
  const [constants, setConstants] = useState<ValidationConstants>(
    DEFAULT_VALIDATION_CONSTANTS,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConstants = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedConstants = await fetchValidationConstants();
        setConstants(fetchedConstants);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load validation constants",
        );
        // Keep using default constants on error
        setConstants(DEFAULT_VALIDATION_CONSTANTS);
      } finally {
        setIsLoading(false);
      }
    };

    loadConstants();
  }, []);

  return {
    constants,
    isLoading,
    error,
  };
}
