# ⚛️ ClinicCare Dashboard - Multi-Tenant Admin Interface

> **React Application** with TypeScript, internationalization, and state management

⚠️ **This application is currently in development and not yet production-ready**

📝 **This README was written with AI assistance**

## 🎯 **What This Project Is**

A healthcare admin dashboard for managing multiple clinics with patient management, user administration, file uploads, and full Arabic/English support with RTL layout.

### **🚀 Live Demo**

- **Dashboard**: https://clinic-dashboard-demo.vercel.app

## 🛠️ **Technology Stack**

| Technology          | Purpose                              |
| ------------------- | ------------------------------------ |
| **React 19**        | Latest UI framework                  |
| **TypeScript**      | Type safety and developer experience |
| **Vite**            | Fast development server and builds   |
| **TanStack Query**  | Server state management and caching  |
| **React Hook Form** | Form handling with validation        |
| **Zod**             | Type-safe schema validation          |
| **HeroUI**          | Professional component library       |
| **Tailwind CSS**    | Utility-first styling                |
| **i18next**         | Complete internationalization        |
| **React Router**    | Client-side routing with protection  |

## ✅ **Implemented Features**

### **Authentication System**

- ✅ Complete login/logout flow with JWT tokens
- ✅ User registration with email verification
- ✅ Password reset and forgot password flow
- ✅ Email confirmation and resend verification
- ✅ Password change functionality
- ✅ Automatic token refresh on 401 errors
- ✅ Protected routes with role checking
- ✅ Session persistence with AuthProvider context

### **Profile Management** 🆕

- ✅ User profile editing with validation
- ✅ **Profile image upload with preview and validation**
- ✅ **Profile image deletion with confirmation**
- ✅ **Real-time image updates with cache busting**
- ✅ Password change functionality
- ✅ Account settings management
- ✅ Email verification status display
- ✅ **File type and size validation (5MB max)**

### **Patient Management**

- ✅ Patient list with pagination, search, and filtering
- ✅ Create new patient profiles with validation
- ✅ Edit existing patient information
- ✅ Delete patients with confirmation dialog
- ✅ Chronic disease assignment and management
- ✅ Multiple phone numbers support
- ✅ Sorting and pagination
- ✅ **GeoNames-based location selection (country, state, city)**

### **Onboarding System** 🆕

- ✅ Multi-step clinic setup wizard (2 steps)
- ✅ Subscription plan selection with feature comparison
- ✅ Clinic information collection and validation
- ✅ **Branch details with GeoNames location integration**
- ✅ Progress indicator with step validation
- ✅ Form persistence between steps
- ✅ Phone numbers input with validation
- ✅ **Bilingual location names (Arabic/English)**

### **User Interface & Experience**

- ✅ Fully responsive design (mobile-first approach)
- ✅ Dark/light theme switching with persistence
- ✅ Loading states for all async operations
- ✅ Comprehensive error handling with user-friendly messages
- ✅ Toast notifications for all actions
- ✅ Modal dialogs for confirmations and forms
- ✅ Data tables with sorting and pagination
- ✅ Real-time form validation with error display
- ✅ **Image preview modals for profile pictures**

### **Internationalization**

- ✅ Complete English interface (750+ translation keys)
- ✅ Complete Arabic interface with RTL layout
- ✅ Dynamic language switching with persistence
- ✅ RTL-aware animations and transitions
- ✅ Localized date/time formatting
- ✅ Cultural number formatting
- ✅ Direction-aware icons and layouts

## 🏗️ **Architecture**

**Feature-Based Structure:**

- **15 Pages** - Login, Register, Dashboard, Patients, Profile, etc.
- **55+ Components** - Reusable UI components with proper props
- **25+ Custom Hooks** - Business logic abstraction
- **7 API Services** - Type-safe API integration
- **Core Utilities** - Shared functions and helpers

**State Management:**

- **TanStack Query** for server state (caching, synchronization)
- **React Context** for global UI state (theme, language, auth)
- **Local State** with useState/useReducer for component state
- **React Hook Form** for complex form state

## 🌍 **Internationalization**

**Complete Translation Support:**

- **English** - 750+ translation keys
- **Arabic** - 750+ translation keys with RTL layout

**RTL Implementation:**

- Automatic layout direction switching
- RTL-aware animations and transitions
- Proper text alignment for each language
- Cultural formatting for dates, numbers, and currency

## 🔌 **API Integration**

**7 API Service Files:**

- **authApi** - 12 authentication endpoints
- **profileApi** - 3 profile management endpoints (update, upload image, delete image) 🆕
- **patientsApi** - 6 patient management endpoints
- **chronicDiseasesApi** - Chronic disease management
- **locationApi** - 8 GeoNames location service endpoints 🆕
- **onboardingApi** - Clinic setup and subscription plans
- **staffApi** - Staff invitation management

**Custom Hooks (25+):**

- useAuth, usePaginatedPatients, usePatients, usePatient
- useCreatePatient, useUpdatePatient, useDeletePatient
- **useUpdateProfileImage, useDeleteProfileImage** 🆕
- useCountries, useStates, useCities, useLocationState
- useFormWithValidation, useToast, useLoadingState
- useTableState, useDebounce, useDateFormat, useGenderDisplay

## 📝 **Forms & Validation**

**Zod Schemas (12+):**

- **Auth:** login, register, forgotPassword, resetPassword, changePassword
- **Patients:** createPatientSchema, updatePatientSchema
- **Onboarding:** step1Schema (subscription), step2Schema (branch details) 🆕
- **Profile:** updateProfileSchema
- **Location:** Country, state, city selection with GeoNames IDs

**Validation Features:**

- Real-time validation with error display
- Phone number validation (7-15 digits)
- Password confirmation matching
- Date validation (past dates only)
- **File upload validation (type, size)** 🆕
- Custom error messages with i18n support

## 🚀 **Quick Start**

```bash
# Prerequisites: Node.js 18+, Backend API running on port 5000
git clone https://github.com/SherifOthman/clinic-dashboard.git
cd clinic-dashboard
npm install
npm run dev -- --port 3001
# Access: http://localhost:3001
```

## 🎯 **User Roles & Access**

**Super Admin** - Full system access
**Clinic Owner** - Patient and staff management
**Doctor** - Patient records and medical data
**Receptionist** - Patient registration and scheduling

## 📊 **Project Stats**

- **Pages**: 15 (including auth flows and error pages)
- **Components**: 55+ reusable components
- **Custom Hooks**: 25+ for business logic
- **Translation Keys**: 750+ (English + Arabic)
- **Form Schemas**: 12+ Zod validation schemas
- **API Endpoints**: 40+ integrated endpoints

## 🔐 **Security Features**

- JWT token-based authentication with refresh
- Automatic token refresh and logout on expiry
- Role-based route protection
- Input validation on all forms with Zod
- XSS protection and secure file uploads
- **File type and size validation on client side**
- CSRF protection with API integration

## 🆕 **Recent Updates**

- ✅ Added profile image upload with multipart/form-data
- ✅ Implemented profile image deletion with confirmation
- ✅ Integrated GeoNames for location services
- ✅ Updated onboarding to use GeoNames location structure
- ✅ Added bilingual location names (Arabic/English)
- ✅ Implemented real-time image updates with cache busting
- ✅ Added file validation (type, size) with user feedback
- ✅ Enhanced profile page with image management
- ✅ Added translation keys for new features

---

**Demonstrates:** React development, TypeScript, State management, Internationalization, UI/UX, API integration, File uploads
