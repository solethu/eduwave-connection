
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import Header from '@/components/Header';
import StudentTable from '@/components/students/StudentTable';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useStudents } from '@/hooks/useStudents';

const AdminStudents = () => {
  const { students, loading } = useStudents();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(userData);
      if (user.role !== 'admin') {
        navigate('/dashboard');
        toast.error('Access denied: Admin privileges required');
        return;
      }
    };

    checkUserRole();
  }, [navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Student Management</CardTitle>
          </CardHeader>
          <CardContent>
            <StudentTable students={students} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminStudents;
