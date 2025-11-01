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
    <>
      {/* Mobile/Tablet top nav */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50 glass-effect" aria-label="Primary">
        <div className="container mx-auto px-3">
          <div className="flex justify-between items-center h-14 gap-2">
            <div className="flex items-center gap-1">
              {navItems.map(({ id, icon: Icon }) => (
                <Button
                  key={id}
                  aria-label={id}
                  variant={activeSection === id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveSection(id)}
                  className="h-9 w-9 p-0 transition-therapeutic"
                >
                  <Icon size={18} />
                </Button>
              ))}
            </div>
            
            <EmergencyButton className="h-9 text-xs px-3" />
            
            {user && onLogout && (
              <Button
                aria-label="Logout"
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="h-9 px-2 transition-therapeutic"
              >
                <AlertTriangle size={18} />
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Desktop top nav */}
      <nav className="hidden md:block sticky top-0 z-40 bg-card/70 backdrop-blur-md border-b border-border/50" aria-label="Primary">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Heart className="text-primary" size={20} />
              <span className="font-semibold">VITAKITA</span>
            </div>
            <div className="flex items-center gap-1">
              {navItems.map(({ id, label }) => (
                <Button
                  key={id}
                  variant={activeSection === id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveSection(id)}
                  className="px-3"
                >
                  <span className="text-sm font-medium">{label}</span>
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {user && <span className="hidden lg:inline text-sm text-muted-foreground">{user.name}</span>}
              {user && onLogout && (
                <Button variant="outline" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;