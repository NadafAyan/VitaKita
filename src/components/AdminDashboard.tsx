import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  Eye,
  Calendar
} from "lucide-react";

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminCode, setAdminCode] = useState("");

  // Mock analytics data - would come from backend
  const analyticsData = {
    totalUsers: 1247,
    activeSessions: 89,
    forumPosts: 234,
    aiChats: 1523,
    weeklyGrowth: 12.5,
    crisisInterventions: 3,
    moodTrends: {
      positive: 45,
      neutral: 35,
      negative: 20
    }
  };

  const recentActivity = [
    {
      id: '1',
      type: 'forum_post',
      content: 'New anonymous post about academic stress',
      timestamp: '2 minutes ago',
      status: 'normal'
    },
    {
      id: '2',
      type: 'ai_chat',
      content: 'Crisis intervention triggered - user redirected to resources',
      timestamp: '15 minutes ago',
      status: 'alert'
    },
    {
      id: '3',
      type: 'forum_post',
      content: 'Supportive reply posted in anxiety discussion',
      timestamp: '1 hour ago',
      status: 'positive'
    },
    {
      id: '4',
      type: 'user_join',
      content: 'New user registered anonymously',
      timestamp: '2 hours ago',
      status: 'normal'
    }
  ];

  const handleLogin = () => {
    // Simple demo authentication - would be replaced with proper auth
    if (adminCode === "admin123" || adminCode === "vitakita") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid admin code. Try 'admin123' or 'vitakita'");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pb-24 pt-6 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-therapeutic border-0 gradient-support">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
              <Shield size={24} className="text-primary" />
            </div>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>
              Enter admin credentials to access the VITAKITA dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin code"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="border-border/30"
              />
              <Button 
                onClick={handleLogin}
                className="w-full transition-therapeutic"
                disabled={!adminCode.trim()}
              >
                Access Dashboard
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Demo codes: "admin123" or "vitakita"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">VITAKITA Admin Dashboard</h1>
            <p className="text-muted-foreground">Anonymous analytics and community oversight</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsAuthenticated(false)}
            className="transition-gentle"
          >
            Logout
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-gentle border-0 gradient-support">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{analyticsData.totalUsers}</p>
                </div>
                <Users className="text-primary" size={20} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-gentle border-0 gradient-support">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Now</p>
                  <p className="text-2xl font-bold">{analyticsData.activeSessions}</p>
                </div>
                <Eye className="text-primary" size={20} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-gentle border-0 gradient-support">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Forum Posts</p>
                  <p className="text-2xl font-bold">{analyticsData.forumPosts}</p>
                </div>
                <MessageSquare className="text-primary" size={20} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-gentle border-0 gradient-support">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI Chats</p>
                  <p className="text-2xl font-bold">{analyticsData.aiChats}</p>
                </div>
                <BarChart className="text-primary" size={20} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Crisis Alerts & Mood Trends */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-gentle border-0 gradient-calm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="text-destructive" size={20} />
                Crisis Interventions
              </CardTitle>
              <CardDescription>
                This week: {analyticsData.crisisInterventions} interventions triggered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Automatic redirections</span>
                  <Badge variant="destructive">{analyticsData.crisisInterventions}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Resources provided</span>
                  <Badge variant="secondary">{analyticsData.crisisInterventions}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  All crisis interventions follow protocol and users are directed to appropriate professional resources.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-gentle border-0 gradient-calm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="text-primary" size={20} />
                Community Sentiment
              </CardTitle>
              <CardDescription>
                Overall mood trends from interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Positive</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-green-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${analyticsData.moodTrends.positive}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{analyticsData.moodTrends.positive}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Neutral</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-blue-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${analyticsData.moodTrends.neutral}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{analyticsData.moodTrends.neutral}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Needs Support</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-orange-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${analyticsData.moodTrends.negative}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{analyticsData.moodTrends.negative}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-gentle border-0 gradient-support">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Real-time anonymous activity monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <div className={`p-2 rounded-full ${
                    activity.status === 'alert' 
                      ? 'bg-destructive/10 text-destructive' 
                      : activity.status === 'positive'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-primary/10 text-primary'
                  }`}>
                    {activity.type === 'forum_post' ? <MessageSquare size={16} /> : 
                     activity.type === 'ai_chat' ? <BarChart size={16} /> :
                     <Users size={16} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.content}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                  <Badge 
                    variant={activity.status === 'alert' ? 'destructive' : 'secondary'}
                    className="border-0"
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Backend Note */}
        <Card className="mt-8 shadow-gentle border-0 gradient-calm">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Real-time analytics and user data will be available once Supabase backend integration is configured with proper anonymization protocols.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;