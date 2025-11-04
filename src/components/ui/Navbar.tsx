import { Button } from "@heroui/button";
import { Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
  title?: string;
  children?: React.ReactNode;
}

export function Navbar({ onMenuClick, title, children }: NavbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-divider bg-content1 px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          isIconOnly
          className="text-primary hover:bg-primary/10"
          variant="light"
          onPress={onMenuClick}
        >
          <Menu size={20} />
        </Button>
        {title && (
          <h2 className="text-lg font-semibold hidden sm:block">{title}</h2>
        )}
      </div>

      <div className="flex items-center gap-4">{children}</div>
    </header>
  );
}
