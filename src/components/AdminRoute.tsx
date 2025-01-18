import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: { user: { email } } } = await supabase.auth.getUser();
      
      if (email !== "raushan22882917@gmail.com") {
        navigate("/");
      }
    };

    checkAdminAccess();
  }, [user, navigate]);

  return <>{children}</>;
};