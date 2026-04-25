/**
 * Site configuration
 */

import { PERMISSIONS } from "@/core/constants";
import {
  Building2,
  KeyRound,
  LayoutDashboard,
  Mail,
  ShieldCheck,
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
      key: "invitations",
      label: "Invitations",
      href: "/invitations",
      icon: Mail,
      requiredPermission: PERMISSIONS.INVITE_STAFF,
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
      requiredPermission: null, // all authenticated users
    },
    {
      key: "audit",
      label: "Audit Logs",
      href: "/audit",
      icon: ShieldCheck,
      requiredPermission: null, // role-guarded (SuperAdmin only) via ROUTE_ACCESS
    },
    {
      key: "role-defaults",
      label: "Role Permissions",
      href: "/role-defaults",
      icon: KeyRound,
      requiredPermission: null, // role-guarded (SuperAdmin only) via ROUTE_ACCESS
    },
  ],
} as const;
