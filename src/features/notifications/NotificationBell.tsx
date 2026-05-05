import { Popover, Button } from "@heroui/react";
import { Bell, CheckCheck, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import {
  useUnreadNotificationCount,
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "./notificationsHooks";
import type { NotificationDto } from "./notificationsApi";

// ── Type → colour mapping ─────────────────────────────────────────────────────

const TYPE_STYLES: Record<NotificationDto["type"], { dot: string; bg: string }> = {
  Error:   { dot: "bg-danger",  bg: "bg-danger/10"  },
  Warning: { dot: "bg-warning", bg: "bg-warning/10" },
  Success: { dot: "bg-success", bg: "bg-success/10" },
  Info:    { dot: "bg-accent",  bg: "bg-accent/10"  },
};

// ── Main component ────────────────────────────────────────────────────────────

export function NotificationBell() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [page, setPage]  = useState(1);

  const { data: unreadCount = 0 }  = useUnreadNotificationCount();
  const { data, isLoading }        = useNotifications(page);
  const markRead                   = useMarkNotificationRead();
  const markAll                    = useMarkAllNotificationsRead();

  const notifications = data?.items ?? [];
  const hasMore       = data ? page < data.totalPages : false;

  function handleOpen(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen) setPage(1); // reset to first page on open
  }

  return (
    <Popover isOpen={open} onOpenChange={handleOpen} placement="bottom end">
      <Popover.Trigger>
        {/* Bell button with unread badge */}
        <Button isIconOnly variant="ghost" aria-label={t("notifications.title")}>
          <div className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
        </Button>
      </Popover.Trigger>

      <Popover.Content className="w-80 p-0 shadow-lg">
        <NotificationPanel
          notifications={notifications}
          isLoading={isLoading}
          unreadCount={unreadCount}
          hasMore={hasMore}
          onMarkRead={(id) => markRead.mutate(id)}
          onMarkAll={() => markAll.mutate()}
          onLoadMore={() => setPage((p) => p + 1)}
          onClose={() => setOpen(false)}
        />
      </Popover.Content>
    </Popover>
  );
}

// ── Panel ─────────────────────────────────────────────────────────────────────

interface NotificationPanelProps {
  notifications: NotificationDto[];
  isLoading:     boolean;
  unreadCount:   number;
  hasMore:       boolean;
  onMarkRead:    (id: string) => void;
  onMarkAll:     () => void;
  onLoadMore:    () => void;
  onClose:       () => void;
}

function NotificationPanel({
  notifications, isLoading, unreadCount,
  hasMore, onMarkRead, onMarkAll, onLoadMore, onClose,
}: NotificationPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{t("notifications.title")}</h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-danger/10 px-1.5 py-0.5 text-xs font-medium text-danger">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAll}
            className="flex items-center gap-1 text-xs text-accent hover:underline"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            {t("notifications.markAllRead")}
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading && notifications.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-sm text-muted">
            {t("common.loading")}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center text-muted">
            <Bell className="h-8 w-8 opacity-30" />
            <p className="text-sm">{t("notifications.empty")}</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onMarkRead={onMarkRead}
                onClose={onClose}
              />
            ))}
          </div>
        )}

        {hasMore && (
          <button
            type="button"
            onClick={onLoadMore}
            className="w-full py-2.5 text-center text-xs text-accent hover:bg-surface-secondary transition-colors"
          >
            {t("notifications.loadMore")}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Single notification row ───────────────────────────────────────────────────

function NotificationItem({
  notification: n,
  onMarkRead,
  onClose,
}: {
  notification: NotificationDto;
  onMarkRead:   (id: string) => void;
  onClose:      () => void;
}) {
  const { formatDateShort } = useDateFormat();
  const navigate = useNavigate();
  const styles   = TYPE_STYLES[n.type] ?? TYPE_STYLES.Info;

  function handleClick() {
    if (!n.isRead) onMarkRead(n.id);
    if (n.actionUrl) {
      navigate(n.actionUrl);
      onClose();
    }
  }

  return (
    <div
      className={`flex gap-3 px-4 py-3 transition-colors ${
        n.isRead ? "opacity-60" : "bg-surface-secondary/40"
      } hover:bg-surface-secondary cursor-pointer`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {/* Colour dot */}
      <div className="mt-1.5 shrink-0">
        <span className={`block h-2 w-2 rounded-full ${styles.dot}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug ${n.isRead ? "" : "text-foreground"}`}>
          {n.title}
        </p>
        <p className="mt-0.5 text-xs text-muted line-clamp-2">{n.message}</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-xs text-muted">{formatDateShort(n.createdAt)}</span>
          {n.actionUrl && (
            <ExternalLink className="h-3 w-3 shrink-0 text-accent" />
          )}
        </div>
      </div>
    </div>
  );
}
