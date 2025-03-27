import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Header from '@/components/Header';
import { 
  Search, 
  FileText, 
  Download, 
  Clock, 
  BookOpen, 
  BarChart2, 
  FlaskConical, 
  Languages, 
  Calculator,
  Globe,
  Music,
  History,
  Download as DownloadIcon,
  BookmarkPlus
} from 'lucide-react';

interface User {
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
}

// Mock data for resources
const resourcesData = {
  docs: [
    { id: 1, title: 'Calculus Formula Sheet', type: 'PDF', subject: 'Mathematics', downloads: 325, pages: 4, date: '2023-06-15' },
    { id: 2, title: 'Organic Chemistry Reactions Guide', type: 'PDF', subject: 'Chemistry', downloads: 287, pages: 12, date: '2023-07-03' },
    { id: 3, title: 'World History Timeline - 20th Century', type: 'PDF', subject: 'History', downloads: 198, pages: 8, date: '2023-05-22' },
    { id: 4, title: 'Grammar Rules and Practice Exercises', type: 'DOC', subject: 'English', downloads: 210, pages: 15, date: '2023-06-30' },
    { id: 5, title: 'Physics: Laws of Motion Cheat Sheet', type: 'PDF', subject: 'Physics', downloads: 246, pages: 6, date: '2023-07-12' },
    { id: 6, title: 'Python Programming Exercises', type: 'PDF', subject: 'Computer Science', downloads: 312, pages: 10, date: '2023-07-05' },
  ],
  papers: [
    { id: 1, title: 'Mathematics Final Exam 2022', type: 'PDF', subject: 'Mathematics', downloads: 428, pages: 18, date: '2023-01-10' },
    { id: 2, title: 'Biology Midterm Test with Answers', type: 'PDF', subject: 'Biology', downloads: 385, pages: 14, date: '2023-02-15' },
    { id: 3, title: 'History Mock Exam', type: 'PDF', subject: 'History', downloads: 246, pages: 12, date: '2023-03-08' },
    { id: 4, title: 'Physics Assessment Sample Questions', type: 'PDF', subject: 'Physics', downloads: 302, pages: 16, date: '2023-02-28' },
  ],
  other: [
    { id: 1, title: 'Interactive Periodic Table', type: 'Web App', subject: 'Chemistry', downloads: 156, date: '2023-05-05' },
    { id: 2, title: 'Geometry Visualization Tool', type: 'Web App', subject: 'Mathematics', downloads: 203, date: '2023-06-12' },
    { id: 3, title: 'Literary Devices Reference Chart', type: 'Image', subject: 'English', downloads: 175, date: '2023-04-18' },
    { id: 4, title: 'Geography Map Collection', type: 'ZIP', subject: 'Geography', downloads: 142, date: '2023-07-01' },
  ]
};

// Subject icons mapping
const subjectIcons: Record<string, React.ReactNode> = {
  'Mathematics': <Calculator className="h-5 w-5" />,
  'Chemistry': <FlaskConical className="h-5 w-5" />,
  'Physics': <BarChart2 className="h-5 w-5" />,
  'Biology': <FlaskConical className="h-5 w-5" />,
  'History': <History className="h-5 w-5" />,
  'English': <BookOpen className="h-5 w-5" />,
  'Geography': <Globe className="h-5 w-5" />,
  'Computer Science': <FileText className="h-5 w-5" />,
  'Music': <Music className="h-5 w-5" />,
  'Languages': <Languages className="h-5 w-5" />,
};

// File type colors
const getTypeColor = (type: string) => {
  switch (type) {
    case 'PDF': return 'bg-red-50 text-red-600';
    case 'DOC': return 'bg-blue-50 text-blue-600';
    case 'Image': return 'bg-purple-50 text-purple-600';
    case 'ZIP': return 'bg-amber-50 text-amber-600';
    case 'Web App': return 'bg-green-50 text-green-600';
    default: return 'bg-gray-50 text-gray-600';
  }
};

const ResourcesPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full" />
    </div>;
  }

  // Filter resources based on search and subject filter
  const getFilteredResources = (resources: any[]) => {
    return resources.filter(resource => {
      const matchesSearch = searchQuery === '' || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === null || resource.subject === activeFilter;
      return matchesSearch && matchesFilter;
    });
  };

  // Get unique subjects from all resources
  const getAllSubjects = () => {
    const allResources = [
      ...resourcesData.docs,
      ...resourcesData.papers,
      ...resourcesData.other
    ];
    const subjects = new Set(allResources.map(resource => resource.subject));
    return Array.from(subjects);
  };

  // Handle download
  const handleDownload = (resource: any) => {
    toast.success(`Downloading ${resource.title}`);
  };

  // Handle bookmark
  const handleBookmark = (resource: any) => {
    toast.success(`${resource.title} added to bookmarks`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} />
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold animate-fade-in">Learning Resources</h1>
          <p className="text-gray-500 mt-1 animate-fade-in">Access and download study materials and past papers</p>
        </div>
        
        {/* Search and filters */}
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search resources..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={activeFilter === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(null)}
              >
                All
              </Button>
              {getAllSubjects().map((subject) => (
                <Button
                  key={subject}
                  variant={activeFilter === subject ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setActiveFilter(subject)}
                >
                  {subjectIcons[subject]}
                  {subject}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Resources tabs */}
        <Tabs defaultValue="study-materials" className="animate-slide-up stagger-1">
          <TabsList className="mb-8">
            <TabsTrigger value="study-materials" className="flex items-center gap-2">
              <BookOpen size={16} />
              Study Materials
            </TabsTrigger>
            <TabsTrigger value="past-papers" className="flex items-center gap-2">
              <FileText size={16} />
              Past Papers
            </TabsTrigger>
            <TabsTrigger value="other-resources" className="flex items-center gap-2">
              <Globe size={16} />
              Other Resources
            </TabsTrigger>
          </TabsList>
          
          {/* Study Materials Tab */}
          <TabsContent value="study-materials">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredResources(resourcesData.docs).map((resource) => (
                <Card key={resource.id} className="overflow-hidden hover:shadow-md transition-shadow animate-scale-in">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex justify-between">
                      <div className={`p-2 rounded-md ${getTypeColor(resource.type)}`}>
                        <FileText size={18} />
                      </div>
                      <Badge variant="outline">{resource.type}</Badge>
                    </div>
                    <CardTitle className="text-lg mt-3 line-clamp-1">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 py-0">
                    <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        {subjectIcons[resource.subject]}
                        <span>{resource.subject}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DownloadIcon size={14} />
                        <span>{resource.downloads}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{new Date(resource.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-5 pt-4 flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-brand"
                      onClick={() => handleBookmark(resource)}
                    >
                      <BookmarkPlus size={16} className="mr-1" />
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleDownload(resource)}
                    >
                      <Download size={16} />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {getFilteredResources(resourcesData.docs).length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No resources found</h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Past Papers Tab */}
          <TabsContent value="past-papers">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredResources(resourcesData.papers).map((resource) => (
                <Card key={resource.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex justify-between">
                      <div className={`p-2 rounded-md ${getTypeColor(resource.type)}`}>
                        <FileText size={18} />
                      </div>
                      <Badge variant="outline">{resource.type}</Badge>
                    </div>
                    <CardTitle className="text-lg mt-3 line-clamp-1">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 py-0">
                    <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        {subjectIcons[resource.subject]}
                        <span>{resource.subject}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DownloadIcon size={14} />
                        <span>{resource.downloads}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{new Date(resource.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-5 pt-4 flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-brand"
                      onClick={() => handleBookmark(resource)}
                    >
                      <BookmarkPlus size={16} className="mr-1" />
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleDownload(resource)}
                    >
                      <Download size={16} />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {getFilteredResources(resourcesData.papers).length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No past papers found</h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Other Resources Tab */}
          <TabsContent value="other-resources">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredResources(resourcesData.other).map((resource) => (
                <Card key={resource.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex justify-between">
                      <div className={`p-2 rounded-md ${getTypeColor(resource.type)}`}>
                        <Globe size={18} />
                      </div>
                      <Badge variant="outline">{resource.type}</Badge>
                    </div>
                    <CardTitle className="text-lg mt-3 line-clamp-1">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 py-0">
                    <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        {subjectIcons[resource.subject]}
                        <span>{resource.subject}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DownloadIcon size={14} />
                        <span>{resource.downloads}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{new Date(resource.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-5 pt-4 flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-brand"
                      onClick={() => handleBookmark(resource)}
                    >
                      <BookmarkPlus size={16} className="mr-1" />
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleDownload(resource)}
                    >
                      {resource.type === 'Web App' ? 'Launch' : 'Download'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {getFilteredResources(resourcesData.other).length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <Globe size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No resources found</h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ResourcesPage;
