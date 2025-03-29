
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email, created_at')
          .eq('role', 'student')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setStudents(data || []);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error('Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return { students, loading };
};
