import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Code, Clock, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function StatsGrid() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    problemsSolved: 0,
    practiceSessions: 0,
    currentStreak: 0,
    achievementPoints: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Fetch problems solved
        const { data: submissions } = await supabase
          .from('submissions')
          .select('id')
          .eq('user_id', user.id);
        
        // Fetch practice sessions
        const { data: sessions } = await supabase
          .from('peer_sessions')
          .select('id')
          .eq('created_by', user.id);

        // Fetch current streak from daily_user_scores
        const { data: streakData } = await supabase
          .from('daily_user_scores')
          .select('submission_date')
          .eq('user_id', user.id)
          .order('submission_date', { ascending: false });

        // Calculate streak
        let streak = 0;
        if (streakData && streakData.length > 0) {
          const today = new Date();
          let currentDate = new Date(streakData[0].submission_date);
          
          while (streak < streakData.length) {
            const diff = Math.floor((today.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diff !== streak) break;
            streak++;
            currentDate = new Date(streakData[streak]?.submission_date);
          }
        }

        setStats({
          problemsSolved: submissions?.length || 0,
          practiceSessions: sessions?.length || 0,
          currentStreak: streak,
          achievementPoints: (submissions?.length || 0) * 10 + (sessions?.length || 0) * 20,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const statsCards = [
    {
      title: "Problems Solved",
      value: stats.problemsSolved.toString(),
      icon: Code,
      description: "Total problems completed",
    },
    {
      title: "Practice Sessions",
      value: stats.practiceSessions.toString(),
      icon: Clock,
      description: "Total sessions",
    },
    {
      title: "Current Streak",
      value: stats.currentStreak.toString(),
      icon: Activity,
      description: "Days in a row",
    },
    {
      title: "Achievement Points",
      value: stats.achievementPoints.toString(),
      icon: Trophy,
      description: "Points earned",
    },
  ];

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="h-20 bg-gray-200 dark:bg-gray-700" />
          <CardContent className="h-16 bg-gray-100 dark:bg-gray-800" />
        </Card>
      ))}
    </div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}