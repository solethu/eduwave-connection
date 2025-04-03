
import { supabase } from "@/integrations/supabase/client";

/**
 * Attempts a demo login with the provided credentials.
 */
export const handleDemoLogin = async (email: string, password: string) => {
  try {
    // Attempt to sign in directly
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    if (data?.session) {
      return { data };
    }
    
    return null;
  } catch (error) {
    return { error };
  }
};
