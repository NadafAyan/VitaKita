import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Heart, Shield, Star, Users } from "lucide-react";
import heroImage from "@/assets/hero-vitakita.jpg";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="gradient-hero absolute inset-0 opacity-90" />
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-primary-foreground mb-4">
              <Star size={16} />
              <span className="text-sm">Trusted mental wellness companion for students</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-primary-foreground leading-tight">
              Feel supported. Grow resilient. Thrive with VitaKita.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/90 max-w-2xl">
              Confidential, stigma-free mental health support with AI guidance, curated resources, and a peer community — all in one place.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link to="/auth">
                <Button size="lg" className="shadow-therapeutic">Join Free</Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="shadow-gentle">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-gentle">
            <CardHeader>
              <CardTitle>Always There</CardTitle>
              <CardDescription>24/7 AI support that listens and guides with care</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-0 shadow-gentle">
            <CardHeader>
              <CardTitle>Curated Resources</CardTitle>
              <CardDescription>Evidence-based content to build daily resilience</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-0 shadow-gentle">
            <CardHeader>
              <CardTitle>Safe Community</CardTitle>
              <CardDescription>Anonymous peer support moderated for safety</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Why VitaKita */}
      <section className="container mx-auto px-4 py-8">
        <Card className="max-w-5xl mx-auto border-0 shadow-gentle">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl">Why students choose VitaKita</CardTitle>
            <CardDescription>Built with privacy and compassion at the core</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid sm:grid-cols-2 gap-4 text-base">
              <li className="flex items-center gap-2"><Check className="text-primary" size={18} /> Confidential and secure by design</li>
              <li className="flex items-center gap-2"><Check className="text-primary" size={18} /> Personalized guidance and tools</li>
              <li className="flex items-center gap-2"><Check className="text-primary" size={18} /> Community that understands you</li>
              <li className="flex items-center gap-2"><Check className="text-primary" size={18} /> Free to start, easy to use</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Trust */}
      <section className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto shadow-gentle border-0 gradient-calm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 rounded-full bg-accent/20">
              <Shield size={32} className="text-accent-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Your privacy. Your pace.</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We never share your personal data. You stay in control of your journey, with tools that meet you where you are.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Heart size={16} className="text-primary" /> Compassionate by design</span>
              <span className="flex items-center gap-2"><Users size={16} className="text-primary" /> Community first</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Begin your wellness journey</h2>
        <p className="text-lg text-muted-foreground mb-6">Join thousands of students building healthier habits with VitaKita.</p>
        <Link to="/auth">
          <Button size="lg" className="shadow-therapeutic">Get Started</Button>
        </Link>
      </section>
    </div>
  );
};

export default HomePage;