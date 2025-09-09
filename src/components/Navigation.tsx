import { Heart, MessageCircle, BookOpen, Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmergencyButton from "@/components/EmergencyButton";

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  user?: { id: string; email: string; name: string };
  onLogout?: () => void;
}

const Navigation = ({ activeSection, setActiveSection, user, onLogout }: NavigationProps) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Heart },
    { id: 'chat', label: 'AI Support', icon: MessageCircle },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'forum', label: 'Community', icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-t border-border/50 glass-effect">
      <div className="container mx-auto px-4">
        {/* Emergency Button - Always Visible */}
        <div className="flex justify-center py-2">
          <EmergencyButton className="h-8 text-xs px-4" />
        </div>
        
        {/* Main Navigation */}
        <div className="flex justify-around items-center py-3 border-t border-border/20">
          {navItems.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeSection === id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveSection(id)}
              className="flex flex-col gap-1 h-auto py-2 px-3 transition-therapeutic"
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          ))}
          
          {/* Logout Button */}
          {user && onLogout && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="flex flex-col gap-1 h-auto py-2 px-3 transition-therapeutic text-muted-foreground hover:text-foreground"
            >
              <AlertTriangle size={20} />
              <span className="text-xs font-medium">Logout</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;