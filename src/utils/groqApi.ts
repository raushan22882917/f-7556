import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function evaluateSubmission(submission: {
  code: string;
  language: string;
  approach: string;
  testCases: string;
}) {
  try {
    const prompt = `
      Please evaluate this coding submission:
      
      Language: ${submission.language}
      Approach: ${submission.approach}
      Test Cases: ${submission.testCases}
      Code: ${submission.code}
      
      Provide a detailed evaluation with scores (0-100) for:
      1. Correctness
      2. Efficiency
      3. Code Style
      4. Overall Score
      
      Also provide specific feedback and suggestions for improvement.
    `;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });

    const content = response.choices[0]?.message?.content || "";
    
    // Parse the response and extract scores (this is a simple example, you might want to make it more robust)
    const scores = {
      correctness: 85, // Example score
      efficiency: 80,
      codeStyle: 90,
      overallScore: 85,
      comments: content,
    };

    return scores;
  } catch (error) {
    console.error("Error evaluating submission:", error);
    throw error;
  }
}