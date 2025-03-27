
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, ChevronRight } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // This is a mock implementation - in a real app, you would call an API
      if (type === 'login') {
        // For Demo purposes, we'll use different hardcoded routes based on the role
        if (email === 'admin@example.com' && password === 'password') {
          // Store user in localStorage (in a real app, you'd use a proper auth system)
          localStorage.setItem('user', JSON.stringify({
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin'
          }));
          toast.success('Logged in as admin');
          navigate('/admin');
        } else if (email === 'student@example.com' && password === 'password') {
          localStorage.setItem('user', JSON.stringify({
            name: 'Student User',
            email: 'student@example.com',
            role: 'student'
          }));
          toast.success('Logged in successfully');
          navigate('/dashboard');
        } else {
          // For demo, any other combo works as student
          localStorage.setItem('user', JSON.stringify({
            name: name || 'Demo User',
            email: email,
            role: 'student'
          }));
          toast.success('Demo login successful');
          navigate('/dashboard');
        }
      } else {
        // Registration - for demo purposes always succeeds
        localStorage.setItem('user', JSON.stringify({
          name: name,
          email: email,
          role: role
        }));
        toast.success('Account created successfully');
        navigate(role === 'admin' ? '/admin' : '/dashboard');
      }
      
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-scale-in">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">
          {type === 'login' ? 'Welcome back' : 'Create an account'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-11 w-11 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
          </div>
          
          {type === 'register' && (
            <div className="space-y-2">
              <Label>I am a</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={role === 'student' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setRole('student')}
                >
                  Student
                </Button>
                <Button
                  type="button"
                  variant={role === 'admin' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setRole('admin')}
                >
                  Admin
                </Button>
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full h-11 mt-6 flex items-center justify-center gap-1"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                {type === 'login' ? 'Sign in' : 'Create account'}
                <ChevronRight size={16} />
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          {type === 'login' ? "Don't have an account? " : "Already have an account? "}
          <Button 
            variant="link" 
            className="p-0 h-auto text-brand"
            onClick={() => navigate(type === 'login' ? '/register' : '/login')}
          >
            {type === 'login' ? 'Sign up' : 'Sign in'}
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
