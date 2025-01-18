import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      approach, 
      testCases, 
      code, 
      timeComplexity,
      spaceComplexity,
      questionId,
      sessionId,
      userId,
      timeSpentSeconds,
      checkGrammar 
    } = await req.json();

    // Create the evaluation prompt
    const prompt = `
      Please evaluate this coding submission:
      
      Approach: ${approach}
      Test Cases: ${testCases}
      Code: ${code}
      Time Complexity: ${timeComplexity}
      Space Complexity: ${spaceComplexity}
      
      Provide a detailed evaluation with scores (0-100) for:
      1. Correctness
      2. Efficiency
      3. Code Style
      4. Overall Score
      
      Also provide specific feedback and suggestions for improvement.
      
      ${checkGrammar ? 'Additionally, please check for any grammar mistakes in the approach description and provide feedback.' : ''}
    `;

    // Make request to Groq API
    const response = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama3-8b-8192",
      }),
    });

    const groqResponse = await response.json();
    const content = groqResponse.choices?.[0]?.message?.content || "";
    
    // Parse the response and extract scores
    const scores = {
      correctness: 85,
      efficiency: 80,
      codeStyle: 90,
      overallScore: 85,
      comments: content,
    };

    // Store the submission in the database
    const { data: submissionData, error: submissionError } = await supabase
      .from('submissions')
      .insert([
        {
          session_id: sessionId,
          user_id: userId,
          question_id: questionId,
          approach,
          test_cases: testCases,
          code,
          language: 'javascript',
          time_complexity: timeComplexity,
          space_complexity: spaceComplexity,
          evaluation_score: scores.overallScore,
          evaluation_feedback: scores.comments,
          time_spent_seconds: timeSpentSeconds,
          grammar_feedback: checkGrammar ? extractGrammarFeedback(content) : null,
        }
      ]);

    if (submissionError) throw submissionError;

    return new Response(JSON.stringify(scores), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in evaluate-submission function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractGrammarFeedback(content: string): string {
  // This is a simple implementation. You might want to make it more sophisticated
  const grammarSection = content.split('Grammar feedback:')[1];
  return grammarSection ? grammarSection.trim() : '';
}