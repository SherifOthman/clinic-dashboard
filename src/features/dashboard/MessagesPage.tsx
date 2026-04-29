import { PageHeader } from "@/core/components/ui/PageHeader";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import { Mail, Phone, Building2, Clock } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useContactMessages } from "./dashboardHooks";
import type { ContactMessageDto } from "./dashboardApi";

export default function MessagesPage() {
  const { t } = useTranslation();
  const { data: messages = [], isLoading } = useContactMessages();
  const [selected, setSelected] = useState<ContactMessageDto | null>(null);

  // Auto-select first message
  if (!selected && messages.length > 0 && !isLoading) {
    setSelected(messages[0]);
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={t("navigation.messages")}
        subtitle={`${messages.length} ${t("dashboard.messages.total")}`}
      />

      {isLoading ? null : messages.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center text-muted">
          <Mail className="h-12 w-12 opacity-30" />
          <p>{t("dashboard.messages.empty")}</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]" style={{ minHeight: 500 }}>
          {/* List panel */}
          <div className="flex flex-col gap-1 overflow-y-auto rounded-xl border border-border bg-surface p-2">
            {messages.map((msg) => (
              <MessageListItem
                key={msg.id}
                msg={msg}
                isSelected={selected?.id === msg.id}
                onClick={() => setSelected(msg)}
              />
            ))}
          </div>

          {/* Detail panel */}
          {selected && <MessageDetail msg={selected} />}
        </div>
      )}
    </div>
  );
}

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
        isSelected ? "bg-accent/10 border border-accent/20" : "hover:bg-surface-secondary border border-transparent"
      }`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
        {msg.firstName[0]}{msg.lastName[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium truncate">
            {msg.firstName} {msg.lastName}
          </span>
          <span className="text-xs text-muted shrink-0">{formatDateShort(msg.createdAt)}</span>
        </div>
        <p className="text-xs font-medium text-foreground truncate">{msg.subject}</p>
        <p className="text-xs text-muted truncate">{msg.message}</p>
      </div>
    </button>
  );
}

function MessageDetail({ msg }: { msg: ContactMessageDto }) {
  const { formatDateShort } = useDateFormat();

  return (
    <div className="rounded-xl border border-border bg-surface p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-base font-bold text-accent">
          {msg.firstName[0]}{msg.lastName[0]}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{msg.firstName} {msg.lastName}</h2>
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

      {/* Subject */}
      <div className="rounded-lg bg-surface-secondary px-4 py-3">
        <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">Subject</p>
        <p className="font-semibold">{msg.subject}</p>
      </div>

      {/* Message body */}
      <div className="flex-1">
        <p className="text-xs font-medium text-muted uppercase tracking-wide mb-2">Message</p>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
      </div>

      {/* Reply button */}
      <a
        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
        className="self-start rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
      >
        Reply via Email
      </a>
    </div>
  );
}
