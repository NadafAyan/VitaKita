import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AuthPage from "@/pages/AuthPage";
import Navigation from "@/components/Navigation";
import HomePage from "@/pages/HomePage";
import DashboardHome from "@/pages/DashboardHome";
import ChatPage from "@/pages/ChatPage";
import ResourcesPage from "@/pages/ResourcesPage";
import ForumPage from "@/pages/ForumPage";
// Removed standalone CounselingPage and UserRecord - merged into DashboardHome
import { Dispatch, SetStateAction, useState as useReactState } from "react";
import { useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";

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
      <Navigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        user={user}
        onLogout={handleLogout}
      />
      <div className="pt-14">
        {renderActiveSection()}
      </div>
    </div>
  );
};

export default Index;
