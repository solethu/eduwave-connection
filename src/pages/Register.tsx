
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import { UserPlus } from 'lucide-react';

const Register = () => {
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
        <UserPlus className="w-14 h-14 mx-auto mb-2 text-brand" />
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand to-blue-600">
          Join FCA Anaesthesia
        </h1>
        <p className="text-gray-500 mt-1">Create an account to get started</p>
      </div>
      
      <div className="w-full max-w-md">
        <AuthForm type="register" />
      </div>
    </div>
  );
};

export default Register;
