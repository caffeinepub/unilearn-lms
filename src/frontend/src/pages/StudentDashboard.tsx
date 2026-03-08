import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Bot,
  Calendar,
  CheckCircle,
  ClipboardList,
  Loader2,
  Sparkles,
  User,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Assignment } from "../backend.d";
import { AssignmentCard } from "../components/AssignmentCard";
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
  useAllSubjects,
  useSaveProfile,
  useSubmitAssignment,
  useUserProfile,
} from "../hooks/useQueries";

type Section =
  | "overview"
  | "chatbot"
  | "attendance"
  | "materials"
  | "assignments"
  | "profile";

function FloatingChatButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-bg shadow-glow-lg text-white"
      aria-label="Open AI Chatbot"
    >
      <Bot size={22} />
    </motion.button>
  );
}

export default function StudentDashboard() {
  const [section, setSection] = useState<Section>("overview");
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [submitNotes, setSubmitNotes] = useState("");
  const [submitFile, setSubmitFile] = useState<File | null>(null);
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: materials = [], isLoading: materialsLoading } =
    useAllMaterials();
  const { data: assignments = [], isLoading: assignmentsLoading } =
    useAllAssignments();
  const { data: attendance = [], isLoading: attendanceLoading } =
    useAllAttendance();
  const { data: subjects = [] } = useAllSubjects();
  const submitAssignment = useSubmitAssignment();
  const saveProfile = useSaveProfile();

  // Calculate stats
  const presentCount = attendance.filter((a) => a.present).length;
  const attendancePct =
    attendance.length > 0
      ? Math.round((presentCount / attendance.length) * 100)
      : 0;
  const pendingAssignments = assignments.length;

  const sectionTitles: Record<Section, string> = {
    overview: "Student Dashboard",
    chatbot: "AI Chatbot",
    attendance: "My Attendance",
    materials: "Study Materials",
    assignments: "Assignments",
    profile: "My Profile",
  };

  const filteredMaterials =
    subjectFilter === "all"
      ? materials
      : materials.filter((m) => m.subject === subjectFilter);

  const handleOpenSubmit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSubmitNotes("");
    setSubmitFile(null);
    setSubmitModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedAssignment || !submitFile) {
      toast.error("Please attach a file");
      return;
    }
    try {
      await submitAssignment.mutateAsync({
        assignmentTitle: selectedAssignment.title,
        notes: submitNotes,
        file: submitFile,
      });
      toast.success("Assignment submitted successfully!");
      setSubmitModalOpen(false);
    } catch {
      toast.error("Failed to submit. Please try again.");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      await saveProfile.mutateAsync({
        name: profileName || profile.name,
        email: profileEmail || profile.email,
        role: profile.role,
      });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  if (profileLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        userRole={"student"}
        activeSection={section}
        onSectionChange={(s) => setSection(s as Section)}
        onLogout={handleLogout}
        userName={profile?.name ?? "Student"}
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
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    Welcome back, {profile?.name?.split(" ")[0] ?? "Student"} 👋
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Here's what's happening with your learning
                  </p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    title="Attendance"
                    value={`${attendancePct}%`}
                    subtitle={`${presentCount} of ${attendance.length} classes`}
                    icon={Calendar}
                    color="success"
                    ocid="student.attendance_card"
                    delay={0}
                  />
                  <StatCard
                    title="Study Materials"
                    value={materials.length}
                    subtitle="Available resources"
                    icon={BookOpen}
                    color="primary"
                    delay={0.1}
                  />
                  <StatCard
                    title="Pending Assignments"
                    value={pendingAssignments}
                    subtitle="To be submitted"
                    icon={ClipboardList}
                    color="warning"
                    delay={0.2}
                  />
                  <StatCard
                    title="Subjects"
                    value={subjects.length}
                    subtitle="Enrolled courses"
                    icon={BookOpen}
                    color="primary"
                    delay={0.3}
                  />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Recent Materials */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">
                        Recent Materials
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-primary h-6 px-2"
                        onClick={() => setSection("materials")}
                      >
                        View all
                      </Button>
                    </div>
                    {materialsLoading ? (
                      <div className="space-y-3">
                        {[1, 2].map((i) => (
                          <div key={i} className="h-20 rounded-xl shimmer" />
                        ))}
                      </div>
                    ) : materials.length === 0 ? (
                      <div
                        className="rounded-xl border border-dashed border-border p-8 text-center"
                        data-ocid="materials.empty_state"
                      >
                        <BookOpen
                          className="mx-auto mb-2 text-muted-foreground"
                          size={32}
                        />
                        <p className="text-sm text-muted-foreground">
                          No materials yet
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {materials.slice(0, 3).map((m, i) => (
                          <MaterialCard key={m.title} material={m} index={i} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Upcoming Assignments */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">
                        Upcoming Assignments
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-primary h-6 px-2"
                        onClick={() => setSection("assignments")}
                      >
                        View all
                      </Button>
                    </div>
                    {assignmentsLoading ? (
                      <div className="space-y-3">
                        {[1, 2].map((i) => (
                          <div key={i} className="h-20 rounded-xl shimmer" />
                        ))}
                      </div>
                    ) : assignments.length === 0 ? (
                      <div
                        className="rounded-xl border border-dashed border-border p-8 text-center"
                        data-ocid="assignments.empty_state"
                      >
                        <ClipboardList
                          className="mx-auto mb-2 text-muted-foreground"
                          size={32}
                        />
                        <p className="text-sm text-muted-foreground">
                          No assignments yet
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {assignments.slice(0, 3).map((a, i) => (
                          <AssignmentCard
                            key={a.title}
                            assignment={a}
                            index={i}
                            showSubmit
                            onSubmit={handleOpenSubmit}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick AI Widget */}
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-bg">
                      <Sparkles size={14} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground">
                      Quick AI Help
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      "Explain a concept",
                      "Study schedule",
                      "Assignment tips",
                    ].map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => setSection("chatbot")}
                        className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary hover:bg-primary/20 transition-colors text-left"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* CHATBOT */}
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

            {/* ATTENDANCE */}
            {section === "attendance" && (
              <motion.div
                key="attendance"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* Summary */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Overall Attendance
                      </p>
                      <p className="font-display text-3xl font-bold text-foreground">
                        {attendancePct}%
                      </p>
                    </div>
                    <div
                      className={`text-sm font-medium px-3 py-1.5 rounded-full ${
                        attendancePct >= 75
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {attendancePct >= 75 ? "Good Standing" : "At Risk"}
                    </div>
                  </div>
                  <Progress value={attendancePct} className="h-2" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {presentCount} present out of {attendance.length} total
                    classes
                  </p>
                </div>

                {/* Records */}
                {attendanceLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-14 rounded-lg shimmer" />
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
                    <p className="text-muted-foreground">
                      No attendance records yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {attendance.map((record, i) => (
                      <motion.div
                        key={`${record.date}-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
                        data-ocid={`attendance.item.${i + 1}`}
                      >
                        <div className="flex items-center gap-3">
                          {record.present ? (
                            <CheckCircle
                              className="text-emerald-500 flex-shrink-0"
                              size={16}
                            />
                          ) : (
                            <XCircle
                              className="text-red-500 flex-shrink-0"
                              size={16}
                            />
                          )}
                          <span className="text-sm text-foreground">
                            {record.date}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            record.present
                              ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
                              : "text-red-600 bg-red-500/10 border-red-500/20"
                          }
                        >
                          {record.present ? "Present" : "Absent"}
                        </Badge>
                      </motion.div>
                    ))}
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
                className="space-y-5"
              >
                {/* Subject filter */}
                <Tabs value={subjectFilter} onValueChange={setSubjectFilter}>
                  <TabsList className="flex-wrap h-auto gap-1">
                    <TabsTrigger
                      value="all"
                      data-ocid="materials.subject_select"
                    >
                      All Subjects
                    </TabsTrigger>
                    {subjects.map((s) => (
                      <TabsTrigger key={s} value={s}>
                        {s}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                {materialsLoading ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-28 rounded-xl shimmer" />
                    ))}
                  </div>
                ) : filteredMaterials.length === 0 ? (
                  <div
                    className="rounded-xl border border-dashed border-border p-12 text-center"
                    data-ocid="materials.empty_state"
                  >
                    <BookOpen
                      className="mx-auto mb-3 text-muted-foreground"
                      size={40}
                    />
                    <p className="text-muted-foreground">
                      No materials for this subject
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredMaterials.map((m, i) => (
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
                className="space-y-3"
              >
                {assignmentsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-28 rounded-xl shimmer" />
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
                  assignments.map((a, i) => (
                    <AssignmentCard
                      key={a.title}
                      assignment={a}
                      index={i}
                      showSubmit
                      onSubmit={handleOpenSubmit}
                    />
                  ))
                )}
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
                <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-bg text-2xl font-bold text-white font-display">
                      {profile?.name?.charAt(0) ?? "S"}
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

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="profile-name">Full Name</Label>
                      <Input
                        id="profile-name"
                        defaultValue={profile?.name ?? ""}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="profile-email">Email</Label>
                      <Input
                        id="profile-email"
                        type="email"
                        defaultValue={profile?.email ?? ""}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Role</Label>
                      <div className="flex h-10 items-center rounded-lg border border-border bg-secondary/50 px-3 text-sm text-muted-foreground capitalize">
                        <User size={14} className="mr-2" />
                        {profile?.role}
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={saveProfile.isPending}
                      className="gradient-bg text-white border-0 hover:opacity-90"
                    >
                      {saveProfile.isPending ? (
                        <>
                          <Loader2 size={14} className="mr-2 animate-spin" />{" "}
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Submit Assignment Modal */}
      <Dialog open={submitModalOpen} onOpenChange={setSubmitModalOpen}>
        <DialogContent data-ocid="assignment.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              Submit: {selectedAssignment?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="submit-notes">Notes (optional)</Label>
              <Textarea
                id="submit-notes"
                placeholder="Add any notes or comments..."
                value={submitNotes}
                onChange={(e) => setSubmitNotes(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="submit-file">Attach File *</Label>
              <Input
                id="submit-file"
                type="file"
                onChange={(e) => setSubmitFile(e.target.files?.[0] ?? null)}
                data-ocid="assignment.upload_button"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSubmitModalOpen(false)}
              data-ocid="assignment.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!submitFile || submitAssignment.isPending}
              data-ocid="assignment.confirm_button"
              className="gradient-bg text-white border-0 hover:opacity-90"
            >
              {submitAssignment.isPending ? (
                <>
                  <Loader2 size={14} className="mr-2 animate-spin" />{" "}
                  Submitting...
                </>
              ) : (
                "Submit Assignment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating chatbot button (only outside chatbot section) */}
      {section !== "chatbot" && (
        <FloatingChatButton onClick={() => setSection("chatbot")} />
      )}
    </div>
  );
}
