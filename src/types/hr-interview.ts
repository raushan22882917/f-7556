export interface Question {
  id: string;
  question: string;
  audio_response_url: string | null;
  feedback: string | null;
  interview_id: string;
  created_at: string;
  evaluation_steps: EvaluationStep[] | null;
}

export interface EvaluationStep {
  name: string;
  score: number;
}

export interface InterviewDetails {
  id: string;
  user_id: string;
  company_name: string;
  position: string;
  created_at: string;
  feedback_pdf_url: string | null;
  status: 'in_progress' | 'completed';
  timer_completed: boolean | null;
  time_spent_seconds: number | null;
}