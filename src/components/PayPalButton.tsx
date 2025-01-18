import { useEffect } from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PayPalButtonProps {
  amount: string;
  planType: 'pro' | 'enterprise';
}

export function PayPalButton({ amount, planType }: PayPalButtonProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubscription = async (subscriptionId: string) => {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user?.id,
          subscription_type: planType,
          payment_id: subscriptionId,
          payment_provider: 'paypal',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: `You are now subscribed to the ${planType} plan!`,
      });

      // Refresh the page to update the UI
      window.location.reload();
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <PayPalButtons
      createSubscription={(data, actions) => {
        return actions.subscription
          .create({
            plan_id: planType === 'pro' ? 'P-PRO_PLAN_ID' : 'P-ENTERPRISE_PLAN_ID',
            application_context: {
              shipping_preference: 'NO_SHIPPING',
              user_action: 'SUBSCRIBE_NOW',
              return_url: window.location.href,
              cancel_url: window.location.href
            }
          })
          .catch(err => {
            console.error('PayPal subscription creation error:', err);
            toast({
              title: "Error",
              description: "Failed to create subscription. Please try again.",
              variant: "destructive",
            });
            throw err;
          });
      }}
      onApprove={async (data, actions) => {
        try {
          if (data.subscriptionID) {
            await handleSubscription(data.subscriptionID);
          } else {
            throw new Error('No subscription ID received');
          }
        } catch (err) {
          console.error('PayPal approval error:', err);
          toast({
            title: "Error",
            description: "Failed to process approval. Please try again.",
            variant: "destructive",
          });
        }
      }}
      onError={(err) => {
        console.error('PayPal error:', err);
        toast({
          title: "Error",
          description: "PayPal transaction failed. Please try again.",
          variant: "destructive",
        });
      }}
      onCancel={() => {
        toast({
          title: "Cancelled",
          description: "You've cancelled the subscription process.",
          variant: "default",
        });
      }}
      style={{
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'subscribe'
      }}
    />
  );
}