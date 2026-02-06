import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Video, Headphones, Clock, ExternalLink } from "lucide-react";
import { auth } from "@/config/firebase";
import { getResources } from "@/lib/firestoreService";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'audio';
  category: string;
  duration: string;
  tags: string[];
  link?: string;
}

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getResources();
        if (data.length > 0) {
          setResources(data as Resource[]);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'stress', label: 'Stress Management' },
    { id: 'anxiety', label: 'Anxiety Support' },
    { id: 'wellness', label: 'General Wellness' },
    { id: 'self-care', label: 'Self-Care' },
    { id: 'relaxation', label: 'Relaxation' },
    { id: 'resilience', label: 'Building Resilience' },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'article': return BookOpen;
      case 'video': return Video;
      case 'audio': return Headphones;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'audio': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Wellness Resource Hub</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Curated mental health resources designed specifically for students in higher education
          </p>
        </div>

        {/* Search */}
        <Card className="mb-6 shadow-gentle border-0 gradient-support">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search resources, topics, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-border/30"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="transition-gentle"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filteredResources.map((resource) => {
            const IconComponent = getIcon(resource.type);
            return (
              <a
                key={resource.id}
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="group cursor-pointer shadow-gentle hover:shadow-therapeutic transition-therapeutic border-0 gradient-calm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-gentle">
                          <IconComponent size={20} className="text-primary" />
                        </div>
                        <Badge className={`${getTypeColor(resource.type)} border-0`}>
                          {resource.type}
                        </Badge>
                      </div>
                      <ExternalLink size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-gentle" />
                    </div>
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-gentle">
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm mb-4">
                      {resource.description}
                    </CardDescription>

                    <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                      <Clock size={14} />
                      <span>{resource.duration}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {resource.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs bg-secondary/50 border-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <Card className="text-center py-12 shadow-gentle border-0 gradient-support">
            <CardContent>
              <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No resources found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or category filters
              </p>
            </CardContent>
          </Card>
        )}

        {/* Note about backend */}
        <Card className="mt-8 shadow-gentle border-0 gradient-calm">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Full resource content, videos, and audio guides will be available once the Supabase backend is connected for secure content delivery.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResourcesPage;
