
/**
 * Simulates a demo login with the provided credentials.
 * No actual authentication is performed; this is just for demonstration purposes.
 */
export const handleDemoLogin = async (email: string, password: string) => {
  // Instead of authenticating against Supabase, we'll simulate a successful login
  // based on expected demo credentials
  
  const validCredentials = {
    "admin@example.com": {
      password: "password",
      userData: {
        id: "demo-admin-id",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        avatar: null
      }
    },
    "student@example.com": {
      password: "password",
      userData: {
        id: "demo-student-id",
        name: "Student User",
        email: "student@example.com",
        role: "student",
        avatar: null
      }
    }
  };

  // Check if email exists and password matches
  if (validCredentials[email] && validCredentials[email].password === password) {
    // Return simulated successful response
    return {
      data: {
        session: {
          user: {
            id: validCredentials[email].userData.id
          }
        },
        user: validCredentials[email].userData
      }
    };
  }

  // Return simulated error response for invalid credentials
  return {
    error: {
      message: "Invalid login credentials"
    }
  };
};
