import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AuthPage from "@/components/AuthPage";
import Navigation from "@/components/Navigation";
import HomePage from "@/components/HomePage";
import ChatPage from "@/components/ChatPage";
import ResourcesPage from "@/components/ResourcesPage";
import ForumPage from "@/components/ForumPage";
import CounselingPage from "@/components/CounselingPage";
import UserRecord from '../components/UserRecord';
import { Dispatch, SetStateAction, useState as useReactState } from "react";

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
      case "counseling":
        return <CounselingPage user={user} />;
      case "userRecord":
        return <UserRecord user={user} />;
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

// Move setUser into the Index component using useState
// Remove the standalone setUser function below

// --- Remove this function ---
// function setUser(userData: User) {
//   throw new Error("Function not implemented.");
// }
function setUser(userData: User) {
  throw new Error("Function not implemented.");
}

