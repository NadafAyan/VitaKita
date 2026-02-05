"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Video, Headphones, Clock, ExternalLink } from "lucide-react";

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

    const resources: Resource[] = [
        {
            id: '1',
            title: 'Understanding Academic Stress',
            description: 'Learn about the common causes of academic stress and how to identify early warning signs.',
            type: 'article',
            category: 'stress',
            duration: '5 min read',
            tags: ['stress', 'academic', 'awareness'],
            link: 'https://jedfoundation.org/resource/understanding-academic-stress/'
        },
        {
            id: '2',
            title: 'Breathing Techniques for Anxiety',
            description: 'Guided breathing exercises to help calm anxiety in moments of stress.',
            type: 'audio',
            category: 'anxiety',
            duration: '10 min',
            tags: ['anxiety', 'breathing', 'relaxation'],
            link: 'https://www.jiosaavn.com/song/meditation-music/Bxo7YyNKYkQ'
        },
        {
            id: '3',
            title: 'Sleep Hygiene for Students',
            description: 'Essential sleep practices to improve your mental health and academic performance.',
            type: 'video',
            category: 'wellness',
            duration: '15 min',
            tags: ['sleep', 'wellness', 'habits'],
            link: 'https://youtu.be/gedoSfZvBgE?si=_Okcmi2u-MQtW3da'
        },
        {
            id: '4',
            title: 'Managing Perfectionism',
            description: 'Strategies to overcome perfectionist tendencies that can lead to burnout.',
            type: 'article',
            category: 'self-care',
            duration: '8 min read',
            tags: ['perfectionism', 'self-care', 'mindset'],
            link: 'https://positivepsychology.com/how-to-overcome-perfectionism/'
        },
        {
            id: '5',
            title: 'Progressive Muscle Relaxation',
            description: 'A guided session to release physical tension and promote relaxation.',
            type: 'audio',
            category: 'relaxation',
            duration: '20 min',
            tags: ['relaxation', 'body', 'tension'],
            link: 'https://youtu.be/SNqYG95j_UQ?si=hCliW_g7XJtiu1cO'
        },
        {
            id: '6',
            title: 'Relaxation music for stress relief',
            description: 'Soothing music tracks to help you relax and unwind.',
            type: 'video',
            category: 'resilience',
            duration: '12 min',
            tags: ['resilience', 'coping', 'mindset'],
            link: 'https://youtu.be/XIS9XHqTIZo?si=9q_aV-nDFaWbjYIq'
        },
        // Additional Resources
        {
            id: '7',
            title: 'The Science of Well-Being',
            description: 'Insights from Yale University on how to build healthy habits and increase happiness.',
            type: 'article',
            category: 'wellness',
            duration: '10 min read',
            tags: ['happiness', 'science', 'growth'],
            link: 'https://www.coursera.org/learn/the-science-of-well-being'
        },
        {
            id: '8',
            title: 'Guided Meditation for Focus',
            description: 'A quick meditation session to boost concentration before study sessions.',
            type: 'audio',
            category: 'stress',
            duration: '8 min',
            tags: ['focus', 'meditation', 'study'],
            link: 'https://www.youtube.com/watch?v=zSkFFW--Ma0'
        }
    ];

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
        <div className="min-h-screen pb-24 pt-6 bg-gradient-to-b from-blue-50/50 to-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-900">Wellness Resource Hub</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Curated mental health resources designed specifically for students.
                    </p>
                </div>

                {/* Search */}
                <Card className="mb-8 shadow-sm border-blue-100 bg-white/80 backdrop-blur">
                    <CardContent className="p-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <Input
                                placeholder="Search resources, topics, or keywords..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
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
                            className={`rounded-full transition-all ${selectedCategory === category.id ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-blue-50'}`}
                        >
                            {category.label}
                        </Button>
                    ))}
                </div>

                {/* Resources Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((resource) => {
                        const IconComponent = getIcon(resource.type);
                        return (
                            <a
                                key={resource.id}
                                href={resource.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group h-full"
                            >
                                <Card className="h-full cursor-pointer hover:shadow-md transition-all border-gray-100 hover:border-blue-200 bg-white">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors text-blue-600">
                                                    <IconComponent size={20} />
                                                </div>
                                                <Badge className={`${getTypeColor(resource.type)} border-0`}>
                                                    {resource.type}
                                                </Badge>
                                            </div>
                                            <ExternalLink size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <CardTitle className="text-lg font-semibold group-hover:text-blue-700 transition-colors mt-4">
                                            {resource.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-sm mb-4 line-clamp-2">
                                            {resource.description}
                                        </CardDescription>

                                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                                            <Clock size={14} />
                                            <span>{resource.duration}</span>
                                        </div>

                                        <div className="flex flex-wrap gap-1 mt-auto">
                                            {resource.tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                    className="text-xs bg-gray-100 text-gray-600 border-0"
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
                    <div className="text-center py-12">
                        <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-700">No resources found</h3>
                        <p className="text-gray-500">
                            Try adjusting your search terms or category filters
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourcesPage;
