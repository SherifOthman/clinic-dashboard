import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "./notificationsApi";

const KEYS = {
  unreadCount: ["notifications", "unread-count"] as const,
  infinite:    ["notifications", "infinite"]     as const,
};

/** Unread badge count — polled every 60s. */
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: KEYS.unreadCount,
    queryFn:  notificationsApi.getUnreadCount,
    staleTime:       30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

/** Infinite notification list — accumulates pages as the user scrolls. */
export function useInfiniteNotifications() {
  return useInfiniteQuery({
    queryKey: KEYS.infinite,
    queryFn:  ({ pageParam = 1 }) => notificationsApi.getAll(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.pageNumber + 1 : undefined,
    staleTime: 30 * 1000,
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
