import { Loader } from "@/components/ui/Loader";
import { refreshToken } from "@/services/authService";
import { ReactNode, useEffect, useState } from "react";

export const CheckTokenFirstOpen = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function tryRefresh() {
      await refreshToken();

      //   await new Promise((reslove, reject) => {
      //     setTimeout(() => {
      //       reslove(true);
      //     }, 10000);
      //   });
      setLoading(false);
    }

    tryRefresh();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
};
