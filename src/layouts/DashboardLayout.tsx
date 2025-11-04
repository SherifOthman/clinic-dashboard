import {
  BarChart3,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Stethoscope,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { Navbar } from "@/components/ui/Navbar";
import { Sidebar, SidebarItem } from "@/components/ui/Sidebar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserMenu, UserMenuItem } from "@/components/ui/UserMenu";
import { getUser } from "@/services/auth";
import { logout } from "@/services/authService";

const menuItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Building2, label: "Clinics", path: "/clinics" },
  { icon: Users, label: "Patients", path: "/patients" },
  { icon: Stethoscope, label: "Doctors", path: "/doctors" },
  { icon: UserCheck, label: "Staff", path: "/staff" },
  { icon: Calendar, label: "Appointments", path: "/appointments" },
  { icon: FileText, label: "Medical Records", path: "/medical-records" },
  { icon: Package, label: "Inventory", path: "/inventory" },
  { icon: CreditCard, label: "Billing", path: "/billing" },
  { icon: BarChart3, label: "Reports", path: "/reports" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  const userMenuItems: UserMenuItem[] = [
    {
      key: "profile",
      label: "Profile",
      icon: User,
      onPress: () => navigate("/profile"),
    },
    {
      key: "logout",
      label: "Logout",
      icon: LogOut,
      color: "danger",
      onPress: handleLogout,
    },
  ];

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const currentPage = menuItems.find(
    (item) => item.path === location.pathname
  )?.label;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed inset-y-0 left-0 z-50 transform bg-content1 border-r border-divider transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <Sidebar isOpen={isSidebarOpen} items={menuItems} logo="ClinicMS" />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 transform bg-content1 border-r border-divider transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          isOpen={true}
          items={menuItems}
          logo="ClinicMS"
          onItemClick={() => setIsMobileSidebarOpen(false)}
        />
      </aside>

      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div
          aria-label="Close sidebar"
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          role="button"
          tabIndex={0}
          onClick={() => setIsMobileSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-16"
        }`}
      >
        <Navbar title={currentPage} onMenuClick={toggleSidebar}>
          <ThemeToggle />
          <UserMenu items={userMenuItems} user={user || { name: "User" }} />
        </Navbar>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
