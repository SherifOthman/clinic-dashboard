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

export async function getNotifications(pageNumber = 1, pageSize = 10): Promise<PagedResult<NotificationDto>> {
  const res = await apiClient.get<PagedResult<NotificationDto>>(`/notifications?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  return res.data;
}

export async function getUnreadNotificationsCount(): Promise<number> {
  const res = await apiClient.get<number>("/notifications/unread-count");
  return res.data;
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.patch("/notifications/read-all");
}
