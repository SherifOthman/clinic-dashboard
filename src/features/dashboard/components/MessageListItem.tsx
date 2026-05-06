import { useDateFormat } from "@/core/hooks/useDateFormat";
import type { ContactMessageDto } from "../dashboardApi";

interface MessageListItemProps {
  msg: ContactMessageDto;
  isSelected: boolean;
  onClick: () => void;
}

export function MessageListItem({ msg, isSelected, onClick }: MessageListItemProps) {
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
