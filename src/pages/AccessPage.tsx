
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Mail, LockKeyhole, ArrowRight } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const AccessPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [studentName, setStudentName] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        toast.error('Invalid access link');
        navigate('/');
        return;
      }

      try {
        // Check if the token exists and is valid
        const { data, error } = await supabase
          .from('students')
          .select('name, is_access_used')
          .eq('access_token', token)
          .single();

        if (error || !data) {
          toast.error('Invalid or expired access link');
          navigate('/');
          return;
        }

        if (data.is_access_used) {
          toast.error('This access link has already been used');
          navigate('/');
          return;
        }

        setStudentName(data.name);
        setIsValid(true);
      } catch (error) {
        console.error('Error validating token:', error);
        toast.error('There was an error processing your access link');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token, navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Verify email matches the student's email
      const { data, error } = await supabase
        .from('students')
        .select('id, email')
        .eq('access_token', token)
        .single();

      if (error || !data) {
        toast.error('Invalid access link');
        return;
      }

      if (data.email.toLowerCase() !== values.email.toLowerCase()) {
        form.setError('email', { 
          type: 'manual', 
          message: 'Email does not match our records' 
        });
        return;
      }

      // Mark access token as used
      const { error: updateError } = await supabase
        .from('students')
        .update({ 
          is_access_used: true,
          last_active: new Date().toISOString()
        })
        .eq('id', data.id);

      if (updateError) {
        toast.error('Error processing your access');
        console.error('Error updating student:', updateError);
        return;
      }

      // Store student in localStorage for future access
      localStorage.setItem('user', JSON.stringify({
        name: studentName,
        email: values.email,
        role: 'student'
      }));

      toast.success('Access granted successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error processing access:', error);
      toast.error('Error processing your access request');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isValid) {
    return null; // Navigate away happens in useEffect
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome, {studentName}</CardTitle>
          <CardDescription>
            Enter your email to access your learning materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          placeholder="your.email@example.com"
                          type="email"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Access Materials <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center border-t pt-5">
          <div className="flex items-center text-sm text-gray-500">
            <LockKeyhole className="mr-2 h-4 w-4" />
            <span>Your access is secure and protected</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccessPage;
