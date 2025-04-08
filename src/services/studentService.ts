
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  last_active: string;
  access_token: string;
  is_access_used: boolean;
}

export const sendAccessEmail = async (studentId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-access-email', {
      body: { studentId }
    });

    if (error) {
      console.error('Error sending access email:', error);
      toast.error('Failed to send access email');
      return false;
    }

    console.log('Email sent response:', data);
    return true;
  } catch (error) {
    console.error('Error invoking function:', error);
    toast.error('An error occurred while sending the email');
    return false;
  }
};

export const fetchStudents = async (): Promise<Student[]> => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    toast.error('Failed to load students');
    console.error('Error fetching students:', error);
    return [];
  }
  
  return data as Student[];
};

export const addStudent = async (name: string, email: string): Promise<Student | null> => {
  const { data, error } = await supabase
    .from('students')
    .insert([{ name, email }])
    .select()
    .single();
  
  if (error) {
    toast.error(`Failed to add student: ${error.message}`);
    console.error('Error adding student:', error);
    return null;
  }
  
  return data as Student;
};

export const updateStudent = async (id: string, name: string, email: string): Promise<Student | null> => {
  const { data, error } = await supabase
    .from('students')
    .update({ name, email })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    toast.error(`Failed to update student: ${error.message}`);
    console.error('Error updating student:', error);
    return null;
  }
  
  return data as Student;
};

export const deleteStudent = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id);
  
  if (error) {
    toast.error(`Failed to delete student: ${error.message}`);
    console.error('Error deleting student:', error);
    return false;
  }
  
  return true;
};

export const resetAccessToken = async (id: string): Promise<Student | null> => {
  const { data, error } = await supabase
    .from('students')
    .update({ 
      access_token: crypto.randomUUID(),
      is_access_used: false
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    toast.error(`Failed to reset access token: ${error.message}`);
    console.error('Error resetting access token:', error);
    return null;
  }
  
  return data as Student;
};
