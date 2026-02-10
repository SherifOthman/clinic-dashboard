import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  scrollBehavior?: "inside" | "outside";
  children: React.ReactNode;
  className?: string;
}

export function BaseModal({
  isOpen,
  onClose,
  title,
  size = "3xl",
  scrollBehavior = "inside",
  children,
  className,
}: BaseModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      scrollBehavior={scrollBehavior}
      className={className}
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-semibold">{title}</h3>
        </ModalHeader>
        <ModalBody className="pb-6">{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
