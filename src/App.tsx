import { Loading } from "@/core/components/Loading";
import { ToastProviderWrapper } from "@/core/components/ToastProviderWrapper";
import { AppRouter } from "@/core/routes/AppRouter";
import { Suspense } from "react";

// Initialize i18n
import "@/core/i18n";

function AppContent() {
  return (
    <ToastProviderWrapper>
      <AppRouter />
    </ToastProviderWrapper>
  );
}

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <AppContent />
    </Suspense>
  );
}

export default App;
