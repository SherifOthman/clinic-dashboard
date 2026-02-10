import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

/**
 * Hook to access auth context
 * Provides authentication state and methods
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
