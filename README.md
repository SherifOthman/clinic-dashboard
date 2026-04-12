# Clinic Dashboard

The admin interface for the Clinic Management platform — a multi-tenant SaaS product for medical clinics. Built with React 19 and TypeScript, demonstrating real-world patterns: feature-based architecture, server state management, full bilingual support with RTL, and role-based access control.

**Live Demo**: https://clinic-dashboard-ecru.vercel.app  
**API Docs**: http://clinic-api.runasp.net/scalar/v1  
**Website**: https://clinic-website-lime.vercel.app

**Repositories**: [Dashboard](https://github.com/SherifOthman/clinic-dashboard) • [API](https://github.com/SherifOthman/clinic-api) • [Website](https://github.com/SherifOthman/clinic-website)

---

## The Problem It Solves

Clinic staff need a fast, intuitive interface to manage patients, track staff, and monitor clinic activity — in both English and Arabic. The dashboard adapts to each user's role: clinic owners manage their team and settings, doctors and receptionists manage patients, and the SuperAdmin has a cross-clinic view of everything including a full audit trail.

---

## What's Built

### Authentication

A complete auth flow: registration with email verification, login, forgot password, reset password, and change password. The Axios client handles token refresh automatically using an interceptor — when a 401 is returned, it fires a single refresh request (deduplicating concurrent calls with a shared promise), retries the original request with the new token, and redirects to login only if the refresh itself fails.

### Onboarding Wizard

New clinic owners are guided through a multi-step setup: clinic name, branch details, location (country → state → city), and subscription plan selection. The wizard validates each step before proceeding and submits everything in a single API call at the end.

### Patient Management

The patients list is paginated and sortable, with a live search that debounces input and ranks results by relevance (exact code match first, then name, then partial). Filters include gender and a "filter by region" modal that shows the distinct states where patients are registered, with a most-used section for quick access. The filter works across both English and Arabic state names simultaneously.

Creating or editing a patient uses a multi-section form: basic info (name, DOB, gender, blood type), location (cascading country/state/city selectors backed by the GeoNames API), phone numbers (with international format validation via libphonenumber-js), and chronic diseases (multi-select). The location selector stores both English and Arabic names together — it resolves the alt-language name from GeoNames before the form can be submitted, so there's no race condition. For countries with no administrative divisions (city-states like Singapore), the selector automatically fills the state and city fields from the country name and hides the empty dropdowns.

Soft-deleted patients are hidden from the list but retained in the database. The SuperAdmin can restore them.

### Staff Management

Clinic owners can view their active staff with role and status filters, invite new members by email (Doctor or Receptionist), resend or cancel pending invitations, and activate or deactivate existing staff. The invitation flow is handled entirely by the API — the invitee receives an email with a registration link that pre-fills their role and links them to the clinic on completion.

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
│   │   ├── ui/              # DataTable, Drawer, TablePagination, Loading, InfoRow, etc.
│   │   └── form/            # FormInput, LocationSelector, PhoneNumbersInput, etc.
│   ├── hooks/               # useMutationWithToast, useBaseTableState, useDebounce, etc.
│   ├── i18n/                # i18next setup, EN/AR translation files (532 keys each)
│   ├── routes/              # RequireAuth, RequireRole guards
│   └── utils/               # roleUtils, ageUtils, phoneFormat, apiErrorHandler, etc.
└── features/
    ├── auth/                # Login, register, password reset, email verification
    ├── patients/            # List, detail drawer, create/edit form, state filter
    ├── staff/               # Staff list, invitations, accept invitation
    ├── audit/               # Audit log viewer (SuperAdmin only)
    ├── onboarding/          # Clinic setup wizard
    ├── profile/             # User profile & password change
    └── dashboard/           # Overview stats
```

**Server state** is managed entirely by TanStack Query. Queries are keyed by feature and parameters, stale after 30 seconds for lists and 5 minutes for detail views. Mutations use a shared `useMutationWithToast` hook that handles success toasts, error toasts (with translated messages from the API's error codes), and query invalidation — eliminating the boilerplate from every mutation hook.

**Form state** is managed by React Hook Form with Zod schemas for validation. Schemas are built with a shared `createValidators` factory that takes the translation function, so all error messages are automatically translated to the current language.

**Role-based access** is enforced at the route level by a `RequireRole` guard that checks the user's role against a route access map. Unauthorized access redirects to `/unauthorized`. Individual UI elements (edit buttons, delete buttons, admin-only sections) are conditionally rendered using permission utility functions.

**i18n** uses i18next with browser language detection and localStorage persistence. The direction (`ltr`/`rtl`), `lang` attribute, and theme class are all applied to the `<html>` element reactively when the language changes. Toast notifications are positioned on the correct side based on direction.

---

## Tech Stack

| Category         | Technology               |
| ---------------- | ------------------------ |
| Framework        | React 19 + TypeScript    |
| Build tool       | Vite                     |
| Server state     | TanStack Query 5         |
| Forms            | React Hook Form + Zod    |
| UI components    | HeroUI v3                |
| Styling          | Tailwind CSS 4           |
| Routing          | React Router 6           |
| HTTP client      | Axios                    |
| i18n             | i18next + react-i18next  |
| Phone validation | libphonenumber-js        |
| Icons            | Lucide React             |
| Testing          | Vitest + Testing Library |

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

### Clinic Setup & Branches

| Feature                                | Status | Notes                     |
| -------------------------------------- | ------ | ------------------------- |
| Onboarding wizard                      | ✅     |                           |
| View / create / edit / toggle branches | ✅     |                           |
| Branch phone numbers                   | ✅     |                           |
| Branch appointment pricing             | ❌     | Backend entity modeled    |
| Subscription management UI             | ❌     | Backend entity modeled    |
| Usage metrics dashboard                | ❌     | Backend aggregates hourly |

### Patients

| Feature                                          | Status | Notes                      |
| ------------------------------------------------ | ------ | -------------------------- |
| Paginated list — search, sort, filter            | ✅     | Search ranked by relevance |
| Create / edit / view / soft-delete / restore     | ✅     | Restore is SuperAdmin only |
| Phone numbers, blood type, DOB, chronic diseases | ✅     |                            |
| Bilingual location (country / state / city)      | ✅     | GeoNames-backed            |
| Medical visit history                            | ❌     | Backend entity modeled     |
| Medical files / documents                        | ❌     | Backend entity modeled     |

### Staff

| Feature                               | Status | Notes |
| ------------------------------------- | ------ | ----- |
| Staff list with role / status filters | ✅     |       |
| Invite / resend / cancel invitations  | ✅     |       |
| Accept invitation                     | ✅     |       |
| Activate / deactivate staff           | ✅     |       |
| Doctor working schedule               | ✅     |       |

### Appointments

| Feature                    | Status | Notes                  |
| -------------------------- | ------ | ---------------------- |
| Book / manage appointments | ❌     | Backend entity modeled |
| Appointment types          | ❌     | Backend entity modeled |
| Calendar view              | ❌     |                        |
| Queue management           | ❌     | Backend entity modeled |

### Medical Visits

| Feature                     | Status | Notes                        |
| --------------------------- | ------ | ---------------------------- |
| Visit record with diagnosis | ❌     | Backend entity modeled       |
| Prescriptions               | ❌     | Backend entity modeled       |
| Lab test orders             | ❌     | Backend entity modeled       |
| Radiology orders            | ❌     | Backend entity modeled       |
| Vital measurements          | ❌     | Backend entity modeled (EAV) |
| Medical file uploads        | ❌     | Backend entity modeled       |

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
