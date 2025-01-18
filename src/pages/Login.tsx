import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar"; // Import Navbar

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar /> {/* Add Navbar here */}

      <div className="flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-sm shadow-lg border-none rounded-lg overflow-hidden">
          <div className="flex flex-col justify-center bg-white dark:bg-gray-800 p-6 rounded-lg">
            {/* Right Side - Login Form */}
            <CardContent>
              <CardHeader className="text-center mb-6">
                <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Sign In</CardTitle>
              </CardHeader>
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
              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/signup")}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Don’t have an account? Sign up
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
