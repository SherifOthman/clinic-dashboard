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
 * Heartbeat monitor animation.
 *
 * Technique: two overlay divs (fade-in / fade-out) slide over a static SVG
 * polyline to reveal and then erase the line — same approach as codeconvey.com.
 *
 * Colors use CSS variables so it works in both light and dark mode:
 *   --background  → overlay color (matches page background, auto light/dark)
 *   --accent      → line stroke color
 *
 * To revert to the spinner:
 *   git checkout 2ee6a2c -- src/core/components/ui/Loading.tsx
 */
export function Loading({ size = "md", className }: LoadingProps) {
  const { width, height } = SIZE_MAP[size];

  // Standard PQRST heartbeat polyline — same points as codeconvey, scaled to our viewBox
  const points =
    "0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486";

  return (
    <div
      className={cn(
        "flex min-h-64 flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <div
        style={{ width, height, position: "relative" }}
        aria-label="Loading"
        role="status"
      >
        {/* Static ECG polyline */}
        <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox="0 0 150 73"
          style={{ display: "block" }}
          aria-hidden="true"
        >
          <polyline
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeMiterlimit="10"
            points={points}
          />
        </svg>

        {/* Reveal mask — slides from right to left, uncovering the line */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "var(--background)",
            top: 0,
            right: 0,
            animation: "ecg-fade-in 2.5s linear infinite",
          }}
        />

        {/* Erase mask — follows behind with a gradient fade */}
        <div
          style={{
            position: "absolute",
            width: "120%",
            height: "100%",
            top: 0,
            left: "-120%",
            animation: "ecg-fade-out 2.5s linear infinite",
            background:
              "linear-gradient(to right, var(--background) 0%, var(--background) 80%, transparent 100%)",
          }}
        />
      </div>

      <style>{`
        @keyframes ecg-fade-in {
          0%   { width: 100%; }
          50%  { width: 0; }
          100% { width: 0; }
        }
        @keyframes ecg-fade-out {
          0%   { left: -120%; }
          15%  { left: -120%; }
          100% { left: 0; }
        }
      `}</style>
    </div>
  );
}
