import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import  Chatbot  from "../components/chatbot";
import { VoiceNavigation } from "../components/voice-navigation";
import { AccessibilityControls } from "../components/accessibility-controls";
import { useAuth } from "../contexts/auth-context";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  Users,
  MessageSquare,
  Heart,
  Calendar,
  Search,
  Bell,
  ChevronLeft,
  Home,
  Menu,
} from "lucide-react";
import { useAccessibility } from "../contexts/accessibility-context";

export function Community() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { speakText, textToSpeech } = useAccessibility();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const communityGroups = [
    {
      id: 1,
      name: "Accessibility Advocates",
      description: "Support group for accessibility challenges and solutions",
      members: 1247,
      lastActivity: "2 hours ago",
      category: "Support",
    },
    {
      id: 2,
      name: "Caregiver Network",
      description: "Connect with fellow caregivers and share experiences",
      members: 892,
      lastActivity: "1 day ago",
      category: "Networking",
    },
    {
      id: 3,
      name: "Travel Companions",
      description: "Find travel buddies and share accessibility tips",
      members: 634,
      lastActivity: "3 hours ago",
      category: "Travel",
    },
    {
      id: 4,
      name: "Parent Support Group",
      description: "Parents of children with special needs",
      members: 1156,
      lastActivity: "5 hours ago",
      category: "Family",
    },
  ];

  const recentDiscussions = [
    {
      id: 1,
      title: "New accessibility features in Delhi Metro",
      author: "Rajesh Kumar",
      replies: 23,
      lastReply: "1 hour ago",
      category: "Accessibility",
    },
    {
      id: 2,
      title: "Finding reliable caretakers in Mumbai",
      author: "Priya Sharma",
      replies: 15,
      lastReply: "3 hours ago",
      category: "Caregiving",
    },
    {
      id: 3,
      title: "Travel tips for wheelchair users",
      author: "Amit Singh",
      replies: 31,
      lastReply: "6 hours ago",
      category: "Travel",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Chatbot />
      <VoiceNavigation />
      <AccessibilityControls />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
                onMouseEnter={() => speakText("Back to dashboard")}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">Community Hub</h1>
                  <p className="text-sm text-muted-foreground">Connect with support groups and networks</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onMouseEnter={() => speakText("Notifications")}
              >
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                onMouseEnter={() => speakText("Menu")}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-500" />
                  Welcome to Our Community
                </CardTitle>
                <CardDescription>
                  Connect with others who understand your journey. Share experiences, get support, and make a difference.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    className="justify-start h-auto py-4 px-6"
                    onMouseEnter={() => speakText("Join a support group")}
                  >
                    <Users className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Join Support Groups</div>
                      <div className="text-sm text-muted-foreground">Find your community</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto py-4 px-6"
                    onMouseEnter={() => speakText("Start a discussion")}
                  >
                    <MessageSquare className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Start Discussion</div>
                      <div className="text-sm text-muted-foreground">Share your thoughts</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community Groups */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Community Groups</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {communityGroups.map((group) => (
                  <Card key={group.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          <CardDescription>{group.description}</CardDescription>
                        </div>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          {group.category}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{group.members} members</span>
                        <span>Last activity: {group.lastActivity}</span>
                      </div>
                      <Button className="w-full mt-4" size="sm">
                        Join Group
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Discussions */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Recent Discussions</h2>
              <div className="space-y-4">
                {recentDiscussions.map((discussion) => (
                  <Card key={discussion.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback>{discussion.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{discussion.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span>by {discussion.author}</span>
                            <span>{discussion.replies} replies</span>
                            <span>Last reply: {discussion.lastReply}</span>
                          </div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {discussion.category}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Accessibility Workshop</h4>
                    <p className="text-sm text-muted-foreground">Tomorrow, 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Caregiver Meetup</h4>
                    <p className="text-sm text-muted-foreground">Friday, 6:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Members</span>
                  <span className="font-semibold">12,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Groups</span>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discussions Today</span>
                  <span className="font-semibold">89</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}