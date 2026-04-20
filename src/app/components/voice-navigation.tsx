import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function VoiceNavigation() {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleVoiceCommand = (command: string) => {
    toast.info(`Command: ${command}`);

    if (command.includes("home") || command.includes("landing")) {
      navigate("/");
    } else if (command.includes("dashboard") || command.includes("explore")) {
      navigate("/dashboard");
    } else if (command.includes("map") || command.includes("accessibility")) {
      navigate("/accessibility-map");
    } else if (command.includes("travel") || command.includes("booking") || command.includes("assistant")) {
      navigate("/travel-booking");
    } else if (command.includes("community")) {
      navigate("/community");
    } else if (command.includes("career") || command.includes("job")) {
      navigate("/careers");
    } else {
      toast.info("Command not recognized. Try saying 'dashboard', 'map', 'booking', etc.");
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      toast.error("Voice recognition not supported in this browser");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast.info("Listening... Say a command like 'dashboard' or 'map'");
    }
  };

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-50"
      drag
      dragConstraints={{
        top: -window.innerHeight + 200,
        bottom: 0,
        left: 0,
        right: window.innerWidth - 200,
      }}
      dragElastic={0.1}
    >
      <Button
        onClick={toggleListening}
        className={`w-14 h-14 rounded-full shadow-lg ${
          isListening
            ? "bg-secondary hover:bg-secondary/90 animate-pulse"
            : "bg-accent hover:bg-accent/90"
        }`}
        size="icon"
      >
        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </Button>
    </motion.div>
  );
}
