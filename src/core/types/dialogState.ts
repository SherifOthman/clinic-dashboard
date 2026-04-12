/**
 * Discriminated union for dialog/modal state in table pages.
 *
 * Why a discriminated union instead of separate booleans?
 * Because the three states are mutually exclusive and each carries
 * different data. TypeScript narrows the type automatically:
 *
 *   if (state.mode === "edit") {
 *     state.id  // ✅ TypeScript knows id exists here
 *   }
 *
 * Usage in a page component:
 *   const [dialog, setDialog] = useState<DialogState>({ mode: "closed" });
 *   setDialog({ mode: "create" });
 *   setDialog({ mode: "edit", id: "abc-123" });
 *   setDialog({ mode: "closed" });
 */
export type DialogState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; id: string };

/**
 * Delete confirmation state — carries id + display name.
 * The name is shown in the confirmation message so the user knows
 * exactly what they're about to delete.
 */
export type DeleteState =
  | { mode: "closed" }
  | { mode: "confirm"; id: string; name: string };
