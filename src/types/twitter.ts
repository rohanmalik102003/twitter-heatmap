export interface TwitterTweet {
  tweet: {
    id: string;
    full_text: string;
    created_at: string;
    retweet_count?: number;
    favorite_count?: number;
    in_reply_to_status_id?: string;
    in_reply_to_user_id?: string;
    entities?: {
      hashtags: Array<{ text: string }>;
      urls: Array<{ url: string; expanded_url: string }>;
      user_mentions: Array<{ screen_name: string; name: string }>;
    };
  };
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD format
  count: number;
  tweets: TwitterTweet[];
}

export interface ActivityStats {
  totalTweets: number;
  longestStreak: number;
  currentStreak: number;
  mostActiveDay: string;
  averagePerDay: number;
  totalDays: number;
  activeDays: number;
  mostActiveDayOfWeek: string;
  yearRange: string;
}

export interface HeatmapData {
  activities: DailyActivity[];
  stats: ActivityStats;
  year: number;
  availableYears: number[];
  allYearActivities: Record<number, DailyActivity[]>;
  allYearStats: Record<number, ActivityStats>;
}

export interface CalendarDay {
  date: string;
  count: number;
  level: number; // 0-4 intensity level
  tweets: TwitterTweet[];
}

export interface ProcessingResult {
  success: boolean;
  data?: HeatmapData;
  error?: string;
}