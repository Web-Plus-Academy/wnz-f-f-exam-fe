import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { updateTimer, submitExam } from '@/store/examSlice';

export const useExamTimer = () => {
  const dispatch = useAppDispatch();
  const { timeRemaining, isSubmitted, startTime } = useAppSelector((state) => state.exam);

  useEffect(() => {
    if (!startTime || isSubmitted) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, 3 * 60 * 60 - elapsed); // 3 hours in seconds
      
      dispatch(updateTimer(remaining));

      if (remaining <= 0) {
        dispatch(submitExam());
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, startTime, isSubmitted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isSubmitted,
  };
};
