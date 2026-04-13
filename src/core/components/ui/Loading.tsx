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
 * Heartbeat ECG animation — codeconvey.com technique, transparent background.
 *
 * Both overlay divs use `background: inherit` so they always match the
 * surface they sit on (page, dialog, card, dark/light mode).
 *
 * The erase mask uses CSS `mask-image` with a linear gradient instead of
 * a background gradient — this way the div's inherited background shows
 * through with a fade, without needing to know the actual color.
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
      <div style={{ width, height, position: "relative" }}>
        {/* Static ECG polyline in accent color */}
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

        {/* Reveal mask — solid, inherits parent background, shrinks to reveal line */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "inherit",
            top: 0,
            right: 0,
            animation: "ecg-reveal 2.5s linear infinite",
          }}
        />

        {/* Erase mask — inherits background, fades out via mask-image gradient */}
        <div
          style={{
            position: "absolute",
            width: "120%",
            height: "100%",
            top: 0,
            left: "-120%",
            background: "inherit",
            WebkitMaskImage:
              "linear-gradient(to right, black 0%, black 80%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, black 0%, black 80%, transparent 100%)",
            animation: "ecg-erase 2.5s linear infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes ecg-reveal {
          0%   { width: 100%; }
          50%  { width: 0;    }
          100% { width: 0;    }
        }
        @keyframes ecg-erase {
          0%   { left: -120%; }
          15%  { left: -120%; }
          100% { left: 0;     }
        }
      `}</style>
    </div>
  );
}
