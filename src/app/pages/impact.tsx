import { Navbar } from "../components/navbar";
import { Chatbot } from "../components/chatbot";
import { VoiceNavigation } from "../components/voice-navigation";
import { Users, MapPin, Heart, TrendingUp, Award, Globe } from "lucide-react";

export function Impact() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Chatbot />
      <VoiceNavigation />

      <main className="pt-24 px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">Our Impact</h1>
            <p className="text-xl text-muted-foreground">
              Together, we're creating positive change in communities across India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Users, value: "50,000+", label: "Lives Touched", color: "primary" },
              { icon: MapPin, value: "10,000+", label: "Accessible Locations", color: "secondary" },
              { icon: Heart, value: "₹2 Cr+", label: "Funds Raised", color: "accent" },
              { icon: TrendingUp, value: "5,000+", label: "Active Volunteers", color: "primary" },
              { icon: Award, value: "500+", label: "Verified Caregivers", color: "secondary" },
              { icon: Globe, value: "25+", label: "Cities Covered", color: "accent" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl text-center border border-border hover:shadow-xl transition-all">
                <stat.icon className={`w-12 h-12 mx-auto mb-4 text-${stat.color}`} />
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-2xl">
            <h2 className="text-3xl font-semibold mb-6">What People Are Saying</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl">
                <p className="text-muted-foreground italic mb-4">
                  "Sahayak has been a lifeline for my elderly mother. Finding accessible places 
                  and booking a caretaker has never been easier."
                </p>
                <div className="font-semibold">— Priya S., Delhi</div>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <p className="text-muted-foreground italic mb-4">
                  "As a wheelchair user, the accessibility map has transformed how I navigate my city. 
                  Thank you for thinking of us!"
                </p>
                <div className="font-semibold">— Rahul M., Bangalore</div>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <p className="text-muted-foreground italic mb-4">
                  "I found meaningful work as a caregiver through Sahayak. The platform is transparent 
                  and supportive."
                </p>
                <div className="font-semibold">— Anjali K., Mumbai</div>
              </div>
              <div className="bg-white p-6 rounded-xl">
                <p className="text-muted-foreground italic mb-4">
                  "Volunteering through Sahayak has been incredibly rewarding. I'm making a real 
                  difference in my community."
                </p>
                <div className="font-semibold">— Vikram T., Pune</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
