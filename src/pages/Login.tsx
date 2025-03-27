
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import { CircleUser } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      navigate(userData.role === 'admin' ? '/admin' : '/dashboard');
    }
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
      </div>
    </div>
  );
};

export default Login;
