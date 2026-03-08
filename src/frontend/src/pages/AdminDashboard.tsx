import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart2,
  BookOpen,
  Bot,
  Calendar,
  CheckCircle,
  ClipboardList,
  GraduationCap,
  Loader2,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ChatbotUI } from "../components/ChatbotUI";
import { StatCard } from "../components/DashboardCards";
import { MaterialCard } from "../components/MaterialCard";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../components/auth";
import {
  useAllAssignments,
  useAllAttendance,
  useAllMaterials,
  useSystemAnalytics,
  useUserProfile,
} from "../hooks/useQueries";

type Section =
  | "overview"
  | "students"
  | "faculty"
  | "analytics"
  | "attendance"
  | "materials"
  | "assignments"
  | "profile"
  | "chatbot";

function MiniBarChart({ data, label }: { data: number[]; label: string }) {
  const max = Math.max(...data, 1);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex items-end gap-1 h-20">
        {data.map((v, i) => (
          <div
            key={months[i]}
            className="flex flex-1 flex-col items-center gap-1"
          >
            <div
              className="w-full rounded-t-sm gradient-bg opacity-80 transition-all"
              style={{ height: `${(v / max) * 72}px` }}
            />
            <span className="text-[9px] text-muted-foreground">
              {months[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [section, setSection] = useState<Section>("overview");

  const { logout } = useAuth();
  const navigate = useNavigate();
  const { data: profile } = useUserProfile();
  const { data: materials = [], isLoading: matLoading } = useAllMaterials();
  const { data: assignments = [], isLoading: assignLoading } =
    useAllAssignments();
  const { data: attendance = [], isLoading: attLoading } = useAllAttendance();
  const { data: analytics } = useSystemAnalytics();

  const [totalUsers, totalMaterials, totalAssignments, totalAttendance] =
    analytics ?? [0n, 0n, 0n, 0n];

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const sectionTitles: Record<Section, string> = {
    overview: "Admin Dashboard",
    students: "Student Management",
    faculty: "Faculty Management",
    analytics: "System Analytics",
    attendance: "Attendance Records",
    materials: "Study Materials",
    assignments: "Assignments",
    profile: "My Profile",
    chatbot: "AI Chatbot",
  };

  // Mock monthly data for charts
  const monthlyEnrollments = [42, 58, 71, 65, 88, 95];
  const monthlyActivity = [30, 45, 60, 52, 78, 84];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        userRole={"admin"}
        activeSection={section}
        onSectionChange={(s) => setSection(s as Section)}
        onLogout={handleLogout}
        userName={profile?.name ?? "Admin"}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar title={sectionTitles[section]} profile={profile ?? null} />

        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <AnimatePresence mode="wait">
            {/* OVERVIEW */}
            {section === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    System Overview
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    University LMS administration panel
                  </p>
                </div>

                {/* Analytics cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    title="Total Users"
                    value={Number(totalUsers)}
                    subtitle="Registered accounts"
                    icon={Users}
                    color="primary"
                    ocid="admin.analytics_card"
                    delay={0}
                  />
                  <StatCard
                    title="Study Materials"
                    value={Number(totalMaterials) || materials.length}
                    subtitle="Uploaded resources"
                    icon={BookOpen}
                    color="success"
                    ocid="admin.analytics_card"
                    delay={0.1}
                  />
                  <StatCard
                    title="Assignments"
                    value={Number(totalAssignments) || assignments.length}
                    subtitle="Active assignments"
                    icon={ClipboardList}
                    color="warning"
                    ocid="admin.analytics_card"
                    delay={0.2}
                  />
                  <StatCard
                    title="Attendance Records"
                    value={Number(totalAttendance) || attendance.length}
                    subtitle="Total records"
                    icon={Calendar}
                    color="danger"
                    ocid="admin.analytics_card"
                    delay={0.3}
                  />
                </div>

                {/* Charts */}
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp size={16} className="text-primary" />
                      <h3 className="font-semibold text-foreground text-sm">
                        Monthly Enrollments
                      </h3>
                    </div>
                    <MiniBarChart
                      data={monthlyEnrollments}
                      label="Students enrolled per month"
                    />
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart2 size={16} className="text-primary" />
                      <h3 className="font-semibold text-foreground text-sm">
                        Platform Activity
                      </h3>
                    </div>
                    <MiniBarChart
                      data={monthlyActivity}
                      label="Active users per month"
                    />
                  </div>
                </div>

                {/* Recent activity */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-semibold text-foreground mb-4">
                    System Health
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      {
                        label: "Server Uptime",
                        value: "99.9%",
                        color: "text-emerald-500 bg-emerald-500/10",
                      },
                      {
                        label: "API Response",
                        value: "< 200ms",
                        color: "text-blue-500 bg-blue-500/10",
                      },
                      {
                        label: "Active Sessions",
                        value: `${Math.floor(Number(totalUsers) * 0.3) || 24}`,
                        color: "text-violet-500 bg-violet-500/10",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`rounded-xl px-4 py-3 ${item.color}`}
                      >
                        <p className="text-xs opacity-70">{item.label}</p>
                        <p className="font-display font-bold text-lg">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STUDENTS */}
            {section === "students" && (
              <motion.div
                key="students"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div className="rounded-2xl border border-border bg-card p-8 text-center">
                  <Users
                    className="mx-auto mb-3 text-muted-foreground"
                    size={48}
                  />
                  <h3 className="font-display font-bold text-foreground mb-2">
                    Student Management
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Student accounts are managed via Internet Identity. Students
                    register themselves and select their role during signup.
                    View their activity through the Attendance and Analytics
                    sections.
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
                    Total registered: {Number(totalUsers)} users
                  </div>
                </div>
              </motion.div>
            )}

            {/* FACULTY */}
            {section === "faculty" && (
              <motion.div
                key="faculty"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div className="rounded-2xl border border-border bg-card p-8 text-center">
                  <GraduationCap
                    className="mx-auto mb-3 text-muted-foreground"
                    size={48}
                  />
                  <h3 className="font-display font-bold text-foreground mb-2">
                    Faculty Management
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Faculty members are authenticated via Internet Identity.
                    They register and select the Faculty role. View their
                    uploaded materials and created assignments in the respective
                    sections.
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
                    Materials uploaded: {materials.length}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ANALYTICS */}
            {section === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      label: "Total Users",
                      value: Number(totalUsers),
                      icon: Users,
                      color: "primary" as const,
                    },
                    {
                      label: "Materials",
                      value: Number(totalMaterials) || materials.length,
                      icon: BookOpen,
                      color: "success" as const,
                    },
                    {
                      label: "Assignments",
                      value: Number(totalAssignments) || assignments.length,
                      icon: ClipboardList,
                      color: "warning" as const,
                    },
                    {
                      label: "Attendance Records",
                      value: Number(totalAttendance) || attendance.length,
                      icon: Calendar,
                      color: "danger" as const,
                    },
                  ].map((card, i) => (
                    <StatCard
                      key={card.label}
                      title={card.label}
                      value={card.value}
                      icon={card.icon}
                      color={card.color}
                      ocid="admin.analytics_card"
                      delay={i * 0.1}
                    />
                  ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <BarChart2 size={16} className="text-primary" />
                      6-Month Overview
                    </h3>
                    <MiniBarChart
                      data={monthlyEnrollments}
                      label="Enrollments"
                    />
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Quick Stats
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          label: "Attendance Rate",
                          value:
                            attendance.length > 0
                              ? `${Math.round((attendance.filter((a) => a.present).length / attendance.length) * 100)}%`
                              : "N/A",
                        },
                        {
                          label: "Avg Assignments",
                          value:
                            assignments.length > 0
                              ? `${assignments.length}`
                              : "0",
                        },
                        {
                          label: "Materials/Subject",
                          value:
                            materials.length > 0 ? `${materials.length}` : "0",
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="flex items-center justify-between"
                        >
                          <p className="text-xs text-muted-foreground">
                            {stat.label}
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ATTENDANCE */}
            {section === "attendance" && (
              <motion.div
                key="attendance"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="font-semibold text-foreground mb-3">
                  All Attendance Records ({attendance.length})
                </h3>
                {attLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-12 rounded-lg shimmer" />
                    ))}
                  </div>
                ) : attendance.length === 0 ? (
                  <div
                    className="rounded-xl border border-dashed border-border p-12 text-center"
                    data-ocid="attendance.empty_state"
                  >
                    <Calendar
                      className="mx-auto mb-3 text-muted-foreground"
                      size={40}
                    />
                    <p className="text-muted-foreground">No records yet</p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border overflow-hidden">
                    <Table data-ocid="attendance.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Marked By</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendance.map((record, i) => (
                          <TableRow
                            key={`att-${record.date}-${i}`}
                            data-ocid={`attendance.row.${i + 1}`}
                          >
                            <TableCell className="font-mono text-xs text-muted-foreground max-w-32 truncate">
                              {record.student.toString?.() ??
                                String(record.student)}
                            </TableCell>
                            <TableCell className="text-sm">
                              {record.date}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  record.present
                                    ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 text-[10px]"
                                    : "text-red-600 bg-red-500/10 border-red-500/20 text-[10px]"
                                }
                              >
                                {record.present ? (
                                  <span className="flex items-center gap-1">
                                    <CheckCircle size={9} /> Present
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <XCircle size={9} /> Absent
                                  </span>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground max-w-32 truncate">
                              {record.markedBy.toString?.() ??
                                String(record.markedBy)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </motion.div>
            )}

            {/* MATERIALS */}
            {section === "materials" && (
              <motion.div
                key="materials"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="font-semibold text-foreground mb-3">
                  All Study Materials ({materials.length})
                </h3>
                {matLoading ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-28 rounded-xl shimmer" />
                    ))}
                  </div>
                ) : materials.length === 0 ? (
                  <div
                    className="rounded-xl border border-dashed border-border p-12 text-center"
                    data-ocid="materials.empty_state"
                  >
                    <BookOpen
                      className="mx-auto mb-3 text-muted-foreground"
                      size={40}
                    />
                    <p className="text-muted-foreground">
                      No materials uploaded
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {materials.map((m, i) => (
                      <MaterialCard key={m.title} material={m} index={i} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ASSIGNMENTS */}
            {section === "assignments" && (
              <motion.div
                key="assignments"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="font-semibold text-foreground mb-3">
                  All Assignments ({assignments.length})
                </h3>
                {assignLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 rounded-lg shimmer" />
                    ))}
                  </div>
                ) : assignments.length === 0 ? (
                  <div
                    className="rounded-xl border border-dashed border-border p-12 text-center"
                    data-ocid="assignments.empty_state"
                  >
                    <ClipboardList
                      className="mx-auto mb-3 text-muted-foreground"
                      size={40}
                    />
                    <p className="text-muted-foreground">No assignments yet</p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border overflow-hidden">
                    <Table data-ocid="assignments.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Deadline</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assignments.map((a, i) => (
                          <TableRow
                            key={`asgn-${a.title}-${i}`}
                            data-ocid={`assignments.row.${i + 1}`}
                          >
                            <TableCell className="font-medium text-sm">
                              {a.title}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="text-[10px] border-primary/20 text-primary"
                              >
                                {a.subject}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {a.deadline}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground max-w-40 truncate">
                              {a.description}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </motion.div>
            )}

            {/* CHATBOT (Admin can also use AI) */}
            {section === "chatbot" && (
              <motion.div
                key="chatbot"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="h-[calc(100vh-11rem)] rounded-2xl border border-border bg-card overflow-hidden"
              >
                <ChatbotUI />
              </motion.div>
            )}

            {/* PROFILE */}
            {section === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-lg"
              >
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-bg text-2xl font-bold text-white">
                      {profile?.name?.charAt(0) ?? "A"}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground">
                        {profile?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {profile?.role}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
                      <span className="text-xs text-muted-foreground">
                        Email
                      </span>
                      <span className="text-sm text-foreground">
                        {profile?.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
                      <span className="text-xs text-muted-foreground">
                        Role
                      </span>
                      <span className="text-sm text-foreground capitalize">
                        {profile?.role}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Floating chatbot button */}
      {section !== "chatbot" && (
        <motion.button
          type="button"
          onClick={() => setSection("chatbot")}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-bg shadow-glow-lg text-white"
        >
          <Bot size={22} />
        </motion.button>
      )}
    </div>
  );
}
