
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Sidebar } from './sidebar';
import { 
  Calendar, 
  Edit3, 
  BarChart3, 
  Clock,
  TrendingUp,
  Users,
  MessageSquare
} from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

interface DashboardStats {
  scheduledTweets: number;
  totalTweets: number;
  avgEngagement: number;
  upcomingTweets: any[];
}

export function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    scheduledTweets: 0,
    totalTweets: 0,
    avgEngagement: 0,
    upcomingTweets: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <main className="flex-1 lg:ml-0 ml-0">
        <div className="max-w-6xl mx-auto p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 lg:mt-0 mt-16">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {session?.user?.name || 'User'}!
            </h1>
            <p className="text-muted-foreground">
              Your AI-powered co-pilot for X/Twitter is ready to help you create amazing content.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link href="/compose">
              <div className="tweet-card group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                    <Edit3 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Compose Tweet</h3>
                    <p className="text-sm text-muted-foreground">Create AI-powered content</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/schedule">
              <div className="tweet-card group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                    <Calendar className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">View Schedule</h3>
                    <p className="text-sm text-muted-foreground">Manage your content calendar</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="tweet-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled Posts</p>
                  <p className="text-2xl font-bold text-white">{loading ? '...' : stats.scheduledTweets}</p>
                </div>
                <Clock className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="tweet-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tweets</p>
                  <p className="text-2xl font-bold text-white">{loading ? '...' : stats.totalTweets}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="tweet-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Engagement</p>
                  <p className="text-2xl font-bold text-white">{loading ? '...' : `${stats.avgEngagement.toFixed(1)}%`}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="tweet-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Followers</p>
                  <p className="text-2xl font-bold text-white">1.2K</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Upcoming Tweets */}
          <div className="tweet-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Upcoming Tweets</h2>
              <Link href="/schedule">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  View All
                </Button>
              </Link>
            </div>
            
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : stats.upcomingTweets?.length > 0 ? (
              <div className="space-y-3">
                {stats.upcomingTweets.slice(0, 3).map((tweet, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <p className="text-white text-sm">{tweet.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(tweet.scheduledFor).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming tweets scheduled</p>
                <Link href="/compose">
                  <Button className="mt-4">
                    Schedule Your First Tweet
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
