import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import type { UserProfile } from "../backend.d";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  title: string;
  profile: UserProfile | null;
}

export function Navbar({ title, profile }: NavbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-6">
      <div>
        <h1 className="text-lg font-semibold font-display text-foreground">
          {title}
        </h1>
        <p className="text-xs text-muted-foreground capitalize">
          {profile?.role ?? "Loading..."} Portal
        </p>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-secondary transition-colors"
          aria-label="Notifications"
        >
          <Bell size={16} className="text-muted-foreground" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>
        <Avatar className="h-9 w-9">
          <AvatarFallback className="gradient-bg text-white text-xs font-bold">
            {profile?.name?.charAt(0)?.toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
