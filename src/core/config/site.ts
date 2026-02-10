/**
 * Site configuration
 */

import { LayoutDashboard, User, Users } from "lucide-react";

export const siteConfig = {
  name: "ClinicManagement",
  description: "Modern clinic management system",
  version: "1.0.0",
  author: "ClinicManagement Team",
  url: "https://clinicmanagement.com",
  links: {
    github: "https://github.com/clinicmanagement",
    docs: "https://docs.clinicmanagement.com",
    support: "https://support.clinicmanagement.com",
  },
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
      key: "profile",
      label: "Profile",
      href: "/profile",
      icon: User,
    },
  ],
} as const;
