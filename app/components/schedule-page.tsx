
'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Edit, 
  Trash2, 
  Plus,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';

interface ScheduledTweet {
  id: string;
  content: string;
  scheduledFor: string;
  isPosted: boolean;
  isThread: boolean;
  threadOrder?: number;
}

export function SchedulePage() {
  const [scheduledTweets, setScheduledTweets] = useState<ScheduledTweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchScheduledTweets();
  }, []);

  const fetchScheduledTweets = async () => {
    try {
      const response = await fetch('/api/tweets/scheduled');
      if (response.ok) {
        const data = await response.json();
        setScheduledTweets(data);
      }
    } catch (error) {
      console.error('Failed to fetch scheduled tweets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTweet = async (tweetId: string) => {
    try {
      const response = await fetch(`/api/tweets/scheduled/${tweetId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setScheduledTweets(prev => prev.filter(tweet => tweet.id !== tweetId));
        toast.success('Scheduled tweet deleted');
      } else {
        toast.error('Failed to delete tweet');
      }
    } catch (error) {
      toast.error('An error occurred while deleting');
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isToday: date.toDateString() === new Date().toDateString(),
      isPast: date < new Date(),
    };
  };

  const getCalendarData = () => {
    const tweetsbyDate: Record<string, ScheduledTweet[]> = {};
    
    scheduledTweets.forEach(tweet => {
      const date = new Date(tweet.scheduledFor).toISOString().split('T')[0];
      if (!tweetsbyDate[date]) {
        tweetsbyDate[date] = [];
      }
      tweetsbyDate[date].push(tweet);
    });

    return tweetsbyDate;
  };

  const calendarData = getCalendarData();
  const selectedDateTweets = calendarData[selectedDate] || [];

  const upcomingTweets = scheduledTweets
    .filter(tweet => !tweet.isPosted && new Date(tweet.scheduledFor) > new Date())
    .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
    .slice(0, 5);

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      
      <main className="flex-1 lg:ml-0 ml-0">
        <div className="max-w-6xl mx-auto p-6 lg:p-8">
          <div className="lg:mt-0 mt-16 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Content Schedule</h1>
                <p className="text-muted-foreground">
                  Manage your scheduled posts and content calendar
                </p>
              </div>
              <Link href="/compose">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Tweet
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="tweet-card">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">
                      {scheduledTweets.filter(t => !t.isPosted).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
                <div className="tweet-card">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">
                      {scheduledTweets.filter(t => t.isPosted).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Posted</p>
                  </div>
                </div>
                <div className="tweet-card">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {upcomingTweets.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                  </div>
                </div>
                <div className="tweet-card">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-500">
                      {scheduledTweets.filter(t => t.isThread).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Threads</p>
                  </div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="tweet-card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Calendar View</h2>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-1 bg-card border border-border rounded text-white text-sm"
                  />
                </div>

                {/* Calendar implementation would go here - simplified for demo */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center py-2 text-sm text-muted-foreground font-medium">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="text-center py-8 text-muted-foreground">
                  📅 Full calendar implementation would render here
                  <br />
                  <span className="text-sm">
                    Selected date: {new Date(selectedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Selected Date Tweets */}
              {selectedDateTweets.length > 0 && (
                <div className="tweet-card">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Tweets for {new Date(selectedDate).toLocaleDateString()}
                  </h3>
                  <div className="space-y-3">
                    {selectedDateTweets.map((tweet) => {
                      const { time, isPast } = formatDateTime(tweet.scheduledFor);
                      return (
                        <div key={tweet.id} className="border border-border rounded p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{time}</span>
                              {tweet.isThread && (
                                <Badge variant="secondary">Thread</Badge>
                              )}
                              {tweet.isPosted ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : isPast ? (
                                <XCircle className="w-4 h-4 text-red-500" />
                              ) : null}
                            </div>
                            {!tweet.isPosted && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTweet(tweet.id)}
                                className="text-red-500 hover:text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <p className="text-white text-sm">{tweet.content}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Upcoming Tweets Sidebar */}
            <div className="space-y-6">
              <div className="tweet-card">
                <h3 className="text-lg font-semibold text-white mb-4">Upcoming Tweets</h3>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : upcomingTweets.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingTweets.map((tweet) => {
                      const { date, time, isToday } = formatDateTime(tweet.scheduledFor);
                      return (
                        <div key={tweet.id} className="border-l-2 border-primary pl-3 pb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-primary font-medium">
                              {isToday ? 'Today' : date}
                            </span>
                            <span className="text-xs text-muted-foreground">{time}</span>
                            {tweet.isThread && (
                              <Badge variant="secondary" className="text-xs">Thread</Badge>
                            )}
                          </div>
                          <p className="text-sm text-white line-clamp-3">{tweet.content}</p>
                          <div className="flex gap-1 mt-2">
                            <Button variant="ghost" size="sm" className="text-xs">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs text-red-500"
                              onClick={() => handleDeleteTweet(tweet.id)}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No upcoming tweets</p>
                    <Link href="/compose">
                      <Button size="sm" className="mt-3">
                        Schedule First Tweet
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="tweet-card">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/compose">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="w-4 h-4 mr-2" />
                      New Tweet
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Bulk Schedule
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Optimal Times
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
