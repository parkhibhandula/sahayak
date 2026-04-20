import { useAccessibility } from "../contexts/accessibility-context";
import { Button } from "./ui/button";
import { Type, Contrast, Volume2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function AccessibilityControls() {
  const { fontSize, setFontSize, highContrast, setHighContrast, textToSpeech, setTextToSpeech } = useAccessibility();

  return (
    <div className="flex items-center gap-2">
      {/* Font Size Control */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" title="Font Size">
            <Type className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setFontSize("small")}>
            Small {fontSize === "small" && "✓"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFontSize("medium")}>
            Medium {fontSize === "medium" && "✓"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFontSize("large")}>
            Large {fontSize === "large" && "✓"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* High Contrast Toggle */}
      <Button
        variant={highContrast ? "default" : "outline"}
        size="icon"
        onClick={() => setHighContrast(!highContrast)}
        title="High Contrast"
      >
        <Contrast className="w-4 h-4" />
      </Button>

      {/* Text to Speech Toggle */}
      <Button
        variant={textToSpeech ? "default" : "outline"}
        size="icon"
        onClick={() => setTextToSpeech(!textToSpeech)}
        title="Text to Speech"
      >
        <Volume2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
