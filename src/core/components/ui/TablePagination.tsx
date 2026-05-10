import type { PagedResult } from "@/core/types";
import { toArabicNumerals } from "@/core/utils/arabicNumerals";
import { ListBox, Pagination, Select } from "@heroui/react";
import { useTranslation } from "react-i18next";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// ─── Types ────────────────────────────────────────────────────────────────────

interface TablePaginationProps {
  data: Omit<PagedResult<unknown>, "items"> | undefined;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showTotal?: boolean;
  isDisabled?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPageItems(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | "ellipsis")[] = [1];
  if (current > 3) items.push("ellipsis");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) items.push(i);
  if (current < total - 2) items.push("ellipsis");
  items.push(total);
  return items;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface PageLinksProps {
  pageItems: (number | "ellipsis")[];
  currentPage: number;
  isDisabled: boolean;
  isRTL: boolean;
  onPageChange: (page: number) => void;
}

function PageLinks({ pageItems, currentPage, isDisabled, isRTL, onPageChange }: PageLinksProps) {
  return (
    <>
      {pageItems.map((p, i) =>
        p === "ellipsis" ? (
          <Pagination.Item key={`ellipsis-${i}`}>
            <Pagination.Ellipsis />
          </Pagination.Item>
        ) : (
          <Pagination.Item key={p}>
            <Pagination.Link
              isActive={p === currentPage}
              isDisabled={isDisabled}
              onPress={() => onPageChange(p)}
              className={p === currentPage ? "bg-accent text-accent-foreground font-semibold" : ""}
            >
              {isRTL ? toArabicNumerals(String(p)) : p}
            </Pagination.Link>
          </Pagination.Item>
        ),
      )}
    </>
  );
}

function SizeSelector({
  pageSize,
  onPageSizeChange,
  label,
  ariaLabel,
}: {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  label: string;
  ariaLabel: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-default-500 shrink-0 text-sm">{label}</span>
      <Select
        className="w-20"
        value={pageSize}
        onChange={(v) => v && onPageSizeChange(Number(v))}
        aria-label={ariaLabel}
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {PAGE_SIZE_OPTIONS.map((s) => (
              <ListBox.Item key={s} id={s} textValue={String(s)}>
                {s}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TablePagination({
  data,
  currentPage,
  onPageChange,
  onPageSizeChange,
  showTotal = true,
  isDisabled = false,
}: TablePaginationProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  if (!data || data.totalPages <= 1) return null;

  const { totalCount, pageSize, hasNextPage, hasPreviousPage } = data;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);
  const pageItems = getPageItems(currentPage, data.totalPages);

  const pageLinksProps: PageLinksProps = {
    pageItems,
    currentPage,
    isDisabled,
    isRTL,
    onPageChange,
  };

  const summary = showTotal ? (
    <Pagination.Summary className="text-default-500 text-sm">
      {isRTL ? (
        <>
          عرض{" "}
          <span className="text-accent font-semibold">{toArabicNumerals(String(startItem))}</span>{" "}
          إلى{" "}
          <span className="text-accent font-semibold">{toArabicNumerals(String(endItem))}</span>{" "}
          من{" "}
          <span className="text-accent font-semibold">{toArabicNumerals(String(totalCount))}</span>{" "}
          نتيجة
        </>
      ) : (
        <>
          Showing <span className="text-accent font-semibold">{startItem}</span> to{" "}
          <span className="text-accent font-semibold">{endItem}</span> of{" "}
          <span className="text-accent font-semibold">{totalCount}</span> results
        </>
      )}
    </Pagination.Summary>
  ) : null;

  const sizeSelector = onPageSizeChange ? (
    <SizeSelector
      pageSize={pageSize}
      onPageSizeChange={onPageSizeChange}
      label={t("table.perPage")}
      ariaLabel={t("table.itemsPerPage")}
    />
  ) : null;

  /**
   * Nav buttons — icon only, no text.
   * RTL: Next (←) on the left, Previous (→) on the right.
   * LTR: Previous (←) on the left, Next (→) on the right.
   */
  const nav = (
    <Pagination>
      <Pagination.Content className="gap-1">
        {isRTL ? (
          <>
            {/* RTL left button: goes to next page, points left ← */}
            <Pagination.Item>
              <Pagination.Next
                isDisabled={!hasNextPage || isDisabled}
                onPress={() => onPageChange(currentPage + 1)}
              >
                <Pagination.PreviousIcon />
              </Pagination.Next>
            </Pagination.Item>

            <PageLinks {...pageLinksProps} />

            {/* RTL right button: goes to previous page, points right → */}
            <Pagination.Item>
              <Pagination.Previous
                isDisabled={!hasPreviousPage || isDisabled}
                onPress={() => onPageChange(currentPage - 1)}
              >
                <Pagination.NextIcon />
              </Pagination.Previous>
            </Pagination.Item>
          </>
        ) : (
          <>
            {/* LTR left button: goes to previous page, points left ← */}
            <Pagination.Item>
              <Pagination.Previous
                isDisabled={!hasPreviousPage || isDisabled}
                onPress={() => onPageChange(currentPage - 1)}
              >
                <Pagination.PreviousIcon />
              </Pagination.Previous>
            </Pagination.Item>

            <PageLinks {...pageLinksProps} />

            {/* LTR right button: goes to next page, points right → */}
            <Pagination.Item>
              <Pagination.Next
                isDisabled={!hasNextPage || isDisabled}
                onPress={() => onPageChange(currentPage + 1)}
              >
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </>
        )}
      </Pagination.Content>
    </Pagination>
  );

  // ── Desktop: summary left | nav center | size selector right ──────────────
  const desktopLayout = (
    <div className="relative hidden items-center py-4 sm:flex">
      <div className="flex-1 whitespace-nowrap">{summary}</div>
      <div className="absolute left-1/2 -translate-x-1/2">{nav}</div>
      <div className="flex flex-1 justify-end">{sizeSelector}</div>
    </div>
  );

  // ── Mobile: nav centered | summary + size selector below ──────────────────
  const mobileLayout = (
    <div className="flex flex-col items-center gap-2 py-4 sm:hidden">
      <div className="overflow-x-auto">{nav}</div>
      <div className="flex w-full items-center justify-between">
        {summary}
        {sizeSelector}
      </div>
    </div>
  );

  return (
    <>
      {desktopLayout}
      {mobileLayout}
    </>
  );
}
