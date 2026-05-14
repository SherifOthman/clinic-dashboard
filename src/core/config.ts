/**
 * Site configuration
 */

import { PERMISSIONS } from "@/core/constants";
import {
  BarChart3,
  Building2,
  CalendarClock,
  FlaskConical,
  LayoutDashboard,
  MessageSquare,
  ShieldCheck,
  Star,
  Stethoscope,
  User,
  UserCog,
  Users,
} from "lucide-react";

export const siteConfig = {
  name: "ClinicManagement",
  description: "Modern clinic management system",
  version: "1.0.0",
  author: "ClinicManagement Team",
  url: "https://clinicmanagement.com",
  sidebarItems: [
    {
      key: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      requiredPermission: null, // all authenticated users
    },
    {
      key: "appointments",
      label: "Appointments",
      href: "/appointments",
      icon: CalendarClock,
      requiredPermission: PERMISSIONS.VIEW_APPOINTMENTS,
    },
    {
      key: "patients",
      label: "Patients",
      href: "/patients",
      icon: Users,
      requiredPermission: PERMISSIONS.VIEW_PATIENTS,
    },
    {
      key: "staff",
      label: "Staff",
      href: "/staff",
      icon: UserCog,
      requiredPermission: PERMISSIONS.VIEW_STAFF,
    },
    {
      key: "branches",
      label: "Branches",
      href: "/branches",
      icon: Building2,
      requiredPermission: PERMISSIONS.VIEW_BRANCHES,
    },
    {
      key: "profile",
      label: "Profile",
      href: "/profile",
      icon: User,
      requiredPermission: null,
    },
    {
      key: "usage",
      label: "Usage & Limits",
      href: "/usage",
      icon: BarChart3,
      requiredPermission: null,
    },
    {
      key: "audit",
      label: "Audit Logs",
      href: "/audit",
      icon: ShieldCheck,
      requiredPermission: null,
    },
    {
      key: "messages",
      label: "Messages",
      href: "/messages",
      icon: MessageSquare,
      requiredPermission: null,
    },
    {
      key: "reviews",
      label: "Reviews",
      href: "/reviews",
      icon: Star,
      requiredPermission: null,
    },
    // ── SuperAdmin reference data management ──────────────────────────────────
    {
      key: "adminSpecializations",
      label: "Specializations",
      href: "/admin/specializations",
      icon: Stethoscope,
      requiredPermission: null,
    },
    {
      key: "adminChronicDiseases",
      label: "Chronic Diseases",
      href: "/admin/chronic-diseases",
      icon: FlaskConical,
      requiredPermission: null,
    },
  ],
} as const;
