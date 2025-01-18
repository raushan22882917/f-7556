import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { term } = await req.json();
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

    if (!groqApiKey || !googleApiKey) {
      throw new Error('Missing required API keys');
    }

    console.log('Processing request for term:', term);

    // Get explanation from Groq
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: "You are a DevOps expert. Provide detailed explanations of DevOps terms and concepts."
          },
          {
            role: "user",
            content: `Explain the DevOps term or concept: "${term}" in simple terms.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!groqResponse.ok) {
      console.error('Groq API error details:', await groqResponse.text());
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    console.log('Groq response:', groqData);

    if (!groqData.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from Groq API');
    }

    const groqExplanation = groqData.choices[0].message.content;

    // Get additional insights from Gemini
    const genAI = new GoogleGenerativeAI(googleApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const geminiPrompt = `For the DevOps term "${term}", provide:
    1. Three relevant YouTube video titles and search URLs
    2. Three related questions that someone learning this concept might ask
    Format as JSON with structure:
    {
      "videos": [{"title": "string", "url": "string"}],
      "relatedQuestions": ["string"]
    }`;

    console.log('Sending request to Gemini');
    const geminiResult = await model.generateContent(geminiPrompt);
    const geminiResponse = await geminiResult.response;
    const geminiText = geminiResponse.text();
    
    console.log('Gemini response:', geminiText);

    let geminiData;
    try {
      geminiData = JSON.parse(geminiText);
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      // Provide fallback data if parsing fails
      geminiData = {
        videos: [
          { 
            title: "Introduction to " + term, 
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(term)}+tutorial`
          }
        ],
        relatedQuestions: ["What is " + term + "?"]
      };
    }

    // Validate geminiData structure
    if (!geminiData.videos || !geminiData.relatedQuestions) {
      throw new Error('Invalid response structure from Gemini API');
    }

    // Combine responses
    const result = {
      explanation: groqExplanation,
      videos: geminiData.videos,
      relatedQuestions: geminiData.relatedQuestions
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in explain-devops-term function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'An error occurred while processing your request'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});