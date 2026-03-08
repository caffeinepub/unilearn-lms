import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { cn } from "../lib/utils";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  title?: string;
  accept?: string;
}

export function UploadModal({
  open,
  onClose,
  onUpload,
  title = "Upload File",
  accept = ".pdf,.ppt,.pptx,.doc,.docx",
}: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setSuccess(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile],
  );

  const handleSubmit = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      await onUpload(file);
      setSuccess(true);
      setTimeout(() => {
        setFile(null);
        setSuccess(false);
        onClose();
      }, 1500);
    } catch {
      // handled by caller
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setFile(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-ocid="upload.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <motion.div
            className={cn(
              "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-secondary/50",
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.01 }}
            data-ocid="upload.dropzone"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
              data-ocid="upload_button"
            />
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex flex-col items-center gap-2"
                >
                  <CheckCircle2 size={36} className="text-emerald-500" />
                  <p className="text-sm font-medium text-emerald-500">
                    Uploaded!
                  </p>
                </motion.div>
              ) : file ? (
                <motion.div
                  key="file"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <FileText size={36} className="text-primary" />
                  <p className="text-sm font-medium text-foreground text-center max-w-full break-all">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-bg">
                    <Upload size={20} className="text-white" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    Drop file or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, PPT, DOC up to 50MB
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {file && !success && (
            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={14} className="text-primary flex-shrink-0" />
                <span className="text-xs text-foreground truncate">
                  {file.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-muted-foreground hover:text-destructive transition-colors ml-2 flex-shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
            data-ocid="upload.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!file || isUploading || success}
            data-ocid="upload.confirm_button"
            className="gradient-bg text-white border-0 hover:opacity-90"
          >
            {isUploading ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
