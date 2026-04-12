import { ConfirmDialog } from "@/core/components/ui/index";
import { getFileUrl } from "@/core/utils/fileUtils";
import { getGenderImageSrc } from "@/core/utils/patientImageUtils";
import {
  useDeleteProfileImage,
  useUpdateProfileImage,
} from "@/features/auth/hooks";
import type { User as UserType } from "@/features/auth/types";
import { Avatar, Button, Card } from "@heroui/react";
import { Camera, User } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface ProfileImageCardProps {
  user: UserType;
}

export function ProfileImageCard({ user }: ProfileImageCardProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateProfileImage = useUpdateProfileImage();

  const imageUrl = user.profileImageUrl
    ? getFileUrl(user.profileImageUrl)
    : getGenderImageSrc(user.gender);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) updateProfileImage.mutate(file);
    event.target.value = "";
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>{t("profile.profilePicture")}</Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-col items-center gap-4">
        <Avatar size="lg" className="h-24 w-24">
          <Avatar.Image
            className="object-cover"
            src={imageUrl}
            alt={`${user.firstName} ${user.lastName}`}
          />
          <Avatar.Fallback>
            <User className="h-12 w-12" />
          </Avatar.Fallback>
        </Avatar>

        <Button
          variant="outline"
          size="sm"
          onPress={() => fileInputRef.current?.click()}
          isDisabled={updateProfileImage.isPending}
          isPending={updateProfileImage.isPending}
        >
          <Camera className="h-4 w-4" />
          {updateProfileImage.isPending
            ? "Loading..."
            : t("profile.changePhoto")}
        </Button>

        {user.profileImageUrl && <DeleteProfileImageButton />}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <p className="text-default-500 text-center text-xs">
          {t("profile.imageRequirements")}
        </p>
      </Card.Content>
    </Card>
  );
}

// ── Self-contained delete button + confirm dialog ─────────────────────────────

function DeleteProfileImageButton() {
  const { t } = useTranslation();
  const deleteProfileImage = useDeleteProfileImage();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onPress={() => setConfirmOpen(true)}
        isDisabled={deleteProfileImage.isPending}
        className="text-danger"
      >
        {deleteProfileImage.isPending ? "Loading..." : t("profile.deletePhoto")}
      </Button>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() =>
          deleteProfileImage.mutate(undefined, {
            onSuccess: () => setConfirmOpen(false),
          })
        }
        title={t("profile.deletePhoto")}
        message={t("profile.confirmDeleteImage")}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        variant="danger"
        isLoading={deleteProfileImage.isPending}
      />
    </>
  );
}
