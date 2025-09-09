import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare, Users, Heart, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ForumPost {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  supportCount: number;
  replies: ForumReply[];
  isAnonymous: boolean;
}

interface ForumReply {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  supportCount: number;
}

const ForumPage = () => {
  const [newPost, setNewPost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Mock data - would be replaced with Firebase/Supabase real-time data
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: '1',
      userId: 'anon_user_123',
      content: "Feeling overwhelmed with finals coming up. Anyone else struggling with motivation? I know I should be studying but I just can't seem to focus.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      supportCount: 7,
      isAnonymous: true,
      replies: [
        {
          id: 'r1',
          userId: 'anon_user_456',
          content: "I totally understand this feeling. What helps me is breaking things down into tiny tasks. Even just opening the textbook counts as a win!",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          supportCount: 3,
        }
      ]
    },
    {
      id: '2',
      userId: 'anon_user_789',
      content: "Just wanted to share that I finally reached out to the counseling center on campus. It took a lot of courage but I'm glad I did. If you're thinking about it, please consider it.",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      supportCount: 12,
      isAnonymous: true,
      replies: []
    }
  ]);

  const handleSubmitPost = async () => {
    if (!newPost.trim()) return;

    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      const post: ForumPost = {
        id: Date.now().toString(),
        userId: `anon_user_${Math.floor(Math.random() * 1000)}`,
        content: newPost,
        timestamp: new Date(),
        supportCount: 0,
        isAnonymous: true,
        replies: []
      };

      setPosts(prev => [post, ...prev]);
      setNewPost("");
      setIsSubmitting(false);

      toast({
        title: "Post shared",
        description: "Your anonymous post has been shared with the community.",
      });
    }, 1000);
  };

  const handleSupport = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, supportCount: post.supportCount + 1 }
          : post
      )
    );

    toast({
      title: "Support sent",
      description: "Your support has been added to this post.",
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-6">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Peer Support Community</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A safe, anonymous space to share experiences and support one another
          </p>
        </div>

        {/* Community Guidelines */}
        <Card className="mb-6 shadow-gentle border-0 gradient-support">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-accent-foreground mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Community Guidelines</h3>
                <p className="text-sm text-muted-foreground">
                  This is a supportive space for peer connection. All posts are anonymous and moderated. 
                  If you're in crisis, please contact emergency services or your campus counseling center immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Post */}
        <Card className="mb-8 shadow-gentle border-0 gradient-calm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare size={20} />
              Share Your Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share what's on your mind. Your post will be anonymous and you'll be identified only by a user ID..."
                className="min-h-[120px] border-border/30 bg-background/50"
                disabled={isSubmitting}
              />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users size={16} />
                  <span>Posted anonymously as anon_user_xxx</span>
                </div>
                
                <Button
                  onClick={handleSubmitPost}
                  disabled={!newPost.trim() || isSubmitting}
                  className="transition-therapeutic"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                      Posting...
                    </div>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Share Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="shadow-gentle border-0 gradient-calm transition-therapeutic hover:shadow-therapeutic">
              <CardContent className="p-6">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Users size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{post.userId}</p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(post.timestamp)}</p>
                    </div>
                  </div>
                  
                  <Badge variant="secondary" className="bg-secondary/50 border-0">
                    Anonymous
                  </Badge>
                </div>

                {/* Post Content */}
                <p className="text-sm leading-relaxed mb-4 text-foreground">
                  {post.content}
                </p>

                {/* Post Actions */}
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSupport(post.id)}
                    className="text-muted-foreground hover:text-primary transition-gentle"
                  >
                    <Heart size={16} className="mr-1" />
                    <span>{post.supportCount}</span>
                  </Button>
                  
                  {post.replies.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                    </span>
                  )}
                </div>

                {/* Replies */}
                {post.replies.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-border/30 space-y-3">
                    {post.replies.map((reply) => (
                      <div key={reply.id} className="bg-secondary/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-xs">{reply.userId}</p>
                            <p className="text-xs text-muted-foreground">{formatTimeAgo(reply.timestamp)}</p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground/90">{reply.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-primary transition-gentle p-1 h-auto"
                          >
                            <Heart size={12} className="mr-1" />
                            <span className="text-xs">{reply.supportCount}</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <Card className="text-center py-12 shadow-gentle border-0 gradient-support">
            <CardContent>
              <MessageSquare size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground">
                Be the first to share and start building our supportive community
              </p>
            </CardContent>
          </Card>
        )}

        {/* Backend Note */}
        <Card className="mt-8 shadow-gentle border-0 gradient-calm">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Real-time forum functionality with Firebase/Supabase will be available once the backend integration is set up.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForumPage;