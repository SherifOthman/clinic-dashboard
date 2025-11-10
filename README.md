# Clinic Management UI Template

A comprehensive, production-ready clinic management UI built with Hero UI, React, TypeScript, and Tailwind CSS v4. Features modular architecture, reusable components, and professional medical dashboard design.

## ✨ Features

### 🏥 Complete Medical Management System

- **Dashboard** - Statistics cards, today's overview, recent appointments
- **Clinics Management** - Location management with subscription plans
- **Patients Management** - Comprehensive patient profiles with medical history
- **Appointments** - Advanced scheduling with payment tracking
- **Reports & Analytics** - Financial reports and performance metrics
- **Settings** - User profile, security, notifications, preferences

### 🎨 Professional UI/UX

- **Hero UI v2** - Latest components with consistent design
- **Responsive Tables** - No horizontal scrolling, optimized for all screens
- **Loading States** - Professional skeleton loading for all data tables
- **Color-coded Status** - Consistent status indicators across features
- **Language Toggle** - Easy language switching capability

### 🏗️ Clean Architecture

- **Feature-based Structure** - Organized by business domains
- **Reusable Components** - Modular, maintainable component library
- **Shared Types** - TypeScript interfaces for type safety
- **Constants Management** - Centralized configuration and constants
- **PascalCase Naming** - Consistent file naming conventions

## 📁 Project Structure

```
src/
├── components/           # Shared UI components
│   └── ui/              # Base UI components
│       ├── DataTable.tsx      # Reusable data table
│       ├── FilterBar.tsx      # Search and filter bar
│       ├── LanguageToggle.tsx # Language switcher
│       ├── Navbar.tsx         # Top navigation
│       ├── Sidebar.tsx        # Side navigation
│       ├── TableSkeleton.tsx  # Loading skeleton
│       ├── ThemeToggle.tsx    # Dark/light mode
│       └── UserMenu.tsx       # User dropdown menu
├── features/            # Feature-based modules
│   ├── dashboard/       # Dashboard feature
│   │   ├── components/  # Dashboard-specific components
│   │   ├── Dashboard.tsx
│   │   └── index.ts
│   ├── clinics/         # Clinics management
│   │   ├── components/
│   │   ├── Clinics.tsx
│   │   └── index.ts
│   └── patients/        # Patient management
│       ├── components/
│       ├── Patients.tsx
│       └── index.ts
├── layouts/             # Layout components
├── lib/                 # Utilities and constants
│   ├── constants.ts     # Shared constants
│   └── utils.ts         # Helper functions
├── pages/               # Remaining page components
├── types/               # TypeScript type definitions
└── styles/              # Global styles
```

## 🧩 Reusable Components

### DataTable

Reusable table component with responsive design and no horizontal scrolling.

```tsx
import { DataTable } from "@/components/ui/DataTable";

const columns = [
  { key: "name", label: "NAME", minWidth: "200px" },
  { key: "email", label: "EMAIL", minWidth: "180px" },
  { key: "actions", label: "ACTIONS", width: "80px" },
];

<DataTable
  columns={columns}
  data={data}
  isLoading={false}
  renderCell={(item, columnKey) => {
    // Custom cell rendering logic
  }}
/>;
```

### FilterBar

Search and filter component for data tables.

```tsx
import { FilterBar } from "@/components/ui/FilterBar";

<FilterBar
  searchValue={search}
  onSearchChange={setSearch}
  searchPlaceholder="Search patients..."
>
  {/* Additional filter components */}
</FilterBar>;
```

### Feature Components

Each feature (Dashboard, Clinics, Patients) has its own components directory with specialized table and UI components.

Location: `src/components/ui/theme-toggle.tsx`

```tsx
import { ThemeToggle } from "@/components/ui/theme-toggle";

<ThemeToggle />;
```

### UserMenu

Location: `src/components/ui/user-menu.tsx`

```tsx
import { UserMenu, UserMenuItem } from "@/components/ui/user-menu";
import { User, LogOut } from "lucide-react";

const items: UserMenuItem[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "logout", label: "Logout", icon: LogOut, color: "danger" },
];

<UserMenu user={{ name: "John Doe", avatar: "https://..." }} items={items} />;
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🧪 Testing Mode

The application is currently configured for testing with mock authentication:

### Login

- **Any email and password combination will work** for testing purposes
- The login simulates a 500ms API delay for realistic UX
- A mock user is created with admin privileges

### Demo Credentials

You can use the "Use Demo Account" button or enter any credentials:

- Email: Any valid email format (e.g., test@example.com)
- Password: Any password (minimum 6 characters)

### Not Implemented Features

Some features display "Not implemented" messages:

- Forgot password functionality
- Generate report functionality
- Download report functionality
- Save settings functionality
- Change photo functionality

To restore real API authentication, uncomment the original code in `src/services/authService.ts`.

## Pages Included

- **Dashboard** - Overview with stats cards and recent activity
- **Clinics** - Manage clinic locations with table, search, and CRUD modals
- **Patients** - Patient records with avatars, demographics, and management
- **Appointments** - Schedule and track appointments with status filtering
- **Settings** - User profile and preferences

## Project Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── sidebar.tsx       # Collapsible sidebar component
│   │   ├── navbar.tsx        # Top navigation bar
│   │   ├── theme-toggle.tsx  # Dark mode toggle
│   │   └── user-menu.tsx     # User dropdown menu
│   └── icons.tsx             # Icon components
├── layouts/
│   └── dashboard-layout.tsx  # Main dashboard layout
├── pages/
│   ├── dashboard.tsx        # Dashboard with stats
│   ├── clinics.tsx          # Clinics management
│   ├── patients.tsx         # Patients management
│   ├── appointments.tsx     # Appointments management
│   └── settings.tsx         # Settings page
├── App.tsx
├── main.tsx
└── provider.tsx
```

## Customization

### Change Logo

Edit `src/layouts/dashboard-layout.tsx`:

```tsx
<Sidebar items={menuItems} isOpen={isSidebarOpen} logo="YourApp" />
```

### Add Menu Items

Edit `src/layouts/dashboard-layout.tsx`:

```tsx
const menuItems: SidebarItem[] = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Settings, label: "Settings", path: "/settings" },
  // Add more items here
];
```

### Change Primary Color

Edit `tailwind.config.js`:

```js
plugins: [heroui({
  themes: {
    light: {
      colors: {
        primary: {
          DEFAULT: "#your-color",
          foreground: "#ffffff",
        },
      },
    },
  },
})],
```

## Tech Stack

- React 19
- TypeScript
- Hero UI v2
- Tailwind CSS v4
- Vite
- React Router
- Lucide Icons

## License

MIT
