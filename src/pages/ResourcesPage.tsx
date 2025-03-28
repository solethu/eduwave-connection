
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from '@/components/Header';
import { Search, Folder, Plus } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface User {
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
}

// Folder data structure
const foldersData = [
  { id: 1, name: 'ANKI Decks', owner: 'djwwium', ownerAvatar: null, date: '2024-02-25' },
  { id: 2, name: 'Pharmacology', owner: 'me', ownerAvatar: null, date: '2024-02-22' },
  { id: 3, name: 'Physics', owner: 'me', ownerAvatar: null, date: '2024-02-22' },
  { id: 4, name: 'Physiology', owner: 'me', ownerAvatar: null, date: '2024-02-22' },
  { id: 5, name: 'Refresher Courses', owner: 'me', ownerAvatar: null, date: '2024-02-22' },
  { id: 6, name: 'Zoom recordings', owner: 'tiyasisanda', ownerAvatar: null, date: '2024-03-19' },
];

const ResourcesPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter folders based on search
  const getFilteredFolders = () => {
    return foldersData.filter(folder => 
      searchQuery === '' || folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Handle folder click
  const handleFolderClick = (folderId: number) => {
    toast.info(`Opening folder: ${foldersData.find(f => f.id === folderId)?.name}`);
    // Future implementation: navigate to folder contents
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} />
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold animate-fade-in">Learning Resources</h1>
          <p className="text-gray-500 mt-1 animate-fade-in">Access anaesthesia study materials and resources</p>
        </div>
        
        {/* Search bar */}
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
            {user?.role === 'admin' && (
              <Button>
                <Plus className="mr-1 h-4 w-4" /> New Folder
              </Button>
            )}
          </div>
        </div>
        
        {/* Different views based on user role */}
        {user?.role === 'admin' ? (
          // Admin view - Card layout
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-slide-up">
            {getFilteredFolders().map((folder) => (
              <Card 
                key={folder.id} 
                className="cursor-pointer hover:shadow-glass-hover transition-shadow"
                onClick={() => handleFolderClick(folder.id)}
              >
                <CardContent className="p-6 flex flex-col items-center">
                  <Folder className="h-12 w-12 text-brand mb-4" />
                  <h3 className="text-lg font-medium text-center">{folder.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{folder.owner}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(folder.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
            
            {getFilteredFolders().length === 0 && (
              <div className="col-span-full p-12 bg-white rounded-md shadow text-center">
                <Folder className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700">No folders found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        ) : (
          // Student view - Resource listing with downloads and descriptions
          <div className="space-y-6 animate-slide-up">
            {getFilteredFolders().map((folder) => (
              <Card 
                key={folder.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleFolderClick(folder.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <Folder className="h-10 w-10 text-brand" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{folder.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-500">
                          Shared by: {folder.owner}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(folder.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {getFilteredFolders().length === 0 && (
              <div className="p-12 bg-white rounded-md shadow text-center">
                <Folder className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700">No resources found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ResourcesPage;
