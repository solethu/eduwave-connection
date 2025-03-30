
import { supabase } from '@/integrations/supabase/client';

/**
 * Sets up demo users in the database if they don't already exist
 * This ensures the demo credentials shown on the login screen actually work
 */
export async function setupDemoUsers() {
  try {
    console.log("Checking if demo users exist...");
    
    // Check if admin user exists
    const { data: adminExists } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', 'admin@example.com')
      .maybeSingle();
      
    // Check if student user exists
    const { data: studentExists } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', 'student@example.com')
      .maybeSingle();

    // Create admin user if it doesn't exist
    if (!adminExists) {
      console.log("Creating admin demo user...");
      const { error: adminError } = await supabase.auth.signUp({
        email: 'admin@example.com',
        password: 'password',
        options: {
          data: {
            name: 'Admin User',
            role: 'admin'
          }
        }
      });
      
      if (adminError) {
        console.error("Error creating admin demo user:", adminError);
      }
    }
    
    // Create student user if it doesn't exist
    if (!studentExists) {
      console.log("Creating student demo user...");
      const { error: studentError } = await supabase.auth.signUp({
        email: 'student@example.com',
        password: 'password',
        options: {
          data: {
            name: 'Student User',
            role: 'student'
          }
        }
      });
      
      if (studentError) {
        console.error("Error creating student demo user:", studentError);
      }
    }
    
    // If we created any users, we should log that they'll need verification
    if (!adminExists || !studentExists) {
      console.log("Demo users created - you may need to verify their emails in the Supabase dashboard");
    } else {
      console.log("Demo users already exist");
    }
  } catch (error) {
    console.error("Error setting up demo users:", error);
  }
}
