
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';
import { 
  BarChart, 
  Users, 
  BookOpen, 
  Video, 
  Upload,
  FileText,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface User {
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
}

// Mock data
const recentUploads = [
  { id: 1, title: 'Advanced Calculus Lecture', type: 'Video', date: '2023-09-02', views: 152 },
  { id: 2, title: 'Chemistry Exam Paper 2023', type: 'PDF', date: '2023-09-01', views: 98 },
  { id: 3, title: 'Programming Tutorial: Arrays', type: 'Video', date: '2023-08-30', views: 215 },
];

const popularContent = [
  { id: 1, title: 'Physics: Laws of Motion', type: 'Video', views: 876, rating: 4.8 },
  { id: 2, title: 'Biology Final Exam Study Guide', type: 'PDF', views: 724, rating: 4.7 },
  { id: 3, title: 'Literature Analysis Masterclass', type: 'Video', views: 692, rating: 4.9 },
];

const studentActivity = [
  { id: 1, name: 'Emma Wilson', email: 'emma@example.com', lastActive: '2023-09-04T15:30:00', progress: 78 },
  { id: 2, name: 'John Smith', email: 'john@example.com', lastActive: '2023-09-04T14:15:00', progress: 45 },
  { id: 3, name: 'Sarah Johnson', email: 'sarah@example.com', lastActive: '2023-09-04T09:20:00', progress: 62 },
  { id: 4, name: 'Michael Brown', email: 'michael@example.com', lastActive: '2023-09-03T16:45:00', progress: 91 },
];

const AdminDashboard = () => {
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
    if (parsedUser.role !== 'admin') {
      navigate('/dashboard');
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

  // Format date to relative time (e.g., "2 hours ago")
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    }
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} />
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold animate-fade-in">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1 animate-fade-in">Manage content and monitor student activity</p>
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="animate-scale-in">
            <CardContent className="p-6 flex items-center">
              <div className="p-3 bg-blue-50 rounded-full mr-4">
                <Users className="h-6 w-6 text-brand" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <h3 className="text-2xl font-bold">248</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-scale-in stagger-1">
            <CardContent className="p-6 flex items-center">
              <div className="p-3 bg-green-50 rounded-full mr-4">
                <Video className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Video Content</p>
                <h3 className="text-2xl font-bold">64</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-scale-in stagger-2">
            <CardContent className="p-6 flex items-center">
              <div className="p-3 bg-purple-50 rounded-full mr-4">
                <FileText className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Resource Documents</p>
                <h3 className="text-2xl font-bold">127</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-scale-in stagger-3">
            <CardContent className="p-6 flex items-center">
              <div className="p-3 bg-amber-50 rounded-full mr-4">
                <Eye className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Views</p>
                <h3 className="text-2xl font-bold">15.8K</h3>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Actions buttons */}
        <div className="flex flex-wrap gap-4 mb-8 animate-slide-up">
          <Button asChild className="gap-2">
            <Link to="/admin/videos/upload">
              <Upload size={16} />
              Upload Video
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="gap-2">
            <Link to="/admin/resources/upload">
              <FileText size={16} />
              Add Resources
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="gap-2">
            <Link to="/admin/students">
              <Users size={16} />
              Manage Students
            </Link>
          </Button>
        </div>
        
        {/* Content management & analytics */}
        <Tabs defaultValue="content" className="mb-8 animate-slide-up stagger-1">
          <TabsList className="mb-6">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <BookOpen size={16} />
              Content Management
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users size={16} />
              Student Activity
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart size={16} />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          {/* Content Management Tab */}
          <TabsContent value="content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Uploads */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Recent Uploads</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/admin/content" className="flex items-center gap-1 text-brand text-sm">
                        <Plus size={14} />
                        Add Content
                      </Link>
                    </Button>
                  </div>
                  <CardDescription>Recently uploaded content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUploads.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-md ${
                            item.type === 'Video' ? 'bg-blue-50 text-brand' : 'bg-amber-50 text-amber-500'
                          }`}>
                            {item.type === 'Video' ? <Video size={16} /> : <FileText size={16} />}
                          </div>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <div className="flex gap-2 items-center mt-1">
                              <Badge variant="outline">{item.type}</Badge>
                              <span className="text-xs text-gray-500">{item.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{item.views} views</Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Popular Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Content</CardTitle>
                  <CardDescription>Most viewed learning materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {popularContent.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-md ${
                            item.type === 'Video' ? 'bg-blue-50 text-brand' : 'bg-amber-50 text-amber-500'
                          }`}>
                            {item.type === 'Video' ? <Video size={16} /> : <FileText size={16} />}
                          </div>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <div className="flex gap-2 items-center mt-1">
                              <div className="text-xs text-gray-500 flex items-center">
                                <span className="text-yellow-400 mr-1">★</span>
                                {item.rating}
                              </div>
                              <Badge variant="secondary">{item.views} views</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye size={14} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Student Activity Tab */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Student Activity</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin/students" className="flex items-center gap-1 text-brand text-sm">
                      View All Students
                    </Link>
                  </Button>
                </div>
                <CardDescription>Student engagement and progress tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {studentActivity.map((student) => (
                    <div key={student.id} className="flex items-center justify-between pb-4 last:pb-0 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-medium text-gray-700">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium">{student.name}</h3>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="hidden md:block">
                          <p className="text-sm text-gray-500">Last active</p>
                          <p className="text-sm font-medium">{getRelativeTime(student.lastActive)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Progress</p>
                          <div className="w-32 h-2 bg-gray-100 rounded-full mt-1">
                            <div 
                              className="h-full bg-brand rounded-full" 
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Content engagement and student performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <BarChart size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
                  <p className="text-gray-500 max-w-md">
                    Detailed analytics visualization will be shown here with charts for
                    content engagement, student performance, and learning metrics.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
