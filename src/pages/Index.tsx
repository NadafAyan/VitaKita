import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AuthPage from "@/components/AuthPage";
import Navigation from "@/components/Navigation";
import HomePage from "@/components/HomePage";
import DashboardHome from "@/components/DashboardHome";
import ChatPage from "@/components/ChatPage";
import ResourcesPage from "@/components/ResourcesPage";
import ForumPage from "@/components/ForumPage";
// Removed standalone CounselingPage and UserRecord - merged into DashboardHome
import { Dispatch, SetStateAction, useState as useReactState } from "react";
import { useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";

interface User {
  id: string;
  email: string;
  name: string;
}

type IndexProps = {
  user: any;
};

const Index = ({ user }: IndexProps) => {
  const [activeSection, setActiveSection] = useState("home");
  const { toast } = useToast();
  const location = useLocation();

  const handleLogout = () => {
    signOut(auth).then(() => {
      setActiveSection("home");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out from VITAKITA.",
      });
    }).catch((error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    });
  };

  // Show marketing homepage for guests; if `?auth=1` present, render AuthPage
  if (!user) {
    const params = new URLSearchParams(location.search);
    const showAuth = params.get("auth") === "1";
    return showAuth ? <AuthPage /> : <HomePage />;
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "home":
        return <DashboardHome setActiveSection={setActiveSection} user={user} />;
      case "chat":
        return <ChatPage />;
      case "resources":
        return <ResourcesPage />;
      case "forum":
        return <ForumPage />;
      case "counseling":
        return <DashboardHome setActiveSection={setActiveSection} user={user} />;
      case "userRecord":
        return <DashboardHome setActiveSection={setActiveSection} user={user} />;
      default:
        return <DashboardHome setActiveSection={setActiveSection} user={user} />;
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
