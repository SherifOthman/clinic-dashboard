import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "./notificationsApi";

const KEYS = {
  unreadCount: ["notifications", "unread-count"] as const,
  list:        (page: number) => ["notifications", "list", page] as const,
};

/** Unread badge count — polled every 60s. */
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: KEYS.unreadCount,
    queryFn:  notificationsApi.getUnreadCount,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

/** Paginated notification list. */
export function useNotifications(page = 1) {
  return useQuery({
    queryKey: KEYS.list(page),
    queryFn:  () => notificationsApi.getAll(page),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}

/** Mark a single notification as read. */
export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/** Mark all notifications as read. */
export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
