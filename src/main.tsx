import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { AppProvider } from "@/core/AppProvider";
import { ErrorBoundary } from "@/core/components/ui/ErrorBoundary";
import "@/core/globals.css";
// Initialize i18n before the app renders so translations are ready immediately
import "@/core/i18n";
import "react-international-phone/style.css";
import App from "./App";

// Mount the React tree into the #root div defined in index.html.
// Wrap order matters:
//   ErrorBoundary  → catches any unhandled React errors app-wide
//   BrowserRouter  → provides URL-based routing context
//   AppProvider    → sets up React Query, theme, and toast
//   App            → the actual route tree
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
