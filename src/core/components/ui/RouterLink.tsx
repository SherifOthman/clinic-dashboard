import { Link as RouterDomLink, type LinkProps } from "react-router-dom";

interface RouterLinkProps extends LinkProps {
  className?: string;
}

/**
 * Styled link using react-router Link with HeroUI link appearance.
 * Use for navigation links within auth forms and pages.
 */
export function RouterLink({ className, ...props }: RouterLinkProps) {
  return (
    <RouterDomLink
      className={`text-accent hover:text-accent/80 text-sm underline-offset-4 hover:underline ${className ?? ""}`}
      {...props}
    />
  );
}

