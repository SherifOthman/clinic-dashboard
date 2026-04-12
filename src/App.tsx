import { Loading } from "@/core/components/ui/Loading";
import "@/core/i18n";
import { AppRouter } from "@/core/routes/AppRouter";
import { Suspense } from "react";

// App is intentionally thin — it just wraps the router in a Suspense boundary.
// The Suspense fallback covers the initial load of any lazy-loaded page chunk.
// All providers (React Query, theme, toast) live in AppProvider (main.tsx).
function App() {
  return (
    <Suspense fallback={<Loading className="h-screen" />}>
      <AppRouter />
    </Suspense>
  );
}

export default App;
