import { motion, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Send } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { RefObject } from "react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  buttonRotation: number;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

/**
 * Input component for the chat interface
 * Features auto-resizing textarea and animated send button
 */
export default function ChatInput({
  input,
  isLoading,
  buttonRotation,
  textareaRef,
  onInputChange,
  onSendMessage,
  onKeyPress,
}: ChatInputProps) {
  // Animation values for input scaling
  const inputScale = useSpring(1);

  return (
    <CardFooter className="border-t bg-gradient-to-r from-card/80 via-card/60 to-card/80 p-3 md:p-4 rounded-b-2xl backdrop-blur-md shadow-md">
      <motion.div
        className="flex w-full gap-2 md:gap-3 items-end"
        style={{ scale: inputScale }}
      >
        <div className="flex-1 relative">
          <TextareaAutosize
            ref={textareaRef}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            disabled={isLoading}
            minRows={1}
            maxRows={6}
            className="w-full resize-none rounded-2xl border border-input bg-background/80 px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-md backdrop-blur-md"
            onFocus={() => inputScale.set(1.03)}
            onBlur={() => inputScale.set(1)}
          />

          {/* Enhanced send button */}
          <motion.div
            className="absolute bottom-2 right-2"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.97 }}
            animate={{ rotate: buttonRotation }}
          >
            <Button
              onClick={onSendMessage}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="h-10 w-10 p-0 mb-1 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/80 shadow-xl disabled:opacity-50"
            >
              <Send className="h-5 w-5 mb-1" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </CardFooter>
  );
}
