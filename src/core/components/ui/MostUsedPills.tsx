/**
 * Reusable "most used" pills strip.
 *
 * Renders a labelled row of pill buttons. Each pill highlights when its key
 * matches one of the `selectedKeys`. Clicking a pill calls `onSelect(key)`.
 *
 * Intentionally data-agnostic — callers supply `items` as `{ key, label }[]`
 * so it works for locations, chronic diseases, specializations, etc.
 */
interface MostUsedPillsItem {
  key: string;
  label: string;
}

interface MostUsedPillsProps {
  items: MostUsedPillsItem[];
  /** Keys that are currently selected (highlighted) */
  selectedKeys: string[];
  onSelect: (key: string) => void;
  label?: string;
}

export function MostUsedPills({
  items,
  selectedKeys,
  onSelect,
  label,
}: MostUsedPillsProps) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <p className="text-muted text-xs font-semibold tracking-wide uppercase">
          {label}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const selected = selectedKeys.includes(item.key);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                selected
                  ? "border-accent bg-accent text-white"
                  : "border-divider hover:border-accent hover:text-accent"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
