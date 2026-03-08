import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Shield,
  UserCircle,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { UserRole } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const roles = [
  {
    value: "student" as UserRole,
    label: "Student",
    description: "Access courses, materials, and submit assignments",
    icon: UserCircle,
    color: "border-blue-500/40 bg-blue-500/10 hover:border-blue-500/60",
    activeColor: "border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/30",
  },
  {
    value: "faculty" as UserRole,
    label: "Faculty",
    description: "Create courses, upload materials, manage attendance",
    icon: Users,
    color: "border-violet-500/40 bg-violet-500/10 hover:border-violet-500/60",
    activeColor: "border-violet-500 bg-violet-500/20 ring-2 ring-violet-500/30",
  },
  {
    value: "admin" as UserRole,
    label: "Administrator",
    description: "Full access to manage the entire LMS platform",
    icon: Shield,
    color: "border-amber-500/40 bg-amber-500/10 hover:border-amber-500/60",
    activeColor: "border-amber-500 bg-amber-500/20 ring-2 ring-amber-500/30",
  },
];

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { login, isLoggingIn, identity, isLoginSuccess } =
    useInternetIdentity();
  const { actor } = useActor();
  const navigate = useNavigate();

  const handleStep1 = () => {
    login();
  };

  // Move to step 2 once authenticated
  useEffect(() => {
    const isAuthed =
      isLoginSuccess || (!!identity && !identity.getPrincipal().isAnonymous());
    if (isAuthed && step === 1) {
      setStep(2);
    }
  }, [isLoginSuccess, identity, step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !selectedRole) {
      toast.error("Please fill in all fields and select a role");
      return;
    }
    if (!actor) {
      toast.error("Still connecting... please wait");
      return;
    }

    setIsSaving(true);
    try {
      await actor.saveCallerUserProfile({
        name: name.trim(),
        email: email.trim(),
        role: selectedRole,
      });
      toast.success("Profile created!");
      // Route to appropriate dashboard
      const routes: Record<string, string> = {
        student: "/student",
        faculty: "/faculty",
        admin: "/admin",
      };
      navigate({
        to: routes[selectedRole] as "/student" | "/faculty" | "/admin",
      });
    } catch {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-12">
      {/* Background */}
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/" })}
          className="gap-2 text-white/70 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft size={14} />
          Back
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg px-6"
      >
        <div className="rounded-2xl border border-white/10 bg-card/90 backdrop-blur-xl shadow-glow-lg p-8">
          {/* Logo */}
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-bg shadow-glow">
              <GraduationCap size={28} className="text-white" />
            </div>
            <div className="text-center">
              <h1 className="font-display text-2xl font-bold text-foreground">
                {step === 1 ? "Create your account" : "Complete your profile"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {step === 1
                  ? "Connect with Internet Identity to get started"
                  : "Tell us a bit about yourself"}
              </p>
            </div>
          </div>

          {/* Step indicators */}
          <div className="mb-6 flex items-center justify-center gap-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  step > s
                    ? "gradient-bg text-white"
                    : step === s
                      ? "gradient-bg text-white ring-2 ring-primary/30"
                      : "bg-secondary text-muted-foreground"
                }`}
              >
                {step > s ? <CheckCircle2 size={14} /> : s}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="rounded-xl border border-border bg-secondary/30 p-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                    <Shield size={24} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Internet Identity Authentication
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    UniLearn uses decentralized Internet Identity for secure,
                    passwordless login. No email or password required.
                  </p>
                </div>

                <Button
                  onClick={handleStep1}
                  disabled={isLoggingIn}
                  className="w-full h-11 gradient-bg text-white border-0 hover:opacity-90 font-semibold"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Shield size={16} className="mr-2" />
                      Connect with Internet Identity
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/login" })}
                    className="text-primary font-medium hover:underline"
                  >
                    Login
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Dr. Jane Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    data-ocid="signup.name_input"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-ocid="signup.email_input"
                    required
                    autoComplete="email"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Select Your Role</Label>
                  <div className="space-y-2.5">
                    {roles.map((role) => {
                      const Icon = role.icon;
                      const isSelected = selectedRole === role.value;
                      return (
                        <motion.button
                          type="button"
                          key={role.value}
                          onClick={() => setSelectedRole(role.value)}
                          data-ocid="signup.role_select"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
                            isSelected ? role.activeColor : role.color
                          }`}
                        >
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                            <Icon
                              size={18}
                              className={
                                isSelected
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }
                            />
                          </div>
                          <div className="min-w-0">
                            <p
                              className={`text-sm font-semibold ${isSelected ? "text-foreground" : "text-foreground"}`}
                            >
                              {role.label}
                            </p>
                            <p className="text-[11px] text-muted-foreground leading-snug">
                              {role.description}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle2
                              size={16}
                              className="ml-auto flex-shrink-0 text-primary"
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSaving || !name || !email || !selectedRole}
                  data-ocid="signup.submit_button"
                  className="w-full h-11 gradient-bg text-white border-0 hover:opacity-90 font-semibold"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Creating profile...
                    </>
                  ) : (
                    "Complete Sign Up"
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
