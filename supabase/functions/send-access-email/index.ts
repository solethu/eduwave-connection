
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  studentId: string;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if it's a POST request
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Parse request body
    const { studentId }: EmailRequest = await req.json();

    if (!studentId) {
      return new Response(JSON.stringify({ error: 'Student ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Get student details from database
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('name, email, access_token')
      .eq('id', studentId)
      .single();

    if (studentError || !student) {
      console.error('Error fetching student:', studentError);
      return new Response(JSON.stringify({ error: 'Student not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Create access URL
    const origin = req.headers.get('origin') || 'https://yourdomain.com';
    const accessUrl = `${origin}/access/${student.access_token}`;

    console.log(`Sending email to ${student.email} with access link: ${accessUrl}`);

    // In a real implementation, you would use an email service like Resend, SendGrid, etc.
    // For now, we'll just log the email details and simulate a successful send
    
    /*
    // Example with Resend:
    const resend = new Resend('re_123456789');
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: student.email,
      subject: 'Your FCA Anaesthesia Learning Access',
      html: `
        <h1>Welcome to FCA Anaesthesia Learning Platform</h1>
        <p>Hello ${student.name},</p>
        <p>You've been granted access to the FCA Anaesthesia learning materials.</p>
        <p>Click the link below to access your materials:</p>
        <p><a href="${accessUrl}" style="padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Access Learning Materials</a></p>
        <p>Or copy and paste this URL into your browser: ${accessUrl}</p>
        <p>This link is unique to you and should not be shared with others.</p>
        <p>Best regards,<br>FCA Anaesthesia Team</p>
      `,
    });
    */

    // For demo purposes, simulate successful email send
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email would be sent to ${student.email}`,
        details: {
          to: student.email,
          subject: 'Your FCA Anaesthesia Learning Access',
          accessUrl
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
