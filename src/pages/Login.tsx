
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleUser } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { handleDemoLogin } from '@/utils/demoAuth';

const Login = () => {
  const navigate = useNavigate();
  const [attemptingDemoLogin, setAttemptingDemoLogin] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [navigate]);

  const attemptDemoLogin = async (role: 'admin' | 'student') => {
    setAttemptingDemoLogin(true);
    try {
      const email = role === 'admin' ? 'admin@example.com' : 'student@example.com';
      const password = 'password';
      
      const response = await handleDemoLogin(email, password);
      
      if (response?.error) {
        toast.error(`Unable to log in with demo ${role} credentials: ${response.error.message}`);
        setAttemptingDemoLogin(false);
        return;
      }
      
      if (response?.data?.user) {
        // Store the user data in localStorage for session persistence
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        toast.success(`Logged in successfully as ${role}`);
        navigate(role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      setAttemptingDemoLogin(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <div className="mb-8 text-center animate-fade-in">
        <CircleUser className="w-14 h-14 mx-auto mb-2 text-brand" />
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand to-blue-600">
          FCA Anaesthesia
        </h1>
        <p className="text-gray-500 mt-1">Your Learning Journey Starts Here</p>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-md p-6">
        <h2 className="text-xl font-semibold text-center mb-6">Demo Access</h2>
        
        <div className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="default"
              onClick={() => attemptDemoLogin('admin')}
              disabled={attemptingDemoLogin}
              className="flex items-center justify-center gap-2"
            >
              {attemptingDemoLogin ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <CircleUser size={16} />
                  <span>Login as Admin</span>
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => attemptDemoLogin('student')}
              disabled={attemptingDemoLogin}
              className="flex items-center justify-center gap-2"
            >
              {attemptingDemoLogin ? (
                <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full" />
              ) : (
                <>
                  <CircleUser size={16} />
                  <span>Login as Student</span>
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-gray-500 text-center">
          <p>Demo credentials:</p>
          <div className="mt-1">
            <p>Admin: admin@example.com / password</p>
            <p>Student: student@example.com / password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
