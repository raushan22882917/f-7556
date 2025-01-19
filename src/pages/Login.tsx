import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("candidate");

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === "SIGNED_IN" && session) {
        console.log("User signed in, redirecting to dashboard");
        navigate("/dashboard");
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        setError(null);
      } else if (event === "USER_UPDATED") {
        console.log("User updated");
        checkSession();
      }
    });

    checkSession();

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate]);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (session) {
        console.log("Active session found, redirecting to dashboard");
        navigate("/dashboard");
      }
    } catch (error) {
      handleError(error as AuthError);
    }
  };

  const handleError = (error: AuthError) => {
    console.error("Auth error:", error);
    
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          setError("Invalid credentials. Please check your email and password.");
          break;
        case 422:
          setError("Email verification required. Please check your inbox.");
          break;
        case 429:
          setError("Too many requests. Please try again later.");
          break;
        default:
          setError(error.message);
      }
      
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message,
      });
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md shadow-lg border-none rounded-lg overflow-hidden">
          <div className="flex flex-col justify-center bg-white dark:bg-gray-800 p-6 rounded-lg">
            <CardContent>
              <CardHeader className="text-center mb-6">
                <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Sign In
                </CardTitle>
              </CardHeader>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="candidate" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="candidate">Candidate</TabsTrigger>
                  <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
                </TabsList>

                <TabsContent value="candidate">
                  <Auth
                    supabaseClient={supabase}
                    appearance={{
                      theme: ThemeSupa,
                      variables: {
                        default: {
                          colors: {
                            brand: "#7c3aed",
                            brandAccent: "#6366f1",
                          },
                        },
                      },
                      className: {
                        container: "w-full",
                        button: "w-full py-3 px-6 text-sm rounded-lg shadow-md transition-all text-white font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-600",
                      },
                    }}
                    providers={["google", "github"]}
                    view="sign_in"
                    redirectTo={`${window.location.origin}/auth/callback`}
                  />
                </TabsContent>

                <TabsContent value="recruiter">
                  <Auth
                    supabaseClient={supabase}
                    appearance={{
                      theme: ThemeSupa,
                      variables: {
                        default: {
                          colors: {
                            brand: "#2563eb",
                            brandAccent: "#1d4ed8",
                          },
                        },
                      },
                      className: {
                        container: "w-full",
                        button: "w-full py-3 px-6 text-sm rounded-lg shadow-md transition-all text-white font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-600",
                      },
                    }}
                    providers={[]}
                    view="sign_in"
                    redirectTo={`${window.location.origin}/auth/callback`}
                  />
                </TabsContent>
              </Tabs>

              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/signup")}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Don't have an account? Sign up
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}