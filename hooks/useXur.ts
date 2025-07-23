import { useState, useEffect, useCallback } from 'react';
import { apiService, XurData, ApiResponse } from '../services/api';

export interface UseXurResult {
  xurData: XurData | null;
  isLoading: boolean;
  error: string | null;
  isXurPresent: boolean;
  timeUntilXur: string;
  refreshXurData: () => Promise<void>;
}

export function useXur(): UseXurResult {
  const [xurData, setXurData] = useState<XurData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const calculateTimeUntilXur = useCallback((): string => {
    // Xûr arrives Friday 18h and leaves Tuesday 18h (Paris local time)
    const XUR_HOUR = 18;
    
    const currentDay = currentTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentSecond = currentTime.getSeconds();
    
    // Create timestamps for Xûr events in local time
    const getNextTuesday = () => {
      const tuesday = new Date(currentTime);
      
      // If it's Monday, Tuesday is tomorrow
      if (currentDay === 1) {
        tuesday.setDate(currentTime.getDate() + 1);
      } 
      // If it's Sunday, Tuesday is in 2 days
      else if (currentDay === 0) {
        tuesday.setDate(currentTime.getDate() + 2);
      }
      // If it's Tuesday before 18h, it's today
      else if (currentDay === 2 && currentHour < XUR_HOUR) {
        // Don't change the date, it's today
      }
      // In all other cases, go to next Tuesday (in 7+ days)
      else {
        let daysToAdd = (2 - currentDay + 7) % 7;
        if (daysToAdd === 0) daysToAdd = 7; // If it's 0, we want next Tuesday
        tuesday.setDate(currentTime.getDate() + daysToAdd);
      }
      
      tuesday.setHours(XUR_HOUR, 0, 0, 0);
      return tuesday;
    };
    
    const getNextFriday = () => {
      const friday = new Date(currentTime);
      
      if (currentDay < 5) {
        // Before Friday
        const daysToAdd = 5 - currentDay;
        friday.setDate(currentTime.getDate() + daysToAdd);
      } else if (currentDay === 5 && currentHour < XUR_HOUR) {
        // Friday before 18h - today
        // Don't change the date
      } else {
        // After Friday 18h - take next Friday
        const daysToAdd = (5 - currentDay + 7) % 7;
        if (daysToAdd === 0) {
          friday.setDate(currentTime.getDate() + 7);
        } else {
          friday.setDate(currentTime.getDate() + daysToAdd);
        }
      }
      
      friday.setHours(XUR_HOUR, 0, 0, 0);
      return friday;
    };
    
    // Determine if Xûr is present and calculate next event
    let targetDate: Date;
    
    // Xûr is present from Friday 18h to Tuesday 18h (local time)
    if (currentDay === 5 && currentHour >= XUR_HOUR) {
      // Friday after 18h - Xûr just arrived
      targetDate = getNextTuesday();
    } else if (currentDay === 6 || currentDay === 0 || currentDay === 1) {
      // Weekend and Monday - Xûr is present
      targetDate = getNextTuesday();
    } else if (currentDay === 2 && currentHour < XUR_HOUR) {
      // Tuesday before 18h - Xûr is still present
      targetDate = getNextTuesday();
    } else {
      // Xûr is not present
      targetDate = getNextFriday();
    }
    
    // Calculate time difference
    const timeDiff = targetDate.getTime() - currentTime.getTime();
    
    if (timeDiff <= 0) {
      return "Now!";
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, [currentTime]);

  const isXurPresent = useCallback((): boolean => {
    if (xurData?.isAvailable) return true;
    
    // Calculate based on local time if API data is not available
    const XUR_HOUR = 18;
    
    const currentDay = currentTime.getDay();
    const currentHour = currentTime.getHours();
    
    // Xûr is present from Friday 18h to Tuesday 18h (local time)
    return (currentDay === 5 && currentHour >= XUR_HOUR) || // Friday after 18h
           currentDay === 6 || currentDay === 0 || currentDay === 1 || // Weekend and Monday
           (currentDay === 2 && currentHour < XUR_HOUR); // Tuesday before 18h
  }, [xurData, currentTime]);

  const refreshXurData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getXurInventory();
      setXurData(response.Response);
    } catch (err) {
      console.error('Failed to fetch Xûr data:', err);
      setError('Failed to fetch Xûr data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshXurData();
  }, [refreshXurData]);

  // Update time every second for live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    xurData,
    isLoading,
    error,
    isXurPresent: isXurPresent(),
    timeUntilXur: calculateTimeUntilXur(),
    refreshXurData,
  };
}

