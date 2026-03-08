import { motion } from "motion/react";
import { ChatbotUI } from "../components/ChatbotUI";

export default function ChatbotPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col"
    >
      <ChatbotUI />
    </motion.div>
  );
}
