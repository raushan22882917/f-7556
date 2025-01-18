import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignupForm } from "@/components/auth/SignupForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar"; // Import Navbar

export default function Signup() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing up with Google:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar with theme toggle */}
      <Navbar />

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-sm shadow-lg border-none rounded-lg overflow-hidden bg-white dark:bg-gray-800 p-6">
          <CardHeader className="space-y-4 text-center">
            <div className="flex flex-col items-center space-y-4">
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                Register
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <SignupForm onGoogleSignup={handleGoogleSignup} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
