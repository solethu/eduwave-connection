
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import { CircleUser } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const Login = () => {
  const navigate = useNavigate();
  const [attemptingDemoLogin, setAttemptingDemoLogin] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const { data: userData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
          
        if (userData) {
          localStorage.setItem('user', JSON.stringify({
            name: userData.name,
            email: userData.email,
            role: userData.role,
            avatar: userData.avatar_url
          }));
          navigate(userData.role === 'admin' ? '/admin' : '/dashboard');
        }
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleDemoLogin = async (role: 'admin' | 'student') => {
    setAttemptingDemoLogin(true);
    try {
      const email = role === 'admin' ? 'admin@example.com' : 'student@example.com';
      const password = 'password';
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error(`Demo login error for ${role}:`, error);
        toast.error(`Unable to log in with demo ${role} credentials. The database may not be configured with these users.`);
        setAttemptingDemoLogin(false);
        return;
      }
      
      if (data?.session) {
        const { data: userData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        
        if (profileError) {
          console.error(`Error fetching ${role} profile:`, profileError);
          toast.error(`Error fetching ${role} profile`);
          setAttemptingDemoLogin(false);
          return;
        }
        
        localStorage.setItem('user', JSON.stringify({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar_url
        }));
        
        toast.success(`Logged in successfully as ${role}`);
        navigate(role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (error) {
      console.error('Unexpected auth error:', error);
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
      
      <div className="w-full max-w-md">
        <AuthForm type="login" />
      </div>
      
      <div className="mt-8 space-y-4 text-center animate-fade-in">
        <div>
          <p className="text-sm font-medium text-gray-700">Quick access with demo accounts:</p>
          <div className="mt-3 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => handleDemoLogin('admin')}
              disabled={attemptingDemoLogin}
              className="flex items-center justify-center gap-2"
            >
              {attemptingDemoLogin ? (
                <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full" />
              ) : (
                <>
                  <CircleUser size={16} />
                  <span>Login as Admin</span>
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleDemoLogin('student')}
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
        
        <div className="text-sm text-gray-500">
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
