import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PayPalButton } from "@/components/PayPalButton";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "Basic coding challenges",
      "Community access",
      "Basic progress tracking",
      "Limited peer practice sessions (2 free trials)",
      "Public leaderboard access",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "$5",
    description: "Best for serious learners",
    features: [
      "All Free features",
      "Advanced coding challenges",
      "Priority community support",
      "Detailed progress analytics",
      "Unlimited peer practice sessions",
      "Custom study plans",
      "Interview preparation tools",
      "Premium learning resources",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$20",
    description: "For teams and organizations",
    features: [
      "All Pro features",
      "Custom challenge creation",
      "Team management dashboard",
      "API access",
      "Dedicated support",
      "Custom integrations",
      "Advanced analytics",
      "Priority feature requests",
      "Custom branding options",
    ],
    popular: false,
  },
];

export function PricingPlans({ subscription }: { subscription: any }) {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = (planName: string) => {
    setSelectedPlan(planName);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedPlan(null);
    setIsDialogOpen(false);
  };

  const handleSubscriptionSuccess = (planName: string) => {
    toast({
      title: "Subscription Successful!",
      description: `You are now subscribed to the ${planName} plan.`,
      variant: "default",
    });
    closeDialog();
  };

  const getPlanType = (plan: string): "pro" | "enterprise" => {
    const lowercasePlan = plan.toLowerCase();
    if (lowercasePlan === "pro" || lowercasePlan === "enterprise") {
      return lowercasePlan as "pro" | "enterprise";
    }
    throw new Error(`Invalid plan type: ${plan}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={`relative transition-transform transform hover:scale-105 ${
            plan.popular ? "border-4 border-purple-500 shadow-xl" : "border border-gray-300"
          }`}
        >
          {plan.popular && (
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 px-3 py-1 text-sm font-semibold text-white shadow-lg">
                <Zap className="h-4 w-4" />
                Popular
              </span>
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-center">
              <h3 className="text-3xl font-bold">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-5xl font-extrabold text-gray-800 dark:text-white">
                  {plan.price}
                </span>
                {plan.name !== "Free" && (
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                )}
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {plan.description}
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              {plan.name === "Free" ? (
                <Button
                  className="w-full py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                  disabled={subscription?.subscription_type === "free"}
                >
                  {subscription?.subscription_type === "free"
                    ? "Current Plan"
                    : "Get Started Free"}
                </Button>
              ) : (
                <Button
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => openDialog(plan.name)}
                >
                  Subscribe to {plan.name}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscribe to {selectedPlan} Plan</DialogTitle>
            <DialogDescription>
              Select a payment method to proceed with your subscription.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-4">
            <Button className="w-full py-3 bg-green-500 hover:bg-green-600 text-white">
              Pay with Debit Card
            </Button>
            {selectedPlan && selectedPlan !== "Free" && (
              <PayPalButton
                amount={selectedPlan === "Pro" ? "5" : selectedPlan === "Enterprise" ? "20" : "0"}
                planType={getPlanType(selectedPlan)}
              />
            )}
            <Button
              className="w-full py-3 bg-gray-200 hover:bg-gray-300"
              onClick={closeDialog}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}