import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AccessibilityProvider } from "./contexts/accessibility-context";
import { AuthProvider } from "./contexts/auth-context";
import { Toaster } from "./components/ui/sonner";
import Chatbot from "./components/chatbot";

export default function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Chatbot />
      </AuthProvider>
      <Toaster />
    </AccessibilityProvider>
  );
}