import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare, Users, Heart, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { auth } from "@/config/firebase";
import { subscribeToForumPosts, addForumPost, supportPost } from "@/lib/firestoreService";

interface ForumPost {
  id: string;
  userId: string;
  content: string;
  timestamp: any;
  supportCount: number;
  replies: ForumReply[];
  isAnonymous: boolean;
}

interface ForumReply {
  id: string;
  userId: string;
  content: string;
  timestamp: any;
  supportCount: number;
}

const ForumPage = () => {
  const [newPost, setNewPost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const { toast } = useToast();
  const user = auth.currentUser;

  useEffect(() => {
    const unsubscribe = subscribeToForumPosts((fetchedPosts) => {
      setPosts(fetchedPosts.map(post => ({
        ...post,
        timestamp: post.timestamp?.toDate() || new Date()
      })));
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmitPost = async () => {
    if (!newPost.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await addForumPost({
        userId: `anon_user_${user.uid.slice(0, 4)}`,
        content: newPost,
        isAnonymous: true,
        replies: []
      });

      setNewPost("");
      toast({
        title: "Post shared",
        description: "Your anonymous post has been shared with the community.",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error sharing your post.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSupport = async (postId: string, currentSupport: number) => {
    try {
      await supportPost(postId, currentSupport);
      toast({
        title: "Support sent",
        description: "Your support has been added to this post.",
      });
    } catch (error) {
      console.error("Error supporting post:", error);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${Math.max(0, diffInMinutes)}m ago`;
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
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : posts.map((post) => (
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
                    onClick={() => handleSupport(post.id, post.supportCount)}
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