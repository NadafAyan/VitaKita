import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Mail, Lock, User, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-vitakita.jpg";

interface AuthPageProps {
  onAuthSuccess: (user: { id: string; email: string; name: string }) => void;
}

const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call - would integrate with Supabase Auth
    setTimeout(() => {
      if (loginData.email && loginData.password) {
        const user = {
          id: `user_${Math.floor(Math.random() * 10000)}`,
          email: loginData.email,
          name: loginData.email.split('@')[0]
        };
        
        onAuthSuccess(user);
        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in to VITAKITA.",
        });
      } else {
        toast({
          title: "Login failed",
          description: "Please check your credentials and try again.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please ensure both passwords match.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Simulate API call - would integrate with Supabase Auth
    setTimeout(() => {
      if (signupData.email && signupData.password && signupData.name) {
        const user = {
          id: `user_${Math.floor(Math.random() * 10000)}`,
          email: signupData.email,
          name: signupData.name
        };
        
        onAuthSuccess(user);
        toast({
          title: "Account created!",
          description: "Welcome to VITAKITA. Your mental health journey starts here.",
        });
      } else {
        toast({
          title: "Signup failed",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Background */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="gradient-hero absolute inset-0 opacity-90" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-primary-foreground/20">
                  <Heart size={32} className="text-primary-foreground" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground">
                  VITAKITA
                </h1>
              </div>
              <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                Your confidential digital mental health companion for higher education
              </p>
            </div>

            {/* Auth Card */}
            <Card className="max-w-md mx-auto shadow-therapeutic border-0 glass-effect">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Join VITAKITA</CardTitle>
                <CardDescription>
                  Secure, confidential mental health support designed for students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input
                            type="email"
                            placeholder="Email address"
                            value={loginData.email}
                            onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10 border-border/30"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input
                            type="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                            className="pl-10 border-border/30"
                            required
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full transition-therapeutic" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input
                            type="text"
                            placeholder="Full name"
                            value={signupData.name}
                            onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                            className="pl-10 border-border/30"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input
                            type="email"
                            placeholder="Email address"
                            value={signupData.email}
                            onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10 border-border/30"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input
                            type="password"
                            placeholder="Password"
                            value={signupData.password}
                            onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                            className="pl-10 border-border/30"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input
                            type="password"
                            placeholder="Confirm password"
                            value={signupData.confirmPassword}
                            onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="pl-10 border-border/30"
                            required
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full transition-therapeutic" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                {/* Privacy Notice */}
                <Card className="mt-6 bg-secondary/20 border-0">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Shield size={16} className="text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Your privacy is protected. All data is encrypted and your mental health information remains confidential.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuthPage;