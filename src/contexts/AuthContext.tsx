import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError, AuthApiError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  logout: async () => {} 
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleAuthError = (error: AuthError) => {
    console.error('Auth error:', error);
    
    if (error instanceof AuthApiError) {
      if (error.message.includes('refresh_token_not_found') || 
          error.message.includes('Invalid Refresh Token') ||
          error.message.includes('JWT expired') ||
          error.message.includes('session_not_found')) {
        console.log('Session expired, redirecting to login');
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
        // Clear any invalid tokens and redirect to login
        supabase.auth.signOut().then(() => {
          setUser(null);
          if (location.pathname !== '/login') {
            navigate('/login', { state: { from: location.pathname } });
          }
        });
      } else {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/login');
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Initializing auth state');
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          console.log('AuthProvider: Found existing session');
          setUser(session.user);
        } else if (location.pathname !== '/login' && 
                  location.pathname !== '/signup' && 
                  !location.pathname.startsWith('/reset-password')) {
          console.log('AuthProvider: No session found, redirecting to login');
          navigate('/login', { state: { from: location.pathname } });
        }
      } catch (error: any) {
        handleAuthError(error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        const returnTo = location.state?.from || '/';
        navigate(returnTo);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/login');
      } else if (event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setUser(session.user);
          console.log('Token refreshed successfully');
        } else {
          console.log('Token refresh failed');
          const error = new AuthApiError('Session refresh failed', 400, 'refresh_token_not_found');
          handleAuthError(error);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};