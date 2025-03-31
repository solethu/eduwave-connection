
import { supabase } from "@/integrations/supabase/client";

/**
 * Attempts a demo login with the provided credentials.
 * This is a wrapper around the standard Supabase auth to provide
 * better error handling for demo login attempts.
 */
export const handleDemoLogin = async (email: string, password: string) => {
  console.log(`Attempting demo login with ${email}`);
  
  try {
    // Attempt to sign in directly
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Log the result for debugging
    if (error) {
      console.error(`Demo login error for ${email}:`, error);
      return { error };
    }

    if (data?.session) {
      console.log(`Demo login successful for ${email}`);
      return { data };
    }
    
    return null;
  } catch (error) {
    console.error("Demo auth error:", error);
    return { error };
  }
};
