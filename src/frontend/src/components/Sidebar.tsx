import {
  BarChart2,
  BookOpen,
  Bot,
  Calendar,
  ChevronLeft,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  PlusSquare,
  Upload,
  User,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { UserRole } from "../backend.d";
import { cn } from "../lib/utils";

interface SidebarProps {
  userRole: UserRole | string;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  userName: string;
}

const navConfig: Record<
  string,
  { label: string; icon: React.ElementType; section: string; ocid: string }[]
> = {
  student: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      section: "overview",
      ocid: "sidebar.dashboard_link",
    },
    {
      label: "AI Chatbot",
      icon: Bot,
      section: "chatbot",
      ocid: "sidebar.chatbot_link",
    },
    {
      label: "Attendance",
      icon: Calendar,
      section: "attendance",
      ocid: "sidebar.attendance_link",
    },
    {
      label: "Study Materials",
      icon: BookOpen,
      section: "materials",
      ocid: "sidebar.materials_link",
    },
    {
      label: "Assignments",
      icon: ClipboardList,
      section: "assignments",
      ocid: "sidebar.assignments_link",
    },
    {
      label: "Profile",
      icon: User,
      section: "profile",
      ocid: "sidebar.profile_link",
    },
  ],
  faculty: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      section: "overview",
      ocid: "sidebar.dashboard_link",
    },
    {
      label: "Upload Materials",
      icon: Upload,
      section: "materials",
      ocid: "sidebar.materials_link",
    },
    {
      label: "Create Assignment",
      icon: PlusSquare,
      section: "assignments",
      ocid: "sidebar.assignments_link",
    },
    {
      label: "Attendance",
      icon: Calendar,
      section: "attendance",
      ocid: "sidebar.attendance_link",
    },
    {
      label: "AI Chatbot",
      icon: Bot,
      section: "chatbot",
      ocid: "sidebar.chatbot_link",
    },
    {
      label: "Profile",
      icon: User,
      section: "profile",
      ocid: "sidebar.profile_link",
    },
  ],
  admin: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      section: "overview",
      ocid: "sidebar.dashboard_link",
    },
    {
      label: "Students",
      icon: Users,
      section: "students",
      ocid: "sidebar.dashboard_link",
    },
    {
      label: "Faculty",
      icon: GraduationCap,
      section: "faculty",
      ocid: "sidebar.dashboard_link",
    },
    {
      label: "Analytics",
      icon: BarChart2,
      section: "analytics",
      ocid: "sidebar.dashboard_link",
    },
    {
      label: "Attendance",
      icon: Calendar,
      section: "attendance",
      ocid: "sidebar.attendance_link",
    },
    {
      label: "Materials",
      icon: FileText,
      section: "materials",
      ocid: "sidebar.materials_link",
    },
    {
      label: "Assignments",
      icon: ClipboardList,
      section: "assignments",
      ocid: "sidebar.assignments_link",
    },
    {
      label: "Profile",
      icon: User,
      section: "profile",
      ocid: "sidebar.profile_link",
    },
  ],
};

export function Sidebar({
  userRole,
  activeSection,
  onSectionChange,
  onLogout,
  userName,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navItems = navConfig[userRole as string] || navConfig.student;

  return (
    <motion.aside
      className="relative flex h-screen flex-col border-r border-border bg-sidebar"
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ minWidth: collapsed ? 64 : 240 }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg gradient-bg">
            <GraduationCap className="h-4.5 w-4.5 text-white" size={18} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-display font-bold text-sidebar-foreground whitespace-nowrap overflow-hidden"
              >
                UniLearn
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.section;
            return (
              <li key={item.section + item.label}>
                <button
                  type="button"
                  onClick={() => onSectionChange(item.section)}
                  data-ocid={item.ocid}
                  className={cn(
                    "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-lg gradient-bg"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon
                    className={cn(
                      "relative z-10 flex-shrink-0",
                      isActive ? "text-white" : "",
                    )}
                    size={18}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                          "relative z-10 whitespace-nowrap overflow-hidden",
                          isActive ? "text-white" : "",
                        )}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: User + Logout */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full gradient-bg text-xs font-bold text-white uppercase">
            {userName.charAt(0) || "U"}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="min-w-0 flex-1 overflow-hidden"
              >
                <p className="truncate text-xs font-semibold text-sidebar-foreground">
                  {userName}
                </p>
                <p className="truncate text-[10px] capitalize text-muted-foreground">
                  {userRole as string}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && (
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onLogout}
                data-ocid="nav.logout_button"
                className="flex-shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-destructive transition-colors"
                title="Logout"
              >
                <LogOut size={14} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-secondary transition-colors z-10"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <motion.div
          animate={{ rotate: collapsed ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronLeft size={12} />
        </motion.div>
      </button>
    </motion.aside>
  );
}
