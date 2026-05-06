import { useState, useEffect } from "react";
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
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Filter,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useAccessibility } from "../contexts/accessibility-context";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const specializations = [
  "travel assistant",
  "Mobility Support",
  "Elderly Care",
  "Rehabilitation",
  "Physical Therapy",
  "Daily Activities",
  "Companionship"
];

export function CaretakerBooking() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("all");
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<any>(null);
  const [caretakers, setCaretakers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { speakText, textToSpeech } = useAccessibility();

  useEffect(() => {
    fetchCaretakers();
  }, []);

  const fetchCaretakers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/caretakers');
      const data = await response.json();
      if (data.success) {
        // Transform the data to match the expected format
        const transformedCaretakers = data.caretakers.map((caretaker: any, index: number) => ({
          id: caretaker._id || index + 1,
          name: caretaker.name,
          experience: `${caretaker.yearsOfExperience} years`,
          rating: 4.5 + Math.random() * 0.5, // Mock rating for now
          reviews: Math.floor(Math.random() * 200) + 50, // Mock reviews
          specialization: caretaker.specialization,
          location: caretaker.location,
          availability: caretaker.availability === 'full-time' ? 'Full-time' : 'Part-time',
          hourlyRate: `₹${caretaker.hourlyRate}/hour`,
          image: caretaker.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        }));
        setCaretakers(transformedCaretakers);
      }
    } catch (error) {
      console.error('Error fetching caretakers:', error);
      // Fallback to mock data if API fails
      setCaretakers([
        {
          id: 1,
          name: "Priya Sharma",
          experience: "5 years",
          rating: 4.8,
          reviews: 124,
          specialization: ["Elderly Care", "Medical Support"],
          location: "Delhi",
          availability: "Full-time",
          hourlyRate: "₹300/hour",
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
        },
        {
          id: 2,
          name: "Rajesh Kumar",
          experience: "8 years",
          rating: 4.9,
          reviews: 203,
          specialization: ["Travel Assistant", "Mobility Support"],
          location: "Mumbai",
          availability: "Part-time",
          hourlyRate: "₹350/hour",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        },
        {
          id: 3,
          name: "Anita Desai",
          experience: "3 years",
          rating: 4.7,
          reviews: 89,
          specialization: ["Companionship", "Daily Activities"],
          location: "Bangalore",
          availability: "Full-time",
          hourlyRate: "₹280/hour",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
        },
        {
          id: 4,
          name: "Vikram Singh",
          experience: "6 years",
          rating: 4.8,
          reviews: 156,
          specialization: ["Physical Therapy", "Rehabilitation"],
          location: "Pune",
          availability: "Full-time",
          hourlyRate: "₹400/hour",
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = (text: string) => {
    if (textToSpeech) {
      speakText(text);
    }
  };

  const handleBookNow = (assistant: any) => {
    setSelectedAssistant(assistant);
    setShowBookingDialog(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowBookingDialog(false);
    // Show verification dialog
    alert("To complete this booking, please verify your role and provide additional details.");
  };

  const filteredAssistants = caretakers.filter((assistant) => {
    const matchesSearch = assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assistant.specialization.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterSpecialization === "all" || 
      assistant.specialization.some((s: string) => s === filterSpecialization);
    return matchesSearch && matchesFilter;
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
                <h1 className="text-xl font-semibold">Caretaker Booking</h1>
                <p className="text-xs text-muted-foreground">Find and book professional caretakers</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/caretaker-registration")}
                onMouseEnter={() => handleMouseEnter("Register as a caretaker")}
              >
                Register as Caretaker
              </Button>
              <AccessibilityControls />
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Filter by specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                <SelectItem value="Elderly Care">Elderly Care</SelectItem>
                <SelectItem value="Medical Support">Medical Support</SelectItem>
                <SelectItem value="Travel Assistant">Travel Assistant</SelectItem>
                <SelectItem value="Mobility Support">Mobility Support</SelectItem>
                <SelectItem value="Companionship">Companionship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assistant Cards */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading caretakers...</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssistants.map((assistant) => (
                <div
                  key={assistant.id}
                  className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300"
                  onMouseEnter={() => handleMouseEnter(`${assistant.name}, ${assistant.experience} experience, rated ${assistant.rating} stars`)}
                >
                  <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                    <ImageWithFallback
                      src={assistant.image}
                      alt={assistant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{assistant.name}</h3>
                        <p className="text-sm text-muted-foreground">{assistant.experience} experience</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="font-semibold">{assistant.rating.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({assistant.reviews})</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {assistant.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {assistant.availability}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {assistant.specialization.map((spec: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <div className="text-xs text-muted-foreground">Hourly Rate</div>
                        <div className="font-semibold text-lg text-primary">{assistant.hourlyRate}</div>
                      </div>
                      <Button 
                        onClick={() => handleBookNow(assistant)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book {selectedAssistant?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBookingSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="service-type">Service Type</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="travel">Travel Assistance</SelectItem>
                  <SelectItem value="daily">Daily Care</SelectItem>
                  <SelectItem value="medical">Medical Support</SelectItem>
                  <SelectItem value="companionship">Companionship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="booking-date">Preferred Date</Label>
              <Input id="booking-date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input id="duration" type="number" min="1" placeholder="Enter hours" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-number">Contact Number</Label>
              <Input id="contact-number" type="tel" placeholder="Enter your phone number" required />
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900">
                <strong>Note:</strong> You'll be asked to verify your profile and provide additional 
                information before completing this booking.
              </p>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Proceed to Verification
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
