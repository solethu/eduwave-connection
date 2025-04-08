
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
  console.log('Fetching students...');
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching students:', error);
      toast.error(`Failed to load students: ${error.message}`);
      return [];
    }
    
    console.log('Students fetched successfully:', data);
    return data as Student[];
  } catch (error) {
    console.error('Unexpected error in fetchStudents:', error);
    toast.error('An unexpected error occurred while loading students');
    return [];
  }
};

export const addStudent = async (name: string, email: string): Promise<Student | null> => {
  console.log('Adding student:', { name, email });
  try {
    const { data, error } = await supabase
      .from('students')
      .insert([{ name, email }])
      .select();
    
    if (error) {
      console.error('Error adding student:', error);
      toast.error(`Failed to add student: ${error.message}`);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.error('No data returned after adding student');
      toast.error('Failed to add student: No data returned');
      return null;
    }
    
    console.log('Student added successfully:', data[0]);
    return data[0] as Student;
  } catch (error) {
    console.error('Unexpected error in addStudent:', error);
    toast.error('An unexpected error occurred while adding the student');
    return null;
  }
};

export const updateStudent = async (id: string, name: string, email: string): Promise<Student | null> => {
  console.log('Updating student:', { id, name, email });
  try {
    const { data, error } = await supabase
      .from('students')
      .update({ name, email })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating student:', error);
      toast.error(`Failed to update student: ${error.message}`);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.error('No data returned after updating student');
      toast.error('Failed to update student: No data returned');
      return null;
    }
    
    console.log('Student updated successfully:', data[0]);
    return data[0] as Student;
  } catch (error) {
    console.error('Unexpected error in updateStudent:', error);
    toast.error('An unexpected error occurred while updating the student');
    return null;
  }
};

export const deleteStudent = async (id: string): Promise<boolean> => {
  console.log('Deleting student:', id);
  try {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting student:', error);
      toast.error(`Failed to delete student: ${error.message}`);
      return false;
    }
    
    console.log('Student deleted successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error in deleteStudent:', error);
    toast.error('An unexpected error occurred while deleting the student');
    return false;
  }
};

export const resetAccessToken = async (id: string): Promise<Student | null> => {
  console.log('Resetting access token for student:', id);
  try {
    const { data, error } = await supabase
      .from('students')
      .update({ 
        access_token: crypto.randomUUID(),
        is_access_used: false
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error resetting access token:', error);
      toast.error(`Failed to reset access token: ${error.message}`);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.error('No data returned after resetting access token');
      toast.error('Failed to reset access token: No data returned');
      return null;
    }
    
    console.log('Access token reset successfully:', data[0]);
    return data[0] as Student;
  } catch (error) {
    console.error('Unexpected error in resetAccessToken:', error);
    toast.error('An unexpected error occurred while resetting the access token');
    return null;
  }
};
