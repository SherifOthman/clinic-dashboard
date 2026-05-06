import { PageHeader } from "@/core/components/ui/PageHeader";
import { TablePagination } from "@/core/components/ui/TablePagination";
import { toArabicNumerals } from "@/core/utils/arabicNumerals";
import { useQueryClient } from "@tanstack/react-query";
import { Circle, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { dashboardApi } from "./dashboardApi";
import type { ContactMessageDto } from "./dashboardApi";
import { useContactMessages, useContactMessagesUnreadCount } from "./dashboardHooks";
import { MessageDetail } from "./components/MessageDetail";
import { MessageListItem } from "./components/MessageListItem";
import type { PagedResult } from "@/core/types";

export default function MessagesPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
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
    setSelected({ ...msg, isRead: true });

    if (!msg.isRead) {
      // Optimistically update the list cache so the dot disappears immediately
      qc.setQueryData<PagedResult<ContactMessageDto>>(
        ["contact", "messages", page],
        (old) => old
          ? { ...old, items: old.items.map((m) => m.id === msg.id ? { ...m, isRead: true } : m) }
          : old,
      );

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

  // Auto-select first message when messages load
  useEffect(() => {
    if (!selected && messages.length > 0 && !isLoading) {
      handleSelect(messages[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const unreadInPage = messages.filter((m) => !m.isRead).length;

  return (
    <div>
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
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
          {/* List panel */}
          <div className="flex flex-col rounded-xl border border-border bg-surface" style={{ maxHeight: 600 }}>
            {unreadInPage > 0 && (
              <div className="flex items-center gap-2 border-b border-border px-3 py-2 bg-warning/5">
                <Circle className="h-2 w-2 fill-warning text-warning" />
                <span className="text-xs font-medium text-warning">
                  {isRTL ? toArabicNumerals(String(unreadInPage)) : unreadInPage} {t("dashboard.messages.unreadOnPage")}
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
              <div className="border-t border-border px-4 py-1">
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
