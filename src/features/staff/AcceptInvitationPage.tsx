import { Button, Card } from "@heroui/react";
import { XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { AcceptInvitationForm } from "./components/AcceptInvitationForm";

export default function AcceptInvitationPage() {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  if (!token) {
    return (
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <Card.Content className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="bg-danger/10 flex h-16 w-16 items-center justify-center rounded-full">
              <XCircle className="text-danger h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold">
              {t("staff.acceptInvitation.invalidToken")}
            </h2>
            <p className="text-default-600 text-sm">
              {t("staff.acceptInvitation.invalidTokenMessage")}
            </p>
            <Button variant="primary" onPress={() => navigate("/login")}>
              {t("auth.forgotPassword.backToLogin")}
            </Button>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <AcceptInvitationForm token={token} />
    </div>
  );
}

