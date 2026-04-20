import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "motion/react";
import { useAccessibility } from "../contexts/accessibility-context";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([
    { text: "Hello! I'm here to help you navigate Sahayak. How can I assist you today?", isBot: true },
  ]);
  const { speakText, textToSpeech } = useAccessibility();

  const handleSend = () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { text: message, isBot: false }]);

    // Simple bot responses
    setTimeout(() => {
      let botResponse = "";
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes("accessibility")) {
        botResponse = "You can find accessibility features in the map section. Would you like me to guide you there?";
      } else if (lowerMessage.includes("book") || lowerMessage.includes("assistant")) {
        botResponse = "You can book travel assistants or caretakers from the Travel Booking section in your dashboard.";
      } else if (lowerMessage.includes("community")) {
        botResponse = "Join our Community Hub to connect with support groups and other users. We'd love to have you!";
      } else {
        botResponse = "I can help you with accessibility features, booking assistants, and community support. What would you like to know?";
      }

      setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
      if (textToSpeech) {
        speakText(botResponse);
      }
    }, 800);

    setMessage("");
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        drag
        dragConstraints={{
          top: -window.innerHeight + 200,
          bottom: 0,
          left: -window.innerWidth + 200,
          right: 0,
        }}
        dragElastic={0.1}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          size="icon"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </motion.div>

      {/* Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-96 bg-white shadow-2xl z-40 flex flex-col border-l border-border"
          >
            <div className="p-6 border-b border-border">
              <h3 className="text-xl font-semibold">Sahayak Assistant</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Here to help you navigate
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl ${
                      msg.isBot
                        ? "bg-muted text-foreground"
                        : "bg-primary text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={handleSend} size="icon" className="bg-primary hover:bg-primary/90">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
