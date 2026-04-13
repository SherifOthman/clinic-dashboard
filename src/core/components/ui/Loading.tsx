import { cn } from "@/core/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: { width: 100, height: 49 },
  md: { width: 150, height: 73 },
  lg: { width: 200, height: 97 },
};

/**
 * Heartbeat ECG animation — fully transparent background.
 *
 * Uses SVG stroke-dashoffset animation (the "draw a line" technique):
 *   - pathLength="1" normalises dash values to 0–1 so no pixel math needed
 *   - strokeDasharray="0.4 0.6" = 40% visible segment, 60% gap
 *   - Animating dashoffset from 1.4 → 0 moves the segment across the full path
 *
 * Why not the overlay-div technique?
 *   The previous approach used two divs with background: var(--background) to
 *   mask the line. Inside dialogs/cards the background is var(--overlay), not
 *   var(--background), so the masks showed as coloured blocks.
 *   This SVG-only approach has zero background dependency — works on any surface
 *   in both light and dark mode.
 */
export function Loading({ size = "md", className }: LoadingProps) {
  const { width, height } = SIZE_MAP[size];

  const points =
    "0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486";

  return (
    <div
      className={cn(
        "flex min-h-64 flex-col items-center justify-center",
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 150 73"
        aria-hidden="true"
      >
        {/* Faint ghost track so the eye knows where the line will travel */}
        <polyline
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.15"
          strokeWidth="3"
          strokeMiterlimit="10"
          points={points}
        />

        {/* Animated segment — travels left to right, erasing itself from behind */}
        <polyline
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeMiterlimit="10"
          strokeLinecap="round"
          points={points}
          pathLength={1}
          strokeDasharray="0.4 0.6"
          strokeDashoffset={1.4}
          style={{ animation: "ecg-travel 2s linear infinite" }}
        />
      </svg>

      <style>{`
        @keyframes ecg-travel {
          0%   { stroke-dashoffset: 1.4; }
          100% { stroke-dashoffset: 0;   }
        }
      `}</style>
    </div>
  );
}
