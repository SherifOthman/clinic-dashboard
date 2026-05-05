import { apiClient } from "@/core/api";
import type { PagedResult } from "@/core/types";

export type NotificationType = "Info" | "Warning" | "Error" | "Success";

export interface NotificationDto {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationsApi = {
  getAll: (pageNumber = 1, pageSize = 20): Promise<PagedResult<NotificationDto>> =>
    apiClient.get(`/notifications?pageNumber=${pageNumber}&pageSize=${pageSize}`),

  getUnreadCount: (): Promise<number> =>
    apiClient.get("/notifications/unread-count"),

  markRead: (id: string): Promise<void> =>
    apiClient.patch(`/notifications/${id}/read`),

  markAllRead: (): Promise<void> =>
    apiClient.patch("/notifications/read-all"),
};
