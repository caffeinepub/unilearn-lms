import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart2,
  BookOpen,
  Bot,
  Brain,
  CheckSquare,
  FileText,
  GraduationCap,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { ThemeToggle } from "../components/ThemeToggle";

function FloatingIcon({
  icon: Icon,
  className,
  delay = 0,
}: {
  icon: React.ElementType;
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute flex items-center justify-center rounded-2xl gradient-bg opacity-80 ${className}`}
      animate={{ y: [0, -16, 0], rotate: [0, 5, -3, 0] }}
      transition={{
        duration: 5 + delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay,
      }}
    >
      <Icon className="text-white" size={20} />
    </motion.div>
  );
}

const features = [
  {
    icon: Brain,
    title: "AI-Powered Learning",
    description:
      "Get instant answers, explanations, and study guidance from our integrated AI assistant trained on academic content.",
    color: "from-violet-500/20 to-purple-500/10 border-violet-500/20",
    iconBg: "bg-violet-500",
  },
  {
    icon: CheckSquare,
    title: "Smart Attendance",
    description:
      "Real-time attendance tracking with detailed reports for students, faculty, and administrators.",
    color: "from-emerald-500/20 to-green-500/10 border-emerald-500/20",
    iconBg: "bg-emerald-500",
  },
  {
    icon: FileText,
    title: "Digital Materials",
    description:
      "Upload, organize, and access course materials — PDFs, presentations, documents — from anywhere.",
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/20",
    iconBg: "bg-blue-500",
  },
  {
    icon: BarChart2,
    title: "Analytics Dashboard",
    description:
      "Comprehensive insights into student performance, course completion rates, and engagement metrics.",
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/20",
    iconBg: "bg-amber-500",
  },
];

const mockChatMessages = [
  { role: "user", text: "Can you explain the concept of recursion?" },
  {
    role: "ai",
    text: "Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem. Think of it like nested Russian dolls...",
  },
  { role: "user", text: "Can you give me a simple example?" },
  {
    role: "ai",
    text: "Sure! Calculating factorial: factorial(5) = 5 × factorial(4) = 5 × 4 × factorial(3)... until we reach factorial(1) = 1, the base case.",
  },
];

const stats = [
  { value: "10K+", label: "Students Enrolled" },
  { value: "500+", label: "Courses Available" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24/7", label: "AI Support" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-foreground text-lg">
              UniLearn
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#chatbot"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              AI Chatbot
            </a>
            <a
              href="#about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: "/login" })}
              data-ocid="landing.login_button"
            >
              Login
            </Button>
            <Button
              size="sm"
              onClick={() => navigate({ to: "/signup" })}
              data-ocid="landing.signup_button"
              className="gradient-bg text-white border-0 hover:opacity-90"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Dark mesh background */}
        <div className="absolute inset-0 mesh-bg" />
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-pattern opacity-30" />

        {/* Floating icons */}
        <FloatingIcon
          icon={BookOpen}
          className="h-12 w-12 top-1/4 left-[8%]"
          delay={0}
        />
        <FloatingIcon
          icon={GraduationCap}
          className="h-14 w-14 top-1/3 right-[10%]"
          delay={1.5}
        />
        <FloatingIcon
          icon={BarChart2}
          className="h-10 w-10 bottom-1/3 left-[15%]"
          delay={0.8}
        />
        <FloatingIcon
          icon={Brain}
          className="h-12 w-12 bottom-1/4 right-[18%]"
          delay={2}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
              <Star size={11} className="fill-current" />
              AI-Powered University Learning Management System
            </div>

            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
              Smart Learning{" "}
              <span className="gradient-text">Management System</span> with AI
              Assistant
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 leading-relaxed">
              Empowering universities with intelligent tools for students,
              faculty, and administrators. One platform for everything — from AI
              tutoring to attendance tracking.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate({ to: "/signup" })}
                data-ocid="landing.signup_button"
                className="gradient-bg text-white border-0 hover:opacity-90 gap-2 px-8 py-6 text-base font-semibold"
              >
                Get Started Free
                <ArrowRight size={16} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: "/login" })}
                data-ocid="landing.login_button"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-base"
              >
                Login
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <p className="font-display text-3xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center"
          >
            <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
              Everything your university needs
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground text-lg">
              Built for the modern academic environment with AI at the core
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className={`rounded-2xl border bg-gradient-to-br p-6 shadow-card ${feature.color}`}
                >
                  <div
                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${feature.iconBg}`}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="mb-2 font-display font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Chatbot Preview */}
      <section id="chatbot" className="py-24 px-6 bg-secondary/30">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Bot size={11} />
                AI Assistant
              </div>
              <h2 className="font-display text-4xl font-bold text-foreground leading-tight">
                Your personal <span className="gradient-text">AI tutor</span>,
                available 24/7
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Ask complex academic questions, get step-by-step explanations,
                receive personalized study recommendations, and get help with
                any assignment — all powered by advanced AI.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Instant answers to academic questions",
                  "Assignment help and explanations",
                  "Personalized study strategies",
                  "Topic summaries and breakdowns",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm">
                    <CheckSquare
                      size={16}
                      className="text-primary flex-shrink-0"
                    />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Mock chat window */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-border bg-card shadow-glow overflow-hidden"
            >
              {/* Chat header */}
              <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
                <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center animate-pulse-glow">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    UniLearn AI
                  </p>
                  <p className="text-[10px] text-emerald-500 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                    Online
                  </p>
                </div>
              </div>

              {/* Chat messages */}
              <div className="p-4 space-y-3 max-h-72 overflow-y-auto custom-scrollbar">
                {mockChatMessages.map((msg, i) => (
                  <motion.div
                    key={msg.text.slice(0, 20)}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`h-7 w-7 flex-shrink-0 rounded-full flex items-center justify-center ${msg.role === "user" ? "gradient-bg" : "bg-secondary border border-border"}`}
                    >
                      {msg.role === "user" ? (
                        <GraduationCap size={13} className="text-white" />
                      ) : (
                        <Bot size={13} className="text-primary" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] px-3 py-2 text-xs leading-relaxed ${msg.role === "user" ? "chat-bubble-user text-white" : "chat-bubble-ai text-foreground"}`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mock input */}
              <div className="border-t border-border p-3 flex items-center gap-2">
                <div className="flex-1 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
                  Ask your question...
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
                  <ArrowRight size={14} className="text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            Ready to transform learning?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground text-lg">
            Join thousands of students and faculty already using UniLearn to
            elevate their educational experience.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate({ to: "/signup" })}
              className="gradient-bg text-white border-0 hover:opacity-90 gap-2 px-8"
            >
              Start for Free <ArrowRight size={16} />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer id="about" className="border-t border-border py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
                  <GraduationCap size={16} className="text-white" />
                </div>
                <span className="font-display font-bold text-foreground text-lg">
                  UniLearn
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                The modern LMS platform designed for the future of higher
                education.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3 text-sm">
                Platform
              </h4>
              <ul className="space-y-2">
                {["Features", "AI Chatbot", "Attendance", "Analytics"].map(
                  (item) => (
                    <li key={item}>
                      <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        {item}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3 text-sm">
                Contact
              </h4>
              <ul className="space-y-2">
                {["About Us", "Support", "Privacy Policy", "Terms"].map(
                  (item) => (
                    <li key={item}>
                      <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        {item}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
