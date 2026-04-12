/**
 * Profile React Query hooks.
 *
 * Profile data is fetched via the auth "me" endpoint and cached under the
 * ["auth", "me"] query key. Rather than duplicating that logic, we re-export
 * the relevant hooks from the auth feature so profile components have a
 * single, feature-local import path.
 */
export {
  useDeleteProfileImage,
  useMe,
  useUpdateProfile,
  useUpdateProfileImage,
} from "@/features/auth/hooks";
