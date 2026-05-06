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
  MapPin,
  Navigation,
  Car,
  Accessibility,
  Phone,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { useAccessibility } from "../contexts/accessibility-context";
import { useAuth } from "../contexts/auth-context";
import { toast } from "sonner";

interface RideBooking {
  _id: string;
  pickupLocation: { address: string };
  destination: { address: string };
  rideType: string;
  fare: { total: number; distance?: number; duration?: number };
  status: string;
  driverId?: { name: string; phone: string; rating: number };
  vehicle?: { model: string; number: string; color: string };
  createdAt: string;
}

export function TravelBooking() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingData, setBookingData] = useState({
    pickupLocation: "",
    destination: "",
    rideType: "economy",
    specialRequirements: [] as string[],
    emergencyContact: user?.phone || "",
  });
  const [fareEstimate, setFareEstimate] = useState<{
    baseFare: number;
    distance: number;
    duration: number;
    taxes: number;
    total: number;
  } | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<RideBooking | null>(null);
  const { speakText } = useAccessibility();

  useEffect(() => {
    if (bookingData.pickupLocation && bookingData.destination) {
      getFareEstimate();
    }
  }, [bookingData.pickupLocation, bookingData.destination, bookingData.rideType]);

  const getFareEstimate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/rides/fare-estimate?pickup=${encodeURIComponent(bookingData.pickupLocation)}&destination=${encodeURIComponent(bookingData.destination)}&rideType=${bookingData.rideType}`
      );
      const data = await response.json();
      if (data.success) {
        setFareEstimate(data.estimate);
      }
    } catch (error) {
      console.error('Error getting fare estimate:', error);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book a ride");
      navigate("/login");
      return;
    }

    if (!bookingData.pickupLocation || !bookingData.destination || !fareEstimate) {
      toast.error("Please fill all required fields");
      return;
    }

    setBookingLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/rides/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          pickupLocation: { address: bookingData.pickupLocation },
          destination: { address: bookingData.destination },
          rideType: bookingData.rideType,
          specialRequirements: bookingData.specialRequirements,
          emergencyContact: bookingData.emergencyContact,
          fare: fareEstimate,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCurrentBooking(data.booking);
        setShowBookingDialog(false);
        toast.success("Ride booked successfully!");
        speakText("Ride booked successfully. Finding your driver.");
      } else {
        toast.error(data.message || "Booking failed");
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error("Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const rideTypeOptions = [
    { value: "economy", label: "Economy", description: "Affordable & Comfortable", icon: Car },
    { value: "premium", label: "Premium", description: "Extra Space & Comfort", icon: Car },
    { value: "wheelchair", label: "Wheelchair", description: "Accessible Vehicle", icon: Accessibility },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AccessibilityControls />
      <VoiceNavigation />
      <Chatbot />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Travel Sahayak</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">🙏 Namaste!</h2>
            <p className="text-lg text-gray-600">Aapki safe journey humare liye important hai</p>
          </div>

          {/* Booking Form */}
          <div className="space-y-6">
            {/* Pickup Location */}
            <div>
              <Label htmlFor="pickup" className="text-base font-medium">
                <MapPin className="h-4 w-4 inline mr-2" />
                Pickup Location (Kahaan se)
              </Label>
              <Input
                id="pickup"
                placeholder="Enter pickup address"
                value={bookingData.pickupLocation}
                onChange={(e) => setBookingData(prev => ({ ...prev, pickupLocation: e.target.value }))}
                className="mt-2"
              />
            </div>

            {/* Destination */}
            <div>
              <Label htmlFor="destination" className="text-base font-medium">
                <Navigation className="h-4 w-4 inline mr-2" />
                Destination (Kahaan jaana hai)
              </Label>
              <Input
                id="destination"
                placeholder="Enter destination address"
                value={bookingData.destination}
                onChange={(e) => setBookingData(prev => ({ ...prev, destination: e.target.value }))}
                className="mt-2"
              />
            </div>

            {/* Ride Type */}
            <div>
              <Label className="text-base font-medium">
                <Car className="h-4 w-4 inline mr-2" />
                Ride Type (Kaisi gaadi chahiye)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {rideTypeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.value}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        bookingData.rideType === option.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setBookingData(prev => ({ ...prev, rideType: option.value }))}
                    >
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 mr-2" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Special Requirements */}
            <div>
              <Label className="text-base font-medium">Special Requirements (Optional)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  { value: "assistance", label: "Door-to-door assistance chahiye" },
                  { value: "luggage", label: "Luggage help chahiye" },
                  { value: "medical", label: "Medical equipment hai" },
                ].map((req) => (
                  <Badge
                    key={req.value}
                    variant={bookingData.specialRequirements.includes(req.value) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setBookingData(prev => ({
                        ...prev,
                        specialRequirements: prev.specialRequirements.includes(req.value)
                          ? prev.specialRequirements.filter(r => r !== req.value)
                          : [...prev.specialRequirements, req.value]
                      }));
                    }}
                  >
                    {req.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <Label htmlFor="emergency" className="text-base font-medium">
                <Phone className="h-4 w-4 inline mr-2" />
                Emergency Contact (Family member ka number)
              </Label>
              <Input
                id="emergency"
                type="tel"
                placeholder="10-digit mobile number"
                value={bookingData.emergencyContact}
                onChange={(e) => setBookingData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                className="mt-2"
              />
            </div>

            {/* Fare Estimate */}
            {fareEstimate && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2">Estimated Fare</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Distance</span>
                    <span>{fareEstimate.distance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span>{fareEstimate.duration} mins</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{fareEstimate.total}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Book Button */}
            <Button
              onClick={() => setShowBookingDialog(true)}
              className="w-full py-3 text-lg"
              disabled={!bookingData.pickupLocation || !bookingData.destination || !fareEstimate}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Book Ride Now
            </Button>
          </div>
        </div>

        {/* Current Booking Status */}
        {currentBooking && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h3 className="text-lg font-medium mb-4">Current Ride</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Status</span>
                <Badge variant={currentBooking.status === 'searching' ? 'secondary' : 'default'}>
                  {currentBooking.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>From</span>
                <span>{currentBooking.pickupLocation.address}</span>
              </div>
              <div className="flex justify-between">
                <span>To</span>
                <span>{currentBooking.destination.address}</span>
              </div>
              <div className="flex justify-between">
                <span>Fare</span>
                <span>₹{currentBooking.fare.total}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Booking Confirmation Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Ride Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Please confirm your ride details:</p>
              <div className="mt-2 space-y-1">
                <p><strong>From:</strong> {bookingData.pickupLocation}</p>
                <p><strong>To:</strong> {bookingData.destination}</p>
                <p><strong>Type:</strong> {rideTypeOptions.find(t => t.value === bookingData.rideType)?.label}</p>
                <p><strong>Fare:</strong> ₹{fareEstimate?.total}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowBookingDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="flex-1"
              >
                {bookingLoading ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}