# Clinic Dashboard

The admin interface for the Clinic Management platform — a multi-tenant SaaS product for medical clinics. Built with React 19 and TypeScript, demonstrating real-world patterns: feature-based architecture, server state management, full bilingual support with RTL, and permission-based access control.

**Live Demo**: https://clinic-dashboard-ecru.vercel.app  
**API Docs**: http://clinic-api.runasp.net/scalar/v1  
**Website**: https://clinic-website-lime.vercel.app

**Repositories**: [Dashboard](https://github.com/SherifOthman/clinic-dashboard) • [API](https://github.com/SherifOthman/clinic-api) • [Website](https://github.com/SherifOthman/clinic-website)

---

## The Problem It Solves

Clinic staff need a fast, intuitive interface to manage patients, track staff, and monitor clinic activity — in both English and Arabic. The dashboard adapts to each user's permissions: clinic owners manage their team and settings, doctors and receptionists see only what they're allowed to, and the SuperAdmin has a cross-clinic view of everything including a full audit trail.

---

## What's Built

### Authentication

A complete auth flow: registration with email verification, login, forgot password, reset password, and change password. The Axios client handles token refresh automatically using an interceptor — when a 401 is returned, it fires a single refresh request (deduplicating concurrent calls with a shared promise), retries the original request with the new token, and redirects to login only if the refresh itself fails.

### Permission-Based Access Control

Fine-grained access control using permissions from the backend JWT. The `useMe` hook exposes `hasPermission()` and `hasAnyPermission()` helpers. All UI guards use `permissions.ts` utility functions (`canViewPatients`, `canInviteStaff`, `canManageBranches`, etc.) — no hardcoded role strings in components.

Route visibility is enforced at two levels:

- **Role gate** (`ROUTE_ACCESS`) — coarse-grained, e.g. only `ClinicOwner` can access `/staff`
- **Permission gate** (`requiredPermission` in `siteConfig`) — fine-grained, e.g. user must have `ViewPatients` to see `/patients`

Both checks run in `RequireRole`. The sidebar filters items using `canAccessRouteWithPermissions()` — users without `ViewPatients` never see the Patients link and get the 403 page if they navigate directly.

Clinic owners can manage per-staff permissions via a checkbox grid in the staff detail dialog (grouped by category: Patients, Staff, Branches, Schedule, Appointments, Invoices).

### Onboarding Wizard

New clinic owners are guided through a multi-step setup: clinic name, branch details, location (country → state → city), and subscription plan selection. The wizard validates each step before proceeding and submits everything in a single API call at the end.

### Patient Management

The patients list is paginated and sortable, with a live search that debounces input and ranks results by relevance (exact code match first, then name, then partial). Filters include gender and cascading location filters (country → state → city) that query only the locations where patients are actually registered.

Patient codes are stored as zero-padded strings (`"0042"`) for `StartsWith` search but displayed as plain numbers (`42`) using `formatPatientCode()`.

Creating or editing a patient uses a multi-section form: basic info, contact info (phone numbers with international format validation), chronic diseases, and address (cascading country/state/city selectors). Patient names and location names are resolved server-side — no extra frontend calls needed when switching language.

### Staff Management

Clinic owners can view their active staff, invite new members by email, resend or cancel pending invitations, and activate or deactivate existing staff. Doctors have a working schedule per branch with sub-tabs for working days and visit types. The staff detail dialog has three tabs: Info, Schedule (doctors only), and Permissions (owner only, non-owner staff only).

### Branches

Clinic owners can view, create, edit, and toggle branches. The Add Branch button is hidden unless the user has `ManageBranches` permission.

### Audit Log Viewer

SuperAdmin-only. Shows every action taken across all clinics: who did what, to which record, when, from which IP and browser. Filterable by entity type, action type, user, clinic, and date range. Each entry can be expanded to show field-level diffs with old and new values side by side.

### Profile

Users can update their name, username, phone number, and upload a profile image. Password change is a separate form that requires the current password.

### Dashboard

Overview stats for the current clinic: patient counts, recent registrations, and key metrics. SuperAdmin sees aggregated stats across all clinics.

---

## Architecture

Feature-based structure — each feature is self-contained with its own API layer, hooks, types, Zod schemas, and components. Nothing leaks between features except through the shared `core/` layer.

```
src/
├── core/
│   ├── api.ts               # Axios client with interceptors (auth, refresh, redirect)
│   ├── components/
│   │   ├── ui/              # DataTable, Dialog, ConfirmDialog, TablePagination,
│   │   │                    # Loading, InfoRow, LocationFilterButton, StatsCard,
│   │   │                    # Sidebar, UserAvatar, ThemeSwitch, LanguageSwitcher, etc.
│   │   └── form/            # FormInput, FormPasswordInput, FormSelect, FormPhoneInput,
│   │                        # LocationSelector, PhoneNumbersInput
│   ├── hooks/               # useMutationWithToast, useBaseTableState, useDebounce,
│   │                        # useMostUsed, useLocalStorage, useValidation, useToast, etc.
│   ├── i18n/                # i18next setup, EN/AR translation files
│   ├── location/            # locationApi, useCountries/useStates/useCities hooks
│   ├── routes/              # RequireAuth, RequireGuest, RequireRole guards
│   └── utils/               # permissions, ageUtils, phoneFormat, phoneValidation,
│                            # patientUtils, patientImageUtils, apiErrorHandler, etc.
└── features/
    ├── auth/                # Login, register, password reset, email verification
    ├── patients/            # List, detail dialog, create/edit form, location filters
    ├── staff/               # Staff list, invitations, accept invitation, schedule, permissions
    ├── branches/            # Branch list, create/edit, detail dialog
    ├── audit/               # Audit log viewer (SuperAdmin only)
    ├── onboarding/          # Clinic setup wizard
    ├── profile/             # User profile & password change
    └── dashboard/           # Overview stats
```

**Server state** is managed entirely by TanStack Query. Queries are keyed by feature and parameters, stale after 30 seconds for lists and 5 minutes for detail views. Mutations use a shared `useMutationWithToast` hook that handles success toasts, error toasts (with translated messages from the API's error codes), and query invalidation.

**Form state** is managed by React Hook Form with Zod schemas for validation. Schemas are built with a shared `useValidation` hook that takes the translation function, so all error messages are automatically translated to the current language.

**Permissions** are resolved from the backend on login via `/auth/me` and stored in the `user` object. The `permissions.ts` utility provides typed helper functions for every permission. `roleUtils.ts` is merged into `permissions.ts` — one file for all role and permission checks. A shared `roleColors.ts` constant provides chip colors for role badges.

**i18n** uses i18next with browser language detection and localStorage persistence. The direction (`ltr`/`rtl`), `lang` attribute, and theme class are all applied to the `<html>` element reactively when the language changes. Toast notifications are positioned on the correct side based on direction.

**Location data** is served from the backend's seeded GeoNames database. The `core/location/` layer provides `useCountries`, `useStates`, and `useCities` hooks with 24-hour stale time. Patient list rows and detail dialogs receive location names directly from the API (resolved server-side in the current language) — no extra frontend calls needed.

---

## Tech Stack

| Category         | Technology              |
| ---------------- | ----------------------- |
| Framework        | React 19 + TypeScript   |
| Build tool       | Vite                    |
| Server state     | TanStack Query 5        |
| Forms            | React Hook Form + Zod   |
| UI components    | HeroUI v3               |
| Styling          | Tailwind CSS 4          |
| Routing          | React Router 6          |
| HTTP client      | Axios                   |
| i18n             | i18next + react-i18next |
| Phone validation | libphonenumber-js       |
| Icons            | Lucide React            |

---

## Feature Status

> ✅ Done · 🔧 API done, no UI yet · 🗂️ Domain modeled, no API or UI · ❌ Not started

### Authentication & Profile

| Feature                                | Status | Notes                  |
| -------------------------------------- | ------ | ---------------------- |
| Register, email confirmation, resend   | ✅     |                        |
| Login, logout                          | ✅     |                        |
| Forgot / reset / change password       | ✅     |                        |
| Profile — name, username, phone, image | ✅     |                        |
| In-app notifications                   | ❌     | Backend entity modeled |

### Permissions & Access Control

| Feature                          | Status | Notes                                          |
| -------------------------------- | ------ | ---------------------------------------------- |
| Permission-based UI guards       | ✅     | All CRUD actions gated by permissions          |
| Sidebar visibility by permission | ✅     | Links hidden if user lacks required permission |
| Route guard (role + permission)  | ✅     | 403 page on direct URL access                  |
| Staff permissions management UI  | ✅     | Checkbox grid in staff detail dialog           |

### Clinic Setup & Branches

| Feature                                | Status | Notes                       |
| -------------------------------------- | ------ | --------------------------- |
| Onboarding wizard                      | ✅     |                             |
| View / create / edit / toggle branches | ✅     | Add button permission-gated |
| Branch phone numbers                   | ✅     |                             |
| Subscription management UI             | ❌     | Backend entity modeled      |
| Usage metrics dashboard                | ❌     | Backend aggregates daily    |

### Patients

| Feature                                          | Status | Notes                                      |
| ------------------------------------------------ | ------ | ------------------------------------------ |
| Paginated list — search, sort                    | ✅     | Search ranked by relevance                 |
| Filter by gender                                 | ✅     |                                            |
| Filter by location (country → state → city)      | ✅     | Cascading, queries actual patient data     |
| Create / edit / view / soft-delete / restore     | ✅     | All actions permission-gated               |
| Phone numbers, blood type, DOB, chronic diseases | ✅     |                                            |
| Bilingual location (country / state / city)      | ✅     | Names resolved server-side, no extra calls |
| Patient code display (strip leading zeros)       | ✅     | "0042" stored, "42" displayed              |
| Medical visit history                            | ❌     | Backend entity modeled                     |
| Medical files / documents                        | ❌     | Backend entity modeled                     |

### Staff

| Feature                               | Status | Notes                                |
| ------------------------------------- | ------ | ------------------------------------ |
| Staff list with role / status filters | ✅     |                                      |
| Invite / resend / cancel invitations  | ✅     | Invite button permission-gated       |
| Accept invitation                     | ✅     |                                      |
| Activate / deactivate staff           | ✅     | Permission-gated                     |
| Doctor working schedule               | ✅     | Sub-tabs: working days + visit types |
| Staff permissions management          | ✅     | Checkbox grid, owner only            |

### Appointments

| Feature                    | Status | Notes                  |
| -------------------------- | ------ | ---------------------- |
| Book / manage appointments | ❌     | Backend entity modeled |
| Appointment types          | ❌     | Backend entity modeled |
| Calendar view              | ❌     |                        |
| Queue management           | ❌     | Backend entity modeled |

### Medical Visits

| Feature                     | Status | Notes                  |
| --------------------------- | ------ | ---------------------- |
| Visit record with diagnosis | ❌     | Backend entity modeled |
| Prescriptions               | ❌     | Backend entity modeled |
| Lab test orders             | ❌     | Backend entity modeled |
| Radiology orders            | ❌     | Backend entity modeled |
| Vital measurements          | ❌     | Backend entity modeled |
| Medical file uploads        | ❌     | Backend entity modeled |

### Inventory

| Feature                  | Status | Notes                  |
| ------------------------ | ------ | ---------------------- |
| Medicine inventory       | ❌     | Backend entity modeled |
| Medicine dispensing      | ❌     | Backend entity modeled |
| Medical supplies         | ❌     | Backend entity modeled |
| Medical services catalog | ❌     | Backend entity modeled |

### Billing

| Feature         | Status | Notes                  |
| --------------- | ------ | ---------------------- |
| Invoices        | ❌     | Backend entity modeled |
| Payments        | ❌     | Backend entity modeled |
| Revenue reports | ❌     |                        |

### Dashboard & Analytics

| Feature                                      | Status | Notes |
| -------------------------------------------- | ------ | ----- |
| Clinic stats (patients, staff, subscription) | ✅     |       |
| Recent patients widget                       | ✅     |       |
| SuperAdmin cross-clinic stats                | ✅     |       |
| Appointment / revenue analytics              | ❌     |       |

### Audit

| Feature                                                 | Status | Notes           |
| ------------------------------------------------------- | ------ | --------------- |
| Audit log viewer (filter by entity, action, user, date) | ✅     | SuperAdmin only |
| Field-level diff display                                | ✅     |                 |
| Patient restore from audit                              | ✅     | SuperAdmin only |

---

## Getting Started

```bash
npm install
npm run dev
```

---

## License

MIT
