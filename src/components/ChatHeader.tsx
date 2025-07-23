import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { MessageSquare, RotateCcw, Sun, Moon } from "lucide-react";
import { headerVariants, buttonVariants } from "@/constants/animations";
import { useTheme } from "@/contexts/ThemeContext";

interface ChatHeaderProps {
  messageCount: number;
  onClearChat: () => void;
}

/**
 * Header component for the chat interface
 * Shows title, message counter, theme toggle, and clear chat functionality
 */
export default function ChatHeader({
  messageCount,
  onClearChat,
}: ChatHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <CardHeader className="border-b-2 border-border/40 bg-gradient-to-r from-card/80 via-card/60 to-card/80 rounded-t-2xl backdrop-blur-md shadow-md">
      <motion.div
        className="flex items-center justify-between px-2 md:px-4 py-2"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-5">
          <motion.div
            className="p-4 bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl shadow-lg border border-primary/10"
            whileHover={{ scale: 1.08, rotate: 8 }}
            whileTap={{ scale: 0.97 }}
          >
            <MessageSquare className="h-8 w-8 text-primary drop-shadow" />
          </motion.div>

          <div>
            <motion.h1
              className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text drop-shadow-sm tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              AI Chat Assistant
            </motion.h1>

            <motion.p
              className="text-base text-muted-foreground mt-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {messageCount > 0
                ? `${messageCount} messages in conversation`
                : "Ready to help you"}
            </motion.p>
          </div>
        </div>

        {/* Action buttons container */}
        <div className="flex items-center gap-3">
          {/* Theme toggle button */}
          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="text-xs hover:bg-accent/60 shadow transition-all duration-200 rounded-lg"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4 mr-1" />
              ) : (
                <Sun className="h-4 w-4 mr-1" />
              )}
              {theme === "light" ? "Dark" : "Light"}
            </Button>
          </motion.div>

          {/* Clear chat button */}
          {messageCount > 0 && (
            <motion.div
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={onClearChat}
                className="text-xs hover:bg-destructive/20 hover:text-destructive hover:border-destructive/30 shadow transition-all duration-200 rounded-lg"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear Chat
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </CardHeader>
  );
} 