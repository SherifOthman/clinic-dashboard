import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { Camera, UserCircle } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "@/core/hooks/useToast";
import { useDeleteProfileImage, useUpdateProfileImage } from "../hooks";
import type { User } from "../types/index";

interface ProfileImageCardProps {
  user: User;
}

// Get the base URL for static files from the API URL
const getStaticFileUrl = (path: string) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const baseUrl = apiUrl.replace("/api", "");
  return `${baseUrl}${path}`;
};

export function ProfileImageCard({ user }: ProfileImageCardProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateProfileImage = useUpdateProfileImage();
  const deleteProfileImage = useDeleteProfileImage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showError } = useToast();

  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  // Add cache busting to the image URL to force refresh
  const imageUrl = user.profileImageUrl
    ? `${getStaticFileUrl(user.profileImageUrl)}?t=${user.profileImageUpdatedAt || Date.now()}`
    : undefined;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showError("toast.imageUploadFailed");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showError("toast.imageTooLarge");
        return;
      }

      updateProfileImage.mutate(file);
    }

    // Reset the input value so the same file can be selected again if needed
    event.target.value = "";
  };

  const handleChangePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleImageClick = () => {
    if (imageUrl) {
      setIsModalOpen(true);
    }
  };

  const handleDeleteImage = () => {
    if (window.confirm(t("profile.confirmDeleteImage"))) {
      deleteProfileImage.mutate();
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">{t("profile.profilePicture")}</h3>
      </CardHeader>
      <CardBody className="flex flex-col items-center gap-4">
        <button
          type="button"
          className={`${imageUrl ? "cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary rounded-full" : "cursor-default"}`}
          onClick={handleImageClick}
          disabled={!imageUrl}
          aria-label={imageUrl ? t("profile.clickToViewImage") : undefined}
        >
          <Avatar
            key={imageUrl} // Force re-render when URL changes
            name={initials}
            src={imageUrl}
            size="lg"
            className="w-24 h-24"
            showFallback
            fallback={<UserCircle className="w-12 h-12 text-default-500" />}
          />
        </button>

        <Button
          variant="bordered"
          size="sm"
          startContent={<Camera className="w-4 h-4" />}
          onPress={handleChangePhoto}
          isLoading={updateProfileImage.isPending}
        >
          {t("profile.changePhoto")}
        </Button>

        {imageUrl && (
          <Button
            variant="light"
            size="sm"
            color="danger"
            onPress={handleDeleteImage}
            isLoading={deleteProfileImage.isPending}
          >
            {t("profile.deletePhoto")}
          </Button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <p className="text-xs text-default-500 text-center">
          {t("profile.imageRequirements")}
          {imageUrl && (
            <>
              <br />
              {t("profile.clickImageToView")}
            </>
          )}
        </p>

        {/* Image Preview Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          size="2xl"
          placement="center"
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              {t("profile.profilePicture")}
            </ModalHeader>
            <ModalBody className="pb-6">
              <div className="flex justify-center">
                <img
                  src={imageUrl}
                  alt={t("profile.profilePicture")}
                  className="max-w-full max-h-96 object-contain rounded-lg"
                />
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      </CardBody>
    </Card>
  );
}
