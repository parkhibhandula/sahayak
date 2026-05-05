import { useState } from "react";
import { useNavigate } from "react-router";
import Chatbot from "../components/chatbot";
import { VoiceNavigation } from "../components/voice-navigation";
import { Navbar } from "../components/navbar";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, MapPin, Clock, Briefcase, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

const mockJobs = [
  { id: 1, title: "Caretaker", location: "Delhi", type: "Full-time", experience: "2+ years", salary: "₹15,000 - ₹25,000/month" },
  { id: 2, title: "Personal Assistant", location: "Mumbai", type: "Part-time", experience: "1+ years", salary: "₹20,000 - ₹30,000/month" },
  { id: 3, title: "Medical Support Staff", location: "Bangalore", type: "Full-time", experience: "3+ years", salary: "₹25,000 - ₹40,000/month" },
  { id: 4, title: "Companion for Elderly", location: "Pune", type: "Full-time", experience: "1+ years", salary: "₹12,000 - ₹20,000/month" },
];

export function Careers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const handleApply = (job: any) => {
    setSelectedJob(job);
    setShowApplyDialog(true);
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowApplyDialog(false);
    alert("Application submitted! We'll contact you soon.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Chatbot />
      <VoiceNavigation />

      <main className="pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Build a Meaningful Career</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our team and make a real difference in people's lives
            </p>
          </div>

          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search job openings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {mockJobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-2xl border border-border hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{job.type}</Badge>
                      <Badge variant="outline">{job.experience}</Badge>
                    </div>
                  </div>
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {job.salary}
                  </div>
                </div>
                <Button onClick={() => handleApply(job)} className="w-full bg-primary hover:bg-primary/90">
                  Apply Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleApplicationSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="applicant-name">Full Name</Label>
              <Input id="applicant-name" placeholder="Your name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicant-email">Email</Label>
              <Input id="applicant-email" type="email" placeholder="your@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicant-phone">Phone Number</Label>
              <Input id="applicant-phone" type="tel" placeholder="Your phone number" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicant-experience">Relevant Experience</Label>
              <Textarea id="applicant-experience" placeholder="Describe your experience..." rows={4} required />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Submit Application
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
