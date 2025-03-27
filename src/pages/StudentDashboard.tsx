
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import ProgressCard from '@/components/ProgressCard';
import { Play, FileText, Award, Clock, BarChart2, BookOpen } from 'lucide-react';

interface User {
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
}

// Mock data for the dashboard
const recentVideos = [
  { id: 1, title: 'Introduction to Calculus', thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb', duration: '45 min', progress: 60 },
  { id: 2, title: 'Advanced Algebra Concepts', thumbnail: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d', duration: '38 min', progress: 0 },
  { id: 3, title: 'Physics: Laws of Motion', thumbnail: 'https://images.unsplash.com/photo-1636819488524-a11e6d3c5eb1', duration: '52 min', progress: 20 },
];

const upcomingAssessments = [
  { id: 1, title: 'Chemistry Quiz', dueDate: '2023-09-15', category: 'Chemistry' },
  { id: 2, title: 'Literature Analysis', dueDate: '2023-09-18', category: 'English' },
];

const resources = [
  { id: 1, title: 'Biology Notes - Chapter 5', type: 'PDF', downloads: 238 },
  { id: 2, title: 'History Timeline Diagram', type: 'Image', downloads: 142 },
  { id: 3, title: 'Programming Cheat Sheet', type: 'PDF', downloads: 385 },
];

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'student') {
      navigate('/admin');
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} />
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold animate-fade-in">Welcome back, {user?.name.split(' ')[0]}</h1>
          <p className="text-gray-500 mt-1 animate-fade-in">Here's an overview of your learning progress</p>
        </div>
        
        {/* Progress overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ProgressCard
            title="Course Completion"
            value={65}
            description="Overall progress across all courses"
            icon={<Award size={24} />}
          />
          
          <ProgressCard
            title="Assignment Score"
            value={82}
            description="Average score on assessments"
            icon={<FileText size={24} />}
            color="stroke-purple-500"
          />
          
          <ProgressCard
            title="Weekly Learning Goals"
            value={40}
            description="3 hours out of 7.5 hour goal"
            icon={<Clock size={24} />}
            color="stroke-green-500"
          />
        </div>
        
        {/* Recent videos section */}
        <section className="mb-10 animate-slide-up stagger-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Continue Learning</h2>
            <Button variant="ghost" asChild>
              <Link to="/videos" className="text-brand flex items-center gap-1">
                <span>View all videos</span>
                <Play size={14} />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentVideos.map((video) => (
              <Link to={`/videos/${video.id}`} key={video.id}>
                <Card className="h-full overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {video.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                        <div 
                          className="h-full bg-brand"
                          style={{ width: `${video.progress}%` }}
                        />
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3">
                      <Badge variant="secondary" className="bg-black bg-opacity-60 text-white border-none">
                        {video.duration}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg font-medium">{video.title}</CardTitle>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0">
                    <div className="flex items-center text-sm text-gray-500">
                      {video.progress > 0 ? (
                        <span>{video.progress}% completed</span>
                      ) : (
                        <span>Not started</span>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming assessments */}
          <section className="animate-slide-up stagger-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold">Upcoming Assessments</CardTitle>
                  <BarChart2 size={20} className="text-gray-400" />
                </div>
                <CardDescription>Tests and assignments due soon</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingAssessments.map((assessment) => (
                  <div 
                    key={assessment.id}
                    className="flex items-center justify-between py-3 border-b last:border-b-0"
                  >
                    <div>
                      <h3 className="font-medium">{assessment.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{assessment.category}</Badge>
                        <span className="text-sm text-gray-500">
                          Due: {new Date(assessment.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Start</Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full text-brand" asChild>
                  <Link to="/resources">View all assessments</Link>
                </Button>
              </CardFooter>
            </Card>
          </section>
          
          {/* Resources */}
          <section className="animate-slide-up stagger-3">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold">Learning Resources</CardTitle>
                  <BookOpen size={20} className="text-gray-400" />
                </div>
                <CardDescription>Access study materials and documents</CardDescription>
              </CardHeader>
              <CardContent>
                {resources.map((resource) => (
                  <div 
                    key={resource.id}
                    className="flex items-center justify-between py-3 border-b last:border-b-0"
                  >
                    <div>
                      <h3 className="font-medium">{resource.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{resource.type}</Badge>
                        <span className="text-sm text-gray-500">
                          {resource.downloads} downloads
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full text-brand" asChild>
                  <Link to="/resources">Browse all resources</Link>
                </Button>
              </CardFooter>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
