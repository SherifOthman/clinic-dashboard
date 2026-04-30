# Clinic Dashboard

The admin interface for the ClinicCare platform — a multi-tenant SaaS product for medical clinics. Built with React 19 and TypeScript using a feature-based architecture, TanStack Query for server state, full bilingual (EN/AR) support with RTL, and permission-based access control.

**Live Demo**: https://clinic-dashboard-ecru.vercel.app  
**API Docs**: http://clinic-api.runasp.net/scalar/v1  
**Website**: https://clinic-website-lime.vercel.app

**Repositories**: [Dashboard](https://github.com/SherifOthman/clinic-dashboard) • [API](https://github.com/SherifOthman/clinic-api) • [Website](https://github.com/SherifOthman/clinic-website)

---

## What It Does

Clinic staff need a fast, intuitive interface to manage patients, appointments, and operations — in both English and Arabic. The dashboard adapts to each user's role and permissions: clinic owners manage their team and settings, doctors see their schedule and appointments, receptionists handle patient flow, and the SuperAdmin has a cross-clinic view including a full audit trail.

---

## What's Built

### Authentication

A complete auth flow: registration with email verification, login (email or username), forgot password, reset password, and change password. The API client uses native `fetch` with HTTP-only cookies — no manual token management. On 401, the backend refreshes automatically via the cookie middleware; if that fails, the user is redirected to login.

### Permission-Based Access Control

Fine-grained access control using permissions from the backend JWT. The `useMe` hook exposes the current user. All UI guards use `permissions.ts` utility functions (`canViewPatients`, `canInviteStaff`, `canManageBranches`, etc.) — no hardcoded role strings in components.

Route visibility is enforced at two levels:
- **Role gate** (`ROUTE_ACCESS` in `constants.ts`) — coarse-grained, e.g. only `ClinicOwner` can access `/staff`
- **Permission gate** (`requiredPermission` in `siteConfig`) — fine-grained, e.g. user must have `ViewPatients` to see `/patients`

Both checks run in `canAccessRouteWithPermissions()`. The sidebar filters items using this function — users without the required permission never see the link and get a 403 page on direct URL access.

### Appointments

A full appointment management view with multi-doctor support. The toolbar lets you pick a date, branch, and doctor. The layout adapts automatically: 1 doctor gets a full-width panel, 2–4 doctors get a side-by-side grid, 5+ doctors switch to a single-doctor selector. Each doctor panel shows their appointment list (queue or time-based), supports check-in, status updates, and delay handling. Appointment type (Queue vs Time) is configurable per doctor.

### Patient Management

Paginated, sortable patient list with live search (debounced, ranked by relevance). Filters include gender and cascading location (country → state → city) that query only locations where patients are actually registered. Creating or editing a patient uses a multi-section form: basic info, phone numbers (international format validation), chronic diseases, and address. Patient codes are stored as zero-padded strings (`"0042"`) but displayed as plain numbers (`42`).

### Staff Management

Clinic owners can view active staff, invite new members by email (Doctor or Receptionist), resend or cancel pending invitations, and activate or deactivate existing staff. Doctors have a working schedule per branch with sub-tabs for working days and visit types. The staff detail dialog has three tabs: Info, Schedule (doctors only), and Permissions (owner only).

### Branches

Clinic owners can view, create, edit, and toggle branches. Each branch has a name, address, location (country/state/city), and phone numbers. The Add Branch button is hidden unless the user has `ManageBranches` permission.

### Settings

A dedicated settings page (accessible to all authenticated users) with sections that adapt by role:
- **Account & Security** (all users) — account info card and password change form
- **Clinic Settings** (owner only) — week start day configuration
- **Testimonial** (owner only) — submit a clinic testimonial for the marketing site

### Profile

Users can update their full name, username, phone number, and upload a profile image. Doctors also get a Schedule tab to manage their working hours and visit types directly from their profile.

### Audit Log Viewer

SuperAdmin-only. Shows every action taken across all clinics: who did what, to which record, when, from which IP and browser. Filterable by entity type, action type, user, clinic, and date range. Each entry expands to show field-level diffs with old and new values side by side. Deleted patients can be restored directly from the audit view.

### Dashboard

Role-specific overview pages:
- **Clinic Owner** — patient counts, recent registrations, staff summary, subscription status
- **Doctor** — today's appointments and schedule
- **Receptionist** — today's patient flow
- **SuperAdmin** — aggregated stats across all clinics

---

## Architecture

Feature-based structure — each feature is self-contained with its own API layer, hooks, types, Zod schemas, and components. Nothing leaks between features except through the shared `core/` layer.

```
src/
├── core/
│   ├── api.ts               # Native fetch client (HttpOnly cookies, 401 redirect)
│   ├── AppProvider.tsx      # React Query + theme + toast providers
│   ├── config.ts            # Site config + sidebar navigation items
│   ├── constants.ts         # API endpoints, roles, permissions, ROUTE_ACCESS map
│   ├── types.ts             # Shared types (PagedResult, BaseSearchParams, DialogState)
│   ├── validators.ts        # Shared Zod validator factories (createValidators)
│   ├── components/
│   │   ├── ui/              # DataTable, Dialog, ConfirmDialog, TablePagination,
│   │   │                    # Loading (ECG animation), InfoRow, LocationFilterButton,
│   │   │                    # StatsCard, Sidebar, UserAvatar, AppDatePicker, etc.
│   │   └── form/            # FormInput, FormPasswordInput, FormSelect, FormPhoneInput,
│   │                        # LocationSelector, PhoneNumbersInput
│   ├── hooks/               # useMutationWithToast, useBaseTableState, useDebounce,
│   │                        # useMostUsed, useLocalStorage, useValidation, useToast,
│   │                        # useDialogState, useDeleteDialogState, useIsMobile, etc.
│   ├── i18n/                # i18next setup, EN/AR translation files
│   ├── layouts/             # DashboardLayout, DashboardHeader, AuthLayout
│   ├── location/            # locationApi, useCountries/useStates/useCities hooks
│   ├── routes/              # AppRouter, RequireAuth, RequireGuest, RequireRole guards
│   └── utils/               # permissions, buildQuery, ageUtils, phoneFormat,
│                            # patientUtils, patientImageUtils, apiErrorHandler, etc.
└── features/
    ├── auth/                # Login, register, password reset, email verification
    ├── appointments/        # Appointment list, toolbar, doctor panels, create dialog
    ├── patients/            # List, detail dialog, create/edit form, location filters
    ├── staff/               # Staff list, invitations, accept invitation, schedule, permissions
    ├── branches/            # Branch list (card grid), create/edit, detail dialog
    ├── audit/               # Audit log viewer (SuperAdmin only)
    ├── onboarding/          # Clinic setup wizard
    ├── profile/             # User profile, schedule tab (doctors)
    ├── settings/            # Account, clinic settings, testimonial
    └── dashboard/           # Role-specific overview pages
```

**Server state** is managed entirely by TanStack Query. Queries are keyed by feature and parameters, stale after 30 seconds for lists and 5 minutes for detail views. Mutations use a shared `useMutationWithToast` hook that handles success toasts, error toasts (with translated messages from the API's error codes), and query invalidation.

**Form state** is managed by React Hook Form with Zod schemas for validation. Schemas are built with a shared `useValidation` hook that takes the translation function, so all error messages are automatically translated to the current language.

**Table state** lives in the URL query string via `useBaseTableState`. Page, size, sort, and feature-specific filters are all URL params — the user can refresh or share the URL and land on the same filtered view.

**i18n** uses i18next with browser language detection and localStorage persistence. The `dir` attribute, `lang` attribute, and theme class are all applied to `<html>` reactively when the language changes. Toast notifications are positioned on the correct side based on direction.

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
| Routing          | React Router 7          |
| HTTP client      | Native fetch (cookies)  |
| i18n             | i18next + react-i18next |
| Phone validation | libphonenumber-js       |
| Icons            | Lucide React            |
| Date handling    | @internationalized/date |

---

## Feature Status

> ✅ Done · 🔧 API done, no UI yet · ❌ Not started

### Authentication & Profile

| Feature                                | Status | Notes                  |
| -------------------------------------- | ------ | ---------------------- |
| Register, email confirmation, resend   | ✅     |                        |
| Login (email or username), logout      | ✅     |                        |
| Forgot / reset / change password       | ✅     |                        |
| Google OAuth login                     | ✅     |                        |
| Profile — name, username, phone, image | ✅     |                        |
| Settings page (account + clinic)       | ✅     | Role-adaptive sections |
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
| Week start day setting                 | ✅     | Affects calendar grid       |
| Subscription management UI             | ❌     | Backend entity modeled      |

### Patients

| Feature                                          | Status | Notes                                      |
| ------------------------------------------------ | ------ | ------------------------------------------ |
| Paginated list — search, sort                    | ✅     | Search ranked by relevance                 |
| Filter by gender                                 | ✅     |                                            |
| Filter by location (country → state → city)      | ✅     | Cascading, queries actual patient data     |
| Create / edit / view / soft-delete               | ✅     | All actions permission-gated               |
| Restore deleted patient                          | ✅     | SuperAdmin only, from audit view           |
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
| Accept invitation (public page)       | ✅     |                                      |
| Activate / deactivate staff           | ✅     | Permission-gated                     |
| Doctor working schedule               | ✅     | Sub-tabs: working days + visit types |
| Staff permissions management          | ✅     | Checkbox grid, owner only            |
| Schedule lock (prevent self-manage)   | ✅     | Owner only                           |

### Appointments

| Feature                                    | Status | Notes                                    |
| ------------------------------------------ | ------ | ---------------------------------------- |
| View appointments by date / branch         | ✅     |                                          |
| Multi-doctor grid layout (auto + manual)   | ✅     | 1 doc = full, 2–4 = grid, 5+ = selector |
| Create appointment (queue or time-based)   | ✅     |                                          |
| Update appointment status                  | ✅     | Pending → Waiting → InProgress → Done   |
| Doctor check-in with delay detection       | ✅     |                                          |
| Handle delay (auto-shift / mark missed)    | ✅     |                                          |
| Set appointment type per doctor            | ✅     | Queue vs Time                            |
| View patient detail from appointment       | ✅     |                                          |
| Calendar view                              | ❌     |                                          |

### Dashboard & Analytics

| Feature                                      | Status | Notes |
| -------------------------------------------- | ------ | ----- |
| Clinic owner stats (patients, staff, sub)    | ✅     |       |
| Recent patients widget                       | ✅     |       |
| Doctor dashboard (today's appointments)      | ✅     |       |
| Receptionist dashboard                       | ✅     |       |
| SuperAdmin cross-clinic stats                | ✅     |       |
| Appointment / revenue analytics              | ❌     |       |

### Audit

| Feature                                                 | Status | Notes           |
| ------------------------------------------------------- | ------ | --------------- |
| Audit log viewer (filter by entity, action, user, date) | ✅     | SuperAdmin only |
| Security & business event display                       | ✅     | Login, password, staff, permissions |
| Field-level diff (old vs new values)                    | ✅     |                 |
| Patient restore from audit                              | ✅     | SuperAdmin only |

---

## Getting Started

```bash
npm install
npm run dev
```

Copy `.env.development` and set `VITE_API_URL` to your local API URL.

---

## License

MIT
