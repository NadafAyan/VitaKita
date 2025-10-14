import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/firebase"; // Use unified auth instance
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      const user = userCredential.user;
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in to VITAKITA.",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message, // Display the error message from Firebase
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupData.email, signupData.password);
      const user = userCredential.user;
      // Set display name
      if (signupData.name) {
        await updateProfile(user, { displayName: signupData.name });
      }
      // Create user profile in Firestore with diagnostic flag
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: signupData.name || (user.email ? user.email.split('@')[0] : "User"),
        disease: null,
        requiresDiagnostic: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      toast({
        title: "Account created!",
        description: "Welcome to VITAKITA. Your mental health journey starts here.",
      });
      // Send new users to their record so diagnostic runs immediately
      navigate("/User", { state: { newSignup: true } });
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error.message, // Display the error message from Firebase
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" />
        <div className="gradient-hero absolute inset-0 opacity-90" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-12 px-2">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-primary-foreground/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground">
                  VITAKITA
                </h1>
              </div>
              <p className="text-base sm:text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                Your confidential digital mental health companion for higher education
              </p>
            </div>
            <Card className="max-w-md mx-auto shadow-therapeutic border-0 glass-effect">
              <CardHeader className="text-center">
                <CardTitle className="text-xl sm:text-2xl font-bold">Join VITAKITA</CardTitle>
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
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                          <Input type="email" placeholder="Email address" value={loginData.email} onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))} className="pl-10 border-border/30" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="relative">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          <Input type="password" placeholder="Password" value={loginData.password} onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))} className="pl-10 border-border/30" required />
                        </div>
                      </div>
                      <Button type="submit" className="w-full transition-therapeutic" disabled={isLoading}>{isLoading ? "Signing in..." : "Sign In"}</Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <div className="relative">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          <Input type="text" placeholder="Full name" value={signupData.name} onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))} className="pl-10 border-border/30" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="relative">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                          <Input type="email" placeholder="Email address" value={signupData.email} onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))} className="pl-10 border-border/30" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="relative">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          <Input type="password" placeholder="Password" value={signupData.password} onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))} className="pl-10 border-border/30" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="relative">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          <Input type="password" placeholder="Confirm password" value={signupData.confirmPassword} onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))} className="pl-10 border-border/30" required />
                        </div>
                      </div>
                      <Button type="submit" className="w-full transition-therapeutic" disabled={isLoading}>{isLoading ? "Creating account..." : "Create Account"}</Button>
                    </form>
                  </TabsContent>
                </Tabs>
                <Card className="mt-6 bg-secondary/20 border-0">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1 flex-shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                      <div>
                        <p className="text-xs text-muted-foreground">Your privacy is protected. All data is encrypted and your mental health information remains confidential.</p>
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
