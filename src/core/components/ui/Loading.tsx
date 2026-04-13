import { cn } from "@/core/utils";
import { useEffect, useRef, useState } from "react";

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
 * Heartbeat ECG animation — codeconvey.com technique.
 *
 * Reads the actual computed background color of the nearest parent at mount
 * time, then uses that color for the overlay divs. This works on any surface
 * (page, dialog, card) in both dark and light mode without hardcoding colors.
 */
export function Loading({ size = "md", className }: LoadingProps) {
  const { width, height } = SIZE_MAP[size];
  const ref = useRef<HTMLDivElement>(null);
  const [bgColor, setBgColor] = useState("var(--background)");

  useEffect(() => {
    if (!ref.current) return;
    // Walk up the DOM until we find an element with a non-transparent background
    let el: HTMLElement | null = ref.current.parentElement;
    while (el) {
      const bg = window.getComputedStyle(el).backgroundColor;
      // Skip transparent / rgba(0,0,0,0)
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
        setBgColor(bg);
        return;
      }
      el = el.parentElement;
    }
  }, []);

  const points =
    "0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486";

  const gradientBg = `linear-gradient(to right, ${bgColor} 0%, ${bgColor} 80%, transparent 100%)`;

  return (
    <div
      ref={ref}
      className={cn(
        "flex min-h-64 flex-col items-center justify-center",
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <div style={{ width, height, position: "relative" }}>
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

        {/* Reveal mask — solid, covers the line then shrinks to reveal it */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: bgColor,
            top: 0,
            right: 0,
            animation: "ecg-reveal 2.5s linear infinite",
          }}
        />

        {/* Erase mask — gradient fade that follows behind */}
        <div
          style={{
            position: "absolute",
            width: "120%",
            height: "100%",
            top: 0,
            left: "-120%",
            background: gradientBg,
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
