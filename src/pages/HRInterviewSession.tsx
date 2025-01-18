import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHRInterview } from '@/hooks/useHRInterview';
import { AIInterviewerIntro } from '@/components/AIInterviewerIntro';
import { InterviewQuestionCard } from '@/components/InterviewQuestionCard';
import { QuestionTimer } from '@/components/QuestionTimer';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const MAX_QUESTIONS = 5;
const MAX_TIME_SECONDS = 600; // 10 minutes

export default function HRInterviewSession() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [introCompleted, setIntroCompleted] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  const {
    responses,
    setResponses,
    isLoading,
    interviewDetails,
    handleResponseSubmit,
    currentQuestion,
  } = useHRInterview(id || '');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/hr-interview-questions.json');
        const data = await response.json();
        
        const firstQuestion = data.questions[0];
        const remainingQuestions = data.questions.slice(1);
        const shuffledQuestions = remainingQuestions.sort(() => Math.random() - 0.5);
        const selectedQuestions = [firstQuestion, ...shuffledQuestions.slice(0, MAX_QUESTIONS - 1)];
        
        setQuestions(selectedQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
        toast({
          title: "Error",
          description: "Failed to load interview questions",
          variant: "destructive"
        });
      }
    };

    if (interviewDetails) {
      fetchQuestions();
    }
  }, [interviewDetails, toast]);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };
    startVideo();
  }, []);

  useEffect(() => {
    if (timeSpent >= MAX_TIME_SECONDS) {
      handleTimeUp();
    }
  }, [timeSpent]);

  const handleTimeUp = async () => {
    try {
      await supabase
        .from('hr_interviews')
        .update({ 
          timer_completed: true,
          time_spent_seconds: timeSpent,
          status: 'completed'
        })
        .eq('id', id);

      toast({
        title: "Time's up!",
        description: "Your interview session has ended.",
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating interview:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        
        if (currentQuestion) {
          const formData = new FormData();
          formData.append('audio', audioBlob);
          try {
            const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
              method: 'POST',
              body: formData,
              headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              },
            });
            const data = await response.json();
            setTranscription(data.text);
            
            if (currentQuestion) {
              setResponses(prev => ({
                ...prev,
                [currentQuestion.id]: data.text
              }));
            }
          } catch (error) {
            console.error('Error transcribing audio:', error);
          }
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">HR Interview Session</h1>
          <QuestionTimer onTimeUpdate={setTimeSpent} />
        </div>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="fixed top-4 right-4 w-64 h-48 rounded-lg overflow-hidden shadow-lg border-2 border-purple-500"
        />

        <div className="max-w-4xl mx-auto space-y-8">
          {!introCompleted ? (
            <AIInterviewerIntro onIntroComplete={() => setIntroCompleted(true)} />
          ) : (
            questions[currentQuestionIndex] && (
              <InterviewQuestionCard
                questions={questions}
                currentQuestion={questions[currentQuestionIndex].question}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={MAX_QUESTIONS}
                transcription={transcription}
                isRecording={isRecording}
                onStartRecording={startRecording}
                onStopRecording={stopRecording}
                onSubmit={handleResponseSubmit}
                onNextQuestion={async () => {
                  const isComplete = await handleResponseSubmit();
                  if (currentQuestionIndex < MAX_QUESTIONS - 1) {
                    setCurrentQuestionIndex(prev => prev + 1);
                    setTranscription('');
                  } else if (isComplete) {
                    navigate('/dashboard');
                  }
                }}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}