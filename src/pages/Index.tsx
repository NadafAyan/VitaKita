import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AuthPage from "@/components/AuthPage";
import Navigation from "@/components/Navigation";
import HomePage from "@/components/HomePage";
import ChatPage from "@/components/ChatPage";
import ResourcesPage from "@/components/ResourcesPage";
import ForumPage from "@/components/ForumPage";

interface User {
  id: string;
  email: string;
  name: string;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setActiveSection("home");
  };

  const handleLogout = () => {
    setUser(null);
    setActiveSection("home");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out from VITAKITA.",
    });
  };

  // Show auth page if user is not logged in
  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "home":
        return <HomePage setActiveSection={setActiveSection} />;
      case "chat":
        return <ChatPage />;
      case "resources":
        return <ResourcesPage />;
      case "forum":
        return <ForumPage />;
      default:
        return <HomePage setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderActiveSection()}
      <Navigation 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        user={user}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default Index;
