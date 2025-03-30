
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from '@/components/Header';
import { Search, Folder, Plus, Upload, File, X } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface User {
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
}

// File data structure
interface FileItem {
  id: number;
  name: string;
  type: 'video' | 'document' | 'image' | 'other';
  size: string;
  uploadedBy: string;
  date: string;
  folderId: number;
}

// Folder data structure
interface Folder {
  id: number;
  name: string;
  owner: string;
  ownerAvatar: string | null;
  date: string;
  description?: string;
  files?: FileItem[];
}

// Initial folders data
const foldersData: Folder[] = [
  { id: 1, name: 'ANKI Decks', owner: 'djwwium', ownerAvatar: null, date: '2024-02-25', files: [] },
  { id: 2, name: 'Pharmacology', owner: 'me', ownerAvatar: null, date: '2024-02-22', files: [] },
  { id: 3, name: 'Physics', owner: 'me', ownerAvatar: null, date: '2024-02-22', files: [] },
  { id: 4, name: 'Physiology', owner: 'me', ownerAvatar: null, date: '2024-02-22', files: [] },
  { id: 5, name: 'Refresher Courses', owner: 'me', ownerAvatar: null, date: '2024-02-22', files: [] },
  { id: 6, name: 'Zoom recordings', owner: 'tiyasisanda', ownerAvatar: null, date: '2024-03-19', files: [] },
];

const ResourcesPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [folders, setFolders] = useState<Folder[]>(foldersData);
  
  // State for dialogs
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [addFilesOpen, setAddFilesOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  
  // Form states
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDescription, setNewFolderDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDescription, setFileDescription] = useState('');

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
    return folders.filter(folder => 
      searchQuery === '' || folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Handle folder click
  const handleFolderClick = (folderId: number) => {
    if (user?.role === 'admin') {
      const folder = folders.find(f => f.id === folderId);
      if (folder) {
        setSelectedFolder(folder);
        setAddFilesOpen(true);
      }
    } else {
      toast.info(`Opening folder: ${folders.find(f => f.id === folderId)?.name}`);
    }
  };

  // Create new folder
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast.error('Folder name is required');
      return;
    }

    const newFolder: Folder = {
      id: folders.length + 1,
      name: newFolderName,
      description: newFolderDescription,
      owner: user?.name || 'me',
      ownerAvatar: user?.avatar || null,
      date: new Date().toISOString().split('T')[0],
      files: []
    };

    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setNewFolderDescription('');
    setNewFolderOpen(false);
    toast.success('Folder created successfully!');
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Add file to folder
  const handleAddFile = () => {
    if (!selectedFile || !selectedFolder) {
      toast.error('Please select a file to upload');
      return;
    }

    const fileType = selectedFile.type.startsWith('video/') ? 'video' : 
                    selectedFile.type.startsWith('image/') ? 'image' :
                    selectedFile.type.includes('pdf') || selectedFile.type.includes('doc') ? 'document' : 'other';

    const newFile: FileItem = {
      id: Date.now(),
      name: selectedFile.name,
      type: fileType as any,
      size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadedBy: user?.name || 'me',
      date: new Date().toISOString().split('T')[0],
      folderId: selectedFolder.id
    };

    // Update the folder with the new file
    const updatedFolders = folders.map(folder => {
      if (folder.id === selectedFolder.id) {
        return {
          ...folder,
          files: [...(folder.files || []), newFile]
        };
      }
      return folder;
    });

    setFolders(updatedFolders);
    setSelectedFile(null);
    setFileDescription('');
    setAddFilesOpen(false);
    toast.success(`File added to ${selectedFolder.name} successfully!`);
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
              <Button onClick={() => setNewFolderOpen(true)}>
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
                  {folder.files && folder.files.length > 0 && (
                    <p className="text-xs text-brand mt-2">{folder.files.length} file{folder.files.length !== 1 ? 's' : ''}</p>
                  )}
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

      {/* Create Folder Dialog */}
      <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Create a new folder to organize your learning resources.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="folderDescription">Description (Optional)</Label>
              <Textarea
                id="folderDescription"
                placeholder="Enter a description for this folder"
                value={newFolderDescription}
                onChange={(e) => setNewFolderDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateFolder}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Files Dialog */}
      <Dialog open={addFilesOpen} onOpenChange={setAddFilesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Files to {selectedFolder?.name}</DialogTitle>
            <DialogDescription>
              Upload files to add to this folder.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">Select File</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                {selectedFile ? (
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4" />
                    <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                    <button 
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Drag and drop file or</p>
                    <label htmlFor="fileInput" className="cursor-pointer">
                      <span className="text-sm text-brand hover:underline">Browse files</span>
                      <input
                        id="fileInput"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fileDescription">Description (Optional)</Label>
              <Textarea
                id="fileDescription"
                placeholder="Enter a description for this file"
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddFile}>Upload File</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourcesPage;
