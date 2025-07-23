import { motion, AnimatePresence } from "framer-motion";
import { RefObject } from "react";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Sparkles } from "lucide-react";
import { Message } from "@/types/chat";
import { formatMessageTime } from "@/utils/chatUtils";
import {
  messageVariants,
  containerVariants,
  welcomeVariants,
  loadingVariants,
} from "@/constants/animations";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  scrollAreaRef: RefObject<HTMLDivElement | null>;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

/**
 * Component that renders the message list with welcome screen and loading indicator
 * Handles message animations and scrolling behavior
 */
export default function MessageList({
  messages,
  isLoading,
  scrollAreaRef,
  messagesEndRef,
}: MessageListProps) {
  return (
    <CardContent className="flex-1 p-0 relative overflow-hidden">
      <ScrollArea className="h-full" ref={scrollAreaRef}>
        <motion.div
          className="p-4 md:p-6 space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome screen when no messages */}
          {messages.length === 0 && (
            <motion.div
              className="flex items-center justify-center h-[50vh] text-center"
              variants={welcomeVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="text-muted-foreground max-w-md">
                <motion.div
                  className="relative mb-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl" />
                  <Bot className="h-16 w-16 mx-auto relative text-primary" />
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <Sparkles className="h-6 w-6 text-accent" />
                  </motion.div>
                </motion.div>

                <motion.h3
                  className="text-xl font-semibold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Welcome to AI Chat!
                </motion.h3>

                <motion.p
                  className="text-sm leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  I&apos;m here to help you with questions, provide information,
                  or just have a friendly conversation. What would you like to
                  talk about today?
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* Message list */}
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <MessageBubble key={message.id} message={message} index={index} />
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && <LoadingIndicator />}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </motion.div>
      </ScrollArea>
    </CardContent>
  );
}

/**
 * Individual message bubble component
 */
function MessageBubble({
  message,
  index,
}: {
  message: Message;
  index: number;
}) {
  const isUser = message.role === "user";

  return (
    <motion.div
      custom={index}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ scale: 1.03 }}
      className={`flex gap-3 md:gap-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* Avatar for assistant messages */}
      {!isUser && (
        <motion.div
          whileHover={{ scale: 1.13, rotate: 6 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Avatar className="h-11 w-11 ring-4 ring-primary/30 shadow-lg -mt-2">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <Bot className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
        </motion.div>
      )}

      {/* Message bubble */}
      <motion.div
        className={`max-w-[80vw] md:max-w-[70%] rounded-3xl px-5 py-3 relative border shadow-lg backdrop-blur-md ${
          isUser
            ? "bg-gradient-to-br from-primary/90 to-primary text-primary-foreground ml-8 rounded-br-lg border-primary/30"
            : "bg-gradient-to-br from-muted/80 to-accent/60 text-muted-foreground rounded-bl-lg border-accent/20"
        }`}
        whileHover={{
          scale: 1.04,
          boxShadow: isUser
            ? "0 10px 25px -5px rgba(0,0,0,0.13)"
            : "0 10px 25px -5px rgba(0,0,0,0.08)",
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.p
          className="text-base leading-relaxed whitespace-pre-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {message.text}
        </motion.p>

        <motion.p
          className="text-xs opacity-60 mt-2 text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.2 }}
        >
          {formatMessageTime(message.createdAt)}
        </motion.p>

        {/* Message tail */}
        <div
          className={`absolute bottom-0 w-3 h-3 ${
            isUser
              ? "right-0 bg-primary/80 border-b border-r border-primary/40 transform rotate-45 translate-x-1 translate-y-1"
              : "left-0 bg-accent/70 border-b border-l border-accent/30 transform rotate-45 -translate-x-1 translate-y-1"
          }`}
        />
      </motion.div>

      {/* Avatar for user messages */}
      {isUser && (
        <motion.div
          whileHover={{ scale: 1.13, rotate: -6 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Avatar className="h-11 w-11 ring-4 ring-secondary/30 shadow-lg -mt-2">
            <AvatarFallback className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground">
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * Loading indicator component
 */
function LoadingIndicator() {
  return (
    <motion.div
      variants={loadingVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex gap-4 justify-start"
    >
      <motion.div whileHover={{ scale: 1.1 }}>
        <Avatar className="h-10 w-10 ring-2 ring-primary/20">
          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Bot className="h-5 w-5" />
            </motion.div>
          </AvatarFallback>
        </Avatar>
      </motion.div>

      <div className="bg-gradient-to-br from-muted to-muted/80 rounded-2xl rounded-bl-md px-4 py-3 relative">
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-muted-foreground rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 w-3 h-3 bg-muted transform rotate-45 -translate-x-1 translate-y-1" />
      </div>
    </motion.div>
  );
}
