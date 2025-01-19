import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AdminRoute } from "@/components/AdminRoute";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DevOpsFlow from "@/components/DevOpsFlow";
import MLFlow from './components/MLFlow/MLFlow';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PolicyPage from "./pages/PolicyPage";
import NewsPage from './pages/NewsPage';
import AuthCallback from "./pages/AuthCallback";
import About from "./pages/About";
import Services from "./pages/Services";
import Topics from "./pages/Topics";
import TopicQuestions from "./pages/TopicQuestions";
import SolvePage from "./pages/SolvePage";
import PeerPractice from "./pages/PeerPractice";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Pricing from "./pages/Pricing";
import TeamCoding from "./pages/TeamCoding";
import DevOpsPractice from "./pages/DevOpsPractice";
import HRInterview from "./pages/HRInterview";
import HRInterviewSession from "./pages/HRInterviewSession";
import Settings from "./pages/Settings";
import TechnicalRound from "./pages/TechnicalRound";
import FAQ from "./pages/FAQ";
import Coding from "./pages/Coding";
import Resources from "./pages/Resources";
import InterviewRounds from "./pages/InterviewRounds";
import AdminHackathon from "./pages/AdminHackathon";
import Hackathons from "./pages/Hackathons";
import HackathonDetails from "./pages/HackathonDetails";
import Contact from "./pages/Contact";
import ArticlePage from "./pages/ArticlePage";
import Jobs from "./pages/Jobs";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/coding" element={<Coding />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/interview-rounds" element={<InterviewRounds />} />
                    <Route path="/self-practice" element={<Topics />} />
                    <Route path="/news" element={<NewsPage />} /> 
                    <Route path="/policy" element={<PolicyPage />} />
                    <Route 
                      path="/settings" 
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/topic/:id" 
                      element={
                        <ProtectedRoute>
                          <TopicQuestions />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/solve/:id" 
                      element={
                        <ProtectedRoute>
                          <SolvePage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/peer-practice" 
                      element={
                        <ProtectedRoute>
                          <PeerPractice />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/peer-practice/:sessionId" 
                      element={
                        <ProtectedRoute>
                          <SolvePage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/team-coding" 
                      element={
                        <ProtectedRoute>
                          <TeamCoding />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/community" 
                      element={
                        <ProtectedRoute>
                          <Community />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route 
                      path="/devops-practice" 
                      element={
                        <ProtectedRoute>
                          <DevOpsPractice />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/devops-flow" 
                      element={
                        <ProtectedRoute>
                          <DevOpsFlow />
                        </ProtectedRoute>
                      } 
                    />
                   <Route 
                    path="/ML-flow" 
                    element={
                      <ProtectedRoute>
                        <MLFlow />
                      </ProtectedRoute>
                    } 
                  />
                    <Route 
                      path="/hr-interview" 
                      element={
                        <ProtectedRoute>
                          <HRInterview />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/hr-interview/:id" 
                      element={
                        <ProtectedRoute>
                          <HRInterviewSession />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/technical-round" 
                      element={
                        <ProtectedRoute>
                          <TechnicalRound />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/hackathons" 
                      element={
                        <AdminRoute>
                          <AdminHackathon />
                        </AdminRoute>
                      } 
                    />
                    <Route path="/hackathons" element={<Hackathons />} />
                    <Route 
                      path="/hackathons/:id" 
                      element={
                        <ProtectedRoute>
                          <HackathonDetails />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/article/:id" element={<ArticlePage />} />
                    <Route path="/jobs" element={<Jobs />} />
                  </Routes>
                </main>
              </div>
              <Toaster />
              <Sonner />
            </SidebarProvider>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
