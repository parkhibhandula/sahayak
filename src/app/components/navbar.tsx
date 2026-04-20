import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAccessibility } from "../contexts/accessibility-context";
import { useAuth } from "../contexts/auth-context";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Navbar() {
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupLocation, setSignupLocation] = useState("");
  const { speakText, textToSpeech } = useAccessibility();
  const { login, signup, logout, user, isAuthenticated } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password length
    if (loginPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    try {
      await login(loginEmail, loginPassword);
      toast.success("Login successful");
      setShowLoginDialog(false);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.message || "Login failed");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password length
    if (signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    try {
      await signup({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        phone: signupPhone || "N/A",
        location: signupLocation || "N/A",
        role: "donor",
      });
      toast.success("Signup successful");
      setShowSignupDialog(false);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.message || "Signup failed");
    }
  };

  const handleMouseEnter = (text: string) => {
    if (textToSpeech) {
      speakText(text);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center gap-2"
              onMouseEnter={() => handleMouseEnter("Sahayak - A Unified Support Ecosystem")}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-2xl font-semibold text-foreground">Sahayak</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link 
                to="/about" 
                className="text-foreground/80 hover:text-primary transition-colors"
                onMouseEnter={() => handleMouseEnter("About")}
              >
                About
              </Link>
              <Link 
                to="/how-it-works" 
                className="text-foreground/80 hover:text-primary transition-colors"
                onMouseEnter={() => handleMouseEnter("How It Works")}
              >
                How It Works
              </Link>
              <Link 
                to="/dashboard" 
                className="text-foreground/80 hover:text-primary transition-colors"
                onMouseEnter={() => handleMouseEnter("Explore")}
              >
                Explore
              </Link>
              <Link 
                to="/impact" 
                className="text-foreground/80 hover:text-primary transition-colors"
                onMouseEnter={() => handleMouseEnter("Impact")}
              >
                Impact
              </Link>
              <Link 
                to="/careers" 
                className="text-foreground/80 hover:text-primary transition-colors"
                onMouseEnter={() => handleMouseEnter("Careers")}
              >
                Careers
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <span className="text-sm font-medium text-foreground">{user?.name}</span>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout();
                      toast.success('Logged out');
                      navigate('/');
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setShowLoginDialog(true)}
                    onMouseEnter={() => handleMouseEnter('Login')}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => setShowSignupDialog(true)}
                    className="bg-primary hover:bg-primary/90"
                    onMouseEnter={() => handleMouseEnter('Sign Up')}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome Back</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="your@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Login
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Signup Dialog */}
      <Dialog open={showSignupDialog} onOpenChange={setShowSignupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Your Account</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSignup} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full Name</Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="Your name"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="your@email.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Create password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-phone">Phone</Label>
              <Input
                id="signup-phone"
                type="tel"
                placeholder="Phone"
                value={signupPhone}
                onChange={(e) => setSignupPhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-location">Location</Label>
              <Input
                id="signup-location"
                type="text"
                placeholder="Location"
                value={signupLocation}
                onChange={(e) => setSignupLocation(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Sign Up
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
