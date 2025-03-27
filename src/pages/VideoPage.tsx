
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import Header from '@/components/Header';
import VideoPlayer from '@/components/VideoPlayer';
import { Clock, BarChart, BookOpen, MessageSquare, ThumbsUp, Share2, Flag, Download, Bookmark } from 'lucide-react';

interface User {
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
}

// Mock video data
const videoData = {
  id: '1',
  title: 'Introduction to Calculus',
  description: 'This lecture introduces the fundamental concepts of calculus, including limits, derivatives, and their applications in solving real-world problems. We\'ll explore how calculus forms the mathematical foundation for understanding change and motion.',
  url: 'https://assets.mixkit.co/videos/preview/mixkit-teacher-and-students-in-a-classroom-3644-large.mp4',
  poster: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
  duration: '45 minutes',
  instructor: 'Dr. Sarah Matthews',
  category: 'Mathematics',
  level: 'Intermediate',
  views: 1245,
  likes: 86,
  datePublished: '2023-07-15',
  relatedResources: [
    { id: 1, title: 'Calculus Formula Sheet', type: 'PDF' },
    { id: 2, title: 'Practice Problems Set 1', type: 'PDF' },
    { id: 3, title: 'Calculus Visualization Tools', type: 'Link' }
  ],
  topics: [
    'Introduction to Limits',
    'Derivatives and Rate of Change',
    'Applications of Derivatives',
    'Introduction to Integration'
  ]
};

// Mock comments
const commentsData = [
  { id: 1, user: 'John Smith', avatar: null, comment: 'This explanation of limits finally made it click for me. Thank you!', date: '2023-08-10', likes: 8 },
  { id: 2, user: 'Emma Wilson', avatar: null, comment: 'Could you clarify the concept of continuity a bit more? I\'m struggling with that part.', date: '2023-08-12', likes: 3 },
  { id: 3, user: 'Michael Chen', avatar: null, comment: 'The real-world examples really helped make these abstract concepts more tangible. Great teaching approach.', date: '2023-08-15', likes: 12 }
];

const VideoPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

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

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const handleDownload = () => {
    toast.success('Download started');
  };

  const handleReport = () => {
    toast.success('Report submitted');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} />
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
            {/* Video player */}
            <VideoPlayer 
              videoUrl={videoData.url} 
              posterUrl={videoData.poster}
              onProgress={setVideoProgress}
            />
            
            {/* Video info */}
            <div>
              <h1 className="text-2xl font-bold">{videoData.title}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                <Badge variant="secondary">{videoData.category}</Badge>
                <Badge variant="outline">{videoData.level}</Badge>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{videoData.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart size={14} />
                  <span>{videoData.views} views</span>
                </div>
              </div>
              <Separator className="my-4" />
              
              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => toast.success(videoData.likes + 1 + ' likes')}
                >
                  <ThumbsUp size={16} />
                  <span>Like ({videoData.likes})</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`flex items-center gap-1 ${bookmarked ? 'text-brand' : ''}`}
                  onClick={handleBookmark}
                >
                  <Bookmark size={16} />
                  <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleShare}
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleDownload}
                >
                  <Download size={16} />
                  <span>Download</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleReport}
                >
                  <Flag size={16} />
                  <span>Report</span>
                </Button>
              </div>
              
              {/* Tabs for content, resources, discussions */}
              <Tabs defaultValue="content" className="mt-6">
                <TabsList className="w-full justify-start border-b rounded-none bg-transparent mb-6">
                  <TabsTrigger value="content" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-brand data-[state=active]:shadow-none">
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-brand data-[state=active]:shadow-none">
                    Resources
                  </TabsTrigger>
                  <TabsTrigger value="discussion" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-brand data-[state=active]:shadow-none">
                    Discussion
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="pt-0">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">{videoData.description}</p>
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Topics Covered</h3>
                      <ul className="space-y-2">
                        {videoData.topics.map((topic, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-brand-light text-brand text-xs flex items-center justify-center font-medium">
                              {index + 1}
                            </div>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="resources" className="pt-0">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Supplementary Materials</h3>
                    <div className="space-y-3">
                      {videoData.relatedResources.map((resource) => (
                        <div 
                          key={resource.id} 
                          className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-light text-brand rounded-md">
                              <BookOpen size={18} />
                            </div>
                            <div>
                              <h4 className="font-medium">{resource.title}</h4>
                              <Badge variant="outline">{resource.type}</Badge>
                            </div>
                          </div>
                          <Button size="sm">Download</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="discussion" className="pt-0">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Discussion</h3>
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-6">
                          {commentsData.map((comment) => (
                            <div key={comment.id} className="flex gap-4">
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-700 font-medium">
                                {comment.user.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                  <h4 className="font-medium">{comment.user}</h4>
                                  <span className="text-sm text-gray-500">{comment.date}</span>
                                </div>
                                <p className="text-gray-700 text-sm">{comment.comment}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <Button variant="ghost" size="sm" className="h-8 text-xs flex items-center gap-1">
                                    <ThumbsUp size={14} />
                                    <span>{comment.likes}</span>
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 text-xs flex items-center gap-1">
                                    <MessageSquare size={14} />
                                    <span>Reply</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="animate-slide-in">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Instructor info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium mb-3">Instructor</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-brand-light text-brand flex items-center justify-center font-medium text-lg">
                      {videoData.instructor.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{videoData.instructor}</h4>
                      <p className="text-sm text-gray-500">Professor, Mathematics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Progress card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium mb-3">Your Progress</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Video progress</span>
                        <span>{Math.round(videoProgress * 100)}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full">
                        <div 
                          className="h-full bg-brand rounded-full"
                          style={{ width: `${videoProgress * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Resources viewed</span>
                        <span>0/3</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '0%' }} />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Quiz attempts</span>
                        <span>Not attempted</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '0%' }} />
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4">Take Quiz</Button>
                </CardContent>
              </Card>
              
              {/* Recommended videos */}
              <div>
                <h3 className="font-medium mb-3">Recommended Videos</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="aspect-video bg-gray-100 relative">
                        <img 
                          src={`https://images.unsplash.com/photo-${1635070041078 + index}-e363dbe005cb`} 
                          alt="Video thumbnail"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                          <div className="p-2 rounded-full bg-white bg-opacity-20 backdrop-blur-sm">
                            <Play className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm line-clamp-1">
                          {index === 1 ? 'Advanced Calculus Concepts' : 
                            index === 2 ? 'Calculus Applications in Physics' : 
                              'Calculus Problem Solving Strategies'}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {32 + index} minutes • {120 + index * 20} views
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoPage;
