import JSZip from 'jszip';
import { TwitterTweet, DailyActivity, ActivityStats, HeatmapData, ProcessingResult, CalendarDay } from '@/types/twitter';
import { parseTwitterDate, formatDate, getYearDates, getActivityLevel, getDayOfWeekName, calculateStreak } from './date-utils';
import { getDay } from 'date-fns';

export class TwitterDataParser {
  
  async parseArchive(file: File): Promise<ProcessingResult> {
    try {
      const zip = new JSZip();
      const archive = await zip.loadAsync(file);
      
      // Look for tweets.js file in the archive
      const tweetsFile = archive.file('data/tweets.js') || 
                        archive.file('tweets.js') ||
                        archive.file('data/tweet.js') ||
                        archive.file('tweet.js');
      
      if (!tweetsFile) {
        return {
          success: false,
          error: 'tweets.js file not found in the archive. Please ensure you uploaded a valid Twitter archive.'
        };
      }
      
      const tweetsContent = await tweetsFile.async('text');
      const tweets = this.extractTweetsFromJS(tweetsContent);
      
      if (tweets.length === 0) {
        return {
          success: false,
          error: 'No tweets found in the archive.'
        };
      }
      
      const heatmapData = this.processTweets(tweets);
      
      return {
        success: true,
        data: heatmapData
      };
      
    } catch (error) {
      console.error('Error parsing archive:', error);
      return {
        success: false,
        error: `Failed to parse archive: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
  
  private extractTweetsFromJS(content: string): TwitterTweet[] {
    try {
      // Twitter archives contain a JS file that starts with "window.YTD.tweets.part0 = "
      // We need to extract the JSON data
      let jsonString = content;
      
      // Remove the JS variable assignment
      if (content.includes('window.YTD.tweets.part0 = ')) {
        jsonString = content.replace('window.YTD.tweets.part0 = ', '');
      } else if (content.includes('window.YTD.tweet.part0 = ')) {
        jsonString = content.replace('window.YTD.tweet.part0 = ', '');
      }
      
      // Remove any trailing semicolons or whitespace
      jsonString = jsonString.trim();
      if (jsonString.endsWith(';')) {
        jsonString = jsonString.slice(0, -1);
      }
      
      const tweets = JSON.parse(jsonString) as TwitterTweet[];
      return tweets;
      
    } catch (error) {
      console.error('Error extracting tweets from JS:', error);
      throw new Error('Failed to parse tweets.js file. The file format may be invalid.');
    }
  }
  
  private processTweets(tweets: TwitterTweet[]): HeatmapData {
    // Group tweets by date and year
    const dailyActivitiesByYear = new Map<number, Map<string, DailyActivity>>();
    const years = new Set<number>();
    
    tweets.forEach(tweetObj => {
      const tweet = tweetObj.tweet;
      const tweetDate = parseTwitterDate(tweet.created_at);
      const dateString = formatDate(tweetDate);
      const year = tweetDate.getFullYear();
      
      years.add(year);
      
      if (!dailyActivitiesByYear.has(year)) {
        dailyActivitiesByYear.set(year, new Map<string, DailyActivity>());
      }
      
      const yearActivities = dailyActivitiesByYear.get(year)!;
      
      if (!yearActivities.has(dateString)) {
        yearActivities.set(dateString, {
          date: dateString,
          count: 0,
          tweets: []
        });
      }
      
      const dayActivity = yearActivities.get(dateString)!;
      dayActivity.count++;
      dayActivity.tweets.push(tweetObj);
    });
    
    // Use the most recent year as default or current year if no tweets
    const availableYears = Array.from(years).sort((a, b) => b - a);
    const defaultYear = availableYears.length > 0 ? availableYears[0] : new Date().getFullYear();
    
    // Generate activities and stats for all years
    const allYearActivities: Record<number, DailyActivity[]> = {};
    const allYearStats: Record<number, ActivityStats> = {};
    
    availableYears.forEach(year => {
      const yearDates = getYearDates(year);
      const yearActivitiesMap = dailyActivitiesByYear.get(year) || new Map();
      const activities: DailyActivity[] = [];
      
      yearDates.forEach(date => {
        const dateString = formatDate(date);
        const activity = yearActivitiesMap.get(dateString) || {
          date: dateString,
          count: 0,
          tweets: []
        };
        activities.push(activity);
      });
      
      allYearActivities[year] = activities;
      allYearStats[year] = this.calculateStats(activities, year);
    });
    
    return {
      activities: allYearActivities[defaultYear] || [],
      stats: allYearStats[defaultYear] || this.calculateStats([], defaultYear),
      year: defaultYear,
      availableYears,
      allYearActivities,
      allYearStats
    };
  }
  
  private calculateStats(activities: DailyActivity[], year: number): ActivityStats {
    const totalTweets = activities.reduce((sum, day) => sum + day.count, 0);
    const activeDays = activities.filter(day => day.count > 0).length;
    const totalDays = activities.length;
    
    // Calculate streaks
    const { current: currentStreak, longest: longestStreak } = calculateStreak(activities);
    
    // Find most active day
    const mostActiveDay = activities.reduce((max, day) => 
      day.count > max.count ? day : max, 
      { date: '', count: 0 }
    );
    
    // Calculate most active day of the week
    const dayOfWeekCounts = new Array(7).fill(0);
    activities.forEach(activity => {
      if (activity.count > 0) {
        const dayOfWeek = getDay(new Date(activity.date));
        dayOfWeekCounts[dayOfWeek] += activity.count;
      }
    });
    
    const mostActiveDayIndex = dayOfWeekCounts.indexOf(Math.max(...dayOfWeekCounts));
    const mostActiveDayOfWeek = getDayOfWeekName(mostActiveDayIndex);
    
    const averagePerDay = totalDays > 0 ? totalTweets / totalDays : 0;
    
    return {
      totalTweets,
      longestStreak,
      currentStreak,
      mostActiveDay: mostActiveDay.date,
      averagePerDay: Math.round(averagePerDay * 100) / 100,
      totalDays,
      activeDays,
      mostActiveDayOfWeek,
      yearRange: year.toString()
    };
  }
  
  public generateCalendarData(activities: DailyActivity[]): CalendarDay[] {
    const maxCount = Math.max(...activities.map(a => a.count));
    
    return activities.map(activity => ({
      date: activity.date,
      count: activity.count,
      level: getActivityLevel(activity.count, maxCount),
      tweets: activity.tweets
    }));
  }
}