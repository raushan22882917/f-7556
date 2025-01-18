import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  sessionDetails: {
    date: string;
    startTime: string;
    endTime: string;
    questions: string[];
    sessionCode: string;
    groupName: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY environment variable");
    }

    const { to, sessionDetails }: EmailRequest = await req.json();
    
    // During testing, only send to the specified email
    const testEmail = "instasitebuilder@gmail.com";
    
    const emailHtml = `
      <h2>New Practice Session Scheduled</h2>
      <p>A new practice session has been scheduled for ${sessionDetails.date}</p>
      <p>Time: ${sessionDetails.startTime} - ${sessionDetails.endTime}</p>
      <p>Group: ${sessionDetails.groupName}</p>
      <h3>Questions:</h3>
      <ul>
        ${sessionDetails.questions.map((q, i) => `<li>Question ${i + 1}: ${q}</li>`).join('')}
      </ul>
      <p>Session Code: ${sessionDetails.sessionCode}</p>
      <p>Use this code to join the session when it starts.</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "CodePractice <onboarding@resend.dev>",
        to: [testEmail], // Only send to test email during development
        subject: `New Practice Session - ${sessionDetails.groupName}`,
        html: emailHtml,
      }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error('Resend API error:', data);
      return new Response(
        JSON.stringify({ 
          error: data,
          message: "Error sending email. Please verify your domain at resend.com/domains"
        }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: res.status,
        }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in sendemail function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);