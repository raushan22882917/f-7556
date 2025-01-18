import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from "@/components/Navbar";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Users, UserCheck, Building, UserCog } from 'lucide-react';

const codingFeatures = [
  {
    id: 'solo',
    title: 'Solo Coding',
    icon: Code,
    description: 'Track your individual coding practice progress',
  },
  {
    id: 'collaborative',
    title: 'Collaborative Coding',
    icon: Users,
    description: 'View your peer programming sessions and achievements',
  },
  {
    id: 'mentorship',
    title: 'Mentorship Sessions',
    icon: UserCheck,
    description: 'Monitor your mentorship progress and feedback',
  },
  {
    id: 'team',
    title: 'Team Coding',
    icon: Building,
    description: 'See your organization coding activities',
  },
  {
    id: 'hr',
    title: 'HR Round',
    icon: UserCog,
    description: 'Track your interview preparation progress',
  },
];

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('solo');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to fetch profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {profile?.name || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your coding progress overview
          </p>
        </div>

        <div className="mb-8">
          <StatsGrid />
        </div>

        <Tabs defaultValue="solo" className="w-full mb-8">
          <TabsList className="w-full justify-start mb-4 overflow-x-auto">
            {codingFeatures.map((feature) => (
              <TabsTrigger 
                key={feature.id} 
                value={feature.id}
                className="flex items-center gap-2"
              >
                <feature.icon className="w-4 h-4" />
                {feature.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {codingFeatures.map((feature) => (
            <TabsContent key={feature.id} value={feature.id}>
              <div className="grid gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <feature.icon className="w-5 h-5" />
                    {feature.title} Progress
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {feature.description}
                  </p>
                  <ActivityChart />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProfileCard profile={profile} onProfileUpdate={fetchProfile} />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;