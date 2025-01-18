import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { validatePassword } from "@/utils/auth";
import { FaGoogle, FaGithub } from "react-icons/fa";

interface SignupFormProps {
  onGoogleSignup: () => Promise<void>;
}

export function SignupForm({ onGoogleSignup }: SignupFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [college, setCollege] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast({
        title: "Invalid Password",
        description: passwordError,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name,
            college,
          }
        },
      });

      if (signUpError) throw signUpError;

      if (!user) {
        throw new Error("User creation failed");
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          name,
          email,
          college,
        }])
        .select()
        .single();

      if (profileError) throw profileError;

      toast({
        title: "Success!",
        description: "Please check your email to verify your account.",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <Input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="bg-white/50 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 placeholder-gray-600 border border-gray-300 dark:border-gray-600 rounded-md"
      />
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="bg-white/50 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 placeholder-gray-600 border border-gray-300 dark:border-gray-600 rounded-md"
      />
      <Input
        type="password"
        placeholder="Password (min. 6 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
        className="bg-white/50 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 placeholder-gray-600 border border-gray-300 dark:border-gray-600 rounded-md"
      />
      <Input
        type="text"
        placeholder="College/University"
        value={college}
        onChange={(e) => setCollege(e.target.value)}
        required
        className="bg-white/50 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 placeholder-gray-600 border border-gray-300 dark:border-gray-600 rounded-md"
      />
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Sign Up"}
      </Button>
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white/50 px-2 text-gray-600">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('google')}
          className="w-full bg-white/50 hover:bg-white/80"
        >
          <FaGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('github')}
          className="w-full bg-white/50 hover:bg-white/80"
        >
          <FaGithub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
      <Button
        type="button"
        variant="ghost"
        onClick={() => navigate("/login")}
        className="w-full hover:bg-white/20"
      >
        Already have an account? Login
      </Button>
    </form>
  );
}
