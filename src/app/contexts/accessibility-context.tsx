import React, { createContext, useContext, useState, useEffect } from "react";

interface AccessibilityContextType {
  fontSize: "small" | "medium" | "large";
  setFontSize: (size: "small" | "medium" | "large") => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  textToSpeech: boolean;
  setTextToSpeech: (value: boolean) => void;
  speakText: (text: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [highContrast, setHighContrast] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const fontSizeMap = {
      small: "14px",
      medium: "16px",
      large: "20px",
    };
    root.style.setProperty("--font-size", fontSizeMap[fontSize]);
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [highContrast]);

  const speakText = (text: string) => {
    if (textToSpeech && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        textToSpeech,
        setTextToSpeech,
        speakText,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
