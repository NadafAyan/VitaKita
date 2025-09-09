import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageCircle, BookOpen, Users, Shield } from "lucide-react";
import heroImage from "@/assets/hero-vitakita.jpg";

interface HomePageProps {
  setActiveSection: (section: string) => void;
}

const HomePage = ({ setActiveSection }: HomePageProps) => {
  const features = [
    {
      icon: MessageCircle,
      title: "AI Support Chat",
      description: "24/7 empathetic support with crisis intervention guidance",
      action: () => setActiveSection('chat'),
    },
    {
      icon: BookOpen,
      title: "Wellness Resources",
      description: "Curated articles, videos, and guided relaxation content",
      action: () => setActiveSection('resources'),
    },
    {
      icon: Users,
      title: "Peer Community",
      description: "Anonymous forum for sharing experiences and support",
      action: () => setActiveSection('forum'),
    },
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="gradient-hero absolute inset-0 opacity-90" />
        
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary-foreground">
              VITAKITA
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 font-light">
              Your confidential digital mental health companion for higher education
            </p>
            <p className="text-lg mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
              A safe, stigma-free space offering resources and tools to help you manage stress, anxiety, and mental wellness challenges.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setActiveSection('chat')}
                className="shadow-therapeutic transition-therapeutic"
              >
                <MessageCircle className="mr-2" size={20} />
                Start AI Chat Support
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setActiveSection('resources')}
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-therapeutic"
              >
                <BookOpen className="mr-2" size={20} />
                Explore Resources
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Mental Wellness Toolkit</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive support designed specifically for students in higher education
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map(({ icon: Icon, title, description, action }, index) => (
            <Card
              key={index}
              className="group cursor-pointer shadow-gentle hover:shadow-therapeutic transition-therapeutic border-0 gradient-support"
              onClick={action}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-gentle">
                  <Icon size={32} className="text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto shadow-gentle border-0 gradient-calm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 rounded-full bg-accent/20">
              <Shield size={32} className="text-accent-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Confidential & Secure</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Your privacy and wellbeing are our top priorities. All interactions are confidential, 
              and our AI is trained to provide supportive guidance while recognizing when professional 
              intervention may be needed.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Heart size={16} className="text-primary" />
                Anonymous Support
              </span>
              <span className="flex items-center gap-2">
                <Shield size={16} className="text-primary" />
                Secure Data
              </span>
              <span className="flex items-center gap-2">
                <Users size={16} className="text-primary" />
                Peer Moderation
              </span>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default HomePage;