import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PayPalButton } from "@/components/PayPalButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PricingPlans } from "./pricing/PricingPlans";
import { FAQ } from "./pricing/FAQ";

export function Pricing() {
  const { user } = useAuth();
  
  const { data: subscription } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <PayPalScriptProvider options={{ 
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "",
        vault: true,
        intent: "subscription"
      }}>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent drop-shadow-md">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose the plan that's right for you. All plans include a 30-day money-back guarantee.
            </p>
          </div>

          <PricingPlans subscription={subscription} />
          <FAQ />
        </div>
      </PayPalScriptProvider>
    </div>
  );
}

export default Pricing;