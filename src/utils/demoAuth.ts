
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Handles login attempts with demo credentials by setting up demo users if they don't exist
 * and then signing in with them
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
    
    // First try to sign in directly
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // If successful, return the session data
    if (data?.session) {
      console.log(`Demo login successful for ${email}`);
      return data;
    }

    // If login failed, attempt to create the demo user
    if (error) {
      console.log(`Demo login failed, attempting to create user: ${email}`);
      
      const role = isDemoAdmin ? "admin" : "student";
      const name = isDemoAdmin ? "Admin User" : "Student User";
      
      // Create the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (signUpError) {
        console.error("Error creating demo user:", signUpError);
        return { error: signUpError };
      }

      // Try to sign in now that the user is created
      const { data: newLoginData, error: newLoginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (newLoginError) {
        console.error("Error signing in with newly created demo user:", newLoginError);
        return { error: newLoginError };
      }

      // Create profile data manually if needed
      if (newLoginData?.session) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: newLoginData.session.user.id,
            name,
            email,
            role,
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }

      return newLoginData;
    }
    
    return null;
  } catch (error) {
    console.error("Demo auth error:", error);
    return { error };
  }
};
