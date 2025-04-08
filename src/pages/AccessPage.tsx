
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Student } from '@/services/studentService';

const AccessPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [studentEmail, setStudentEmail] = useState('');
  const [student, setStudent] = useState<Student | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'check' | 'verify'>('check');

  // Check if token is valid
  useEffect(() => {
    const checkToken = async () => {
      if (!token) return;

      try {
        setLoading(true);
        // Use type casting to work around TypeScript limitations with the Supabase client
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('access_token', token)
          .single() as any;

        if (error) {
          console.error('Error checking token:', error);
          toast.error('Invalid or expired access token');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        // Check if token is already used
        if (data.is_access_used) {
          toast.info('This access link has already been used. Please log in with your credentials.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        // Set student data and verification step
        setStudent(data);
        setVerificationStep('verify');
      } catch (error) {
        console.error('Error:', error);
        toast.error('An error occurred while checking the access token');
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [token, navigate]);

  // Handle email verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    try {
      setVerifying(true);

      if (studentEmail.toLowerCase() !== student.email.toLowerCase()) {
        toast.error('Email does not match our records');
        setVerifying(false);
        return;
      }

      // Mark token as used
      // Use type casting to work around TypeScript limitations with the Supabase client
      const { error } = await supabase
        .from('students')
        .update({ is_access_used: true })
        .eq('id', student.id) as any;

      if (error) {
        console.error('Error marking token as used:', error);
        toast.error('An error occurred while verifying your access');
        setVerifying(false);
        return;
      }

      // Set user data in localStorage
      const userData = {
        id: student.id,
        name: student.name,
        email: student.email,
        role: 'student'
      };

      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Access verified successfully');
      
      // Redirect to dashboard
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred during verification');
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Access Portal</CardTitle>
          <CardDescription className="text-center">
            {verificationStep === 'check' ? 'Checking your access token...' : 'Verify your identity to continue'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verificationStep === 'verify' && student && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <p className="text-center text-sm">
                  Welcome <span className="font-semibold">{student.name}</span>!
                </p>
                <p className="text-center text-sm text-gray-500">
                  Please enter your email address to verify your identity.
                </p>
              </div>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  required
                  className="w-full"
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={verifying || !studentEmail}
                >
                  {verifying ? 'Verifying...' : 'Verify & Access'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessPage;
