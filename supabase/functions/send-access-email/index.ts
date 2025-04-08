
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  studentId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get request body
    const { studentId } = await req.json() as RequestBody;

    if (!studentId) {
      return new Response(
        JSON.stringify({ error: "Student ID is required" }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    }

    // Get student data
    const { data: student, error: fetchError } = await supabase
      .from("students")
      .select("*")
      .eq("id", studentId)
      .single();

    if (fetchError || !student) {
      console.error("Error fetching student:", fetchError);
      return new Response(
        JSON.stringify({ error: "Student not found" }),
        { 
          status: 404, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    }

    // Reset access token if needed
    let accessToken = student.access_token;
    
    if (!accessToken || student.is_access_used) {
      const newToken = crypto.randomUUID();
      
      const { error: updateError } = await supabase
        .from("students")
        .update({ 
          access_token: newToken,
          is_access_used: false
        })
        .eq("id", studentId);

      if (updateError) {
        console.error("Error updating access token:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update access token" }),
          { 
            status: 500, 
            headers: { 
              "Content-Type": "application/json",
              ...corsHeaders
            } 
          }
        );
      }
      
      accessToken = newToken;
    }

    // Here you would normally send an actual email
    // For this example, we'll just log the details
    const baseUrl = req.headers.get("origin") || "https://example.com";
    const accessUrl = `${baseUrl}/access/${accessToken}`;

    console.log(`
      Email would be sent to ${student.email} with the following details:
      - Student: ${student.name}
      - Access URL: ${accessUrl}
    `);

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Access email would be sent (simulated)",
        student: {
          name: student.name,
          email: student.email
        },
        accessUrl
      }),
      { 
        status: 200, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error("Error in send-access-email function:", error);
    
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  }
});
