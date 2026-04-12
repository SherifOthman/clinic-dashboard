/**
 * Site configuration
 */

import {
  Building2,
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
    },
    {
      key: "patients",
      label: "Patients",
      href: "/patients",
      icon: Users,
    },
    {
      key: "staff",
      label: "Staff",
      href: "/staff",
      icon: UserCog,
    },
    {
      key: "invitations",
      label: "Invitations",
      href: "/invitations",
      icon: Mail,
    },
    {
      key: "branches",
      label: "Branches",
      href: "/branches",
      icon: Building2,
    },
    {
      key: "profile",
      label: "Profile",
      href: "/profile",
      icon: User,
    },
    {
      key: "audit",
      label: "Audit Logs",
      href: "/audit",
      icon: ShieldCheck,
    },
  ],
} as const;
