import { useState } from "react";
import type { DeleteState, DialogState } from "@/core/types";

/**
 * Manages the open/closed/edit state of a create-edit dialog.
 * Replaces the repeated useState<DialogState> pattern in every page.
 *
 * Usage:
 *   const dialog = useDialogState();
 *   dialog.openCreate()
 *   dialog.openEdit("abc-123")
 *   dialog.close()
 *   <MyDialog state={dialog.state} onClose={dialog.close} />
 */
export function useDialogState() {
  const [state, setState] = useState<DialogState>({ mode: "closed" });

  return {
    state,
    openCreate: () => setState({ mode: "create" }),
    openEdit: (id: string) => setState({ mode: "edit", id }),
    close: () => setState({ mode: "closed" }),
  };
}

/**
 * Manages the open/closed state of a delete confirmation dialog.
 * Replaces the repeated useState<DeleteState> pattern in every page.
 *
 * Usage:
 *   const deleteDialog = useDeleteDialogState();
 *   deleteDialog.open("abc-123", "John Doe")
 *   deleteDialog.close()
 *   <ConfirmDialog isOpen={deleteDialog.state.mode === "confirm"} ... />
 */
export function useDeleteDialogState() {
  const [state, setState] = useState<DeleteState>({ mode: "closed" });

  return {
    state,
    open: (id: string, name: string) => setState({ mode: "confirm", id, name }),
    close: () => setState({ mode: "closed" }),
  };
}
