# Testing Setup Documentation

## Overview

This document describes the testing configuration applied to the Clinic Management System.

## Changes Made

### 1. Mock Authentication (`src/services/authService.ts`)

- Modified the `login` function to accept **any email and password** for testing
- Simulates a 500ms API delay for realistic user experience
- Creates a mock user with the following properties:
  - ID: "1"
  - Email: User-provided email
  - Name: "Test User"
  - Phone: "+1 (555) 123-4567"
  - Role: "admin"
- Original API code is preserved as comments for easy restoration

### 2. Not Implemented Component (`src/components/ui/NotImplemented.tsx`)

Created a reusable component and helper function for displaying "not implemented" messages:

- `NotImplemented` - Visual component for displaying not implemented features
- `showNotImplemented()` - Helper function that shows an alert

### 3. Updated Pages

#### Login Page (`src/pages/Login.tsx`)

- Added "Not implemented" alert for "Forgot password" link
- Imported and uses `showNotImplemented` helper

#### Reports Page (`src/pages/Reports.tsx`)

- "Generate report" button shows "Not implemented" message
- "Download report" button shows "Not implemented" message

#### Settings Page (`src/pages/Settings.tsx`)

- "Save changes" button shows "Not implemented" message
- "Change photo" button shows "Not implemented" message

### 4. Documentation (`README.md`)

Added a "Testing Mode" section explaining:

- How to login with any credentials
- Which features show "not implemented" messages
- How to restore real API authentication

## How to Use

### Login

1. Navigate to the login page
2. Enter any valid email format (e.g., test@example.com)
3. Enter any password (minimum 6 characters)
4. Click "Sign In" or use the "Use Demo Account" button

### Testing Features

- All implemented features work with mock data
- Features showing "Not implemented" will display an alert message
- No backend API is required for testing

## Restoring Production Mode

To restore real API authentication:

1. Open `src/services/authService.ts`
2. Remove or comment out the mock authentication code
3. Uncomment the original API code block
4. Ensure your API endpoint is configured in `.env` files

## Features Status

### ✅ Fully Implemented (with mock data)

- Dashboard
- Clinics Management
- Patients Management
- Doctors Management
- Staff Management
- Appointments
- Medical Records
- Inventory
- Billing
- Profile

### ⚠️ Shows "Not Implemented"

- Forgot Password
- Generate Report
- Download Report
- Save Settings
- Change Photo

All other features are fully functional with mock data for testing purposes.
