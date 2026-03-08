import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, File, FileText, Presentation } from "lucide-react";
import { motion } from "motion/react";
import type { Material } from "../backend.d";

interface MaterialCardProps {
  material: Material;
  index?: number;
}

function getFileIcon(fileType: string) {
  const type = fileType.toLowerCase();
  if (type.includes("pdf")) return FileText;
  if (type.includes("ppt") || type.includes("presentation"))
    return Presentation;
  return File;
}

function getFileColor(fileType: string) {
  const type = fileType.toLowerCase();
  if (type.includes("pdf"))
    return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
  if (type.includes("ppt") || type.includes("presentation"))
    return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
  return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
}

function formatTime(time: bigint): string {
  const ms = Number(time) / 1_000_000; // nanoseconds to ms
  if (!ms || ms < 0) return "—";
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function MaterialCard({ material, index = 0 }: MaterialCardProps) {
  const FileIcon = getFileIcon(material.fileType);
  const colorClass = getFileColor(material.fileType);

  const handleDownload = () => {
    try {
      const url = material.file.getDirectURL();
      const a = document.createElement("a");
      a.href = url;
      a.download = material.title;
      a.click();
    } catch {
      // Silently fail
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: "easeOut" }}
      whileHover={{ scale: 1.01, y: -2 }}
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-card hover:shadow-card-hover transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border ${colorClass}`}
        >
          <FileIcon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-foreground text-sm leading-snug">
            {material.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {material.subject}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-[10px] ${colorClass}`}>
            {material.fileType.toUpperCase()}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            {formatTime(material.uploadTime)}
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDownload}
          className="h-7 gap-1 text-xs text-primary hover:bg-primary/10"
        >
          <Download size={12} />
          Download
        </Button>
      </div>
    </motion.div>
  );
}
