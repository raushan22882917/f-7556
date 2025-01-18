import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type Activity = {
  type: 'submission';
  icon: typeof Code;
  title: string;
  time: string;
  iconBg: string;
  iconColor: string;
};

type SubmissionWithQuestion = {
  id: string;
  created_at: string;
  questions: {
    title: string;
  };
};

export function RecentActivity() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!user) return;

      try {
        const { data: submissions, error } = await supabase
          .from('submissions')
          .select(`
            id,
            created_at,
            question_id,
            questions!inner (
              title
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;

        const formattedActivities: Activity[] = (submissions as SubmissionWithQuestion[] || []).map(sub => ({
          type: 'submission' as const,
          icon: Code,
          title: `Completed ${sub.questions?.title || 'Coding Challenge'}`,
          time: new Date(sub.created_at).toLocaleString(),
          iconBg: 'bg-blue-100 dark:bg-blue-900',
          iconColor: 'text-blue-600 dark:text-blue-300'
        }));

        setActivities(formattedActivities);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, [user]);

  if (loading) {
    return (
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-4" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${activity.iconBg} mr-4`}>
                <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
              </div>
              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <p className="text-center text-gray-500">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}