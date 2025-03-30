
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import { CircleUser } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { setupDemoUsers } from '@/utils/setupDemoUsers';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  
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
      } else {
        // If not logged in, ensure demo users exist
        await setupDemoUsers();
      }
    };
    
    checkSession();
  }, [navigate]);

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
      
      <div className="mt-8 text-center text-sm text-gray-500 animate-fade-in">
        <p>Demo login credentials:</p>
        <div className="mt-1">
          <p>Admin: admin@example.com / password</p>
          <p>Student: student@example.com / password</p>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Note: If this is your first time, please wait a moment for demo accounts to be created.
        </p>
      </div>
    </div>
  );
};

export default Login;
