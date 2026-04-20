import { Navbar } from "../components/navbar";
import { Chatbot } from "../components/chatbot";
import { VoiceNavigation } from "../components/voice-navigation";
import { Heart, Target, Users, Eye } from "lucide-react";

export function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Chatbot />
      <VoiceNavigation />

      <main className="pt-24 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">About Sahayak</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A platform built with compassion, designed to empower lives through technology and human connection
            </p>
          </div>

          <div className="space-y-12">
            <section className="bg-white p-8 rounded-2xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Sahayak exists to bridge the gap between those who need support and those who can provide it. 
                    We believe in creating an inclusive ecosystem where senior citizens, specially-abled individuals, 
                    and communities can access essential services, connect with caregivers, and find meaningful support 
                    with dignity and ease.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We envision a world where accessibility isn't an afterthought but a fundamental right. 
                    Through technology and community, we strive to create a society where every individual, 
                    regardless of age or ability, can live independently, confidently, and with full access 
                    to the resources they need.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">What We Do</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Sahayak is more than a platform—it's a movement. We provide:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Real-time accessibility mapping to help users find barrier-free locations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Verified caretaker and assistant booking services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Information on government schemes and support programs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Community networks for support, volunteering, and advocacy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Platforms for sharing stories and inspiring others</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Donation channels to support NGOs and charitable organizations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
