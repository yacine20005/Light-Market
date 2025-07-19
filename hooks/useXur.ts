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
    // Xûr arrives Friday 17:00 UTC and leaves Tuesday 17:00 UTC
    const currentUTC = new Date(currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000));
    
    // Get current day (0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday)
    const currentDay = currentUTC.getUTCDay();
    const currentHour = currentUTC.getUTCHours();
    
    let targetDate = new Date(currentUTC);
    
    // If it's Friday after 17:00 or weekend or Monday before 17:00 or Tuesday before 17:00
    const isXurTime = (currentDay === 5 && currentHour >= 17) || // Friday after 17:00
                      currentDay === 6 || currentDay === 0 ||      // Weekend
                      (currentDay === 1 && currentHour < 17) ||    // Monday before 17:00
                      (currentDay === 2 && currentHour < 17);      // Tuesday before 17:00
    
    if (isXurTime) {
      // Xûr is present, calculate time until he leaves (Tuesday 17:00)
      if (currentDay === 5 || currentDay === 6 || currentDay === 0 || currentDay === 1) {
        // Set target to next Tuesday 17:00
        const daysUntilTuesday = (2 - currentDay + 7) % 7;
        targetDate.setUTCDate(currentUTC.getUTCDate() + daysUntilTuesday);
        targetDate.setUTCHours(17, 0, 0, 0);
      } else if (currentDay === 2) {
        // It's Tuesday, set to 17:00 today
        targetDate.setUTCHours(17, 0, 0, 0);
      }
    } else {
      // Xûr is not present, calculate time until next Friday 17:00
      const daysUntilFriday = (5 - currentDay + 7) % 7;
      if (daysUntilFriday === 0 && currentHour < 17) {
        // It's Friday but before 17:00
        targetDate.setUTCHours(17, 0, 0, 0);
      } else {
        targetDate.setUTCDate(currentUTC.getUTCDate() + daysUntilFriday);
        targetDate.setUTCHours(17, 0, 0, 0);
      }
    }
    
    const timeDiff = targetDate.getTime() - currentUTC.getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, [currentTime]);

  const isXurPresent = useCallback((): boolean => {
    if (xurData?.isAvailable) return true;
    
    // Calculate based on time if API data is not available
    const currentUTC = new Date(currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000));
    const currentDay = currentUTC.getUTCDay();
    const currentHour = currentUTC.getUTCHours();
    
    return (currentDay === 5 && currentHour >= 17) || // Friday after 17:00
           currentDay === 6 || currentDay === 0 ||      // Weekend
           (currentDay === 1 && currentHour < 17) ||    // Monday before 17:00
           (currentDay === 2 && currentHour < 17);      // Tuesday before 17:00
  }, [xurData, currentTime]);

  const refreshXurData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getXurInventory();
      setXurData(response.Response);
    } catch (err) {
      console.error('Failed to fetch Xûr data:', err);
      setError('Impossible de récupérer les données de Xûr');
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
