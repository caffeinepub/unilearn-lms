import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, BookOpen, CheckCircle2, Clock } from "lucide-react";
import { motion } from "motion/react";
import type { Assignment } from "../backend.d";

interface AssignmentCardProps {
  assignment: Assignment;
  showSubmit?: boolean;
  onSubmit?: (assignment: Assignment) => void;
  index?: number;
}

function getDeadlineStatus(deadline: string) {
  const now = new Date();
  const due = new Date(deadline);
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0)
    return {
      label: "Overdue",
      color: "text-red-500 bg-red-500/10 border-red-500/20",
      icon: AlertCircle,
    };
  if (diffDays <= 2)
    return {
      label: `${diffDays}d left`,
      color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
      icon: Clock,
    };
  if (diffDays <= 7)
    return {
      label: `${diffDays}d left`,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      icon: Clock,
    };
  return {
    label: `${diffDays}d left`,
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    icon: CheckCircle2,
  };
}

function formatDeadline(deadline: string): string {
  try {
    const date = new Date(deadline);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return deadline;
  }
}

export function AssignmentCard({
  assignment,
  showSubmit = false,
  onSubmit,
  index = 0,
}: AssignmentCardProps) {
  const deadlineStatus = getDeadlineStatus(assignment.deadline);
  const DeadlineIcon = deadlineStatus.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: "easeOut" }}
      whileHover={{ scale: 1.01, y: -2 }}
      className="rounded-xl border border-border bg-card p-4 shadow-card hover:shadow-card-hover transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
            <BookOpen size={16} className="text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground text-sm truncate">
              {assignment.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {assignment.subject}
            </p>
          </div>
        </div>

        <Badge
          variant="outline"
          className={`flex-shrink-0 flex items-center gap-1 text-[10px] px-2 ${deadlineStatus.color}`}
        >
          <DeadlineIcon size={10} />
          {deadlineStatus.label}
        </Badge>
      </div>

      {assignment.description && (
        <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {assignment.description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Clock size={10} />
          <span>Due: {formatDeadline(assignment.deadline)}</span>
        </div>
        {showSubmit && onSubmit && (
          <Button
            size="sm"
            onClick={() => onSubmit(assignment)}
            data-ocid="assignment.submit_button"
            className="h-7 text-xs gradient-bg text-white hover:opacity-90 border-0"
          >
            Submit
          </Button>
        )}
      </div>
    </motion.div>
  );
}
