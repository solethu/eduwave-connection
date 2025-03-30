
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * This function is only used for reference now,
 * as we're not trying to create demo users dynamically
 */
export const handleDemoLogin = async (email: string, password: string) => {
  // Check if this is a demo login attempt
  const isDemoAdmin = email === "admin@example.com" && password === "password";
  const isDemoStudent = email === "student@example.com" && password === "password";
  
  if (!isDemoAdmin && !isDemoStudent) {
    // Not a demo login, return null to let the regular flow handle it
    return null;
  }
  
  try {
    console.log(`Attempting demo login with ${email}`);
    
    // Try to sign in directly
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // If successful, return the session data
    if (data?.session) {
      console.log(`Demo login successful for ${email}`);
      return data;
    }

    // If login failed, log the error
    if (error) {
      console.error(`Demo login failed for ${email}:`, error);
      return { error };
    }
    
    return null;
  } catch (error) {
    console.error("Demo auth error:", error);
    return { error };
  }
};
