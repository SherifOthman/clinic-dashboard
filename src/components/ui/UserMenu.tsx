import { Avatar } from "@heroui/avatar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { LucideIcon } from "lucide-react";

export interface UserMenuItem {
  key: string;
  label: string;
  icon?: LucideIcon;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  onPress?: () => void;
}

interface UserMenuProps {
  user?: {
    name?: string;
    avatar?: string;
  };
  items: UserMenuItem[];
}

export function UserMenu({ user, items }: UserMenuProps) {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="primary"
          name={user?.name}
          size="sm"
          src={user?.avatar}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User menu">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownItem
              key={item.key}
              color={item.color}
              startContent={Icon ? <Icon size={16} /> : undefined}
              onPress={item.onPress}
            >
              {item.label}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
}
