import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      data-ocid="theme.toggle"
      className="relative flex h-8 w-16 items-center rounded-full border border-border bg-secondary p-1 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <motion.div
        className="absolute inset-y-1 h-6 w-6 rounded-full gradient-bg shadow-sm"
        animate={{ x: theme === "dark" ? 32 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
      <div className="relative z-10 flex w-full items-center justify-between px-0.5">
        <AnimatePresence mode="wait">
          {theme === "light" ? (
            <motion.div
              key="sun"
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="flex h-5 w-5 items-center justify-center"
            >
              <Sun className="h-3.5 w-3.5 text-primary-foreground" />
            </motion.div>
          ) : (
            <motion.div key="empty-left" className="h-5 w-5" />
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {theme === "dark" ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
              transition={{ duration: 0.2 }}
              className="flex h-5 w-5 items-center justify-center"
            >
              <Moon className="h-3.5 w-3.5 text-primary-foreground" />
            </motion.div>
          ) : (
            <motion.div key="empty-right" className="h-5 w-5" />
          )}
        </AnimatePresence>
      </div>
    </button>
  );
}
