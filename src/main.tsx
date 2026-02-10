import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ErrorBoundary } from "@/core/components/ErrorBoundary";
import { AppProvider } from "@/core/providers/AppProvider";
import { logger } from "@/core/services/logger";
import "@/core/styles/globals.css";
import { initializeLanguage } from "@/core/utils/languageUtils";
import { initializeTheme } from "@/core/utils/themeUtils";
import App from "./App";

logger.info(
  "Application starting",
  {
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString(),
  },
  "App",
);

initializeTheme();
initializeLanguage();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
