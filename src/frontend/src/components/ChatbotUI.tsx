import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, Sparkles, Trash2, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useChatbot } from "../hooks/useChatbot";
import { cn } from "../lib/utils";

const SUGGESTED_PROMPTS = [
  "Explain photosynthesis",
  "Help with my assignment",
  "Study tips for exams",
  "Summarize Chapter 3",
];

interface ChatbotUIProps {
  compact?: boolean;
}

export function ChatbotUI({ compact = false }: ChatbotUIProps) {
  const { messages, isTyping, sendMessage, clearMessages } = useChatbot();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll needs message/typing changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn("flex flex-col", compact ? "h-full" : "h-full min-h-0")}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-bg animate-pulse-glow">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">UniLearn AI</p>
            <p className="text-[10px] text-emerald-500 flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Online
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearMessages}
          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
        >
          <Trash2 size={14} />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          {/* Suggested prompts (only when no user messages yet) */}
          {messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Sparkles size={10} />
                Try asking...
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    data-ocid={`chatbot.suggested_prompt.${i + 1}`}
                    className="rounded-lg border border-border bg-secondary/50 px-3 py-2 text-left text-xs text-foreground hover:bg-secondary hover:border-primary/40 transition-colors leading-snug"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "flex gap-2.5",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full",
                    msg.role === "user"
                      ? "gradient-bg"
                      : "bg-secondary border border-border",
                  )}
                >
                  {msg.role === "user" ? (
                    <User size={14} className="text-white" />
                  ) : (
                    <Bot size={14} className="text-primary" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "chat-bubble-user"
                      : "chat-bubble-ai text-foreground",
                  )}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2.5"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary border border-border">
                  <Bot size={14} className="text-primary" />
                </div>
                <div className="chat-bubble-ai px-4 py-3 flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground animate-typing-dot"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-3 flex-shrink-0">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything academic..."
            rows={1}
            data-ocid="chatbot.message_input"
            className="min-h-[40px] max-h-32 resize-none text-sm py-2.5 custom-scrollbar"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            data-ocid="chatbot.send_button"
            size="sm"
            className="h-[40px] w-[40px] p-0 flex-shrink-0 gradient-bg text-white border-0 hover:opacity-90 disabled:opacity-50"
          >
            <Send size={15} />
          </Button>
        </div>
        <p className="mt-1.5 text-[10px] text-muted-foreground text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
