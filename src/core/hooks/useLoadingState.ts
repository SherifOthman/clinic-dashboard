import { logger } from "@/core/services/logger";
import { useState } from "react";

export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);

  const withLoading = async <T>(asyncFn: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    logger.debug("Loading state started", {}, "LoadingState");

    try {
      const result = await asyncFn();
      logger.debug("Loading state completed successfully", {}, "LoadingState");
      return result;
    } catch (error) {
      logger.error("Loading state failed", { error }, "LoadingState");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    setIsLoading,
    withLoading,
  };
}
