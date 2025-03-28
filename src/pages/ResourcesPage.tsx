
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import Header from '@/components/Header';
import { 
  Search, 
  Folder,
  ChevronDown,
  Download,
  UserCircle
} from 'lucide-react';

interface User {
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
}

// New data structure for folders
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

  // Get avatar letter for owner
  const getOwnerAvatar = (owner: string) => {
    if (owner === 'me') {
      return (
        <div className="bg-green-700 h-8 w-8 rounded-full flex items-center justify-center text-white font-medium">
          L
        </div>
      );
    } else if (owner === 'tiyasisanda') {
      return (
        <div className="bg-orange-600 h-8 w-8 rounded-full flex items-center justify-center text-white font-medium">
          S
        </div>
      );
    } else {
      return (
        <div className="bg-gray-500 h-8 w-8 rounded-full flex items-center justify-center text-white font-medium">
          {owner.charAt(0).toUpperCase()}
        </div>
      );
    }
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
            <Button>
              New Folder
            </Button>
          </div>
        </div>
        
        {/* Resources table */}
        <div className="bg-white rounded-md shadow overflow-hidden animate-slide-up">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60%]">Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Last modified</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredFolders().map((folder) => (
                <TableRow 
                  key={folder.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleFolderClick(folder.id)}
                >
                  <TableCell className="font-medium flex items-center gap-3">
                    <Folder className="h-5 w-5 text-gray-500" />
                    {folder.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getOwnerAvatar(folder.owner)}
                      <span>{folder.owner}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(folder.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <ChevronDown className="h-5 w-5 inline-block text-gray-400" />
                  </TableCell>
                </TableRow>
              ))}

              {getFilteredFolders().length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Folder className="h-10 w-10 text-gray-300 mb-2" />
                      <p className="text-gray-500 font-medium">No folders found</p>
                      <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default ResourcesPage;
