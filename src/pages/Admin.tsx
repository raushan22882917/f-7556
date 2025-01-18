import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google', // Replace with your desired OAuth provider (e.g., 'google', 'github')
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Login Successful",
        description: "You now have access to admin features.",
      });

      // Set the logged-in state
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Unable to log in. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchUserSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setIsLoggedIn(true);
    }
  };

  useEffect(() => {
    fetchUserSession();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      {!isLoggedIn ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Admin Login</h1>
          <Button onClick={handleLogin} className="px-6 py-3 bg-blue-600 text-white rounded">
            Login as Admin
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome, Admin!</h1>
          <div className="space-y-4">
            {/* Add admin features here */}
            <Button onClick={() => alert('Feature 1 Accessed')} className="px-4 py-2 bg-green-500 text-white rounded">
              Feature 1
            </Button>
            <Button onClick={() => alert('Feature 2 Accessed')} className="px-4 py-2 bg-green-500 text-white rounded">
              Feature 2
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
