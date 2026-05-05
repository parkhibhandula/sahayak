import { Navbar } from "../components/navbar";
import Chatbot from "../components/chatbot";
import { VoiceNavigation } from "../components/voice-navigation";
import { UserPlus, Search, MousePointerClick, CheckCircle } from "lucide-react";

export function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Chatbot />
      <VoiceNavigation />

      <main className="pt-24 px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">How It Works</h1>
            <p className="text-xl text-muted-foreground">
              Getting started with Sahayak is simple and accessible
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: UserPlus,
                title: "Sign Up",
                description: "Create your account in seconds. No role selection required initially.",
                gradient: "from-blue-500 to-blue-600",
              },
              {
                icon: Search,
                title: "Explore",
                description: "Browse all features freely from your personalized dashboard.",
                gradient: "from-emerald-500 to-emerald-600",
              },
              {
                icon: MousePointerClick,
                title: "Choose Services",
                description: "Select the services you need—booking, donations, community, and more.",
                gradient: "from-amber-500 to-amber-600",
              },
              {
                icon: CheckCircle,
                title: "Complete Verification",
                description: "Verify your role when taking sensitive actions like bookings or donations.",
                gradient: "from-purple-500 to-purple-600",
              },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white p-8 rounded-2xl space-y-6">
            <h2 className="text-3xl font-semibold">Key Features</h2>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-xl">
                <h3 className="font-semibold mb-2">🗺️ Accessibility Map</h3>
                <p className="text-muted-foreground">
                  Find wheelchair-accessible locations, tactile paths, audio support centers, and more. 
                  Add new tags to help others in your community.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl">
                <h3 className="font-semibold mb-2">👥 Verified Assistants</h3>
                <p className="text-muted-foreground">
                  Browse profiles of experienced caretakers and personal assistants. View ratings, 
                  specializations, and book directly through the platform.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl">
                <h3 className="font-semibold mb-2">🎙️ Voice Navigation</h3>
                <p className="text-muted-foreground">
                  Navigate the entire platform using voice commands. Perfect for users with visual 
                  impairments or those who prefer hands-free navigation.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-xl">
                <h3 className="font-semibold mb-2">🔊 Text-to-Speech</h3>
                <p className="text-muted-foreground">
                  Enable text-to-speech and hover over any element to hear it read aloud. 
                  Accessibility is at the core of everything we do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
