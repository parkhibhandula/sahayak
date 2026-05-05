import { Navbar } from "../components/navbar";
import Chatbot from "../components/chatbot";
import { VoiceNavigation } from "../components/voice-navigation";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";
import { 
  Heart, 
  MapPin, 
  Users, 
  Shield, 
  Handshake, 
  TrendingUp,
  Star
} from "lucide-react";
import { useAccessibility } from "../contexts/accessibility-context";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function LandingPage() {
  const navigate = useNavigate();
  const { speakText, textToSpeech } = useAccessibility();

  const handleMouseEnter = (text: string) => {
    if (textToSpeech) {
      speakText(text);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Chatbot />
      <VoiceNavigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div 
              className="space-y-6"
              onMouseEnter={() => handleMouseEnter("Sahayak - A Unified Support Ecosystem. Empowering Lives Through Compassion and Technology")}
            >
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                <span className="text-primary font-medium">A Unified Support Ecosystem</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Empowering Lives Through{" "}
                <span className="text-primary">Compassion</span> and{" "}
                <span className="text-secondary">Technology</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Supporting senior citizens, specially-abled individuals, and communities 
                with accessible services, care, and opportunities to make a difference.
              </p>
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
                  onClick={() => navigate("/dashboard")}
                >
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-8 py-6"
                  onClick={() => navigate("/how-it-works")}
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1773227057385-670ca05191da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwY2FyZSUyMHN1cHBvcnQlMjBoZWxwaW5nJTIwc2VuaW9yJTIwY2l0aXplbnxlbnwxfHx8fDE3NzM4NTIyOTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Elderly care support"
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive support services designed with accessibility and care at the forefront
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div 
              className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-xl transition-all duration-300"
              onMouseEnter={() => handleMouseEnter("Accessibility Support. Navigate with ease using our interactive accessibility map and real-time location tagging")}
            >
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Accessibility Support</h3>
              <p className="text-muted-foreground leading-relaxed">
                Navigate with ease using our interactive accessibility map and real-time location tagging
              </p>
            </div>

            <div 
              className="p-8 rounded-2xl bg-gradient-to-br from-secondary/5 to-secondary/10 hover:shadow-xl transition-all duration-300"
              onMouseEnter={() => handleMouseEnter("Community and Care. Connect with caregivers, volunteers, and support networks that truly understand")}
            >
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Community & Care</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect with caregivers, volunteers, and support networks that truly understand
              </p>
            </div>

            <div 
              className="p-8 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 hover:shadow-xl transition-all duration-300"
              onMouseEnter={() => handleMouseEnter("Contribution and Impact. Share stories, donate, or volunteer to create meaningful change in communities")}
            >
              <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Contribution & Impact</h3>
              <p className="text-muted-foreground leading-relaxed">
                Share stories, donate, or volunteer to create meaningful change in communities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Impact</h2>
            <p className="text-xl text-muted-foreground">Together, we're making a difference</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: "50,000+", label: "People Supported", icon: Users },
              { value: "10,000+", label: "Accessibility Points", icon: MapPin },
              { value: "5,000+", label: "Active Volunteers", icon: Handshake },
              { value: "₹2Cr+", label: "Funds Raised", icon: TrendingUp },
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="text-center p-8 bg-white rounded-2xl shadow-lg"
                onMouseEnter={() => handleMouseEnter(`${stat.value} ${stat.label}`)}
              >
                <stat.icon className="w-10 h-10 mx-auto mb-4 text-primary" />
                <div className="text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Stories That Inspire</h2>
            <p className="text-xl text-muted-foreground">Hear from our community members</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Rajesh Kumar",
                role: "Senior Citizen",
                text: "Sahayak helped me find accessible locations near my home. The voice navigation feature is a blessing!",
                image: "https://images.unsplash.com/photo-1766808982363-7df749493298?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYXNzaW9uJTIwY2FyZSUyMGhhbmRzJTIwaG9sZGluZ3xlbnwxfHx8fDE3NzM4NTIzMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
              },
              {
                name: "Priya Sharma",
                role: "Caregiver",
                text: "I found meaningful work as a caregiver through Sahayak. The platform is easy to use and trustworthy.",
                image: "https://images.unsplash.com/photo-1764006145420-df3006edf060?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2Nlc3NpYmlsaXR5JTIwd2hlZWxjaGFpciUyMGFzc2lzdGFuY2UlMjBjb21tdW5pdHl8ZW58MXx8fHwxNzczODUyMjk5fDA&ixlib=rb-4.1.0&q=80&w=1080",
              },
              {
                name: "Anil Patel",
                role: "Volunteer",
                text: "Contributing to my community has never been easier. Sahayak connects people who care with those who need support.",
                image: "https://images.unsplash.com/photo-1758599668547-2b1192c10abb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY29tbXVuaXR5JTIwdm9sdW50ZWVyaW5nJTIwaGVscGluZ3xlbnwxfHx8fDE3NzM4NTIzMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
              },
            ].map((testimonial, idx) => (
              <div 
                key={idx} 
                className="p-8 bg-muted/50 rounded-2xl"
                onMouseEnter={() => handleMouseEnter(`${testimonial.name}, ${testimonial.role}. ${testimonial.text}`)}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full overflow-hidden">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            onMouseEnter={() => handleMouseEnter("Ready to Make a Difference? Join thousands of people creating positive change in their communities")}
          >
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of people creating positive change in their communities
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
            onClick={() => navigate("/dashboard")}
          >
            Explore Platform
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-foreground text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-6 h-6 fill-white" />
            <span className="text-2xl font-semibold">Sahayak</span>
          </div>
          <p className="text-white/70 mb-6">
            A Unified Support Ecosystem - Making Care Accessible to All
          </p>
          <div className="flex justify-center gap-8 text-white/70">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
          <div className="mt-8 pt-8 border-t border-white/20 text-white/70 text-sm">
            © 2026 Sahayak. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
