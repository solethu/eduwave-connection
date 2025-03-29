
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
import { FileData, FolderData } from '@/types/supabase';
import { 
  getFolders, 
  createFolder, 
  getFilesInFolder, 
  uploadFile, 
  deleteFile 
} from '@/services/resourceService';

interface User {
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
}

const ResourcesPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [folders, setFolders] = useState<FolderData[]>([]);
  
  // State for dialogs
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [addFilesOpen, setAddFilesOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<FolderData | null>(null);
  const [folderFiles, setFolderFiles] = useState<FileData[]>([]);
  
  // Form states
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDescription, setNewFolderDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDescription, setFileDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load folders when component mounts
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    loadFolders();
  }, [navigate]);

  // Load folders function
  const loadFolders = async () => {
    setIsLoading(true);
    try {
      const foldersData = await getFolders();
      setFolders(foldersData);
    } catch (error) {
      console.error('Error loading folders:', error);
      toast.error('Failed to load folders');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  // Load files for a specific folder
  const loadFolderFiles = async (folderId: string) => {
    try {
      const filesData = await getFilesInFolder(folderId);
      setFolderFiles(filesData);
    } catch (error) {
      console.error('Error loading files:', error);
      toast.error('Failed to load files');
    }
  };

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
  const handleFolderClick = (folder: FolderData) => {
    setSelectedFolder(folder);
    loadFolderFiles(folder.id);
    setAddFilesOpen(true);
  };

  // Create new folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Folder name is required');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to create folders');
      return;
    }

    try {
      const result = await createFolder(newFolderName, newFolderDescription, {
        name: user.name,
        email: user.email,
        avatar: user.avatar
      });
      
      if (result.success) {
        setNewFolderName('');
        setNewFolderDescription('');
        setNewFolderOpen(false);
        toast.success('Folder created successfully!');
        loadFolders(); // Reload folders to show the new one
      } else {
        toast.error('Failed to create folder');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('An error occurred while creating the folder');
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Add file to folder
  const handleAddFile = async () => {
    if (!selectedFile || !selectedFolder) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to upload files');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadFile(selectedFile, selectedFolder.id, fileDescription, {
        name: user.name,
        email: user.email
      });
      
      if (result.success) {
        setSelectedFile(null);
        setFileDescription('');
        toast.success(`File added to ${selectedFolder.name} successfully!`);
        loadFolderFiles(selectedFolder.id); // Reload files to show the new one
      } else {
        toast.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('An error occurred while uploading the file');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file deletion
  const handleDeleteFile = async (file: FileData) => {
    if (!selectedFolder) return;
    
    if (confirm(`Are you sure you want to delete ${file.name}?`)) {
      try {
        // Extract the storage path from the URL
        const urlParts = file.url.split('/');
        const storagePath = `${selectedFolder.id}/${urlParts[urlParts.length - 1]}`;
        
        const result = await deleteFile(file.id, storagePath);
        
        if (result.success) {
          toast.success('File deleted successfully');
          loadFolderFiles(selectedFolder.id); // Reload files after deletion
        } else {
          toast.error('Failed to delete file');
        }
      } catch (error) {
        console.error('Error deleting file:', error);
        toast.error('An error occurred while deleting the file');
      }
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
            {user?.role === 'admin' && (
              <Button onClick={() => setNewFolderOpen(true)}>
                <Plus className="mr-1 h-4 w-4" /> New Folder
              </Button>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* Resource folders grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-slide-up">
              {getFilteredFolders().map((folder) => (
                <Card 
                  key={folder.id} 
                  className="cursor-pointer hover:shadow-glass-hover transition-shadow"
                  onClick={() => handleFolderClick(folder)}
                >
                  <CardContent className="p-6 flex flex-col items-center">
                    <Folder className="h-12 w-12 text-brand mb-4" />
                    <h3 className="text-lg font-medium text-center">{folder.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{folder.owner}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(folder.created_at).toLocaleDateString('en-US', {
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
          </>
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

      {/* Folder Contents / Add Files Dialog */}
      <Dialog open={addFilesOpen} onOpenChange={setAddFilesOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedFolder?.name}</DialogTitle>
            <DialogDescription>
              {selectedFolder?.description || 'View and manage files in this folder.'}
            </DialogDescription>
          </DialogHeader>
          
          {user?.role === 'admin' && (
            <div className="border-t border-b py-4 my-4">
              <h3 className="font-medium mb-3">Upload New File</h3>
              <div className="space-y-4">
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                          }}
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
                <Button 
                  onClick={handleAddFile} 
                  disabled={!selectedFile || isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Uploading...
                    </>
                  ) : (
                    <>Upload File</>
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {/* List of files */}
          <div className="max-h-96 overflow-y-auto">
            <h3 className="font-medium mb-3">Files</h3>
            {folderFiles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No files in this folder yet.
              </div>
            ) : (
              <div className="space-y-3">
                {folderFiles.map((file) => (
                  <div key={file.id} className="flex items-center p-3 border rounded-md">
                    <div className="mr-3">
                      {file.type === 'image' && <img src={file.url} alt={file.name} className="h-12 w-12 object-cover rounded" />}
                      {file.type === 'video' && <div className="h-12 w-12 bg-blue-100 text-blue-500 flex items-center justify-center rounded"><File className="h-6 w-6" /></div>}
                      {file.type === 'document' && <div className="h-12 w-12 bg-green-100 text-green-500 flex items-center justify-center rounded"><File className="h-6 w-6" /></div>}
                      {file.type === 'other' && <div className="h-12 w-12 bg-gray-100 text-gray-500 flex items-center justify-center rounded"><File className="h-6 w-6" /></div>}
                    </div>
                    <div className="flex-1">
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                        {file.name}
                      </a>
                      <div className="text-xs text-gray-500">
                        {file.size_formatted} • Uploaded by {file.uploaded_by}
                      </div>
                      {file.description && (
                        <div className="text-sm mt-1">{file.description}</div>
                      )}
                    </div>
                    {user?.role === 'admin' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(file);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourcesPage;
