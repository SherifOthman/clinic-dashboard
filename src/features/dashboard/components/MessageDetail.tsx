import { useDateFormat } from "@/core/hooks/useDateFormat";
import { Building2, Clock, Mail, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ContactMessageDto } from "../dashboardApi";

interface MessageDetailProps {
  msg: ContactMessageDto;
}

export function MessageDetail({ msg }: MessageDetailProps) {
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
