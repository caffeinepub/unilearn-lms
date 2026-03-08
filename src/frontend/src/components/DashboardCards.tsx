import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: "primary" | "success" | "warning" | "danger";
  ocid?: string;
  delay?: number;
}

const colorMap = {
  primary:
    "from-primary/20 to-primary/5 border-primary/20 [&_.icon-bg]:gradient-bg [&_.icon-bg]:text-white",
  success:
    "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 [&_.icon-bg]:bg-emerald-500 [&_.icon-bg]:text-white",
  warning:
    "from-amber-500/20 to-amber-500/5 border-amber-500/20 [&_.icon-bg]:bg-amber-500 [&_.icon-bg]:text-white",
  danger:
    "from-red-500/20 to-red-500/5 border-red-500/20 [&_.icon-bg]:bg-red-500 [&_.icon-bg]:text-white",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "primary",
  ocid,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-gradient-to-br p-5 shadow-card",
        colorMap[color],
      )}
      data-ocid={ocid}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold font-display text-foreground leading-none">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trend.value >= 0 ? "text-emerald-500" : "text-red-500",
              )}
            >
              <span>
                {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
        <div className="icon-bg flex h-11 w-11 items-center justify-center rounded-xl">
          <Icon size={20} />
        </div>
      </div>

      {/* Decorative blur circle */}
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-current opacity-5" />
    </motion.div>
  );
}
