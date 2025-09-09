import { Heart, MessageCircle, BookOpen, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Navigation = ({ activeSection, setActiveSection }: NavigationProps) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Heart },
    { id: 'chat', label: 'AI Support', icon: MessageCircle },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'forum', label: 'Community', icon: Users },
    { id: 'admin', label: 'Admin', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-t border-border/50 glass-effect">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center py-3">
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
        </div>
      </div>
    </nav>
  );
};

export default Navigation;