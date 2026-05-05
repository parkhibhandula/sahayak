import { useState } from "react";
import { useNavigate } from "react-router";
import Chatbot from "../components/chatbot";
import { VoiceNavigation } from "../components/voice-navigation";
import { AccessibilityControls } from "../components/accessibility-controls";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  ArrowLeft,
  Search,
  MapPin,
  Plus,
  Filter,
  Navigation,
  Wheelchair,
  Users,
  Home,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useAccessibility } from "../contexts/accessibility-context";

const mockLocations = [
  { id: 1, name: "City Hospital", type: "Healthcare", accessible: true, lat: 28.6139, lng: 77.2090, tags: ["Wheelchair Ramp", "Accessible Washroom"] },
  { id: 2, name: "Green Park Metro", type: "Transport", accessible: true, lat: 28.5594, lng: 77.2067, tags: ["Elevator", "Tactile Flooring"] },
  { id: 3, name: "Central Library", type: "Education", accessible: true, lat: 28.6328, lng: 77.2197, tags: ["Audio Books", "Braille Signs"] },
  { id: 4, name: "Community Center", type: "Community", accessible: true, lat: 28.5355, lng: 77.3910, tags: ["Accessible Parking", "Sign Language Support"] },
  { id: 5, name: "Shopping Mall", type: "Shopping", accessible: true, lat: 28.5494, lng: 77.2501, tags: ["Wheelchair Access", "Disabled Parking"] },
];

export function AccessibilityMap() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { speakText, textToSpeech } = useAccessibility();

  const handleMouseEnter = (text: string) => {
    if (textToSpeech) {
      speakText(text);
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddDialog(false);
    // In a real app, this would submit to a backend
  };

  const filteredLocations = mockLocations.filter((loc) => {
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || loc.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <Chatbot />
      <VoiceNavigation />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/dashboard")}
                onMouseEnter={() => handleMouseEnter("Back to dashboard")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Accessibility Map</h1>
                <p className="text-xs text-muted-foreground">Find accessible locations near you</p>
              </div>
            </div>
            <AccessibilityControls />
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-96 bg-white border-r border-border overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Community">Community</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
              </SelectContent>
            </Select>

            {/* Add Tag Button */}
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => setShowAddDialog(true)}
              onMouseEnter={() => handleMouseEnter("Add new accessibility tag")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Accessibility Tag
            </Button>

            {/* Location List */}
            <div className="space-y-3 mt-6">
              {filteredLocations.map((location) => (
                <div
                  key={location.id}
                  className="p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                  onMouseEnter={() => handleMouseEnter(`${location.name}, ${location.type}. ${location.tags.join(", ")}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{location.name}</h3>
                      <p className="text-sm text-muted-foreground">{location.type}</p>
                    </div>
                    <Navigation className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {location.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-muted/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Interactive Map View</h3>
                <p className="text-muted-foreground max-w-md">
                  In a production environment, this would display an interactive map 
                  with accessibility tags and real-time location data.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  <span className="text-sm">Fully Accessible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-secondary rounded-full" />
                  <span className="text-sm">Partially Accessible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-muted-foreground rounded-full" />
                  <span className="text-sm">Not Accessible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Tag Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Accessibility Tag</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddTag} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="location-name">Location Name</Label>
              <Input id="location-name" placeholder="Enter location name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location-type">Type</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Community">Community</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accessibility-features">Accessibility Features</Label>
              <Textarea 
                id="accessibility-features" 
                placeholder="List accessibility features (e.g., wheelchair ramp, braille signs)"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additional-info">Additional Information</Label>
              <Textarea 
                id="additional-info" 
                placeholder="Any other helpful details"
                rows={2}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Submit Tag
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
