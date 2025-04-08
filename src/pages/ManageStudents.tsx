
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { PlusCircle, Pencil, Trash2, Search, UserPlus, Mail, Copy } from 'lucide-react';
import Header from '@/components/Header';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Student, 
  fetchStudents, 
  addStudent, 
  updateStudent, 
  deleteStudent, 
  resetAccessToken,
  sendAccessEmail 
} from '@/services/studentService';

// Form schema for student
const studentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

interface User {
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
}

const ManageStudents = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Initialize form
  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

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

  // Fetch students
  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });

  // Add student mutation
  const addStudentMutation = useMutation({
    mutationFn: (data: z.infer<typeof studentFormSchema>) => 
      addStudent(data.name, data.email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student added successfully');
      setIsAddModalOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(`Failed to add student: ${error.message}`);
    },
  });

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: z.infer<typeof studentFormSchema> }) => 
      updateStudent(id, data.name, data.email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student updated successfully');
      setIsEditModalOpen(false);
      setSelectedStudent(null);
      form.reset();
    },
    onError: (error) => {
      toast.error(`Failed to update student: ${error.message}`);
    },
  });

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedStudent(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete student: ${error.message}`);
    },
  });

  // Reset access token mutation
  const resetAccessTokenMutation = useMutation({
    mutationFn: (id: string) => resetAccessToken(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Access link reset successfully');
      if (data) {
        setSelectedStudent(data);
      }
    },
    onError: (error) => {
      toast.error(`Failed to reset access link: ${error.message}`);
    },
  });

  // Send access email mutation
  const sendAccessEmailMutation = useMutation({
    mutationFn: (id: string) => sendAccessEmail(id),
    onSuccess: (success) => {
      if (success) {
        toast.success('Access link email sent successfully');
      }
    }
  });

  // Format date to relative time
  const getRelativeTime = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
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

  // Generate access link
  const getAccessLink = (student: Student) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/access/${student.access_token}`;
  };

  // Copy access link to clipboard
  const copyAccessLink = (student: Student) => {
    const link = getAccessLink(student);
    navigator.clipboard.writeText(link);
    toast.success('Access link copied to clipboard');
  };

  // Send access link via email
  const handleSendAccessLink = (student: Student) => {
    sendAccessEmailMutation.mutate(student.id);
  };

  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle add student form submission
  const handleAddStudent = (data: z.infer<typeof studentFormSchema>) => {
    addStudentMutation.mutate(data);
  };

  // Handle edit student form submission
  const handleEditStudent = (data: z.infer<typeof studentFormSchema>) => {
    if (!selectedStudent) return;
    
    updateStudentMutation.mutate({
      id: selectedStudent.id,
      data
    });
  };

  // Handle delete student
  const handleDeleteStudent = () => {
    if (!selectedStudent) return;
    
    deleteStudentMutation.mutate(selectedStudent.id);
  };

  // Open edit modal and prepopulate form
  const openEditModal = (student: Student) => {
    setSelectedStudent(student);
    form.setValue('name', student.name);
    form.setValue('email', student.email);
    setIsEditModalOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  // Reset student access token
  const handleResetAccessToken = (student: Student) => {
    resetAccessTokenMutation.mutate(student.id);
  };

  if (loading || isLoadingStudents) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} />
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold animate-fade-in">Manage Students</h1>
            <p className="text-gray-500 mt-1 animate-fade-in">Add, edit, or remove students and manage their access</p>
          </div>
          <Button onClick={() => {
            form.reset();
            setIsAddModalOpen(true);
          }} className="flex items-center gap-2">
            <UserPlus size={16} />
            Add New Student
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle>Student Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-6 relative">
              <Search className="absolute left-3 text-gray-400" size={18} />
              <Input 
                placeholder="Search students by name or email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableCaption>List of all enrolled students</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Access Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full max-w-24 h-2 bg-gray-100 rounded-full">
                              <div 
                                className="h-full bg-brand rounded-full" 
                                style={{ width: `${student.progress || 0}%` }}
                              />
                            </div>
                            <span className="text-sm">{student.progress || 0}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{getRelativeTime(student.last_active)}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.is_access_used 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {student.is_access_used ? 'Used' : 'Not Used'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleSendAccessLink(student)}
                              title="Send Access Link"
                              disabled={sendAccessEmailMutation.isPending}
                            >
                              <Mail size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => copyAccessLink(student)}
                              title="Copy Access Link"
                            >
                              <Copy size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openEditModal(student)}
                              title="Edit Student"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openDeleteModal(student)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="Delete Student"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No students found matching your search
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
      
      {/* Add Student Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Enter the student details below to create a new account and send an access link.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddStudent)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Student name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="student@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddModalOpen(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={addStudentMutation.isPending}
                >
                  {addStudentMutation.isPending ? 'Adding...' : 'Add Student'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Student Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update the student details below.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditStudent)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Student name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="student@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedStudent && (
                <div className="pt-2">
                  <p className="text-sm font-medium mb-2">Access Link Status</p>
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedStudent.is_access_used 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedStudent.is_access_used ? 'Used' : 'Not Used'}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetAccessToken(selectedStudent)}
                      disabled={resetAccessTokenMutation.isPending}
                    >
                      Reset Link
                    </Button>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedStudent(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={updateStudentMutation.isPending}
                >
                  {updateStudentMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this student? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedStudent(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteStudent}
              disabled={deleteStudentMutation.isPending}
            >
              {deleteStudentMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageStudents;
