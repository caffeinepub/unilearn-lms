import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Bot,
  Calendar,
  CheckCircle,
  ClipboardList,
  Loader2,
  Plus,
  Upload,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
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
  useCreateAssignment,
  useMarkAttendance,
  useSaveProfile,
  useUploadMaterial,
  useUserProfile,
} from "../hooks/useQueries";

type Section =
  | "overview"
  | "materials"
  | "assignments"
  | "attendance"
  | "chatbot"
  | "profile";

export default function FacultyDashboard() {
  const [section, setSection] = useState<Section>("overview");
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");

  // Upload Material form
  const [matTitle, setMatTitle] = useState("");
  const [matSubject, setMatSubject] = useState("");
  const [matFileType, setMatFileType] = useState("PDF");
  const [matFile, setMatFile] = useState<File | null>(null);

  // Create Assignment form
  const [assignTitle, setAssignTitle] = useState("");
  const [assignDesc, setAssignDesc] = useState("");
  const [assignDeadline, setAssignDeadline] = useState("");
  const [assignSubject, setAssignSubject] = useState("");

  // Attendance form
  const [attStudent, setAttStudent] = useState("");
  const [attDate, setAttDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [attPresent, setAttPresent] = useState(true);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const { data: profile } = useUserProfile();
  const { data: materials = [], isLoading: matLoading } = useAllMaterials();
  const { data: assignments = [], isLoading: assignLoading } =
    useAllAssignments();
  const { data: attendance = [] } = useAllAttendance();

  const uploadMaterial = useUploadMaterial();
  const createAssignment = useCreateAssignment();
  const markAttendance = useMarkAttendance();
  const saveProfile = useSaveProfile();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matFile) {
      toast.error("Please select a file");
      return;
    }
    try {
      await uploadMaterial.mutateAsync({
        title: matTitle,
        subject: matSubject,
        fileType: matFileType,
        file: matFile,
      });
      toast.success("Material uploaded successfully!");
      setMatTitle("");
      setMatSubject("");
      setMatFile(null);
    } catch {
      toast.error("Upload failed. Please try again.");
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAssignment.mutateAsync({
        title: assignTitle,
        description: assignDesc,
        deadline: assignDeadline,
        subject: assignSubject,
      });
      toast.success("Assignment created!");
      setAssignTitle("");
      setAssignDesc("");
      setAssignDeadline("");
      setAssignSubject("");
    } catch {
      toast.error("Failed to create assignment.");
    }
  };

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attStudent.trim()) {
      toast.error("Enter student principal");
      return;
    }
    try {
      await markAttendance.mutateAsync({
        student: attStudent,
        date: attDate,
        present: attPresent,
      });
      toast.success(
        `Attendance marked as ${attPresent ? "Present" : "Absent"}`,
      );
      setAttStudent("");
    } catch {
      toast.error("Failed to mark attendance.");
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

  const sectionTitles: Record<Section, string> = {
    overview: "Faculty Dashboard",
    materials: "Upload Study Materials",
    assignments: "Create Assignment",
    attendance: "Attendance Management",
    chatbot: "AI Chatbot",
    profile: "My Profile",
  };

  const todayAttendance = attendance.filter(
    (a) => a.date === new Date().toISOString().split("T")[0],
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        userRole={"faculty"}
        activeSection={section}
        onSectionChange={(s) => setSection(s as Section)}
        onLogout={handleLogout}
        userName={profile?.name ?? "Faculty"}
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
                    Welcome, {profile?.name?.split(" ")[0] ?? "Professor"} 👨‍🏫
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Manage your courses, materials, and students
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <StatCard
                    title="Materials Uploaded"
                    value={materials.length}
                    subtitle="Total resources"
                    icon={BookOpen}
                    color="primary"
                    ocid="faculty.materials_card"
                    delay={0}
                  />
                  <StatCard
                    title="Assignments Created"
                    value={assignments.length}
                    subtitle="Active assignments"
                    icon={ClipboardList}
                    color="warning"
                    delay={0.1}
                  />
                  <StatCard
                    title="Today's Attendance"
                    value={todayAttendance.length}
                    subtitle="Records today"
                    icon={Calendar}
                    color="success"
                    delay={0.2}
                  />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">
                        Recent Materials
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-primary h-6"
                        onClick={() => setSection("materials")}
                      >
                        Upload more <Plus size={10} className="ml-1" />
                      </Button>
                    </div>
                    {matLoading ? (
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
                          No materials uploaded yet
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

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">
                        Recent Assignments
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-primary h-6"
                        onClick={() => setSection("assignments")}
                      >
                        Create new <Plus size={10} className="ml-1" />
                      </Button>
                    </div>
                    {assignLoading ? (
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
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* UPLOAD MATERIALS */}
            {section === "materials" && (
              <motion.div
                key="materials"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="max-w-lg">
                  <h3 className="font-display font-bold text-foreground mb-1">
                    Upload Study Material
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Share resources with your students
                  </p>
                </div>

                <div className="max-w-lg rounded-2xl border border-border bg-card p-6">
                  <form onSubmit={handleUpload} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="mat-title">Material Title *</Label>
                      <Input
                        id="mat-title"
                        placeholder="Introduction to Algorithms"
                        value={matTitle}
                        onChange={(e) => setMatTitle(e.target.value)}
                        required
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="mat-subject">Subject *</Label>
                      <Input
                        id="mat-subject"
                        placeholder="Computer Science"
                        value={matSubject}
                        onChange={(e) => setMatSubject(e.target.value)}
                        required
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>File Type *</Label>
                      <Select
                        value={matFileType}
                        onValueChange={setMatFileType}
                      >
                        <SelectTrigger
                          data-ocid="materials.subject_select"
                          className="h-10"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PDF">PDF</SelectItem>
                          <SelectItem value="PPT">PowerPoint (PPT)</SelectItem>
                          <SelectItem value="Document">Document</SelectItem>
                          <SelectItem value="Video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="mat-file">Upload File *</Label>
                      <Input
                        id="mat-file"
                        type="file"
                        onChange={(e) =>
                          setMatFile(e.target.files?.[0] ?? null)
                        }
                        required
                        data-ocid="materials.upload_button"
                        className="h-10 file:mr-3 file:rounded file:border-0 file:bg-primary/10 file:text-primary file:text-xs file:font-medium"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={uploadMaterial.isPending}
                      className="w-full gradient-bg text-white border-0 hover:opacity-90"
                    >
                      {uploadMaterial.isPending ? (
                        <>
                          <Loader2 size={14} className="mr-2 animate-spin" />{" "}
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={14} className="mr-2" /> Upload Material
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                {/* Materials list */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Your Materials ({materials.length})
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {materials.map((m, i) => (
                      <MaterialCard key={m.title} material={m} index={i} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* CREATE ASSIGNMENTS */}
            {section === "assignments" && (
              <motion.div
                key="assignments"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="max-w-lg rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display font-bold text-foreground mb-4">
                    Create New Assignment
                  </h3>
                  <form onSubmit={handleCreateAssignment} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="assign-title">Title *</Label>
                      <Input
                        id="assign-title"
                        placeholder="Midterm Project"
                        value={assignTitle}
                        onChange={(e) => setAssignTitle(e.target.value)}
                        required
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="assign-subject">Subject *</Label>
                      <Input
                        id="assign-subject"
                        placeholder="Data Structures"
                        value={assignSubject}
                        onChange={(e) => setAssignSubject(e.target.value)}
                        required
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="assign-desc">Description</Label>
                      <Textarea
                        id="assign-desc"
                        placeholder="Describe the assignment requirements..."
                        value={assignDesc}
                        onChange={(e) => setAssignDesc(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="assign-deadline">Deadline *</Label>
                      <Input
                        id="assign-deadline"
                        type="date"
                        value={assignDeadline}
                        onChange={(e) => setAssignDeadline(e.target.value)}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className="h-10"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={createAssignment.isPending}
                      data-ocid="assignment.create_button"
                      className="w-full gradient-bg text-white border-0 hover:opacity-90"
                    >
                      {createAssignment.isPending ? (
                        <>
                          <Loader2 size={14} className="mr-2 animate-spin" />{" "}
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus size={14} className="mr-2" /> Create Assignment
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    All Assignments ({assignments.length})
                  </h3>
                  <div className="space-y-3">
                    {assignments.map((a, i) => (
                      <AssignmentCard key={a.title} assignment={a} index={i} />
                    ))}
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
                className="space-y-6"
              >
                <div className="max-w-lg rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display font-bold text-foreground mb-4">
                    Mark Attendance
                  </h3>
                  <form onSubmit={handleMarkAttendance} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="att-student">
                        Student Principal ID *
                      </Label>
                      <Input
                        id="att-student"
                        placeholder="Enter principal ID..."
                        value={attStudent}
                        onChange={(e) => setAttStudent(e.target.value)}
                        required
                        className="h-10 font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="att-date">Date *</Label>
                      <Input
                        id="att-date"
                        type="date"
                        value={attDate}
                        onChange={(e) => setAttDate(e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <div className="flex gap-3">
                        {[true, false].map((val) => (
                          <button
                            key={String(val)}
                            type="button"
                            onClick={() => setAttPresent(val)}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                              attPresent === val
                                ? val
                                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                                  : "border-red-500 bg-red-500/10 text-red-600"
                                : "border-border text-muted-foreground hover:border-border/80"
                            }`}
                          >
                            {val ? (
                              <CheckCircle size={14} />
                            ) : (
                              <XCircle size={14} />
                            )}
                            {val ? "Present" : "Absent"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={markAttendance.isPending}
                      className="w-full gradient-bg text-white border-0 hover:opacity-90"
                    >
                      {markAttendance.isPending ? (
                        <>
                          <Loader2 size={14} className="mr-2 animate-spin" />{" "}
                          Marking...
                        </>
                      ) : (
                        <>
                          <Calendar size={14} className="mr-2" /> Mark
                          Attendance
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                {/* Attendance Records */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Recent Records ({attendance.length})
                  </h3>
                  <div className="space-y-2">
                    {attendance.slice(0, 20).map((record, i) => (
                      <div
                        key={`${record.date}-${i}`}
                        className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
                        data-ocid={`attendance.item.${i + 1}`}
                      >
                        <div className="flex items-center gap-3">
                          {record.present ? (
                            <CheckCircle
                              className="text-emerald-500 flex-shrink-0"
                              size={15}
                            />
                          ) : (
                            <XCircle
                              className="text-red-500 flex-shrink-0"
                              size={15}
                            />
                          )}
                          <div>
                            <p className="text-xs font-mono text-muted-foreground truncate max-w-48">
                              {record.student.toString?.() ??
                                String(record.student)}
                            </p>
                            <p className="text-xs text-foreground">
                              {record.date}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            record.present
                              ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 text-[10px]"
                              : "text-red-600 bg-red-500/10 border-red-500/20 text-[10px]"
                          }
                        >
                          {record.present ? "Present" : "Absent"}
                        </Badge>
                      </div>
                    ))}
                    {attendance.length === 0 && (
                      <div
                        className="rounded-xl border border-dashed border-border p-12 text-center"
                        data-ocid="attendance.empty_state"
                      >
                        <Users
                          className="mx-auto mb-3 text-muted-foreground"
                          size={40}
                        />
                        <p className="text-muted-foreground">
                          No attendance records yet
                        </p>
                      </div>
                    )}
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
                      {profile?.name?.charAt(0) ?? "F"}
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
                      <Label>Full Name</Label>
                      <Input
                        defaultValue={profile?.name ?? ""}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        defaultValue={profile?.email ?? ""}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Role</Label>
                      <div className="flex h-10 items-center rounded-lg border border-border bg-secondary/50 px-3 text-sm text-muted-foreground capitalize">
                        <User size={14} className="mr-2" /> {profile?.role}
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

      {/* Floating chat button */}
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
