import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import  Chatbot  from "../components/chatbot";
import { VoiceNavigation } from "../components/voice-navigation";
import { AccessibilityControls } from "../components/accessibility-controls";
import { useAuth } from "../contexts/auth-context";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  MapPin,
  Car,
  FileText,
  Users,
  BookOpen,
  Heart,
  UserPlus,
  GraduationCap,
  Search,
  Bell,
  ChevronLeft,
  Home,
  Menu,
} from "lucide-react";
import { useAccessibility } from "../contexts/accessibility-context";

const features = [
  {
    id: "accessibility-map",
    title: "OTM Accessibility Map",
    description: "Find accessible locations and tag new accessibility points in real-time",
    icon: MapPin,
    gradient: "from-blue-500 to-blue-600",
    path: "/accessibility-map",
  },
  {
    id: "travel-booking",
    title: "Travel & Assistant Booking",
    description: "Book travel assistants and caretakers for personalized support",
    icon: Car,
    gradient: "from-emerald-500 to-emerald-600",
    path: "/travel-booking",
  },
  {
    id: "community",
    title: "Community Hub",
    description: "Connect with support groups, forums, and community networks",
    icon: Users,
    gradient: "from-purple-500 to-purple-600",
    path: "/community",
  },
  {
    id: "caretaker-booking",
    title: "Caretaker Services",
    description: "Find and hire verified caretakers for elderly and specially-abled care",
    icon: UserPlus,
    gradient: "from-indigo-500 to-indigo-600",
    path: "/caretaker-booking",
  },
];

export function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { speakText, textToSpeech } = useAccessibility();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }


  const handleMouseEnter = (text: string) => {
    if (textToSpeech) {
      speakText(text);
    }
  };

  const filteredFeatures = features.filter(
    (feature) =>
      feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Chatbot />
      <VoiceNavigation />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="md:hidden"
                onMouseEnter={() => handleMouseEnter("Home")}
              >
                <Home className="w-5 h-5" />
              </Button>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white fill-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold"><a href="/">Sahayak</a></h1>
      
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search features, services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <AccessibilityControls />
              <Button 
                variant="ghost" 
                size="icon"
                onMouseEnter={() => handleMouseEnter("Notifications")}
              >
                <Bell className="w-5 h-5" />
              </Button>
              <Avatar>
                <AvatarFallback className="bg-primary text-white">U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div 
            className="mb-8"
            onMouseEnter={() => handleMouseEnter("Welcome to Sahayak. Explore all features and services designed for your needs")}
          >
            <h2 className="text-3xl font-bold mb-2">Welcome to Sahayak</h2>
            <p className="text-muted-foreground text-lg">
              Explore all features and services designed for your needs
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFeatures.map((feature) => (
              <div
                key={feature.id}
                className="group relative bg-white rounded-2xl p-6 border border-border hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(feature.path)}
                onMouseEnter={() => handleMouseEnter(`${feature.title}. ${feature.description}`)}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />

                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Arrow Indicator */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <ChevronLeft className="w-4 h-4 text-white rotate-180" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl">
            <h3 className="text-2xl font-semibold mb-6">Quick Actions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="justify-start h-auto py-4 px-6"
                onClick={() => navigate("/accessibility-map")}
                onMouseEnter={() => handleMouseEnter("Add accessibility tag")}
              >
                <MapPin className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Add Accessibility Tag</div>
                  <div className="text-xs text-muted-foreground">Help others find accessible places</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
