import { PageHeader } from "@/core/components/ui/PageHeader";
import { TablePagination } from "@/core/components/ui/TablePagination";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import { Mail, Phone, Building2, Clock, Circle } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useContactMessages, useContactMessagesUnreadCount } from "./dashboardHooks";
import { dashboardApi } from "./dashboardApi";
import type { ContactMessageDto } from "./dashboardApi";
import type { PagedResult } from "@/core/types";

export default function MessagesPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useContactMessages(page);
  const { data: unreadCount = 0 } = useContactMessagesUnreadCount();
  const messages = data?.items ?? [];
  const [selected, setSelected] = useState<ContactMessageDto | null>(null);
  const qc = useQueryClient();

  const handlePageChange = (p: number) => {
    setPage(p);
    setSelected(null);
  };

  const handleSelect = (msg: ContactMessageDto) => {
    setSelected({ ...msg, isRead: true }); // show as read immediately in detail panel

    if (!msg.isRead) {
      // Optimistically update the list cache so the dot disappears
      qc.setQueryData<PagedResult<ContactMessageDto>>(
        ["contact", "messages", page],
        (old) => old
          ? { ...old, items: old.items.map((m) => m.id === msg.id ? { ...m, isRead: true } : m) }
          : old,
      );

      // Fire backend call — no await, failure is silent (cosmetic feature)
      dashboardApi.markContactMessageRead(msg.id).then(() => {
        qc.invalidateQueries({ queryKey: ["contact", "unread-count"] });
      }).catch(() => {
        // Revert optimistic update on failure
        qc.setQueryData<PagedResult<ContactMessageDto>>(
          ["contact", "messages", page],
          (old) => old
            ? { ...old, items: old.items.map((m) => m.id === msg.id ? { ...m, isRead: false } : m) }
            : old,
        );
      });
    }
  };

  // Auto-select first message when messages load for the first time on this page
  useEffect(() => {
    if (!selected && messages.length > 0 && !isLoading) {
      handleSelect(messages[0]);
    }
    // Only run when messages array changes (page load / page change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const unreadInPage = messages.filter((m) => !m.isRead).length;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={t("navigation.messages")}
        subtitle={
          data
            ? `${data.totalCount} ${t("dashboard.messages.total")}${unreadCount > 0 ? ` · ${unreadCount} ${t("dashboard.messages.unread")}` : ""}`
            : ""
        }
      />

      {isLoading ? null : messages.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center text-muted">
          <Mail className="h-12 w-12 opacity-30" />
          <p>{t("dashboard.messages.empty")}</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]" style={{ minHeight: 500 }}>
          {/* List panel */}
          <div className="flex flex-col rounded-xl border border-border bg-surface">
            {/* Unread banner inside the list */}
            {unreadInPage > 0 && (
              <div className="flex items-center gap-2 border-b border-border px-3 py-2 bg-warning/5">
                <Circle className="h-2 w-2 fill-warning text-warning" />
                <span className="text-xs font-medium text-warning">
                  {unreadInPage} {t("dashboard.messages.unreadOnPage")}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-1 overflow-y-auto p-2 flex-1">
              {messages.map((msg) => (
                <MessageListItem
                  key={msg.id}
                  msg={msg}
                  isSelected={selected?.id === msg.id}
                  onClick={() => handleSelect(msg)}
                />
              ))}
            </div>

            {data && data.totalPages > 1 && (
              <div className="border-t border-border px-3">
                <TablePagination
                  data={data}
                  currentPage={page}
                  onPageChange={handlePageChange}
                  showTotal={false}
                />
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && <MessageDetail msg={selected} />}
        </div>
      )}
    </div>
  );
}

// ── List item ─────────────────────────────────────────────────────────────────

function MessageListItem({
  msg,
  isSelected,
  onClick,
}: {
  msg: ContactMessageDto;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { formatDateShort } = useDateFormat();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 rounded-lg px-3 py-3 text-start transition-colors ${
        isSelected
          ? "bg-accent/10 border border-accent/20"
          : "hover:bg-surface-secondary border border-transparent"
      }`}
    >
      {/* Avatar with unread dot */}
      <div className="relative shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
          {msg.firstName[0]}{msg.lastName[0]}
        </div>
        {/* Unread indicator dot */}
        {!msg.isRead && (
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-warning border-2 border-surface" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm truncate ${!msg.isRead ? "font-semibold text-foreground" : "font-medium"}`}>
            {msg.firstName} {msg.lastName}
          </span>
          <span className="text-xs text-muted shrink-0">{formatDateShort(msg.createdAt)}</span>
        </div>
        <p className={`text-xs truncate ${!msg.isRead ? "font-medium text-foreground" : "text-foreground"}`}>
          {msg.subject}
        </p>
        <p className="text-xs text-muted truncate">{msg.message}</p>
      </div>
    </button>
  );
}

// ── Detail panel ──────────────────────────────────────────────────────────────

function MessageDetail({ msg }: { msg: ContactMessageDto }) {
  const { t } = useTranslation();
  const { formatDateShort } = useDateFormat();

  return (
    <div className="rounded-xl border border-border bg-surface p-6 flex flex-col gap-5">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-base font-bold text-accent">
          {msg.firstName[0]}{msg.lastName[0]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{msg.firstName} {msg.lastName}</h2>
            {!msg.isRead && (
              <span className="rounded-full bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
                {t("messages.new")}
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted">
            <span className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              <a href={`mailto:${msg.email}`} className="text-accent hover:underline">{msg.email}</a>
            </span>
            {msg.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {msg.phone}
              </span>
            )}
            {msg.company && (
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {msg.company}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDateShort(msg.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-surface-secondary px-4 py-3">
        <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">{t("messages.subject")}</p>
        <p className="font-semibold">{msg.subject}</p>
      </div>

      <div className="flex-1">
        <p className="text-xs font-medium text-muted uppercase tracking-wide mb-2">{t("messages.message")}</p>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
      </div>

      <a
        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
        className="self-start rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
      >
        {t("messages.replyViaEmail")}
      </a>
    </div>
  );
}
