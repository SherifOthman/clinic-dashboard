import { useDateFormat } from "@/core/hooks/useDateFormat";
import { Mail, Circle } from "lucide-react";
import { useState } from "react";
import { useContactMessages, useContactMessagesUnreadCount } from "../dashboardHooks";

export function ContactMessagesPanel() {
  const { formatDateShort } = useDateFormat();
  const [expanded, setExpanded] = useState<string | null>(null);
  const { data, isLoading } = useContactMessages();
  const { data: unreadCount = 0 } = useContactMessagesUnreadCount();
  const messages = data?.items ?? [];

  if (isLoading) return null;

  return (
    <div className="col-span-full rounded-xl border border-border bg-surface p-6">
      <div className="mb-4 flex items-center gap-2">
        <Mail className="h-5 w-5 text-accent" />
        <h3 className="font-semibold">Contact Messages</h3>
        {(data?.totalCount ?? 0) > 0 && (
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
            {data?.totalCount}
          </span>
        )}
        {unreadCount > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
            <Circle className="h-1.5 w-1.5 fill-warning" />
            {unreadCount} new
          </span>
        )}
      </div>

      {messages.length === 0 ? (
        <p className="text-sm text-muted">No messages yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {messages.map((msg) => (
            <div key={msg.id} className="py-3">
              <button
                type="button"
                className="w-full text-start"
                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                        {msg.firstName[0]}{msg.lastName[0]}
                      </div>
                      {!msg.isRead && (
                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-warning border-2 border-surface" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm ${!msg.isRead ? "font-semibold" : "font-medium"}`}>
                        {msg.firstName} {msg.lastName}
                        {msg.company && <span className="ml-1 text-xs text-muted font-normal">· {msg.company}</span>}
                      </p>
                      <p className="text-xs text-muted">{msg.email}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm ${!msg.isRead ? "font-semibold" : "font-medium"}`}>{msg.subject}</p>
                    <p className="text-xs text-muted">{formatDateShort(msg.createdAt)}</p>
                  </div>
                </div>
              </button>
              {expanded === msg.id && (
                <div className="mt-3 rounded-lg bg-default/30 px-4 py-3 text-sm text-foreground">
                  {msg.message}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
