import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Phone, MessageCircle, Heart, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmergencyButtonProps {
  className?: string;
}

const EmergencyButton = ({ className = "" }: EmergencyButtonProps) => {
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const { toast } = useToast();

  const emergencyLevels = [
    {
      id: "moderate",
      title: "Need Support",
      description: "Feeling anxious, stressed, or need someone to talk to",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: MessageCircle,
      action: "Connect with AI Support",
      details: "Get immediate support through our AI companion and access coping strategies."
    },
    {
      id: "high", 
      title: "Crisis Support",
      description: "Having thoughts of self-harm or feeling overwhelmed",
      color: "bg-orange-100 text-orange-800 border-orange-200", 
      icon: Users,
      action: "Talk to Professional",
      details: "Connect with a licensed mental health professional within minutes."
    },
    {
      id: "critical",
      title: "Medical Emergency", 
      description: "Life-threatening situation or immediate danger",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: Phone,
      action: "Call Emergency Services",
      details: "Immediately connect to emergency services (911) and campus security."
    }
  ];

  const handleEmergencyAction = (level: string) => {
    switch (level) {
      case "moderate":
        toast({
          title: "Connecting to AI Support",
          description: "You'll be redirected to our crisis-trained AI companion.",
        });
        // In real app: redirect to chat with crisis mode enabled
        break;
        
      case "high":
        toast({
          title: "Connecting to Professional",
          description: "A mental health professional will be with you shortly.",
        });
        // In real app: initiate video call or phone connection
        break;
        
      case "critical":
        toast({
          title: "Emergency Services Contacted",
          description: "Emergency services have been notified of your location.",
          variant: "destructive"
        });
        // In real app: automatically call 911 and notify campus security
        break;
    }
    setShowEmergencyDialog(false);
    setSelectedLevel("");
  };

  return (
    <>
      {/* Emergency Button */}
      <Button
        onClick={() => setShowEmergencyDialog(true)}
        className={`bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-glow transition-therapeutic ${className}`}
        size="lg"
      >
        <AlertTriangle size={20} className="mr-2" />
        Emergency SOS
      </Button>

      {/* Emergency Dialog */}
      <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="text-destructive" size={24} />
              Emergency Support System
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>You are not alone.</strong> Help is available 24/7. Please select the level of support you need right now:
                </p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {emergencyLevels.map((level) => {
                const IconComponent = level.icon;
                return (
                  <Card 
                    key={level.id}
                    className={`cursor-pointer transition-all border-2 ${
                      selectedLevel === level.id 
                        ? 'border-primary shadow-therapeutic' 
                        : 'border-border/20 hover:border-primary/50 hover:shadow-gentle'
                    }`}
                    onClick={() => setSelectedLevel(level.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <IconComponent size={20} className="text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{level.title}</CardTitle>
                            <CardDescription className="text-sm">
                              {level.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={level.color}>
                          {level.action}
                        </Badge>
                      </div>
                    </CardHeader>
                    {selectedLevel === level.id && (
                      <CardContent className="pt-0">
                        <div className="bg-secondary/30 rounded-lg p-3 mb-4">
                          <p className="text-sm text-muted-foreground">
                            {level.details}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleEmergencyAction(level.id)}
                          className={`w-full transition-therapeutic ${
                            level.id === 'critical' 
                              ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
                              : ''
                          }`}
                          variant={level.id === 'critical' ? 'destructive' : 'default'}
                        >
                          <IconComponent size={16} className="mr-2" />
                          {level.action}
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Quick Resources */}
            <Card className="border-0 gradient-support">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Heart size={16} className="text-primary" />
                  Immediate Resources
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="font-medium">Crisis Text Line</p>
                    <p className="text-muted-foreground">Text HOME to 741741</p>
                  </div>
                  <div>
                    <p className="font-medium">Suicide Prevention</p>
                    <p className="text-muted-foreground">Call 988</p>
                  </div>
                  <div>
                    <p className="font-medium">Emergency</p>
                    <p className="text-muted-foreground">Call 911</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmergencyButton;