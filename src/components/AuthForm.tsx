import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, ChevronRight } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { handleDemoLogin } from '@/utils/demoAuth';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === 'login') {
        // First check if this is a demo login
        const demoResult = await handleDemoLogin(email, password);
        
        if (demoResult) {
          if (demoResult.error) {
            toast.error(demoResult.error.message || 'Login failed');
            setLoading(false);
            return;
          }
          
          if (demoResult.session) {
            const { data: userData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', demoResult.session.user.id)
              .single();

            if (profileError) {
              toast.error('Error fetching profile');
              setLoading(false);
              return;
            }

            // Store user in localStorage
            localStorage.setItem('user', JSON.stringify({
              name: userData.name,
              email: userData.email,
              role: userData.role,
              avatar: userData.avatar_url
            }));

            toast.success('Logged in successfully');
            navigate(userData.role === 'admin' ? '/admin' : '/dashboard');
            return;
          }
        }

        // Regular login flow if not a demo user or demo setup failed
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Login error:', error);
          toast.error(error.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          const { data: userData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          if (profileError) {
            toast.error('Error fetching profile');
            setLoading(false);
            return;
          }

          // Store user in localStorage
          localStorage.setItem('user', JSON.stringify({
            name: userData.name,
            email: userData.email,
            role: userData.role,
            avatar: userData.avatar_url
          }));

          toast.success('Logged in successfully');
          navigate(userData.role === 'admin' ? '/admin' : '/dashboard');
        }
      } else {
        // Registration
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role
            }
          }
        });

        if (error) {
          toast.error(error.message);
          setLoading(false);
          return;
        }

        toast.success('Account created successfully! Check your email for verification.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Unexpected auth error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
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
