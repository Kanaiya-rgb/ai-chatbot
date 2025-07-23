"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useChatState } from "@/hooks/useChatState";
import ChatHeader from "@/components/ChatHeader";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";
import { cardVariants } from "@/constants/animations";

export default function Chat() {
  const {
    messages,
    input,
    isLoading,
    buttonRotation,
    scrollAreaRef,
    messagesEndRef,
    textareaRef,
    setInput,
    sendMessage,
    clearConversation,
  } = useChatState();

  // Handle Enter key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-1 md:p-4 flex items-center justify-center">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-7xl h-[95vh] flex items-center justify-center"
      >
        <Card className="h-full w-full flex flex-col shadow-2xl border-0 bg-card/80 backdrop-blur-xl rounded-3xl md:rounded-[2rem] p-1 md:p-8">
          {/* Header with title and clear button */}
          <ChatHeader
            messageCount={messages.length}
            onClearChat={clearConversation}
          />

          {/* Messages area with welcome screen and loading */}
          <MessageList
            messages={messages}
            isLoading={isLoading}
            scrollAreaRef={scrollAreaRef}
            messagesEndRef={messagesEndRef}
          />

          {/* Input area with textarea and send button */}
          <ChatInput
            input={input}
            isLoading={isLoading}
            buttonRotation={buttonRotation}
            textareaRef={textareaRef}
            onInputChange={setInput}
            onSendMessage={sendMessage}
            onKeyPress={handleKeyPress}
          />
        </Card>
      </motion.div>
    </div>
  );
}
